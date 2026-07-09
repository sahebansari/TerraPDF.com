---
title: "Barcodes & QR Codes"
description: "Generate Code128 barcodes and ISO/IEC 18004 QR codes in TerraPDF PDFs — vector-rendered, crisp at any zoom, with captions, colours, and error correction levels."
layout: base.njk
docPage: true
permalink: /docs/barcodes-and-qr-codes/
---
# Barcodes & QR Codes

TerraPDF generates Code128 barcodes and ISO/IEC 18004 QR codes from scratch — no raster image pipeline, no external dependency. Both render as **vector-filled rectangles**, matching the existing `VectorCanvas` rendering style, so they stay crisp at any zoom and can be placed anywhere an `IContainer` is exposed: `Column`, `Row`, a `Table` cell, header, or footer.

## Barcodes — `Barcode(...)`

`container.Barcode(data, ...)` encodes `data` as a Code128 (Subset B) barcode, covering printable ASCII (0x20-0x7E).

```csharp
// Auto-fills the available width
container.Barcode("TERRAPDF-2026");

// Explicit width/height, custom colour, and a caption below the bars
container.Barcode("SKU-00042-A", width: 260, height: 50,
    hexColor: "#1A3C5E", showCaption: true);
```

### Parameters

| Parameter | Default | Description |
|-----------|---------|--------------|
| `data` | — | Text to encode. Must be printable ASCII (0x20-0x7E). |
| `width` | `null` | Total rendered width in PDF points, including the quiet zone. When `null`, fills the available width. |
| `height` | `40` | Bar height in PDF points (excludes the optional caption). |
| `hexColor` | `"#000000"` | Bar (and caption text) colour. |
| `backgroundHexColor` | `"#FFFFFF"` | Background colour behind the bars. |
| `showCaption` | `false` | When `true`, renders `data` as a centred caption below the bars. |
| `quietZoneModules` | `10` | Blank margin on each side, in barcode modules. The Code128 spec recommends at least 10. |

## QR Codes — `QrCode(...)`

`container.QrCode(data, ...)` encodes `data` (UTF-8 bytes, byte mode) as an ISO/IEC 18004 QR code, generated from scratch: automatic version selection (1-40), all four error correction levels, Reed-Solomon error correction, and full mask-pattern penalty scoring.

```csharp
// Auto-fills the available width (capped by the available height, stays square)
container.QrCode("https://terrapdf.example/p/SKU-10231");

// Explicit size and a higher error correction level
container.QrCode("https://terrapdf.example/", size: 90,
    level: QrErrorCorrectionLevel.Q);

// Custom colours
container.QrCode("Brand-coloured QR", size: 100,
    hexColor: "#1A3C5E", backgroundHexColor: "#EAF1F8");
```

### Parameters

| Parameter | Default | Description |
|-----------|---------|--------------|
| `data` | — | Text to encode as UTF-8 bytes. |
| `size` | `null` | Side length in PDF points. When `null`, fills the available width, capped by the available height so it stays square. |
| `level` | `QrErrorCorrectionLevel.M` | Error correction level — higher levels tolerate more damage/occlusion at the cost of a denser code. |
| `hexColor` | `"#000000"` | Module colour. |
| `backgroundHexColor` | `"#FFFFFF"` | Background colour (including the quiet zone). |
| `quietZoneModules` | `4` | Blank margin on each side, in QR modules. The spec recommends at least 4. |

### Error Correction Levels

| Level | Recovery capacity |
|-------|--------------------|
| `QrErrorCorrectionLevel.L` | ~7% |
| `QrErrorCorrectionLevel.M` (default) | ~15% |
| `QrErrorCorrectionLevel.Q` | ~25% |
| `QrErrorCorrectionLevel.H` | ~30% |

## Placing Barcodes and QR Codes Anywhere

Because both are ordinary `IContainer` extensions, they compose with the rest of the layout system — including inside a table cell, next to product data:

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

## Tips

- Both symbologies render as one fill operation per contiguous run of dark modules via the `PdfPage.AddFilledRects` batch primitive — efficient even on QR codes with thousands of modules.
- `Barcode()` throws `NotSupportedException` if `data` contains a character outside printable ASCII — validate or sanitize dynamic input (e.g. SKUs from external systems) before encoding.
- `QrCode()` throws `NotSupportedException` if `data` is too long to fit any QR version at the requested error correction level — drop to `QrErrorCorrectionLevel.L` or shorten the payload (e.g. a short URL) for large inputs.
- See the [Barcodes & QR Codes sample](/samples/barcodes-and-qr-showcase/) for a full showcase including error correction levels, colours, and table placement.
