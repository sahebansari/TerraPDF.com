---
title: Simple Report - TerraPDF Sample
description: Learn how to create a simple PDF report with text formatting, tables, and page numbers using TerraPDF.
layout: sample.njk
permalink: /samples/simple-report/
---


# Simple Report Sample


## Overview

The Simple Report sample demonstrates fundamental TerraPDF features including:
- **Text formatting** — bold, italic, strikethrough, and colored spans
- **Justified paragraphs** — multi-span mixed text
- **Horizontal rules** — decorative separators
- **Tables** — with alternating row colors and proper alignment
- **Page numbers** — dynamic placeholders for total pages
- **Metadata** — document title, author, subject, and keywords

## Key Features Demonstrated

### 1. Document Metadata
```csharp
doc.MetadataTitle("TerraPDF Developer Guide");
doc.MetadataAuthor("TerraPDF Engineering Team");
doc.MetadataSubject("Comprehensive guide to TerraPDF features");
doc.MetadataKeywords("pdf; terra; dotnet; guide; documentation");
doc.MetadataCreator("TerraPDF Sample Generator v1.0");
```

### 2. Header with Background
```csharp
page.Header().Column(col =>
{
    col.Item().Background(accent).Padding(10)
        .Text("ANNUAL PERFORMANCE REPORT")
        .Bold().FontSize(16).FontColor(Color.White).AlignCenter();
});
```

### 3. Text Span Formatting
```csharp
col.Item().Text(t =>
{
    t.Span("Normal  ");
    t.Span("Bold  ").Bold();
    t.Span("Italic  ").Italic();
    t.Span("Strikethrough  ").Strikethrough();
    t.Span("Coloured  ").FontColor(Color.Blue.Medium);
    t.Span("Large").FontSize(16).FontColor(accent);
});
```

### 4. Table with Alternating Rows
```csharp
col.Item().Table(table =>
{
    table.ColumnsDefinition(c =>
    {
        c.RelativeColumn(3);
        c.RelativeColumn(2);
        c.RelativeColumn(2);
        c.RelativeColumn(2);
    });

    table.HeaderRow(row =>
    {
        row.Cell().Background(accent).Padding(5)
            .Text("Department").Bold().FontColor(Color.White);
        // more columns...
    });

    bool shade = false;
    foreach (var dept in departments)
    {
        string bg = shade ? lightColor : Color.White;
        table.Row(row =>
        {
            row.Cell().Background(bg).Padding(5).Text(dept.Name);
            // more cells...
        });
        shade = !shade;
    }
});
```

### 5. Footer with Page Numbers
```csharp
page.Footer().Column(col =>
{
    col.Item().LineHorizontal(1, accent);
    col.Item().PaddingTop(4).Row(row =>
    {
        row.RelativeItem()
            .Text("(c) 2025 Acme Corporation - Confidential")
            .FontColor(Color.Grey.Medium).FontSize(9);

        row.AutoItem().AlignRight().Text(t =>
        {
            t.Span("Page ").FontSize(9).FontColor(Color.Grey.Medium);
            t.CurrentPageNumber().FontSize(9).FontColor(Color.Grey.Medium);
            t.Span(" of ").FontSize(9).FontColor(Color.Grey.Medium);
            t.TotalPages().FontSize(9).FontColor(Color.Grey.Medium);
        });
    });
});
```

## Use Cases

This sample is ideal for:
- Financial reports and summaries
- Executive briefings
- Performance reviews
- Meeting minutes
- Internal documentation

## What You'll Learn

1. **Page structure** — headers, content, footers
2. **Text styling** — comprehensive formatting options
3. **Tables** — column definitions, headers, rows, alternating backgrounds
4. **Layout** — columns and spacing
5. **Colors** — Material Design palette usage
6. **Alignment** — center, right, justified text

## File Output

Generates: `01_simple_report.pdf`

This sample creates a professional-looking annual performance report suitable for internal business use.
