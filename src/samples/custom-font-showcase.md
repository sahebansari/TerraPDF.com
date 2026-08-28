---
title: Custom Font Embedding Showcase - TerraPDF Sample
description: Embed a TrueType font with FontFamily.Register and render full Unicode text — Cyrillic and Greek — that the standard WinAnsiEncoding fonts cannot.
layout: sample.njk
permalink: /samples/custom-font-showcase/
---

# Custom Font Embedding Showcase Sample

## Overview

The Custom Font Embedding Showcase sample demonstrates:
- **`FontFamily.Register(...)`** — loading a real TrueType font (Lato, SIL Open Font License)
- **Regular and bold variants** — registered separately so `.Bold()` uses the font's real bold outlines
- **Full Unicode** — Cyrillic, Greek, and Bulgarian text the standard-14 fonts cannot represent
- **Side-by-side comparison** — the same strings in Helvetica, falling back to `?`
- **Composite font embedding** — `Type0`/`CIDFontType2` with `Identity-H` encoding, no system font install

## Key Features Demonstrated

### 1. Registering a TrueType Font

Registering is process-wide and thread-safe — call it once (for example at startup) and
reference the family by name from any document afterwards:

```csharp
FontFamily.Register("Lato", regularFontPath);
FontFamily.Register("Lato", boldFontPath, bold: true);
```

### 2. Using It Like a Built-in Family

```csharp
col.Item().Text("The quick brown fox jumps over the lazy dog.")
   .FontFamily("Lato").FontSize(12);

col.Item().Text("The quick brown fox jumps over the lazy dog.")
   .FontFamily("Lato").Bold().FontSize(12);
```

### 3. Full Unicode Beyond WinAnsiEncoding

```csharp
(string Language, string Text)[] multilingual =
[
    ("English",   "TerraPDF now embeds real TrueType fonts."),
    ("Russian",   "TerraPDF теперь встраивает настоящие TrueType-шрифты."),
    ("Greek",     "Το TerraPDF ενσωματώνει πλέον πραγματικές γραμματοσειρές TrueType."),
    ("Bulgarian", "TerraPDF вече вгражда истински TrueType шрифтове."),
];

tbl.Row(row =>
{
    row.Cell().Padding(6).Text(lang).FontSize(9);
    row.Cell().Padding(6).Text(sample).FontFamily("Lato").FontSize(11);
});
```

### 4. What Happens Without a Registered Font

The same strings rendered in standard Helvetica: it has no Cyrillic or Greek glyphs, so every
such character substitutes as `?`.

```csharp
fallback.Item().Text(t =>
{
    t.Span($"{lang}: ").Bold().FontSize(9);
    // No FontFamily("Lato") here — Helvetica has no Cyrillic/Greek glyphs
    t.Span(sample).FontSize(11);
});
```

**Use case:** this is exactly the failure a registered font removes — the sample prints both
so the difference is visible on one page.

## API Summary

| Method | Purpose |
|--------|---------|
| `FontFamily.Register(name, path)` | Register a TrueType file as the regular variant of a family |
| `FontFamily.Register(name, path, bold: true)` | Register the bold variant of an existing family |
| `TextStyle.FontFamily(name)` | Use a registered family exactly like a built-in one |

The whole font file is embedded in the PDF (no subsetting yet), so it renders identically in
any conforming viewer with no font installation required. Each variant is embedded once per
document however many times it is used, and requesting an unregistered style falls back to
the closest registered variant instead of throwing.

## Use Cases

Perfect for:
- **Brand typography** — corporate typefaces on invoices, reports, and proposals
- **Non-Latin scripts** — Cyrillic, Greek, and other coverage the standard-14 fonts lack
- **Consistent output** — identical rendering on servers with no fonts installed
- **Design fidelity** — matching a print or web design system exactly

## What You'll Learn

1. **Font registration** — loading TrueType files and naming a family
2. **Weight variants** — wiring regular and bold to the same family name
3. **Unicode coverage** — why an embedded font unlocks scripts the built-ins can't reach
4. **Encoding internals** — `Type0`/`CIDFontType2` composite fonts with `Identity-H`
5. **Fallback behaviour** — what unmappable characters look like without a registered font

See the [Custom Fonts guide](/docs/custom-fonts/) for the full reference, and the
[Child Nutrition Report](/samples/child-nutrition-india-report/) for a Devanagari-script
document built on the same API.

## File Output

Generates: `14_custom_font_showcase.pdf`

A single A4 page contrasting the embedded Lato family against standard Helvetica across
English, Russian, Greek, and Bulgarian text.
