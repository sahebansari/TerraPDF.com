---
title: Styled Newsletter - TerraPDF Sample
description: Create a professional newsletter with two-column layouts, pull-quotes, and styled statistics using TerraPDF.
layout: sample.njk
permalink: /samples/styled-newsletter/
---


# Styled Newsletter Sample

## Overview

The Styled Newsletter sample showcases advanced styling and layout techniques:
- **Two-column layouts** — row-based article arrangement
- **Colored banners** — feature story highlighting with borders
- **Pull-quote blocks** — emphasized testimonials or key messages
- **Statistics boxes** — bordered containers with metrics
- **Tables** — in-brief news table with alternating rows
- **Multi-page footers** — repeating footer on every page
- **Rounded boxes** — modern design elements

## Key Features Demonstrated

### 1. Feature Story Banner
```csharp
col.Item().Background(highlight).Border(1, secondary).Padding(10).Column(inner =>
{
    inner.Item().Text("FEATURE STORY").Bold().FontSize(9).FontColor(primary);
    inner.Item().PaddingTop(2)
        .Text("Renewable Energy Hits Record 40% of Global Power")
        .Bold().FontSize(15).FontColor(primary);
    inner.Item().PaddingTop(4).Text(featureText)
        .FontColor(Color.Grey.Darken2).Justify();
});
```

### 2. Two-Column Article Layout
```csharp
col.Item().Row(row =>
{
    row.RelativeItem().Column(art =>
    {
        art.Item().Background(primary).Padding(5)
            .Text("TECHNOLOGY").Bold().FontSize(8).FontColor(secondary);
        // article content...
    });

    // Vertical divider
    row.ConstantItem(2).PaddingLeft(4).Background(secondary);

    row.RelativeItem().PaddingLeft(8).Column(art =>
    {
        art.Item().Background(secondary).Padding(5)
            .Text("POLICY").Bold().FontSize(8).FontColor(primary);
        // article content...
    });
});
```

### 3. Pull-Quote with Rounded Box
```csharp
col.Item().Margin(10)
    .RoundedBox(radius: 12, fillHexColor: highlight,
                borderHexColor: secondary, lineWidth: 1.5)
    .Padding(16).Column(q =>
    {
        q.Item().AlignCenter()
            .Text("The energy transition is no longer a question of if")
            .Italic().FontSize(13).FontColor(primary);
        q.Item().PaddingTop(6).AlignRight()
            .Text("- Dr. Amara Osei, IRENA Director General")
            .FontSize(10).FontColor(muted);
    });
```

### 4. Statistics Row with Bordered Boxes
```csharp
col.Item().Row(row =>
{
    void Stat(string value, string label, string fillColor) =>
        row.RelativeItem().Margin(4)
            .RoundedBox(radius: 10, fillHexColor: fillColor,
                        borderHexColor: secondary, lineWidth: 1.5)
            .Padding(12).Column(s =>
            {
                s.Item().AlignCenter().Text(value)
                    .Bold().FontSize(22).FontColor(primary);
                s.Item().AlignCenter().Text(label)
                    .FontSize(9).FontColor(muted);
            });

    Stat("40%",   "Renewables share",       highlight);
    Stat("$2.8T", "Global clean investment", Color.White);
    Stat("180M",  "EVs on the road",        highlight);
    Stat("-18%",  "Carbon intensity drop",  Color.White);
});
```

### 5. In-Brief Table
```csharp
col.Item().Table(table =>
{
    table.ColumnsDefinition(c => 
    { 
        c.RelativeColumn(5); 
        c.RelativeColumn(2); 
    });

    table.HeaderRow(row =>
    {
        row.Cell().Background(primary).Padding(5)
            .Text("Story").Bold().FontColor(Color.White);
        row.Cell().Background(primary).Padding(5).AlignCenter()
            .Text("Category").Bold().FontColor(Color.White);
    });

    bool shade = false;
    foreach (var (story, category) in briefItems)
    {
        string bg = shade ? highlight : Color.White;
        table.Row(row =>
        {
            row.Cell().Background(bg).Padding(5).Text(story);
            row.Cell().Background(bg).Padding(5).AlignCenter()
                .Text(category).Italic().FontColor(muted).FontSize(10);
        });
        shade = !shade;
    }
});
```

## Design Colors

The sample uses a cohesive color palette:
- **Primary** — `#1B4332` (forest green)
- **Secondary** — `#52B788` (light green)
- **Highlight** — `#D8F3DC` (pale green)
- **Muted** — `#6C757D` (gray)

## Use Cases

Perfect for:
- Company newsletters
- Industry news digests
- Marketing communications
- Event announcements
- Sustainability reports

## What You'll Learn

1. **Advanced layout** — row-based composition
2. **Styled containers** — borders, backgrounds, and rounded corners
3. **Multi-column design** — professional newsletter layout
4. **Visual hierarchy** — using size, color, and spacing
5. **Interactive elements** — bordered boxes and badges
6. **Repeating footers** — consistent branding

## File Output

Generates: `02_newsletter.pdf`

Creates a professional, modern newsletter suitable for corporate communications or marketing purposes.
