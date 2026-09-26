---
title: Canvas Extras Showcase - TerraPDF Sample
description: Dashed ellipses, rounded rectangles, pies, and paths, linear and radial gradient fills, clickable canvas links and bookmarks, and vector QR codes drawn with the TerraPDF vector canvas.
layout: sample.njk
permalink: /samples/canvas-extras-showcase/
---

# Canvas Extras Showcase Sample

## Overview

The Canvas Extras Showcase sample demonstrates:
- **Dashed shapes and paths**: dash patterns and phases on ellipses, rounded rectangles, pie sectors, and any path via `PathDescriptor.Dash(...)`
- **Rounded-rectangle paths**: `PathDescriptor.RoundedRect(...)`, with the radius clamped to half the shorter side
- **Gradient fills**: linear gradients at any angle and radial gradients, clipped to the path and combinable with an outline
- **Canvas links**: clickable URI links and in-document links laid over painted buttons
- **Canvas bookmarks**: outline entries placed from a canvas, nested by parent title
- **Canvas QR codes**: vector QR codes at an absolute position, with custom colours, optional backgrounds, and a configurable quiet zone

This is new in **v2.3.0**. Version 2.2.0 added dashes to lines and rectangles;
2.3.0 extends them to every stroked shape and path, and adds gradients, links,
bookmarks, and QR codes to the canvas.

## Key Features Demonstrated

### 1. Dashed Shapes and Paths

`StrokeEllipse`, `DrawEllipse`, `StrokeRoundedRect`, `DrawRoundedRect`,
`StrokePie`, and `DrawPie` take trailing `dashPattern` and `dashPhase`
arguments, with the same semantics as `Line`. Arbitrary paths use `.Dash(...)`,
which applies to the path's stroke:

```csharp
c.StrokeEllipse(45, 40, 40, 28, brandLight, 1.5, dashPattern: [6, 3]);
c.DrawRoundedRect(100, 12, 90, 56, 10, white, accent, 1.5, dashPattern: [2, 2]);
c.StrokePie(205, 10, 64, 64, -90, 270, green, 1.5, dashPattern: [8, 3, 2, 3]);

c.Path(p => p
    .RoundedRect(290, 12, 80, 56, 16)
    .Fill(white)
    .Stroke(brand, 1.5)
    .Dash([4, 4], 2));
```

Each dashed command is scoped with `q`/`Q`, so a solid stroke drawn afterwards
stays solid. The circle methods have no dash parameters; draw a dashed circle
with `StrokeEllipse(cx, cy, r, r, ...)`.

### 2. Gradient Fills

`FillLinearGradient(from, to, angle)` and `FillRadialGradient(center, edge)`
replace a path's flat fill with a two-stop PDF shading clipped to the path:

```csharp
c.Path(p => p.Rect(0, 8, 110, 70).FillLinearGradient(brandLight, white));        // 0°: left to right
c.Path(p => p.Rect(125, 8, 110, 70).FillLinearGradient(accent, brand, 90));      // 90°: top to bottom
c.Path(p => p.RoundedRect(250, 8, 110, 70, 14)
    .FillLinearGradient(green, brandLight, 45)
    .Stroke(brand, 1));                                                          // gradient + outline
c.Path(p => p.Circle(415, 43, 35).FillRadialGradient(white, accent));            // radial
```

| Behaviour | Detail |
|-----------|--------|
| Extent | The gradient spans the path's bounding box |
| Linear angle | Degrees clockwise from left-to-right: 0 = left to right, 90 = top to bottom |
| Radial | Centre colour in the middle, edge colour at half the larger side |
| With `.Fill(...)` | They replace each other; the last call wins |
| Still applies | `.Stroke(...)`, `.UseEvenOddFill()`, `.Opacity(...)`, `.Dash(...)` |

### 3. Links and Bookmarks

A canvas link is an invisible clickable rectangle, so paint the button first
and lay the link over the same area:

```csharp
c.FillRoundedRect(0, 10, 180, 30, 6, brandLight);
c.Text("Open the TerraPDF repository", 12, 29, white, 9, bold: true);
c.Link(0, 10, 180, 30, "https://github.com/sahebansari/TerraPDF");

c.StrokeRoundedRect(200, 10, 180, 30, 6, brand, 1);
c.Text("Back to page 1", 212, 29, brand, 9, bold: true);
c.InternalLink(200, 10, 180, 30, 1);
```

`InternalLink` takes a 1-based page number and an optional `top` scroll
position. Rendering throws `InvalidOperationException` if the document has
fewer pages.

`Bookmark` adds an outline entry for the page the canvas is drawn on, at a
canvas-relative `y`, with no page number to compute. A repeated (title, parent)
pair is recorded once, so a canvas repeated on every page adds one entry:

```csharp
c.Bookmark("Canvas extras");
c.Bookmark("Dashed shapes", 0, "Canvas extras");   // nested under "Canvas extras"
```

### 4. QR Codes on the Canvas

`QrCode` draws a QR code at an absolute position as a single filled vector
path, with runs of dark modules merged into rectangles:

```csharp
c.QrCode("https://github.com/sahebansari/TerraPDF", 0, 0, 110, backgroundHex: white);
c.QrCode("TerraPDF", 130, 0, 110, QrErrorCorrectionLevel.H, hexColor: brand, backgroundHex: white);
c.QrCode("https://github.com/sahebansari/TerraPDF", 260, 0, 110, hexColor: accent, quietZoneModules: 1);
c.Link(0, 0, 110, 110, "https://github.com/sahebansari/TerraPDF");   // make the first one clickable
```

- `size` includes the quiet zone. The specification asks for 4 modules; lower
  it only on a light background.
- `backgroundHex = null` leaves the square transparent.
- Data too long for the chosen error-correction level throws
  `NotSupportedException` when `QrCode` is called, not when the PDF is written.

For a QR code in the layout flow rather than at a canvas position, use
`container.QrCode(...)`. See the [Barcodes & QR Codes sample](/samples/barcodes-and-qr-showcase/).

## Notes

- Labels in this sample stay inside WinAnsiEncoding, the encoding the standard-14 fonts use. The degree sign (°) is part of it.
- Each gradient becomes one page-level `/Shading` resource; dashes and link annotations add no images.

See the [Vector Graphics guide](/docs/vector-graphics/) and the [Bookmarks guide](/docs/bookmarks/) for the full reference.

## Use Cases

Perfect for:
- **Tickets, badges, and certificates**: dashed tear-off lines, gradient banners, and a QR code on one canvas
- **Interactive reports**: buttons that open a dashboard or jump to an appendix page
- **Dashboards and covers**: gradient panels and rounded cards without image assets
- **Repeated page furniture**: a canvas in a header that adds its bookmark once

## What You'll Learn

1. **Dashing any stroke**: shape arguments versus `PathDescriptor.Dash`, and why a dash needs a stroke
2. **Gradients**: angle direction, bounding-box extent, and combining a gradient with an outline
3. **Canvas interactivity**: invisible link rectangles over painted buttons, and position-based bookmarks
4. **Canvas QR codes**: size, quiet zone, background, and when errors are raised

## File Output

Generates: `19_canvas_extras_showcase.pdf`

A two-page A4 document: dashed shapes and gradient fills on page 1, then links,
bookmarks, and QR codes on page 2, each section captioned with what it demonstrates.
