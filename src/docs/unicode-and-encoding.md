---
title: "Unicode & Character Encoding"
description: "Understand TerraPDF WinAnsiEncoding support, Windows-1252 specials, Latin-1 characters, safe text ranges, and glyph rendering limits."
layout: base.njk
docPage: true
permalink: /docs/unicode-and-encoding/
---
# Unicode & Character Encoding

TerraPDF uses WinAnsiEncoding for built-in Type 1 fonts such as Helvetica, Times, and Courier. This guide explains which characters render correctly, how to avoid replacement `?` glyphs, and what text ranges are safest for PDF output.

## Safe Character Ranges

With built-in fonts, TerraPDF supports:

| Range | Coverage |
|-------|----------|
| `U+0020` to `U+007E` | Printable ASCII |
| Windows-1252 specials | Typographic quotes, en dash, em dash, ellipsis, bullet, Euro sign, trademark, and related symbols |
| `U+00A0` to `U+00FF` | Latin-1 Supplement, including many Western European accented characters |

Characters outside these ranges often do not have a glyph in WinAnsiEncoding and may render as `?`.

## Examples

```csharp
container.Text("Francais, senor, Sao Paulo");
container.Text("Pages 42-47");
container.Text("Price: EUR 1,299.00");
```

You can also use supported Windows-1252 characters directly:

```csharp
container.Text("Pages 42–47");
container.Text("Time—and tide");
container.Text("TerraPDF™");
container.Text("Price: € 1,299.00");
```

## Common Unsupported Characters

Many Latin Extended-A/B characters are not available in WinAnsiEncoding. If you see `?` in the output, check whether the character is above `U+00FF` and not one of the Windows-1252 specials.

| Character family | Common fallback |
|------------------|-----------------|
| Polish L with stroke | Use `L` / `l` |
| Czech C/R with caron | Use `C` / `c`, `R` / `r` |
| Turkish G with breve or dotless i | Use `G` / `g`, `I` / `i` |
| Hungarian double acute vowels | Use a close Latin-1 character, such as `Ö` / `ö` or `Ü` / `ü` |

## How TerraPDF Encodes Text

TerraPDF maps supported non-ASCII characters to their WinAnsi byte values and writes them as escaped bytes in PDF strings. This keeps content streams PDF-safe while allowing viewers to resolve each byte through the font's `/WinAnsiEncoding` mapping.

Metadata and bookmark titles are encoded separately as UTF-16BE strings so viewer title bars and outline panels can display richer text than content streams that use built-in fonts.

## Glyph Widths

TerraPDF includes extended Adobe Font Metrics width tables for the full WinAnsi byte range. That keeps line wrapping, text measurement, and justification accurate for supported accented characters and typographic symbols.

## Practical Checklist

1. Prefer printable ASCII, Windows-1252 typographic characters, and Latin-1 characters when using built-in fonts.
2. Replace Latin Extended-A/B characters if they render as `?`.
3. Test representative sample text when producing multilingual PDFs.
4. Use metadata and bookmarks for richer Unicode labels where possible.
