---
title: Product Catalogue - TerraPDF Sample
description: Create product catalogues with images, pricing, and availability using TerraPDF.
layout: sample.njk
permalink: /samples/product-catalogue/
---


# Product Catalogue Sample

## Overview

The Product Catalogue sample demonstrates:
- **Product grid layouts** — multiple columns with product cards
- **Product images** — embedding and sizing images
- **Pricing information** — product costs and discounts
- **Availability status** — stock and inventory display
- **Multi-page catalogs** — automatic pagination
- **Category organization** — structured product grouping

## Key Features Demonstrated

### 1. Product Card Layout
```csharp
col.Item().Row(row =>
{
    void ProductCard(string name, string image, string price, string status) =>
        row.RelativeItem().Margin(8).Border(1, Color.Grey.Lighten2)
            .Padding(10).Column(p =>
            {
                if (File.Exists(image))
                    p.Item().Image(image, 100).AlignCenter();
                
                p.Item().PaddingTop(6).Text(name)
                    .Bold().FontSize(11).FontColor(brand);
                
                p.Item().PaddingTop(4).Text(price)
                    .FontSize(10).FontColor(accent);
                
                p.Item().PaddingTop(2).AlignCenter()
                    .Background(status == "In Stock" ? green : red)
                    .Padding(4)
                    .Text(status).FontSize(8).FontColor(Color.White);
            });

    ProductCard("Product A", "image1.jpg", "$99.99", "In Stock");
    ProductCard("Product B", "image2.jpg", "$149.99", "In Stock");
    ProductCard("Product C", "image3.jpg", "$79.99", "Out of Stock");
});
```

### 2. Product Category Section
```csharp
col.Item().Text("ELECTRONICS").Bold().FontSize(14)
    .FontColor(primary).MarginBottom(8);

col.Item().Row(row =>
{
    // Product cards for electronics category
});

col.Item().PaddingTop(12).Text("HOME & GARDEN").Bold().FontSize(14)
    .FontColor(primary).MarginBottom(8);

col.Item().Row(row =>
{
    // Product cards for home & garden category
});
```

### 3. Product Details Table
```csharp
col.Item().Table(table =>
{
    table.ColumnsDefinition(c =>
    {
        c.RelativeColumn(2);  // Product name
        c.RelativeColumn(1);  // SKU
        c.RelativeColumn(1);  // Price
        c.RelativeColumn(1);  // Stock
    });

    table.HeaderRow(row =>
    {
        row.Cell().Background(primary).Padding(6)
            .Text("Product").Bold().FontColor(Color.White);
        row.Cell().Background(primary).Padding(6)
            .Text("SKU").Bold().FontColor(Color.White);
        row.Cell().Background(primary).Padding(6)
            .Text("Price").Bold().FontColor(Color.White);
        row.Cell().Background(primary).Padding(6)
            .Text("Stock").Bold().FontColor(Color.White);
    });

    var products = new[]
    {
        ("Premium Headphones", "HP-001", "$199.99", "12"),
        ("Wireless Mouse", "WM-002", "$49.99", "45"),
        ("USB-C Hub", "HUB-003", "$79.99", "8"),
        // ... more products ...
    };

    foreach (var (name, sku, price, stock) in products)
    {
        table.Row(row =>
        {
            row.Cell().Padding(6).Text(name);
            row.Cell().Padding(6).AlignCenter().Text(sku).FontSize(9);
            row.Cell().Padding(6).AlignRight().Text(price);
            row.Cell().Padding(6).AlignCenter().Text(stock);
        });
    }
});
```

### 4. Index/Catalog Cover
```csharp
doc.Page(page =>
{
    page.Size(PageSize.A4);
    page.Margin(40);
    page.PageColor(Color.White);

    page.Content().Column(col =>
    {
        col.Spacing(20);

        col.Item().AlignCenter().PaddingTop(40)
            .Text("PRODUCT CATALOGUE 2025")
            .Bold().FontSize(32).FontColor(brand);

        col.Item().AlignCenter()
            .Text("Complete Product Lineup")
            .FontSize(16).FontColor(accent);

        col.Item().AlignCenter().PaddingTop(60)
            .Text("Over 500 products available")
            .FontSize(12).FontColor(muted);

        col.Item().AlignCenter()
            .Text("Fast shipping • Quality guaranteed • Expert support")
            .FontSize(10).FontColor(muted);
    });
});
```

## Product Catalogue Structure

Typical structure:

1. **Cover Page** — Title, branding, overview
2. **Table of Contents** — Category listing
3. **Category Pages** — Organized product sections
4. **Product Details** — Images, descriptions, pricing
5. **Order Information** — Shipping, payment, contact
6. **Index** — SKU index for reference

## Layout Options

### Grid Layout (Card-Based)
```
[Image]  [Image]  [Image]
Product  Product  Product
$99.99   $149.99  $79.99
```

### List Layout (Table-Based)
```
Product Name          SKU     Price   Stock
Premium Headphones    HP-001  $199    12
Wireless Mouse        WM-002  $49     45
```

### Mixed Layout
```
Category title and description

[Card]  [Card]  [Card]

Detailed product specifications table
```

## Use Cases

Perfect for:
- **E-commerce catalogs** — online store PDFs
- **B2B product lists** — wholesale catalogs
- **Retail brochures** — in-store materials
- **Inventory management** — stock tracking
- **Price lists** — cost sheets
- **Training materials** — product knowledge

## What You'll Learn

1. **Product cards** — card-based layout
2. **Image integration** — product photography
3. **Pricing display** — cost formatting
4. **Status indicators** — availability badges
5. **Multi-page layout** — automatic pagination
6. **Table structures** — detailed product data
7. **Category organization** — logical grouping

## File Output

Generates: `06_product_catalogue.pdf`

Creates a professional product catalogue suitable for e-commerce, retail, or B2B distribution.
