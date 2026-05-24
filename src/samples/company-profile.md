---
title: Company Profile - TerraPDF Sample
description: Build professional company profile documents with images, metrics, team tables, and services using TerraPDF.
layout: sample.njk
permalink: /samples/company-profile/
---


# Company Profile Sample

## Overview

The Company Profile sample demonstrates:
- **Banner images** — full-width header images with overlays
- **Key metrics** — statistics boxes with styling
- **Team tables** — employee information in structured layout
- **Service cards** — business offerings in grid layout
- **Multi-page layouts** — logos and branding consistency
- **Professional design** — corporate document styling

## Key Features Demonstrated

### 1. Full-Width Header Banner
```csharp
page.Header().Column(col =>
{
    // Full-width banner image
    if (File.Exists(headerImg))
        col.Item().Image(headerImg);
    else
        col.Item().Background(brand).Padding(30)
            .AlignCenter().Text("TERRAPDF CO.")
            .Bold().FontSize(28).FontColor(Color.White);

    // Coloured accent bar under banner
    col.Item().Background(accent).Padding(4);
});
```

### 2. Key Metrics Display
```csharp
col.Item().Text("KEY METRICS AT A GLANCE").Bold().FontColor(brand);

col.Item().Row(row =>
{
    void Metric(string val, string lbl, string bg) =>
        row.RelativeItem().Margin(4).Background(bg)
            .Border(1, accent).Padding(12).Column(m =>
            {
                m.Item().AlignCenter().Text(val)
                    .Bold().FontSize(24).FontColor(brand);
                m.Item().AlignCenter().Text(lbl)
                    .FontSize(9).FontColor(muted);
            });

    Metric("200+",  "Engineers",        light);
    Metric("40K+",  "OSS Developers",   Color.White);
    Metric("$18M",  "ARR",              light);
    Metric("98%",   "Client Retention", Color.White);
});
```

### 3. Team Leadership Table
```csharp
col.Item().Text("LEADERSHIP TEAM").Bold().FontColor(brand);

col.Item().Table(table =>
{
    table.ColumnsDefinition(c =>
    {
        c.RelativeColumn(2);
        c.RelativeColumn(2);
        c.RelativeColumn(4);
    });

    table.HeaderRow(row =>
    {
        row.Cell().Background(brand).Padding(6)
            .Text("Name").Bold().FontColor(Color.White);
        row.Cell().Background(brand).Padding(6)
            .Text("Title").Bold().FontColor(Color.White);
        row.Cell().Background(brand).Padding(6)
            .Text("Background").Bold().FontColor(Color.White);
    });

    var team = new[]
    {
        ("Sarah Chen",      "CEO & Co-Founder", "15 yrs at Google, Stanford MBA"),
        ("Marcus Obi",      "CTO",              "Former principal engineer at AWS"),
        ("Priya Nair",      "CPO",              "Ex-product lead at Stripe"),
        ("James Whitfield", "CFO",              "CPA, ex-Goldman Sachs"),
        ("Lena Hoffmann",   "VP Engineering",  "Distributed systems expert"),
    };

    bool shade = false;
    foreach (var (name, title, bio) in team)
    {
        string bg = shade ? light : Color.White;
        table.Row(row =>
        {
            row.Cell().Background(bg).Padding(6).Text(name).Bold();
            row.Cell().Background(bg).Padding(6).Text(title).FontColor(accent);
            row.Cell().Background(bg).Padding(6).Text(bio).FontColor(muted).FontSize(10);
        });
        shade = !shade;
    }
});
```

### 4. Services Section with Cards
```csharp
col.Item().Text("OUR SERVICES").Bold().FontColor(brand);

col.Item().Row(row =>
{
    void Service(string icon, string title, string desc) =>
        row.RelativeItem().Margin(4).Border(1, light)
            .Padding(10).Column(s =>
            {
                s.Item().Text(icon + "  " + title).Bold().FontColor(brand);
                s.Item().PaddingTop(4).Text(desc).FontSize(10)
                    .FontColor(muted).Justify();
            });

    Service("*", "PDF & Document APIs",
        "High-performance document generation SDKs for .NET, Java, and Node.js.");
    Service("*", "Cloud SaaS Platform",
        "Scalable multi-tenant SaaS infrastructure with 99.99% SLA guarantee.");
    Service("*", "Consulting & Training",
        "On-site workshops, architecture reviews, and dedicated support plans.");
});
```

### 5. Footer with Logo
```csharp
page.Footer().Padding(20).Row(row =>
{
    row.ConstantItem(55).AlignMiddle().Column(c =>
    {
        if (File.Exists(smallImg))
            c.Item().Image(smallImg, 50);
        else
            c.Item().Text("TerraPDF").Bold().FontColor(brand);
    });

    row.RelativeItem().PaddingLeft(10).AlignMiddle().AlignRight()
        .Text(t =>
        {
            t.Span("Page ").FontSize(9).FontColor(muted);
            t.CurrentPageNumber().FontSize(9).FontColor(muted);
            t.Span(" / ").FontSize(9).FontColor(muted);
            t.TotalPages().FontSize(9).FontColor(muted);
        });
});
```

## Color Scheme

- **Brand** — `#0D3349` (dark blue)
- **Accent** — `#F4A020` (orange)
- **Light** — `#F7F9FC` (light blue)
- **Muted** — `#607080` (gray)

## Layout Sections

1. **Header** — Full-width banner image with accent bar
2. **Tagline** — Company mission statement
3. **About Section** — Company overview (colored box)
4. **Key Metrics** — Four statistic boxes
5. **Leadership Team** — Table with executive information
6. **Services** — Three-column service descriptions
7. **Contact Information** — Email and phone
8. **Footer** — Company logo and page numbers

## Use Cases

Perfect for:
- Corporate brochures
- Company overview documents
- Leadership presentations
- Investment pitch decks
- Partner information sheets
- Annual reports

## What You'll Learn

1. **Image handling** — embedding and sizing images
2. **Metric boxes** — styled containers with statistics
3. **Professional tables** — team and employee data
4. **Service cards** — grid-based layout
5. **Footer branding** — consistent logo placement
6. **Multi-page consistency** — repeating elements

## File Output

Generates: `04_company_profile.pdf`

Creates a professional company profile document suitable for corporate communications, investor presentations, or partner information distribution.
