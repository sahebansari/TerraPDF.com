---
title: Barcodes & QR Codes Showcase - TerraPDF Sample
description: Generate Code128 barcodes and ISO/IEC 18004 QR codes with TerraPDF — vector-rendered, with captions, colours, error correction levels, and table placement.
layout: sample.njk
permalink: /samples/barcodes-and-qr-showcase/
---

# Barcodes & QR Codes Showcase Sample

## Overview

The Barcodes & QR Codes Showcase sample demonstrates:
- **`container.Barcode(...)`** — Code128 (Subset B) barcode generation
- **`container.QrCode(...)`** — from-scratch ISO/IEC 18004 QR code generation
- **Vector rendering** — both render as vector-filled rectangles, crisp at any zoom, no raster image pipeline
- **Error correction levels** — all four QR levels (`L`, `M`, `Q`, `H`) side by side
- **Custom colours** — module and background colour for both symbologies
- **Captions** — human-readable text rendered below a barcode
- **Composability** — placed inside a `Row` and inside a `Table` cell to prove they work like any other element

## Key Features Demonstrated

### 1. Plain Code128 Barcode
```csharp
container.Barcode("TERRAPDF-2026");
```

### 2. Barcode with Caption & Colour
```csharp
container.Barcode("SKU-00042-A", width: 260, height: 50,
    hexColor: "#1A3C5E", showCaption: true);
```

### 3. QR Code Error Correction Levels
```csharp
foreach (var level in new[]
{
    QrErrorCorrectionLevel.L, QrErrorCorrectionLevel.M,
    QrErrorCorrectionLevel.Q, QrErrorCorrectionLevel.H,
})
{
    row.RelativeItem().Column(c =>
    {
        c.Item().AlignCenter().QrCode(
            "https://terrapdf.example/" + level, size: 90, level: level);
        c.Item().PaddingTop(4).AlignCenter()
         .Text($"Level {level}").FontSize(8);
    });
}
```

**Use case:** Higher levels tolerate more damage or occlusion (e.g. a logo overlay) at the cost of a denser code.

### 4. Custom Module & Background Colour
```csharp
row.AutoItem().QrCode("Brand-coloured QR", size: 100,
    hexColor: "#1A3C5E", backgroundHexColor: "#EAF1F8");
row.AutoItem().QrCode("Accent-coloured QR", size: 100,
    hexColor: "#E87722", backgroundHexColor: "#FFFFFF");
```

### 5. Inside a Table Cell

Barcodes and QR codes are ordinary `IContainer` extensions, so they compose inside a product table alongside text cells:

```csharp
tbl.Row(row =>
{
    row.Cell().Padding(6).AlignCenter()
       .QrCode($"https://terrapdf.example/p/{sku}", size: 60);
    row.Cell().Padding(6).AlignMiddle().Column(c =>
    {
        c.Item().Text(name).Bold();
        c.Item().Text(sku).FontSize(8);
    });
    row.Cell().Padding(6).AlignMiddle()
       .Barcode(sku, height: 30);
});
```

**Use case:** Product/inventory sheets, shipping manifests, and ticket stubs where each row needs its own scannable code.

## API Summary

| Method | Purpose |
|--------|---------|
| `Barcode(data, width?, height, hexColor, backgroundHexColor, showCaption, quietZoneModules)` | Code128 (Subset B) — encodes printable ASCII 0x20-0x7E |
| `QrCode(data, size?, level, hexColor, backgroundHexColor, quietZoneModules)` | ISO/IEC 18004, byte-mode, versions 1-40, all four error correction levels |

Both render as **vector-filled rectangles** — no raster image pipeline, crisp at any zoom, and placeable inside any container: `Column`, `Row`, `Table` cell, header, or footer.

## Use Cases

Perfect for:
- **Inventory & shipping** — SKU barcodes and QR labels on packing slips
- **Event ticketing** — scannable QR codes on tickets and badges
- **Product catalogues** — link straight to a product page from a printed catalogue
- **Asset tracking** — barcodes on equipment tags and work orders
- **Marketing collateral** — QR codes linking flyers and brochures to landing pages

## What You'll Learn

1. **Barcode generation** — Code128 encoding, sizing, captions, and quiet zones
2. **QR code generation** — byte-mode encoding, version selection, and error correction
3. **Vector rendering** — how both symbologies stay crisp without a raster pipeline
4. **Composability** — placing scannable codes inside rows, columns, and table cells
5. **Efficient rendering** — the `PdfPage.AddFilledRects` batch primitive behind both

## File Output

Generates: `13_barcodes_and_qr_showcase.pdf`

Creates a comprehensive showcase of barcode and QR code generation suitable for inventory sheets, tickets, and product catalogues.
