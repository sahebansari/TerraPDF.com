---
title: Encryption & Security - TerraPDF Sample
description: Learn how to protect PDFs with AES-128 encryption, passwords, and granular permission controls using TerraPDF.
layout: sample.njk
permalink: /samples/encryption-showcase/
---

# Encryption & Security Sample

## Overview

The Encryption & Security sample demonstrates comprehensive PDF password protection:
- **AES-128 encryption** — industry-standard PDF encryption
- **User passwords** — required to open the document
- **Owner passwords** — full access passwords
- **Permission flags** — granular control over document operations
- **Four protection scenarios** — open password, owner-only, print-only, fully restricted
- **Zero dependencies** — uses only `System.Security.Cryptography`

## Key Features Demonstrated

### 1. Scenario A: Open Password with All Permissions
```csharp
doc.Encrypt(new EncryptionOptions
{
    UserPassword  = "user123",
    OwnerPassword = "admin123",
    Permissions   = PdfPermissions.All,
});
```

**Use case:** Protect authorship while allowing all viewer operations (print, copy, edit, fill forms).

### 2. Scenario B: No Open Password, Owner-Only Restrictions
```csharp
doc.Encrypt(new EncryptionOptions
{
    UserPassword  = "",              // no open password
    OwnerPassword = "ownerOnly",
    Permissions   = PdfPermissions.ExtractForAccessibility,
});
```

**Use case:** Distribute freely but prevent printing and copying. Only screen-reader extraction allowed.

### 3. Scenario C: Print-Only Protection
```csharp
doc.Encrypt(new EncryptionOptions
{
    UserPassword  = "printme",
    OwnerPassword = "printAdmin",
    Permissions   = PdfPermissions.Print
                  | PdfPermissions.PrintLowResolution
                  | PdfPermissions.ExtractForAccessibility,
});
```

**Use case:** Allow printing but prevent digital re-use. Good for reports.

### 4. Scenario D: Fully Restricted (View Only)
```csharp
doc.Encrypt(new EncryptionOptions
{
    UserPassword  = "viewonly",
    OwnerPassword = "superadmin",
    Permissions   = PdfPermissions.None,
});
```

**Use case:** Maximum restriction — view on screen only. No printing, copying, editing, or form filling.

## Understanding PdfPermissions Flags

### Available Permissions

| Flag | Description |
|------|-------------|
| `Print` | High-quality printing |
| `PrintLowResolution` | Degraded/low-resolution printing |
| `ModifyContents` | Modify document contents |
| `CopyText` | Copy or extract text and graphics |
| `ModifyAnnotations` | Add or modify annotations |
| `FillForms` | Fill in interactive form fields |
| `ExtractForAccessibility` | Text extraction for screen readers |
| `AssembleDocument` | Insert, rotate, or delete pages |
| `All` | All flags combined |
| `None` | No permissions |

### Combining Permissions

```csharp
Permissions = PdfPermissions.Print 
            | PdfPermissions.CopyText 
            | PdfPermissions.ModifyAnnotations
```

## Security Details

### Encryption Algorithm

- **Cipher:** AES-128 CBC (Advanced Encryption Standard, 128-bit)
- **Key Derivation:** MD5 × 51 rounds (PDF standard Algorithm 2)
- **IV:** 16 random bytes per encrypted object
- **Handler:** PDF Standard Security Handler, Revision 4
- **PDF Version:** 1.6 minimum for AES support

### How It Works

1. **File Encryption Key (FEK)** — Derived from user/owner passwords using MD5-based key derivation
2. **Per-Object Encryption** — Each PDF object (pages, images, streams) encrypted with unique AES-128 CBC key
3. **Random IVs** — 16-byte initialization vector prepended to every encrypted payload
4. **Password Verification** — O entry (owner) and U entry (user) store password verifiers

## Implementation Example

```csharp
decimal total = items.Sum(x => x.Price);

Document.Create(doc =>
{
    // Apply encryption
    doc.Encrypt(new EncryptionOptions
    {
        UserPassword  = "invoice123",
        OwnerPassword = "invoiceAdmin",
        Permissions   = PdfPermissions.Print 
                      | PdfPermissions.ExtractForAccessibility,
    });

    // Add metadata
    doc.MetadataTitle("Confidential Invoice");
    doc.MetadataAuthor("Acme Corp");

    // Create page
    doc.Page(page =>
    {
        page.Size(PageSize.A4);
        page.Margin(2, Unit.Centimetre);
        
        page.Content().Column(col =>
        {
            col.Item().Text("INVOICE").Bold().FontSize(20);
            col.Item().PaddingTop(12).Text($"Total: ${total:N2}");
        });
    });
}).PublishPdf("invoice.pdf");
```

## Use Cases

Perfect for:
- **Confidential documents** — Board minutes, strategic plans
- **Financial reports** — Tax returns, statements
- **Personal documents** — Medical records, contracts
- **Invoices & billing** — Restrict copying of line items
- **Legal documents** — Protect intellectual property
- **Email attachments** — Secure sensitive communications

## What You'll Learn

1. **Encryption options** — configuring passwords and permissions
2. **Permission flags** — granular control over document operations
3. **Security best practices** — when to use each scenario
4. **Compliance** — PDF standard encryption handling
5. **Zero dependencies** — built-in .NET cryptography
6. **Real-world patterns** — practical protection scenarios

## Security Notes

- **Passwords:** Use strong, complex passwords for sensitive documents
- **Owner Password:** Auto-generated if not specified
- **User Password:** Can be empty for restricted-access mode
- **Extraction:** Even with encryption, metadata is visible
- **Compliance:** Meets PDF 1.6+ security standards

## File Outputs

Generates multiple files:
- `12a_open_password.pdf` — requires password to open
- `12b_owner_only.pdf` — opens freely, operations restricted
- `12c_print_only.pdf` — print and view only
- `12d_fully_restricted.pdf` — view only, no operations
- `12_encryption_showcase.pdf` — overview document

All scenarios are demonstrated in a comprehensive guide with tables, scenarios, and code examples.
