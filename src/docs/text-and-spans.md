---
title: "Text & Spans"
description: "Master text styling in TerraPDF: bold, italic, underline, strikethrough, font size, colors, line height, and multi-span formatting."
layout: base.njk
docPage: true
permalink: /docs/text-and-spans/
---
# Text & Spans

## Single-String Text

The simplest form — one string, block-level style:

```csharp
container.Text("Hello, world!");
```

Chain style methods on the returned `TextDescriptor` to format the whole block:

```csharp
container.Text("Section Heading")
    .Bold()
    .FontSize(16)
    .FontColor(Color.Blue.Darken2)
    .AlignCenter();
```

### All `TextDescriptor` style methods

| Method | Effect |
|--------|--------|
| `.Bold()` | Bold weight |
| `.SemiBold()` | Semi-bold (mapped to bold in the built-in font set) |
| `.Italic()` | Italic style |
| `.Strikethrough()` | Horizontal strikethrough line |
| `.Underline()` | Underline beneath the text |
| `.FontSize(double)` | Font size in PDF points |
| `.LineHeight(double)` | Line-height multiplier (e.g. `1.0` = tight, `1.4` = default, `2.0` = double-spaced) |
| `.FontColor(string)` | Hex colour, e.g. `"#1a4a8a"` or `Color.Red.Medium` |
| `.AlignLeft()` | Left-align (default) |
| `.AlignCenter()` | Centre-align |
| `.AlignRight()` | Right-align |
| `.Justify()` | Justify all lines except the last |
| `.FontFamily(string)` | Selects a font family — see [Font Family](#font-family) below |

---

## Font Family

`.FontFamily(string)` selects one of TerraPDF's three built-in standard-14 font
families: **Helvetica** (default), **Times**, or **Courier**. It's available on
`TextDescriptor`, `SpanDescriptor`, and `TextStyle`, so it can be set at the
block, span, or page-default level.

```csharp
container.Text("Monospaced note").FontFamily("Courier");

container.Text(t =>
{
    t.Span("Serif heading ").FontFamily("Times").Bold();
    t.Span("sans-serif body").FontFamily("Helvetica");
});

page.DefaultTextStyle(s => s.FontFamily("Times").FontSize(11));
```

Family name matching checks whether the name starts with `"Times"` or
`"Courier"` (case-insensitive); anything else — including common aliases like
`"Arial"` — falls back to **Helvetica**. `Bold()` and `Italic()` stay within
the resolved family (e.g. `FontFamily("Times").Bold()` renders Times-Bold, not
Helvetica-Bold).

Need a font outside these three — a brand typeface, or a script beyond
WinAnsiEncoding's Windows-1252 range (Cyrillic, Greek, Devanagari, and
beyond)? `FontFamily.Register("Name", "path/to/font.ttf")` embeds a TrueType
font once under a name of your choosing, and `.FontFamily("Name")` then works
exactly like the built-in names above. See
[Custom Fonts & Full Unicode](/docs/custom-fonts/).

---

## Multi-Span Text

Use the `Action<TextDescriptor>` overload to compose a text block from multiple
independently styled spans.

```csharp
container.Text(t =>
{
    t.Span("Normal  ");
    t.Span("Bold  ").Bold();
    t.Span("Italic  ").Italic();
    t.Span("Struck  ").Strikethrough();
    t.Span("Coloured  ").FontColor(Color.Red.Medium);
    t.Span("Large").FontSize(16).FontColor("#1a4a8a");
});
```

> **Important:** `t.Span(...)` returns a `SpanDescriptor`, not a `TextDescriptor`.
> Style methods chained after `.Span()` apply **only to that span**. This is intentional —
> it prevents accidental formatting of the whole block.

### Styling a span with a callback

`Span(string, Func<TextStyle, TextStyle>?)` is an alternative to chaining —
useful when you want to build up a style conditionally or reuse a style
function across spans:

```csharp
container.Text(t =>
{
    t.Span("Normal  ");
    t.Span("Bold  ", s => s.Bold());
    t.Span("Large", s => s.FontSize(16).FontColor("#1a4a8a"));
});
```

`TextStyle` is immutable — every style method returns a *new* `TextStyle`
rather than mutating in place — so the callback must **return** the
configured style. This is why the parameter type is `Func<TextStyle, TextStyle>`
rather than `Action<TextStyle>`.

### `SpanDescriptor` methods

| Method | Effect |
|--------|--------|
| `.Bold()` | Bold weight for this span |
| `.SemiBold()` | Semi-bold for this span |
| `.Italic()` | Italic for this span |
| `.Strikethrough()` | Strikethrough for this span |
| `.Underline()` | Underline for this span |
| `.FontSize(double)` | Font size for this span |
| `.FontColor(string)` | Text colour for this span |
| `.FontFamily(string)` | Font family for this span — see [Font Family](#font-family) |

---

## Page Numbers

`CurrentPageNumber()` and `TotalPages()` also return `SpanDescriptor` so they
can be individually styled:

```csharp
page.Footer().AlignCenter().Text(t =>
{
    t.Span("Page ").FontSize(9).FontColor(Color.Grey.Medium);
    t.CurrentPageNumber().FontSize(9).FontColor(Color.Grey.Medium);
    t.Span(" of ").FontSize(9).FontColor(Color.Grey.Medium);
    t.TotalPages().FontSize(9).FontColor(Color.Grey.Medium);
});
```

---

## Mixing Styles in One Block

Because the block's alignment is controlled at the `TextDescriptor` level, you can
combine per-span colour/size with a block-level alignment:

```csharp
container.Text(t =>
{
    t.Span("Status: ").Bold();
    t.Span("Approved").FontColor(Color.Green.Darken2).Bold();
    t.Span("  (June 2025)").FontColor(Color.Grey.Medium).FontSize(9);
})
.AlignRight();
```

---

## Underline

`.Underline()` draws a line beneath the text. It works on both the whole block
(`TextDescriptor`) and on individual spans (`SpanDescriptor`).

```csharp
// Whole block underlined
container.Text("Important notice").Underline().Bold();

// Only one span underlined in a mixed block
container.Text(t =>
{
    t.Span("Visit ");
    t.Span("TerraPDF").Underline().FontColor(Color.Blue.Medium);
    t.Span(" for more info.");
});

// Underline and strikethrough can be combined
container.Text("Deprecated").Underline().Strikethrough().FontColor(Color.Grey.Medium);
```

---

## Line Height

`.LineHeight(double)` sets a multiplier applied to the natural line height.
The default multiplier is approximately `1.4`.

```csharp
container.Text("Tight paragraph.").LineHeight(1.0);
container.Text("Normal paragraph.").LineHeight(1.4);
container.Text("Relaxed paragraph.").LineHeight(1.6);
container.Text("Double-spaced paragraph.").LineHeight(2.0);
```

Line height can also be set page-wide via `DefaultTextStyle`:

```csharp
page.DefaultTextStyle(s => s.FontSize(11).LineHeight(1.5));
```

---

## Default Text Style

A page-wide default style is set on `PageDescriptor` and inherited by all text
unless explicitly overridden at the block or span level:

```csharp
page.DefaultTextStyle(s => s.FontSize(11).FontColor(Color.Grey.Darken2));
```

Style resolution order (highest wins):

```
Span style  >  Block style (TextDescriptor)  >  Page default style  >  Library default (12 pt, black)
```
