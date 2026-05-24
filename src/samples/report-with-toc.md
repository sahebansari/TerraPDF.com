---
title: Report with Table of Contents - TerraPDF Sample
description: Generate PDFs with automatic table of contents, heading levels, and internal navigation using TerraPDF.
layout: sample.njk
permalink: /samples/report-with-toc/
---


# Report with Table of Contents Sample

## Overview

The Report with Table of Contents (TOC) sample demonstrates:
- **Automatic TOC generation** — table of contents generated from headings
- **Heading levels** — H1 through H6 with default styling
- **Page numbering** — automatic page collection and numbering
- **Internal links** — clickable page numbers in TOC
- **Multi-chapter reports** — structured document with sections
- **Two-pass rendering** — accurate page counts and positioning

## Key Features Demonstrated

### 1. Table of Contents Page
```csharp
container.TableOfContents(p =>
{
    p.Size(PageSize.A4);
    p.Margin(2, Unit.Centimetre);
    p.PageColor(Color.White);
    p.DefaultTextStyle(s =>
        s.FontFamily("Helvetica").FontSize(12)
            .FontColor("#000000").SemiBold().LineHeight(1.5));
    
    p.Header().MarginBottom(12)
        .Text("Table of Contents").AlignCenter()
        .Bold().FontSize(20).FontColor(Color.Black);
});
```

### 2. Heading Levels
```csharp
// Six heading levels with automatic TOC collection
col.Item().H1("Introduction");
col.Item().H2("What is TerraPDF?");
col.Item().H3("Key Features");
col.Item().H4("Feature Details");
col.Item().H5("Sub-feature");
col.Item().H6("Technical Note");
```

### 3. Heading Styling and Customization
```csharp
// Default heading sizes:
// H1: 24pt, bold
// H2: 20pt, bold
// H3: 16pt, bold
// H4: 14pt, italic
// H5: 12pt, bold
// H6: 11pt, regular

// Customization
col.Item().H2("Custom Heading")
    .FontColor(Color.Blue)
    .Underline();

col.Item().H3("Another Custom")
    .FontSize(18)
    .FontColor(Color.Green.Darken1);
```

### 4. Multi-Chapter Document Structure
```csharp
// Chapter 1 — Introduction
container.Page(p =>
{
    p.Size(PageSize.A4);
    p.Margin(2, Unit.Centimetre);
    
    p.Header().Text("Report with Table of Contents")
        .Bold().FontSize(14).FontColor(Color.Grey.Medium);

    p.Content().Column(col =>
    {
        col.Item().H1("Introduction");
        col.Item().Text("Introduction content...").Justify();

        col.Item().H2("What is TerraPDF?");
        col.Item().Text("Definition and overview...").Justify();

        col.Item().H2("Table of Contents Feature");
        col.Item().Text("TOC feature description...").Justify();

        col.Item().H3("How it works");
        col.Item().Text("Two-pass rendering explanation...").Justify();
    });
});

// Chapter 2 — Features Demo
container.Page(p =>
{
    // ...similar structure...
});

// Chapter 3 — Internal Navigation
container.Page(p =>
{
    // ...with internal links...
});
```

### 5. Internal Links
```csharp
col.Item().Text("Click here to go to Chapter 2")
    .InternalLink(2, 120);  // pageNumber, topY position

// Or use heading references
col.Item().H1("Features");  // Automatically added to TOC
col.Item().Text("See also the ").
    Link("Features section", 5, 150);
```

## Heading Structure Example

The sample generates a professional document with:

```
Table of Contents
├─ Page 1: Introduction
│  ├─ What is TerraPDF?
│  ├─ Table of Contents Feature
│  │  └─ How it works
│  └─ Supported heading levels
│
├─ Page 2: Features
│  ├─ Available Heading Levels
│  ├─ Styling Customisation
│  ├─ Sample Table
│  └─ Further reading
│
├─ Page 3: Internal Navigation
│  └─ Linking Within Documents
│
└─ Page 4-N: Content continues...
```

## Two-Pass Rendering

TerraPDF uses two passes to accurately generate TOC:

1. **First Pass** — Measure content, collect all headings and their page positions
2. **Second Pass** — Render final PDF with populated TOC and accurate page numbers

## Features Demonstrated

- **Heading collection** — automatic from H1-H6 elements
- **Page counting** — accurate total page numbers
- **Link generation** — clickable TOC entries
- **Nested structure** — hierarchical headings
- **Custom styling** — override default heading styles
- **Multi-page layout** — tables inside chapters
- **Accessibility** — structure for screen readers

## Use Cases

Perfect for:
- **Technical documentation** — API guides with chapters
- **Reports** — structured business documents
- **Books** — organized content with navigation
- **Theses** — academic papers with TOC
- **Manuals** — user guides with sections
- **Policies** — organized compliance documents

## What You'll Learn

1. **Table of Contents** — automatic generation from headings
2. **Heading levels** — H1-H6 with default styling
3. **Page collection** — two-pass rendering strategy
4. **Internal navigation** — clickable links
5. **Document structure** — organizing complex documents
6. **Heading customization** — overriding default styles
7. **Nested content** — tables and components in chapters

## Best Practices

- Use heading hierarchy logically (don't skip levels)
- Keep headings concise
- Use consistent terminology
- Place TOC near the beginning
- Avoid too many nesting levels (2-3 is ideal)
- Test navigation in PDF viewers

## File Output

Generates: `09_report_with_toc.pdf`

Creates a professional multi-chapter report with automatic table of contents, proper page numbering, and interactive navigation via clickable TOC entries.
