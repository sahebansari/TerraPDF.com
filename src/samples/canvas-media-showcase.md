---
title: Canvas Media Showcase - TerraPDF Sample
description: Position images on the TerraPDF vector canvas with five fit modes, plus PNG soft-mask transparency, constant alpha, dash patterns, elliptical arcs, pie sectors, and rotated text.
layout: sample.njk
permalink: /samples/canvas-media-showcase/
---

# Canvas Media Showcase Sample

## Overview

The Canvas Media Showcase sample demonstrates:
- **Positioned images on the canvas** — `canvas.Image(...)` places a PNG or JPEG in an absolute target rectangle, from a file path, a `byte[]`, or a `Stream`
- **Five fit modes** — `Stretch`, `Contain`, `Cover`, `CoverTopLeft`, and `CropTopLeft`, all drawn side by side from one wide banner so the differences are unmistakable
- **PNG soft-mask transparency** — an RGBA badge composited over colour bands and over white
- **Constant-alpha layering** — a translucent caption bar over a photo, and three overlapping discs that genuinely blend
- **Dash patterns and phases** — dashed, dotted, and dash-dot strokes, with a phase offset that shifts where the pattern starts
- **Elliptical arcs and pie sectors** — `PathDescriptor.Arc` (centre + radii) alongside `FillPie`/`StrokePie`/`DrawPie` (bounding box)
- **Rotated text** — `angle` rotates a label clockwise around its baseline point

This is new in **v2.2.0**. The vector canvas gained text and opacity in 2.1.0; 2.2.0 adds media and geometry — images, dashes, arcs, sectors, and rotation.

## Key Features Demonstrated

### 1. Image Fit Modes

One 1397×260 px banner is drawn into five identical 84×70 pt targets. Only `Stretch` distorts it; `Cover`, `CoverTopLeft`, and `CropTopLeft` clip, and the clip is scoped with `q`/`Q` so the border drawn afterwards survives:

```csharp
c.FillRect(x, 16, boxW, boxH, white);
c.Image(pngPath, x, 16, boxW, boxH, fitModes[i].Fit);
// Drawn after the image on purpose: the clip is scoped, so this border
// is never clipped away by it.
c.StrokeRect(x, 16, boxW, boxH, grid, 0.75);
```

| Mode | Aspect ratio | Position | Clipping |
|------|--------------|----------|----------|
| `Stretch` | May distort | Fills the target | No |
| `Contain` | Preserved | Centred inside the target | No |
| `Cover` | Preserved | Centred over the target | Yes |
| `CoverTopLeft` | Preserved | Anchored at the target's top-left | Yes |
| `CropTopLeft` | Natural 96-DPI size | Anchored at the target's top-left | Yes |

### 2. Transparency: `/SMask` vs Constant Alpha

An RGBA PNG's alpha channel is embedded as a PDF soft mask, so a transparent ground and a soft rim both composite over whatever sits behind them:

```csharp
for (int i = 0; i < bands.Length; i++)
    c.FillRect(0, 4 + i * 22, 300, 22, bands[i]);
c.Image(alphaPath, 16, 4, 88, 88, ImageFit.Contain);
```

Constant alpha is a different mechanism — it belongs to the drawing, not the image, and applies to any primitive:

```csharp
c.Image(pngPath, 0, 4, 300, 56, ImageFit.Contain);
c.FillRect(0, 38, 300, 22, brand, 0.65);       // translucent caption bar
c.Text("translucent bar over an image", 6, 53, white, 8);
```

### 3. Sources and Natural Size

The same picture is drawn from a file path, a `byte[]`, and a `Stream`. TerraPDF hashes the pixel data, so all three share **one** embedded image XObject:

```csharp
var (naturalW, naturalH) = VectorCanvas.GetImageSizeInPoints(jpegBytes);

c.Image(jpegPath, 0, 16, naturalW, naturalH);
c.Image(jpegBytes, 130, 16, naturalW, naturalH);
using (var stream = new MemoryStream(jpegBytes))
    c.Image(stream, 260, 16, naturalW, naturalH);
```

The canvas copies the data when `Image` is called, so the caller stays the owner of the stream and may dispose it immediately afterwards.

### 4. Dash Patterns and Phase

A dash array alternates painted and skipped lengths in points; the phase offsets where the pattern starts:

```csharp
c.Line(0, y, 240, y, brand, 1.5, 1, [8, 4], 0);   // [8 4] phase 0
c.Line(0, y, 240, y, brand, 1.5, 1, [8, 4], 4);   // same pattern, offset start
c.Line(0, y, 240, y, brand, 1.5, 1, [1, 3], 0);   // dotted
c.StrokeRect(370, 8, 85, 76, Color.Green.Darken2, 1.5, 1, [6, 3], 0);
```

Each dashed command restores the graphics state, so a later stroke is solid without resetting anything.

### 5. Elliptical Arcs and Pie Sectors

The two APIs take different geometry, which the sample labels explicitly. `PathDescriptor.Arc` takes a **centre plus radii**:

```csharp
c.Path(p => p.Arc(cx, cy, rx, ry, startAngle, sweep).Stroke(color, 2.5));
```

The pie helpers take a **bounding box**:

```csharp
c.FillPie(boxX, boxY, boxSize, boxSize, start, sweep, pieColors[i]);
c.StrokePie(boxX, boxY, boxSize, boxSize, start, sweep, white, 1.5);
c.DrawPie(350, 30, 90, 90, 0, -250, "#FFE0B2", accent, 1.5);
```

Angles start at 3 o'clock and increase clockwise, so a pie chart starting at twelve begins at `-90`. Negative sweeps run counter-clockwise, and arcs are split into cubic Bézier segments of at most 90°.

### 6. Rotated Text

`angle` rotates clockwise around the baseline point — the sample builds a radial dial whose every label matches its own spoke:

```csharp
c.Text(deg.ToString(CultureInfo.InvariantCulture),
       ex + 4 * Math.Cos(rad), ey + 4 * Math.Sin(rad), brand, 8, angle: deg);
```

`VectorCanvas.MeasureTextWidth` centres a label under an arc before placing it, since `Text` doesn't align anything itself:

```csharp
double w = VectorCanvas.MeasureTextWidth(label, 8);
c.Text(label, cx - w / 2, 132, muted, 8);
```

## Notes

- Labels in this sample stay inside WinAnsiEncoding, the encoding the standard-14 fonts use. Characters such as U+2192 (arrow) and U+2212 (true minus) fall outside it and render as `?` — a registered custom font is required for those. See the [Custom Font sample](/samples/custom-font-showcase/).
- Canvas images are decoded once and reused on every page the canvas is drawn on.
- The clipping rectangle may extend beyond the canvas; it is not automatically intersected with the canvas bounds.

See the [Vector Graphics guide](/docs/vector-graphics/) and the [Images guide](/docs/images/) for the full reference.

## Use Cases

Perfect for:
- **Report covers and headers** — a banner cropped to a fixed strip without pre-processing the source image
- **Charts built in code** — pie sectors, dashed gridlines, and rotated axis labels with no charting dependency
- **Watermarks and overlays** — translucent bars and rotated captions over photographic content
- **Badges and logos** — RGBA artwork composited over coloured backgrounds

## What You'll Learn

1. **Fit modes** — which of the five preserves aspect ratio, which centres, and which clips
2. **Two kinds of transparency** — per-pixel `/SMask` from the image versus constant alpha from the drawing
3. **Image sources** — file path, `byte[]`, and `Stream`, and how deduplication keeps them to one XObject
4. **Canvas geometry** — dash arrays and phase, arcs by centre and radii, sectors by bounding box, and baseline rotation

## File Output

Generates: `18_canvas_media_showcase.pdf`

A four-page A4 document: fit modes and transparency, opacity and image sources, dashes and arcs, then pie sectors and rotated text — each section captioned with what it demonstrates.
