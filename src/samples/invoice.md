---
title: Invoice - TerraPDF Sample
description: Generate professional multi-page invoices with repeating headers, line items, and payment terms using TerraPDF.
layout: sample.njk
permalink: /samples/invoice/
---


# Invoice Sample

## Overview

The Invoice sample demonstrates sophisticated multi-page document handling:
- **Multi-page tables** — 30+ line items spanning multiple pages
- **Repeating headers** — table header repeats automatically on every page
- **Bill-from/to sections** — customer and vendor information
- **Line items** — quantity, unit price, and totals
- **Totals block** — subtotal, tax, and amount due
- **Payment terms** — terms and conditions box
- **Company branding** — logo and color scheme
- **Dynamic calculations** — computed totals

## Key Features Demonstrated

### 1. Invoice Header with Logo and Metadata
```csharp
page.Header().Column(col =>
{
    col.Item().Row(row =>
    {
        row.RelativeItem().Column(c =>
        {
            if (File.Exists(logoSmall))
                c.Item().Image(logoSmall, 80);
            else
                c.Item().Text("TerraPDF Co.").Bold().FontSize(18).FontColor(brand);
        });

        row.AutoItem().AlignRight().Column(info =>
        {
            info.Item().AlignRight()
                .Text("INVOICE").Bold().FontSize(26).FontColor(brand);
            info.Item().AlignRight().Text(t =>
            {
                t.Span("Invoice # ").FontColor(muted);
                t.Span("INV-2025-0042").Bold().FontColor(brand);
            });
        });
    });

    col.Item().LineHorizontal(2, brand);
});
```

### 2. Bill-From and Bill-To Sections
```csharp
col.Item().Row(row =>
{
    row.RelativeItem().Column(c =>
    {
        c.Item().Text("FROM").Bold().FontSize(8).FontColor(muted);
        c.Item().Text("TerraPDF Co. Ltd.").Bold().FontColor(brand);
        c.Item().Text("42 Innovation Drive, Suite 7");
        c.Item().Text("San Francisco, CA 94105");
        c.Item().Text("billing@terrapdf.example");
    });

    row.RelativeItem().MarginLeft(12).Background(lightBrand)
        .Padding(8).Column(c =>
        {
            c.Item().Text("BILL TO").Bold().FontSize(8).FontColor(muted);
            c.Item().Text("Acme Global Solutions Inc.").Bold().FontColor(brand);
            // ... more customer info ...
        });
});
```

### 3. Multi-Page Line Items Table with Repeating Header
```csharp
col.Item().Table(table =>
{
    table.ColumnsDefinition(c =>
    {
        c.RelativeColumn(5);  // Description
        c.RelativeColumn(1);  // Qty
        c.RelativeColumn(2);  // Unit price
        c.RelativeColumn(2);  // Line total
    });

    // This header repeats on every continuation page automatically
    table.HeaderRow(row =>
    {
        row.Cell().Background(brand).Padding(6)
            .Text("Description").Bold().FontColor(Color.White);
        row.Cell().Background(brand).Padding(6).AlignCenter()
            .Text("Qty").Bold().FontColor(Color.White);
        row.Cell().Background(brand).Padding(6).AlignRight()
            .Text("Unit Price").Bold().FontColor(Color.White);
        row.Cell().Background(brand).Padding(6).AlignRight()
            .Text("Total").Bold().FontColor(Color.White);
    });

    bool shade = false;
    foreach (var (desc, qty, unit) in items)
    {
        string bg = shade ? lightBrand : Color.White;
        decimal line = qty * unit;
        table.Row(row =>
        {
            row.Cell().Background(bg).Padding(6).Text(desc);
            row.Cell().Background(bg).Padding(6).AlignCenter()
                .Text(qty.ToString(CultureInfo.InvariantCulture));
            row.Cell().Background(bg).Padding(6).AlignRight()
                .Text($"${unit:N2}");
            row.Cell().Background(bg).Padding(6).AlignRight()
                .Text($"${line:N2}");
        });
        shade = !shade;
    }
});
```

### 4. Totals Section
```csharp
col.Item().Row(row =>
{
    row.RelativeItem(6);  // left spacer

    row.RelativeItem(4).Column(totals =>
    {
        totals.Item().LineHorizontal(1, Color.Grey.Lighten2);
        
        void TLine(string label, string value, bool bold = false)
        {
            totals.Item().Row(r =>
            {
                var lbl = r.RelativeItem().Text(label);
                if (bold) lbl.Bold();
                var val = r.RelativeItem().AlignRight().Text(value);
                if (bold) val.Bold();
            });
        }

        TLine("Subtotal",  $"${subtotal:N2}");
        TLine("Tax (10%)", $"${tax:N2}");
        totals.Item().LineHorizontal(1.5, brand);
        TLine("TOTAL DUE", $"${total:N2}", bold: true);
        
        totals.Item().Background(brand).Padding(6).AlignCenter()
            .Text($"Amount Due: ${total:N2}")
            .Bold().FontSize(12).FontColor(Color.White);
    });
});
```

### 5. Payment Terms Box
```csharp
col.Item().MarginTop(8).Border(1, Color.Grey.Lighten2)
    .Padding(8).Column(terms =>
    {
        terms.Item().Text("PAYMENT TERMS AND NOTES")
            .Bold().FontColor(brand).FontSize(9);

        terms.Item().PaddingTop(4).Text(t =>
        {
            t.Span("Payment method: ").Bold();
            t.Span("Bank transfer (SWIFT / ACH).  ");
            t.Span("Late payment: ").Bold();
            t.Span("1.5% per month after due date.");
        });

        terms.Item().PaddingTop(2).Text(
            "All amounts are in USD. This invoice is issued under the Master " +
            "Services Agreement dated January 10, 2025...")
            .FontColor(muted).FontSize(9);
    });
```

## Use Cases

Ideal for:
- Service invoices with many line items
- Professional billing documents
- Multi-page financial statements
- Technical delivery invoices
- Project billing

## What You'll Learn

1. **Multi-page tables** — automatic pagination with repeating headers
2. **Complex calculations** — dynamically computed totals
3. **Professional layout** — columns for billing information
4. **Image embedding** — logos and branding
5. **Alternating rows** — visual readability
6. **Precise alignment** — right-aligned numbers

## File Output

Generates: `03_invoice.pdf`

Creates a professional, multi-page invoice document suitable for business-to-business invoicing.
