---
title: "Vector Graphics"
description: "Draw TerraPDF vector graphics with the Canvas API: lines, dashed strokes, rectangles, circles, ellipses, paths, arcs, pie sectors, positioned images, rotated text, grids, and charts."
layout: base.njk
docPage: true
permalink: /docs/vector-graphics/
---
# Vector Graphics

TerraPDF provides a fluent Canvas API for drawing vector graphics directly inside any layout container. Use it for reference sheets, charts, diagrams, badges, progress bars, separators, and decorative document elements.

## Adding a Canvas

`container.Canvas(height, draw)` creates a fixed-height drawing surface that fills the available width. Coordinates use PDF points with a top-left origin, matching the rest of TerraPDF layout.

```csharp
container.Canvas(120, c =>
{
    c.FillRect(0, 0, 200, 80, Color.Blue.Lighten4);
    c.StrokeRect(0, 0, 200, 80, Color.Blue.Darken2, 1.5);
    c.Line(0, 40, 200, 40, Color.Blue.Medium, 0.5);
});
```

## Primitives

| Method | Description |
|--------|-------------|
| `Line(x1, y1, x2, y2, color, lineWidth, opacity, dashPattern, dashPhase)` | Solid or dashed straight line |
| `FillRect(x, y, w, h, color)` | Filled rectangle |
| `StrokeRect(x, y, w, h, color, lineWidth, opacity, dashPattern, dashPhase)` | Solid or dashed rectangle outline |
| `DrawRect(x, y, w, h, fill, stroke, lineWidth, opacity, dashPattern, dashPhase)` | Filled and stroked rectangle |
| `FillRoundedRect(x, y, w, h, radius, color)` | Filled rounded rectangle |
| `StrokeRoundedRect(x, y, w, h, radius, color, lineWidth)` | Rounded rectangle outline |
| `DrawRoundedRect(x, y, w, h, radius, fill, stroke, lineWidth)` | Filled and stroked rounded rectangle |
| `FillCircle(cx, cy, radius, color)` | Filled circle |
| `StrokeCircle(cx, cy, radius, color, lineWidth)` | Circle outline |
| `FillEllipse(cx, cy, rx, ry, color)` | Filled ellipse |
| `StrokeEllipse(cx, cy, rx, ry, color, lineWidth)` | Ellipse outline |
| `Path(p => ...)` | Arbitrary path with lines, cubic Bezier curves, and arcs |
| `Image(source, x, y, w, h, fit)` | Positioned PNG/JPEG from a file, bytes, or stream |
| `FillPie(x, y, w, h, start, sweep, fill)` | Filled elliptical sector |
| `StrokePie(x, y, w, h, start, sweep, stroke, lineWidth)` | Stroked elliptical sector |
| `DrawPie(x, y, w, h, start, sweep, fill, stroke, lineWidth)` | Filled and stroked elliptical sector |
| `Grid(cellWidth, cellHeight, color, lineWidth)` | Full-canvas grid helper |
| `Text(text, x, y, ..., angle)` | One line of text, baseline-anchored at `(x, y)`, optionally rotated |
| `MeasureTextWidth(...)` (`static`) | Measures a label in the font `Text` would render it in |

Every fill/stroke primitive above takes a trailing `opacity` parameter (`1` = fully opaque, the default). Omitting it costs nothing — no `/ExtGState` resource is emitted unless a document actually uses an opacity below `1`.

## Opacity

```csharp
container.Canvas(100, c =>
{
    c.FillRect(0, 0, 120, 80, Color.Blue.Medium);
    // A translucent rectangle drawn on top, at 40% opacity
    c.FillRect(60, 30, 120, 80, Color.Orange.Medium, opacity: 0.4);
});
```

Distinct opacity values used anywhere in a document are deduplicated into shared `/ExtGState` resources, the same way repeated images and fonts already are. `PathDescriptor` has a matching `.Opacity(...)` fluent setter for custom paths.

Opacity is wired through `VectorCanvas` primitives and canvas text only — `DrawImage`, flowed text (`TextBlock`), and `Background()`/border colours don't take an opacity parameter yet.

## Canvas Text

`Text` is the one canvas primitive that isn't top-left anchored — its `(x, y)` is the text's baseline, which is what lets a label sit flush against an axis line or the shape it annotates:

```csharp
container.Canvas(60, c =>
{
    c.Line(0, 40, 200, 40, Color.Grey.Lighten1, 0.5);
    c.Text("Q4 Revenue", 0, 36, fontSize: 10, color: Color.Grey.Darken2);

    // Right-align a value against the axis using MeasureTextWidth
    double w = VectorCanvas.MeasureTextWidth("$482K", fontSize: 10);
    c.Text("$482K", 200 - w, 36, fontSize: 10, color: Color.Blue.Darken2);
});
```

`Text` renders through a registered custom font when `fontFamily` names one (see [Custom Fonts](/docs/custom-fonts/)), otherwise through the standard-14 families — the same font resolution every other TerraPDF text API uses. It also accepts `opacity`, useful for ghosted or watermark-style canvas labels.

### Rotated labels

`angle` rotates the label clockwise, in degrees, around the baseline point `(x, y)`. Negative angles rotate counter-clockwise, and values outside one revolution are accepted unchanged:

```csharp
container.Canvas(120, c =>
{
    c.Text("Vertical axis", 10, 110, fontSize: 9, angle: -90);
    c.Text("Q1 growth", 60, 60, fontSize: 9, angle: 35);
});
```

`Text` draws one line only — no wrapping and no automatic fitting — so pair it with `MeasureTextWidth` when a label needs centring or right-alignment.

## Dashed Strokes

`Line`, `StrokeRect`, and `DrawRect` take a `dashPattern` array and a `dashPhase`. The array alternates painted and skipped lengths in points; the phase offsets where the pattern starts:

```csharp
container.Canvas(80, c =>
{
    c.Line(0, 10, 240, 10, Color.Grey.Darken1, 1, 1, [8, 4], 0);   // dashed
    c.Line(0, 30, 240, 30, Color.Grey.Darken1, 1, 1, [8, 4], 4);   // offset start
    c.Line(0, 50, 240, 50, Color.Grey.Darken1, 1, 1, [1, 3], 0);   // dotted
    c.StrokeRect(260, 5, 90, 60, Color.Green.Darken2, 1.5, 1, [6, 3], 0);
});
```

A pattern must contain at least one positive finite value and no negative values, and the phase must be nonnegative. The array is copied when the command is added, and each dashed command restores the PDF graphics state — a following stroke is solid without resetting anything.

## Positioned Images

`Image` places a PNG or JPEG in an absolute target rectangle on the canvas, from a file path, a `byte[]`, or a `Stream`:

```csharp
container.Canvas(220, c =>
{
    c.Image("photo.jpg", 0, 0, 180, 120, ImageFit.Contain);
    c.Image(logoBytes, 200, 0, 180, 120, ImageFit.Cover);

    using Stream source = OpenImage();
    c.Image(source, 400, 0, 80, 80, ImageFit.Stretch);
});
```

| Mode | Aspect ratio | Position | Clipping |
|------|--------------|----------|----------|
| `Stretch` | May distort | Fills the target | No |
| `Contain` | Preserved | Centred inside the target | No |
| `Cover` | Preserved | Centred over the target | Yes |
| `CoverTopLeft` | Preserved | Anchored at the target's top-left | Yes |
| `CropTopLeft` | Natural 96-DPI size | Anchored at the target's top-left | Yes |

Clipping is isolated with the PDF graphics-state save/restore operators, so a shape or image drawn afterwards is unaffected. Use `VectorCanvas.GetImageSizeInPoints(imageData)` when the target should match the image's natural size — pixel dimensions are converted at 96 DPI. See [Images](/docs/images/) for source ownership and format details.

## Arcs and Pie Sectors

`PathDescriptor.Arc` appends an elliptical arc and `Sector` closes it back to its centre. The `Pie` conveniences draw a sector in one call:

```csharp
container.Canvas(180, c =>
{
    // Centre + radii
    c.Path(p => p
        .Arc(100, 80, 80, 50, startAngle: 15, sweepAngle: 220)
        .Stroke(Color.Blue.Darken2, 2));

    // Bounding box
    c.FillPie(240, 20, 140, 140, -90, 151.2, Color.Blue.Medium);
    c.StrokePie(240, 20, 140, 140, -90, 151.2, Color.White, 1.5);
    c.DrawPie(400, 20, 140, 140, 61.2, 208.8, Color.Amber.Medium, Color.Orange.Darken2, 1.5);
});
```

`Arc` and `Sector` take a **centre and radii**; `FillPie`, `StrokePie`, and `DrawPie` take a **bounding box** — the two differ deliberately, so read the signature before porting numbers between them. Angles start at the ellipse's right-hand point (3 o'clock) and increase clockwise, so a pie chart starting at twelve begins at `-90`. Negative sweeps run counter-clockwise, a zero sweep adds nothing, and sweeps beyond 360° retain every revolution. Arcs are split into cubic Bézier segments of at most 90°.

## Arbitrary Paths

Use `PathDescriptor` for custom shapes, compound paths, curves, polygons, and even-odd fills.

```csharp
container.Canvas(120, c =>
{
    c.Path(p => p
        .MoveTo(50, 10)
        .LineTo(90, 80)
        .LineTo(10, 80)
        .Close()
        .Fill(Color.Blue.Lighten3)
        .Stroke(Color.Blue.Darken2, 1.5));

    c.Path(p => p
        .MoveTo(120, 80)
        .CurveTo(140, 10, 190, 10, 210, 80)
        .Stroke(Color.Orange.Medium, 2));
});
```

Path helpers include `MoveTo`, `LineTo`, `CurveTo`, `Close`, `Rect`, `Ellipse`, `Circle`, `Arc`, `Sector`, `Polyline`, `Polygon`, `Fill`, `Stroke`, `Opacity`, and `UseEvenOddFill`.

## Simple Bar Chart

```csharp
(string Label, double Value)[] data =
[
    ("Q1", 38),
    ("Q2", 52),
    ("Q3", 71),
    ("Q4", 64)
];

container.Canvas(120, c =>
{
    double maxValue = 80;
    double barWidth = 40;
    double gap = 20;
    double baseline = 100;

    for (int i = 0; i < data.Length; i++)
    {
        double barHeight = data[i].Value / maxValue * 90;
        double x = i * (barWidth + gap);
        double y = baseline - barHeight;

        c.FillRoundedRect(x, y, barWidth, barHeight, 3, Color.Blue.Medium);
    }

    c.Line(0, baseline, data.Length * (barWidth + gap), baseline, Color.Grey.Lighten2, 0.5);
});
```

## Tips

- Canvas dimensions are in PDF points.
- The canvas width is the available container width, so it adapts to page margins and surrounding layout.
- Use `Path(...).UseEvenOddFill()` for compound shapes such as donuts or cutouts.
- Prefer vector graphics for crisp charts and diagrams that should scale cleanly in PDF viewers.
- A canvas image is decoded once and reused on every page the canvas is drawn on.
- See the [Canvas Media sample](/samples/canvas-media-showcase/) for every fit mode, dash phase, arc, sector, and text angle drawn side by side.
