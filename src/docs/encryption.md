---
title: "Encryption & Security"
description: "Protect TerraPDF documents with AES-256 encryption (AES-128 legacy mode available), user passwords, owner passwords, and PDF permission flags."
layout: base.njk
docPage: true
permalink: /docs/encryption/
---
# Encryption & Security

TerraPDF supports PDF encryption through the PDF Standard Security Handler, defaulting to **AES-256** (Revision 6, PDF 2.0) with **AES-128** (Revision 4, PDF 1.6) available as a legacy opt-in. Encrypted documents can require an open password, define an owner password for full access, and restrict common actions such as printing, copying, editing, form filling, accessibility extraction, and page assembly.

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
| `Algorithm` | `EncryptionAlgorithm` | `Aes256` (default) or `Aes128` (legacy). See [Choosing an Algorithm](#choosing-an-algorithm) below. |

## Choosing an Algorithm

As of TerraPDF 1.4.0, `container.Encrypt(...)` produces **AES-256** output by default — Standard Security Handler Revision 6, SHA-2 key derivation, and PDF 2.0 output. This is supported by every mainstream viewer since roughly 2008 (Acrobat 9+, Chrome, Edge, Firefox, Preview, and others).

If you need to support a very old or restricted PDF reader that only understands PDF 1.6-era encryption, opt back into AES-128 (Revision 4) explicitly:

```csharp
container.Encrypt(new EncryptionOptions
{
    UserPassword = "open123",
    OwnerPassword = "admin456",
    Permissions = PdfPermissions.All,
    Algorithm = EncryptionAlgorithm.Aes128
});
```

> **Upgrading from 1.3.x?** If your code calls `container.Encrypt(...)` without setting `Algorithm`, it now produces AES-256/PDF 2.0 output instead of the previous AES-128/PDF 1.6 output. Set `Algorithm = EncryptionAlgorithm.Aes128` if you need to keep the old behavior.

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

- By default, encrypted output uses **AES-256** (Revision 6) and is emitted as **PDF 2.0**. Setting `Algorithm = EncryptionAlgorithm.Aes128` produces **PDF 1.6** output using Revision 4, the minimum version required for AES encryption.
- Page content streams, image XObjects, document metadata, bookmark titles, and hyperlink URIs are all encrypted — nothing is left as plaintext inside an encrypted document.
- The `/Encrypt` dictionary, cross-reference data, trailer, stream lengths, and PDF header remain unencrypted as required by the PDF specification.
- Each encrypted object receives its own key derived from the file encryption key and object identity — SHA-2 based derivation for AES-256, MD5-based derivation for the legacy AES-128 mode.

Call `container.Encrypt(options)` once inside the `Document.Create` callback before publishing. If called more than once, the latest settings replace the previous settings.
