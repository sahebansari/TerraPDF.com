---
title: Event Brochure - TerraPDF Sample
description: Create professional event brochures with agendas, speaker cards, and sponsor sections using TerraPDF.
layout: sample.njk
permalink: /samples/event-brochure/
---


# Event Brochure Sample

## Overview

The Event Brochure sample showcases event marketing materials:
- **Header banner** — event title with overlay text
- **Agenda table** — conference schedule with multiple tracks
- **Speaker cards** — two-column layout of featured speakers
- **Sponsor logos** — tiered sponsor display
- **Call-to-action** — registration banner
- **Professional branding** — consistent color scheme throughout

## Key Features Demonstrated

### 1. Header with Overlay Text
```csharp
page.Header().Column(col =>
{
    if (File.Exists(headerImg))
        col.Item().Image(headerImg);
    else
        col.Item().Background(primary).Padding(40);

    col.Item().Background(primary).Padding(12).Column(overlay =>
    {
        overlay.Item().AlignCenter()
            .Text("TECHVISION SUMMIT 2025")
            .Bold().FontSize(22).FontColor(Color.White);
        
        overlay.Item().AlignCenter()
            .Text("September 18-19, 2025  |  Convention Center, San Francisco")
            .FontColor(gold).FontSize(11);
    });
});
```

### 2. Agenda Table with Tracks
```csharp
col.Item().Text("CONFERENCE AGENDA – DAY 1").Bold().FontColor(primary);

col.Item().Table(table =>
{
    table.ColumnsDefinition(c =>
    {
        c.ConstantColumn(70);  // Time
        c.RelativeColumn(3);   // Session
        c.RelativeColumn(2);   // Track
    });

    table.HeaderRow(row =>
    {
        row.Cell().Background(primary).Padding(6)
            .Text("Time").Bold().FontColor(Color.White);
        row.Cell().Background(primary).Padding(6)
            .Text("Session").Bold().FontColor(Color.White);
        row.Cell().Background(primary).Padding(6)
            .Text("Track").Bold().FontColor(Color.White);
    });

    var agenda = new[]
    {
        ("09:00", "Registration & Breakfast",                    "All"),
        ("10:00", "Opening Keynote: The Next Decade of AI",      "Keynote"),
        ("11:00", "Building Resilient Cloud-Native Architectures", "Cloud"),
        // ... more sessions ...
    };

    bool shade = false;
    foreach (var (time, session, track) in agenda)
    {
        string bg = shade ? light : Color.White;
        table.Row(row =>
        {
            row.Cell().Background(bg).Padding(5).Text(time)
                .Bold().FontColor(primary);
            row.Cell().Background(bg).Padding(5).Text(session);
            row.Cell().Background(bg).Padding(5).AlignCenter()
                .Text(track).Italic().FontColor(muted).FontSize(10);
        });
        shade = !shade;
    }
});
```

### 3. Speaker Cards in Two-Column Layout
```csharp
col.Item().Text("FEATURED SPEAKERS").Bold().FontColor(primary);

col.Item().Row(row =>
{
    void Speaker(string name, string role, string org, string topic) =>
        row.RelativeItem().Margin(5).Border(1, Color.Grey.Lighten2)
            .Padding(10).Column(s =>
            {
                s.Item().Background(primary).Padding(4)
                    .Text(name).Bold().FontColor(Color.White).FontSize(11);
                s.Item().PaddingTop(4).Text(role)
                    .FontColor(gold).FontSize(10);
                s.Item().Text(org).FontColor(muted).FontSize(10);
                s.Item().PaddingTop(6).Text("Topic: " + topic)
                    .Italic().FontColor(primary).FontSize(10);
            });

    Speaker("Dr. Aiko Tanaka", "Research Director", "OpenMind Labs",
        "The Next Decade of AI");
    Speaker("Carlos Rivera", "VP Engineering", "CloudScale Inc.",
        "Resilient Cloud Architectures");
    Speaker("Emma Johansson", "CISO", "Fortress Security",
        "Zero-Trust in Enterprise");
});
```

### 4. Sponsor Tier Display
```csharp
col.Item().Text("OUR SPONSORS").Bold().FontColor(primary);

col.Item().Row(row =>
{
    void Sponsor(string tier, string name, string bg) =>
        row.RelativeItem().Margin(3).Background(bg)
            .Border(1, gold).Padding(10).Column(s =>
            {
                s.Item().AlignCenter().Text(tier)
                    .FontSize(8).FontColor(muted);
                s.Item().AlignCenter().Text(name)
                    .Bold().FontColor(primary);
                if (File.Exists(smallImg))
                    s.Item().AlignCenter().Image(smallImg, 40);
            });

    Sponsor("PLATINUM", "TerraPDF Co.",  light);
    Sponsor("GOLD",     "CloudScale Inc.", Color.White);
    Sponsor("GOLD",     "Fortress Sec.",   light);
    Sponsor("SILVER",   "DevEx Labs",      Color.White);
});
```

### 5. Call-to-Action Banner
```csharp
col.Item().MarginTop(10).Background(primary).Padding(14).Column(cta =>
{
    cta.Item().AlignCenter()
        .Text("REGISTER NOW — EARLY BIRD ENDS AUGUST 1")
        .Bold().FontSize(14).FontColor(Color.White);
    
    cta.Item().PaddingTop(4).AlignCenter()
        .Text("summit.techvision.example  |  tickets@techvision.example  |  +1 (800) 123-4567")
        .FontColor(gold).FontSize(10);
});
```

## Color Scheme

- **Primary** — `#6A0572` (purple)
- **Gold** — `#D4A017` (accent yellow)
- **Light** — `#FAF5FB` (light purple)
- **Muted** — `#7A7A8C` (gray)

## Brochure Structure

1. **Header** — Event banner with title and dates
2. **Welcome Section** — Event overview
3. **Agenda** — Conference schedule with tracks
4. **Featured Speakers** — Two-column speaker cards
5. **Sponsors** — Tiered sponsor display
6. **CTA Banner** — Registration call-to-action
7. **Footer** — Event info and page numbers

## Use Cases

Perfect for:
- Conference brochures
- Event programs
- Trade show materials
- Webinar invitations
- Festival programs
- Workshop schedules

## What You'll Learn

1. **Header overlays** — text on banner images
2. **Table styling** — agenda with multiple tracks
3. **Card layouts** — speaker information cards
4. **Sponsor tiers** — categorized display
5. **CTAs** — action-oriented sections
6. **Professional design** — event branding

## File Output

Generates: `05_event_brochure.pdf`

Creates a professional event brochure suitable for conferences, trade shows, and marketing communications.
