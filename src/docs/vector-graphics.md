---
title: "Vector Graphics"
description: "Draw TerraPDF vector graphics with the Canvas API: lines, rectangles, rounded rectangles, circles, ellipses, paths, polygons, grids, and charts."
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
| `Line(x1, y1, x2, y2, color, lineWidth)` | Straight line |
| `FillRect(x, y, w, h, color)` | Filled rectangle |
| `StrokeRect(x, y, w, h, color, lineWidth)` | Rectangle outline |
| `DrawRect(x, y, w, h, fill, stroke, lineWidth)` | Filled and stroked rectangle |
| `FillRoundedRect(x, y, w, h, radius, color)` | Filled rounded rectangle |
| `StrokeRoundedRect(x, y, w, h, radius, color, lineWidth)` | Rounded rectangle outline |
| `DrawRoundedRect(x, y, w, h, radius, fill, stroke, lineWidth)` | Filled and stroked rounded rectangle |
| `FillCircle(cx, cy, radius, color)` | Filled circle |
| `StrokeCircle(cx, cy, radius, color, lineWidth)` | Circle outline |
| `FillEllipse(cx, cy, rx, ry, color)` | Filled ellipse |
| `StrokeEllipse(cx, cy, rx, ry, color, lineWidth)` | Ellipse outline |
| `Path(p => ...)` | Arbitrary path with lines and cubic Bezier curves |
| `Grid(cellWidth, cellHeight, color, lineWidth)` | Full-canvas grid helper |

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

Path helpers include `MoveTo`, `LineTo`, `CurveTo`, `Close`, `Rect`, `Ellipse`, `Circle`, `Polyline`, `Polygon`, `Fill`, `Stroke`, and `UseEvenOddFill`.

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
