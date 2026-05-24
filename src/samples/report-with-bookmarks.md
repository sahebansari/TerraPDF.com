---
title: Report with Bookmarks - TerraPDF Sample
description: Navigate complex PDFs with hierarchical bookmarks and outline structure using TerraPDF.
layout: sample.njk
permalink: /samples/report-with-bookmarks/
---


# Report with Bookmarks Sample

## Overview

The Report with Bookmarks sample demonstrates PDF bookmark/outline navigation:
- **Hierarchical structure** — top-level sections, sub-sections, and entries
- **Multiple levels** — parent-child bookmark relationships
- **Page positioning** — bookmarks linked to specific page locations
- **Developer guide** — comprehensive technical documentation
- **Professional layout** — headers, content sections, and footers

## Key Features Demonstrated

### 1. Defining Bookmarks

```csharp
// Top-level bookmarks
doc.Bookmark("Introduction",    1, 120.0);
doc.Bookmark("Getting Started", 2);
doc.Bookmark("Core Features",   3);
doc.Bookmark("Advanced Topics", 5);
doc.Bookmark("Appendix",        6);

// Sub-section bookmarks
doc.Bookmark("Installation",  2, "Getting Started");
doc.Bookmark("Quick Start",   2, "Getting Started", 200.0);
doc.Bookmark("Configuration", 2, "Getting Started", 280.0);

// Feature bookmarks
doc.Bookmark("Text & Typography", 3, "Core Features");
doc.Bookmark("Layout Containers",  3, "Core Features", 150.0);
doc.Bookmark("Tables",             4, "Core Features");
doc.Bookmark("Images & Hyperlinks",4, "Core Features", 200.0);
```

### 2. Bookmark Structure

```csharp
// Bookmark(title, pageNumber, parentTitle, topYPosition)
// - pageNumber: which page the bookmark points to
// - parentTitle (optional): parent bookmark for hierarchy
// - topYPosition (optional): Y-coordinate on the page (0 = top)
```

### 3. Page with Multiple Content Sections

```csharp
doc.Page(page =>
{
    page.Size(PageSize.A4);
    page.Margin(2.5, Unit.Centimetre);
    page.PageColor(Color.White);
    page.DefaultTextStyle(s => s.FontSize(11));

    page.Header().Background(brand).Padding(10).Column(h =>
        h.Item().AlignCenter().Text("TERRAPDF DEVELOPER GUIDE")
            .Bold().FontSize(18).FontColor(Color.White));

    page.Content().Column(col =>
    {
        col.Item().PaddingTop(20).Text("Introduction")
            .Bold().FontSize(22).FontColor(brand).AlignCenter();
        
        col.Item().PaddingTop(12).Text(introductionContent)
            .Justify().FontColor(muted);
    });

    page.Footer().AlignCenter().Text(t =>
    {
        t.Span("TerraPDF Developer Guide  |  ");
        t.CurrentPageNumber().FontSize(9).FontColor(brand).Bold();
        t.Span(" / ");
        t.TotalPages().FontSize(9).FontColor(brand).Bold();
    });
});
```

### 4. Metadata for Accessibility

```csharp
doc.MetadataTitle("TerraPDF Developer Guide");
doc.MetadataAuthor("TerraPDF Engineering Team");
doc.MetadataSubject("Comprehensive guide to TerraPDF features and APIs");
doc.MetadataKeywords("pdf; terra; dotnet; guide; documentation");
doc.MetadataCreator("TerraPDF Sample Generator v1.0");
```

## Bookmark Organization

The sample creates a professional structure:

```
📖 Introduction
📖 Getting Started
  └─ Installation
  └─ Quick Start
  └─ Configuration
📖 Core Features
  └─ Text & Typography
  └─ Layout Containers
  └─ Tables
  └─ Images & Hyperlinks
📖 Advanced Topics
  └─ Multi-Page Documents
  └─ Custom Styling
  └─ Performance Tips
📖 Appendix
  └─ API Reference
  └─ Sample Code
  └─ Migration Guide
```

## Sample Page Structure

### Page 1: Introduction
- Title: "Introduction"
- Content: What TerraPDF is, why it matters
- Topics: Getting Started overview

### Page 2: Getting Started
- Installation instructions via NuGet
- Quick start example
- Configuration guide

### Page 3: Core Features - Text & Typography
- Text and typography options
- Layout containers (Column, Row, Table)
- Images and hyperlinks

### Page 4: Core Features - Tables & Decorators
- Table structure and configuration
- Decorators (Padding, Margin, Background, Border)
- Styling patterns

### Page 5: Advanced Topics
- Multi-page documents and pagination
- Custom styling patterns
- Performance optimization tips

### Page 6: Appendix
- API reference overview
- Sample code blocks
- Migration guide from v1.x to v2.0

## Use Cases

Ideal for:
- **Technical documentation** — API guides, developer manuals
- **User manuals** — with navigable sections
- **Annual reports** — with executive summary navigation
- **Educational materials** — textbooks with chapters
- **Legal documents** — contracts with sections and clauses
- **Policy documents** — with hierarchical structure

## What You'll Learn

1. **Bookmark creation** — adding navigation entries
2. **Hierarchy** — parent-child relationships
3. **Page positioning** — linking to specific locations
4. **Multi-page structure** — organizing complex documents
5. **Metadata** — document-level information
6. **Professional formatting** — headers and footers
7. **Content organization** — logical document flow

## Bookmark Best Practices

1. **Hierarchy** — Use 2-3 levels maximum for clarity
2. **Descriptive titles** — Clear bookmark names
3. **Consistent naming** — Use consistent title patterns
4. **Page coverage** — Create bookmarks for major sections
5. **Accessibility** — Bookmarks aid navigation for all readers

## File Output

Generates: `08_report_with_bookmarks.pdf`

Creates a comprehensive developer guide with professional structure and easy navigation through bookmarks visible in the PDF viewer's outline/bookmark panel.
