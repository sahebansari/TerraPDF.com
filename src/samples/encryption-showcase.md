---
title: Encryption & Security - TerraPDF Sample
description: Learn how to protect PDFs with AES-256 encryption (AES-128 legacy mode included), passwords, and granular permission controls using TerraPDF.
layout: sample.njk
permalink: /samples/encryption-showcase/
---

# Encryption & Security Sample

## Overview

The Encryption & Security sample demonstrates comprehensive PDF password protection:
- **AES-256 encryption by default** — Standard Security Handler Revision 6, PDF 2.0 output
- **AES-128 legacy mode** — opt in via `EncryptionAlgorithm.Aes128` for pre-2008 viewers
- **User passwords** — required to open the document
- **Owner passwords** — full access passwords
- **Permission flags** — granular control over document operations
- **Five protection scenarios** — open password, owner-only, print-only, fully restricted, legacy AES-128
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

### 5. Scenario E: Legacy AES-128 Compatibility Mode
```csharp
doc.Encrypt(new EncryptionOptions
{
    UserPassword  = "legacy123",
    OwnerPassword = "legacyAdmin",
    Permissions   = PdfPermissions.All,
    Algorithm     = EncryptionAlgorithm.Aes128,
});
```

**Use case:** Scenarios A–D all use the AES-256 default. Set `Algorithm = EncryptionAlgorithm.Aes128` only when a document must open in a viewer released before roughly 2008, predating AES-256 support — this produces PDF 1.6 / Revision 4 output instead of PDF 2.0 / Revision 6.

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

### Encryption Algorithm (default: AES-256)

- **Cipher:** AES-256 CBC (Advanced Encryption Standard, 256-bit)
- **Key Derivation:** SHA-2 based, Algorithm 2.B (ISO 32000-2, Revision 6)
- **IV:** 16 random bytes per encrypted object
- **Handler:** PDF Standard Security Handler, Revision 6
- **PDF Version:** 2.0

### Legacy Mode (`Algorithm = EncryptionAlgorithm.Aes128`)

- **Cipher:** AES-128 CBC
- **Key Derivation:** MD5 × 51 rounds (PDF standard Algorithm 2)
- **Handler:** PDF Standard Security Handler, Revision 4
- **PDF Version:** 1.6 minimum for AES support

### How It Works

1. **File Encryption Key (FEK)** — Derived from user/owner passwords (SHA-2 based for AES-256, MD5-based for legacy AES-128)
2. **Per-Object Encryption** — Each PDF object (pages, images, streams, metadata, bookmark titles, hyperlink URIs) encrypted with a unique key derived from the FEK and object identity
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
- **Extraction:** Metadata, bookmark titles, and hyperlink URIs are all encrypted — nothing is left as plaintext in an encrypted document
- **Compliance:** Meets PDF 2.0 security standards by default; PDF 1.6+ in legacy mode

## File Outputs

Generates multiple files:
- `12a_open_password.pdf` — requires password to open (AES-256)
- `12b_owner_only.pdf` — opens freely, operations restricted (AES-256)
- `12c_print_only.pdf` — print and view only (AES-256)
- `12d_fully_restricted.pdf` — view only, no operations (AES-256)
- `12e_aes128_legacy.pdf` — legacy AES-128 compatibility mode
- `12_encryption_showcase.pdf` — overview document

All scenarios are demonstrated in a comprehensive guide with tables, scenarios, and code examples.
