---
title: Product Catalog Cover - TerraPDF Sample
description: Design professional product catalog cover pages with featured items and testimonials using TerraPDF.
layout: sample.njk
permalink: /samples/product-catalog-cover/
---

# Product Catalog Cover Sample

## Overview

The Product Catalog Cover sample demonstrates:
- **Cover page design** — professional catalog frontmatter
- **Featured products** — prominent product showcase
- **Testimonials** — customer quotes and reviews
- **Call-to-action sections** — engagement and lead generation
- **Multi-column layouts** — professional design composition
- **High-impact typography** — professional branding

## Key Features Demonstrated

### 1. Cover Page Header
```csharp
page.Header().Column(col =>
{
    if (File.Exists(headerImg))
        col.Item().Image(headerImg);
    else
        col.Item().Background(brand).Padding(50);

    col.Item().Background(primary).Padding(20).Column(overlay =>
    {
        overlay.Item().AlignCenter()
            .Text("PRODUCT COLLECTION 2025")
            .Bold().FontSize(26).FontColor(Color.White);
        
        overlay.Item().PaddingTop(4).AlignCenter()
            .Text("Discover Our Latest Innovations")
            .FontSize(12).FontColor(secondary);
    });
});
```

### 2. Hero Section with CTA
```csharp
col.Item().Background(highlight).Padding(30).Column(hero =>
{
    hero.Item().Text("Welcome to Our Latest Collection")
        .Bold().FontSize(20).FontColor(brand);
    
    hero.Item().PaddingTop(8).Text(
        "Explore our curated selection of premium products, " +
        "featuring cutting-edge innovation and exceptional quality.")
        .Justify().FontColor(muted);
    
    hero.Item().PaddingTop(12)
        .Text("Featured Highlights Below ↓")
        .Italic().FontSize(11).FontColor(accent);
});
```

### 3. Featured Products Section
```csharp
col.Item().Text("FEATURED PRODUCTS").Bold().FontSize(14)
    .FontColor(brand).MarginTop(16).MarginBottom(8);

col.Item().Row(row =>
{
    void FeaturedProduct(string name, string image, string desc, string highlight) =>
        row.RelativeItem().Margin(6).Border(2, accent)
            .Padding(12).Column(p =>
            {
                if (File.Exists(image))
                    p.Item().Image(image, 120).AlignCenter();
                
                p.Item().PaddingTop(8).Text(name)
                    .Bold().FontSize(12).FontColor(brand).AlignCenter();
                
                p.Item().PaddingTop(4).Background(Color.Yellow.Lighten2)
                    .Padding(4).AlignCenter()
                    .Text(highlight).FontSize(9).FontColor(Color.Red.Darken1);
                
                p.Item().PaddingTop(6).Text(desc)
                    .FontSize(9).FontColor(muted).Justify();
            });

    FeaturedProduct("Premium Edition", "premium.jpg",
        "Our flagship product with advanced features",
        "Best Seller");
    FeaturedProduct("Classic Collection", "classic.jpg",
        "Time-tested reliability and performance",
        "Top Rated");
    FeaturedProduct("New Launch", "new.jpg",
        "Revolutionary design and innovation",
        "Limited Edition");
});
```

### 4. Customer Testimonials
```csharp
col.Item().Text("WHAT OUR CUSTOMERS SAY").Bold().FontSize(14)
    .FontColor(brand).MarginTop(16).MarginBottom(8);

col.Item().Row(row =>
{
    void Testimonial(string quote, string author, string title, string stars) =>
        row.RelativeItem().Margin(4).Background(light)
            .Border(1, Color.Grey.Lighten2).Padding(10).Column(t =>
            {
                t.Item().Text("★ " + stars).FontSize(10).FontColor(accent);
                t.Item().PaddingTop(4).Text($"\"{quote}\"")
                    .Italic().FontSize(9).FontColor(muted);
                t.Item().PaddingTop(6).Text(author)
                    .Bold().FontSize(9).FontColor(brand);
                t.Item().Text(title).FontSize(8).FontColor(muted);
            });

    Testimonial("Excellent quality and fast delivery!",
        "Sarah Johnson", "Product Manager", "5/5");
    Testimonial("Best investment for our business",
        "Mike Chen", "Operations Director", "5/5");
});
```

### 5. Call-to-Action Banner
```csharp
col.Item().MarginTop(16).Background(brand).Padding(16)
    .Column(cta =>
    {
        cta.Item().AlignCenter()
            .Text("READY TO EXPLORE OUR FULL CATALOG?")
            .Bold().FontSize(14).FontColor(Color.White);
        
        cta.Item().PaddingTop(6).AlignCenter()
            .Text("Request a complete product guide or schedule a demo")
            .FontSize(10).FontColor(secondary);
        
        cta.Item().PaddingTop(8).AlignCenter()
            .Text("Contact: sales@example.com  |  +1 (555) 123-4567")
            .FontSize(9).FontColor(Color.White);
    });
```

### 6. Key Information Boxes
```csharp
col.Item().Row(row =>
{
    void InfoBox(string icon, string title, string desc) =>
        row.RelativeItem().Margin(4).Border(1, Color.Grey.Lighten2)
            .Padding(10).Column(i =>
            {
                i.Item().Text(icon + " " + title).Bold()
                    .FontColor(brand);
                i.Item().PaddingTop(4).Text(desc)
                    .FontSize(9).FontColor(muted);
            });

    InfoBox("✓", "Premium Quality",
        "Rigorous quality control and testing");
    InfoBox("→", "Fast Shipping",
        "Worldwide delivery in 3-7 business days");
    InfoBox("◆", "Expert Support",
        "24/7 customer service available");
});
```

## Cover Design Elements

Typical cover page includes:

1. **Header Banner** — Eye-catching image or background
2. **Title/Logo** — Catalog name and branding
3. **Hero Section** — Welcome message with highlights
4. **Featured Products** — Top-3 or top-5 products highlighted
5. **Testimonials** — Customer success stories
6. **Key Information** — Quality, shipping, support
7. **Call-to-Action** — Primary conversion goal
8. **Contact Information** — Sales and support details

## Design Colors

- **Brand** — Primary corporate color
- **Primary** — Featured section color
- **Secondary** — Accent highlights
- **Light** — Background fill color
- **Muted** — Text secondary information
- **Accent** — Call-to-action color

## Use Cases

Perfect for:
- **Catalog frontmatter** — cover page design
- **Marketing materials** — promotional pieces
- **Sales brochures** — high-impact presentation
- **Product showcases** — feature highlights
- **Investor materials** — portfolio presentation
- **Event materials** — conference handouts

## What You'll Learn

1. **Cover design** — professional frontmatter
2. **Featured products** — prominent showcase
3. **Testimonials** — customer social proof
4. **Information boxes** — key benefits
5. **Call-to-action** — conversion elements
6. **Multi-column layout** — professional composition
7. **Typography hierarchy** — emphasis and focus

## File Output

Generates: `07_product_catalog_cover.pdf`

Creates a professional, high-impact catalog cover page designed to capture attention and drive engagement with your product line.
