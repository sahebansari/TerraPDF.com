---
title: "Getting Started with TerraPDF"
description: "Installation and quick start guide for TerraPDF. Learn to generate your first PDF in minutes."
layout: base.njk
docPage: true
permalink: /docs/getting-started/
canonicalUrl: https://terrapdf.com/getting-started/
---
# Getting Started with TerraPDF

## Installation

```sh
dotnet add package TerraPDF
```

## Namespaces

| Namespace | Contents |
|-----------|----------|
| `TerraPDF.Core` | Fluent API entry points, descriptors, extension methods |
| `TerraPDF.Infra` | `IContainer`, `IDocument`, `IComponent` interfaces |
| `TerraPDF.Helpers` | `Color`, `PageSize`, `Unit`, `TextStyle` |

---

## Minimal Example

```csharp
using TerraPDF.Core;
using TerraPDF.Helpers;

Document.Create(container =>
{
    container.Page(page =>
    {
        page.Size(PageSize.A4);
        page.Margin(2, Unit.Centimetre);
        page.PageColor(Color.White);
        page.DefaultTextStyle(s => s.FontSize(11));

        page.Header().Text("My First PDF").Bold().FontSize(20);

        page.Content().Column(col =>
        {
            col.Spacing(8);
            col.Item().Text("Hello, TerraPDF!");
            col.Item().Text("A second paragraph.").Italic();
        });

        page.Footer().AlignCenter().Text(t =>
        {
            t.Span("Page ");
            t.CurrentPageNumber();
            t.Span(" / ");
            t.TotalPages();
        });
    });
})
.PublishPdf("output.pdf");
```

---

## Document Entry Points

```csharp
// Inline callback
Document.Create(container => { ... }).PublishPdf("output.pdf");

// Reusable IDocument class
Document.Create(new MyReport(data)).PublishPdf("output.pdf");
```

---

## Page Configuration

Every page is configured through `PageDescriptor`:

```csharp
container.Page(page =>
{
    // Size
    page.Size(PageSize.A4);                        // standard size
    page.Size(PageSize.Landscape(PageSize.A4));    // landscape
    page.Size(210, 297, Unit.Millimetre);          // explicit dimensions

    // Margins
    page.Margin(2, Unit.Centimetre);               // all sides
    page.MarginVertical(1, Unit.Centimetre);       // top + bottom
    page.MarginHorizontal(1.5, Unit.Centimetre);   // left + right
    page.Margin(top: 72, right: 54, bottom: 72, left: 54); // individual (points)

    // Appearance
    page.PageColor(Color.White);
    page.DefaultTextStyle(s => s.FontSize(11).FontColor(Color.Grey.Darken2));

    // Layout slots
    page.Header()   // IContainer — drawn above content on every page
    page.Content()  // IContainer — main scrollable area
    page.Footer()   // IContainer — drawn below content on every page
});
```

---

## Output Methods

```csharp
var composer = Document.Create(...);

// Write to file
composer.PublishPdf("report.pdf");

// Return as byte array (API responses, email attachments)
byte[] bytes = composer.PublishPdf();

// Write to any stream
using var stream = new MemoryStream();
composer.PublishPdf(stream);
```

---

## Next Steps

- [Text & Spans](/docs/text-and-spans/) — styling, underline, line-height, multi-span, page numbers
- [Layout](/docs/layout/) — Column, Row, Table
- [Decorators](/docs/decorators/) — Padding, Margin, Background, Border, Rounded Border, Per-Edge Borders, Alignment, Lines, PageBreak, Hyperlink, ShowIf
- [Images](/docs/images/) — PNG and JPEG embedding
- [Encryption & Security](/docs/encryption/) - AES-128 encryption, passwords, and permissions
- [Vector Graphics](/docs/vector-graphics/) - Canvas API, shapes, paths, grids, and charts
- [Unicode & Encoding](/docs/unicode-and-encoding/) - WinAnsiEncoding, Windows-1252 specials, and Latin-1 coverage
- [Table of Contents](/docs/table-of-contents/) — headings, automatic TOC generation, internal links
- [Bookmarks](/docs/bookmarks/) — PDF outlines / hierarchical navigation tree
- [Metadata](/docs/metadata/) — document properties (Title, Author, Subject, Keywords, Creator)
- [Colors](/docs/colors/) — full built-in palette reference
- [Page Sizes & Units](/docs/page-sizes-and-units/) — all standard sizes and unit conversions
- [Components & Templates](/docs/components-and-templates/) — reusable `IComponent` and `IDocument`
- [Row & Column Layout](/docs/row-and-column-layout/) — deep dive with diagrams
