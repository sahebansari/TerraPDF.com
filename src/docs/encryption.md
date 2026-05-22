---
title: "Encryption & Security"
description: "Protect TerraPDF documents with AES-128 encryption, user passwords, owner passwords, and PDF permission flags."
layout: base.njk
docPage: true
permalink: /docs/encryption/
---
# Encryption & Security

TerraPDF supports AES-128 PDF encryption through the PDF Standard Security Handler. Encrypted documents can require an open password, define an owner password for full access, and restrict common actions such as printing, copying, editing, form filling, accessibility extraction, and page assembly.

No external package is required. Encryption is implemented with `System.Security.Cryptography`.

## Quick Start

```csharp
using TerraPDF.Core;
using TerraPDF.Helpers;

Document.Create(container =>
{
    container.Encrypt(new EncryptionOptions
    {
        UserPassword = "open123",
        OwnerPassword = "admin456",
        Permissions = PdfPermissions.Print | PdfPermissions.CopyText
    });

    container.Page(page =>
    {
        page.Size(PageSize.A4);
        page.Margin(2, Unit.Centimetre);
        page.Content()
            .Text("This PDF is password-protected.")
            .Bold()
            .FontSize(18);
    });
})
.PublishPdf("protected.pdf");
```

## Encryption Options

| Property | Type | Description |
|----------|------|-------------|
| `UserPassword` | `string?` | Password required to open the document. Leave empty for no open prompt while still encrypting content and applying permissions. |
| `OwnerPassword` | `string?` | Password that grants full access regardless of permission restrictions. |
| `Permissions` | `PdfPermissions` | Bitwise permission flags applied for normal users. Defaults to `All`. |

## Permission Flags

Combine flags with the bitwise OR operator:

```csharp
PdfPermissions.Print | PdfPermissions.CopyText
```

| Flag | Allows |
|------|--------|
| `PdfPermissions.Print` | High-quality printing |
| `PdfPermissions.PrintLowResolution` | Low-resolution printing |
| `PdfPermissions.ModifyContents` | Editing document contents |
| `PdfPermissions.CopyText` | Copying or extracting text and graphics |
| `PdfPermissions.ModifyAnnotations` | Adding or modifying annotations and form fields |
| `PdfPermissions.FillForms` | Filling interactive form fields |
| `PdfPermissions.ExtractForAccessibility` | Extraction for screen readers |
| `PdfPermissions.AssembleDocument` | Inserting, rotating, or deleting pages |
| `PdfPermissions.All` | All permissions granted |
| `PdfPermissions.None` | View-only access |

## Common Patterns

### View Only

```csharp
container.Encrypt(new EncryptionOptions
{
    UserPassword = "readonly",
    Permissions = PdfPermissions.None
});
```

### Open Without Password, Restrict Copying

```csharp
container.Encrypt(new EncryptionOptions
{
    OwnerPassword = "admin",
    Permissions = PdfPermissions.Print
});
```

### Encrypt and Allow Everything

```csharp
container.Encrypt(new EncryptionOptions
{
    UserPassword = "open",
    Permissions = PdfPermissions.All
});
```

## Technical Notes

- Encrypted output uses PDF 1.6, the minimum version required for AES encryption.
- Page content streams and image XObjects are encrypted.
- The `/Encrypt` dictionary, cross-reference data, trailer, stream lengths, and PDF header remain unencrypted as required by the PDF specification.
- Each encrypted object receives its own AES-128 key derived from the file encryption key and object identity.

Call `container.Encrypt(options)` once inside the `Document.Create` callback before publishing. If called more than once, the latest settings replace the previous settings.
