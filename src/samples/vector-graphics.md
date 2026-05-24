---
title: Vector Graphics Showcase - TerraPDF Sample
description: Draw shapes, lines, and graphics using TerraPDF's vector graphics capabilities for data visualization.
layout: sample.njk
permalink: /samples/vector-graphics/
---


# Vector Graphics Showcase Sample

## Overview

The Vector Graphics Showcase sample demonstrates:
- **Drawing capabilities** — shapes, lines, and paths
- **Custom graphics** — data visualization elements
- **Colors and fills** — gradient and solid fills
- **Geometry** — circles, rectangles, polygons
- **Charts and diagrams** — visual data representation
- **Performance** — efficient vector rendering

## Key Features Demonstrated

### 1. Basic Shapes
```csharp
col.Item().Row(row =>
{
    // Rectangle
    row.RelativeItem().Margin(4).Canvas(height: 80, action: (c, area) =>
    {
        c.DrawRectangle(new(area.X, area.Y), 
                       new(area.Right, area.Bottom), 
                       fillColor: "#FF5733");
    }).Border(1);

    // Circle
    row.RelativeItem().Margin(4).Canvas(height: 80, action: (c, area) =>
    {
        decimal centerX = area.X + area.Width / 2;
        decimal centerY = area.Y + area.Height / 2;
        decimal radius = Math.Min(area.Width, area.Height) / 2 - 5;
        
        c.DrawCircle(new(centerX, centerY), radius, 
                    fillColor: "#33FF57");
    }).Border(1);

    // Polygon
    row.RelativeItem().Margin(4).Canvas(height: 80, action: (c, area) =>
    {
        var points = new[]
        {
            new(area.X + area.Width / 2, area.Y + 5),           // Top
            new(area.Right - 5, area.Y + area.Height - 5),      // Bottom right
            new(area.X + 5, area.Y + area.Height - 5)           // Bottom left
        };
        
        c.DrawPolygon(points, fillColor: "#3357FF");
    }).Border(1);
});
```

### 2. Lines and Paths
```csharp
col.Item().Canvas(height: 100, action: (c, area) =>
{
    // Horizontal lines
    c.DrawLine(new(area.X, area.Y + 20), 
              new(area.Right, area.Y + 20), 
              color: "#000000", width: 2);
    
    // Vertical lines
    c.DrawLine(new(area.X + 50, area.Y), 
              new(area.X + 50, area.Bottom), 
              color: "#FF0000", width: 1.5);
    
    // Diagonal line
    c.DrawLine(new(area.X, area.Y), 
              new(area.Right, area.Bottom), 
              color: "#0000FF", width: 1);
}).Border(1, Color.Grey.Lighten2);
```

### 3. Bar Chart Visualization
```csharp
void BarChart(IContainer container, string title, (string Label, decimal Value)[] data)
{
    decimal maxValue = data.Max(x => x.Value);
    
    container.Column(col =>
    {
        col.Item().Text(title).Bold().FontSize(12).FontColor(brand);
        
        col.Item().Canvas(height: 150, action: (c, area) =>
        {
            decimal barWidth = area.Width / (data.Length * 1.5m);
            decimal startX = area.X + 20;
            
            for (int i = 0; i < data.Length; i++)
            {
                decimal barHeight = (data[i].Value / maxValue) * (area.Height - 30);
                decimal x = startX + (i * barWidth * 1.5m);
                decimal y = area.Bottom - 20 - barHeight;
                
                c.DrawRectangle(
                    new(x, y),
                    new(x + barWidth, area.Bottom - 20),
                    fillColor: new[] { "#FF5733", "#33FF57", "#3357FF" }[i % 3]);
            }
        }).Border(1);
        
        col.Item().Row(row =>
        {
            foreach (var (label, _) in data)
            {
                row.RelativeItem().AlignCenter()
                    .Text(label).FontSize(9).FontColor(muted);
            }
        });
    });
}

BarChart(col.Item(), "Quarterly Revenue",
    new[] { ("Q1", 250m), ("Q2", 380m), ("Q3", 320m), ("Q4", 450m) });
```

### 4. Pie Chart
```csharp
void PieChart(IContainer container, string title, (string Label, decimal Value)[] data)
{
    decimal total = data.Sum(x => x.Value);
    
    container.Column(col =>
    {
        col.Item().Text(title).Bold().FontSize(12).FontColor(brand);
        
        col.Item().Canvas(height: 120, action: (c, area) =>
        {
            decimal centerX = area.X + area.Width / 2;
            decimal centerY = area.Y + area.Height / 2;
            decimal radius = Math.Min(area.Width, area.Height) / 2 - 10;
            
            decimal currentAngle = 0;
            string[] colors = { "#FF5733", "#33FF57", "#3357FF", "#FFD700" };
            
            for (int i = 0; i < data.Length; i++)
            {
                decimal sliceAngle = (data[i].Value / total) * 360;
                
                // Draw pie slice (simplified)
                c.DrawArc(new(centerX, centerY), radius, 
                         currentAngle, currentAngle + sliceAngle,
                         strokeColor: colors[i % colors.Length], 
                         width: 1.5);
                
                currentAngle += sliceAngle;
            }
        }).Border(1);
        
        col.Item().Column(legend =>
        {
            foreach (var (label, value) in data)
            {
                decimal pct = (value / total) * 100;
                legend.Item().Text($"● {label}: {pct:F1}%")
                    .FontSize(9).FontColor(muted);
            }
        });
    });
}

PieChart(col.Item(), "Market Share",
    new[] { ("Product A", 35m), ("Product B", 28m), ("Product C", 22m), ("Other", 15m) });
```

### 5. Timeline Visualization
```csharp
col.Item().Canvas(height: 80, action: (c, area) =>
{
    decimal lineY = area.Y + area.Height / 2;
    
    // Main timeline line
    c.DrawLine(new(area.X + 20, lineY), 
              new(area.Right - 20, lineY), 
              color: brand, width: 3);
    
    var events = new[] { ("2023", 0.1m), ("2024", 0.4m), ("2025", 0.7m) };
    
    foreach (var (date, pos) in events)
    {
        decimal x = area.X + 20 + (area.Width - 40) * pos;
        
        // Event circle
        c.DrawCircle(new(x, lineY), 5, fillColor: accent);
        
        // Event label
        c.DrawText(date, new(x - 10, lineY + 15), fontSize: 10);
    }
}).Border(1);
```

## Graphics Features

### Drawing Methods

| Method | Purpose |
|--------|---------|
| `DrawRectangle()` | Solid rectangles |
| `DrawCircle()` | Circles and ellipses |
| `DrawLine()` | Lines and paths |
| `DrawPolygon()` | Custom polygons |
| `DrawArc()` | Curved segments |
| `DrawText()` | Text in canvas |

### Customization Options

- **Fill colors** — hex colors or Material Design palette
- **Stroke colors** — border colors
- **Stroke width** — line thickness
- **Positioning** — pixel-perfect placement
- **Coordinates** — area-relative positioning

## Use Cases

Perfect for:
- **Data visualization** — charts and graphs
- **Infographics** — diagrams and illustrations
- **Timelines** — event sequences
- **Organizational charts** — hierarchies
- **Floor plans** — layout diagrams
- **Technical diagrams** — system architecture

## What You'll Learn

1. **Canvas drawing** — basic graphics operations
2. **Shape creation** — rectangles, circles, polygons
3. **Lines and paths** — connecting visual elements
4. **Color and styling** — fills and strokes
5. **Data visualization** — charts and graphs
6. **Coordinate systems** — positioning and layout
7. **Performance** — efficient rendering

## File Output

Generates: `10_vector_graphics_showcase.pdf`

Creates a comprehensive showcase of vector graphics capabilities suitable for data visualization, infographics, and technical diagrams.
