---
title: Font Subsetting Showcase - TerraPDF Sample
description: See how TerraPDF automatically embeds only the glyphs a document uses, shrinking custom-font PDFs by up to 55% with no API change.
layout: sample.njk
permalink: /samples/font-subsetting-showcase/
---

# Font Subsetting Showcase Sample

## Overview

The Font Subsetting Showcase sample demonstrates:
- **Automatic glyph subsetting** — `FontFamily.Register(...)` embeds only the glyphs a document actually draws, instead of the whole font file
- **Composite-glyph closure** — accented Latin letters (é, ö, ï) and Devanagari conjuncts are themselves built from component glyphs, and subsetting keeps every one of those alive
- **No API change** — the size reduction is fully automatic; the sample calls `FontFamily.Register` exactly as it always has
- **Measured savings** — the sample prints the registered font files' on-disk size next to the generated PDF's size, so the reduction is a real number, not a claim

This is new in **v2.1.0**. Font embedding has supported full Unicode text since v2.0.0, but every registered variant embedded the entire font file — a 700KB font stayed 700KB inside the PDF even if the document only used a few dozen characters from it.

## Key Features Demonstrated

### 1. Registering Fonts (Unchanged API)

Subsetting is fully automatic — you register a font exactly as before:

```csharp
FontFamily.Register("Lato", latoRegularPath);
FontFamily.Register("Devanagari", devanagariRegularPath);
```

### 2. Composite Latin Glyphs

Accented letters aren't drawn as a single glyph in most fonts — é is typically an `e` outline plus a composite reference to a combining acute accent, a glyph no content stream ever names directly. Subsetting computes the closure of every shown glyph's composite references first, so the accent survives even though nothing in the text stream points at its glyph ID:

```csharp
col.Item().Text("café, Wörld, naïve, Zürich")
   .FontFamily("Lato").FontSize(14).FontColor(Color.Black);
```

### 3. Devanagari Conjuncts and Reph

Devanagari conjuncts (स्व, क्ष, ज्ञ) and reph (धर्म, वर्तमान) are substituted in via the font's own `GSUB` table at render time — the same closure pass keeps every glyph those substitutions reach:

```csharp
col.Item().Text("धर्म, प्रधानमंत्री, स्वास्थ्य, राष्ट्रीय, कार्यक्रम")
   .FontFamily("Devanagari").FontSize(16).FontColor(Color.Black);
```

### 4. Measuring the Win

The sample writes the registered `.ttf` files' raw size on disk next to the generated PDF's total size, so the reduction is measured on this exact document rather than assumed:

```csharp
long latoRawBytes = new FileInfo(latoRegularPath).Length;
long devanagariRawBytes = new FileInfo(devanagariRegularPath).Length;

Console.WriteLine($"Lato-Regular.ttf on disk:               {latoRawBytes:N0} bytes");
Console.WriteLine($"NotoSansDevanagari-Regular.ttf on disk: {devanagariRawBytes:N0} bytes");
Console.WriteLine($"Whole generated PDF (both, subsetted):  {pdf.Length:N0} bytes");
```

Across the release's own measurements: a mixed Latin/Cyrillic/Greek custom-font sample dropped from 718KB to 320KB (55% smaller), and a two-variant (regular + bold) Devanagari report dropped from 152KB to 77KB (49% smaller).

## What's Happening Under the Hood

Every glyph a document never draws is blanked out of the font's `glyf` table. Glyph IDs are **never renumbered**, so `cmap`, `hmtx`, `GSUB`, and the `Identity-H`/`CIDToGIDMap` encoding used for custom-font text all stay valid without any other change to how the font is referenced.

## Known Limitations

- This is glyph-outline blanking, not full re-indexed subsetting — tables sized per glyph regardless of usage (`hmtx`, `loca`, `cmap`, `GSUB`/`GPOS`, `post`, `name`) aren't trimmed yet, so the whole-file win is smaller than the `glyf` table's own reduction (which shrinks by over 99% in both measured cases above). Full re-indexed subsetting may follow in a later version.
- Characters the font has no glyph for still render as `.notdef`, exactly as before — subsetting only affects glyphs the document *does* draw.

See the [Custom Fonts guide](/docs/custom-fonts/) for the full font-embedding reference.

## Use Cases

Perfect for:
- **Brand typefaces shipped with the app** — a full weight family embedded once per document costs only the glyphs actually used
- **Devanagari and other complex scripts** — conjuncts and reph keep rendering correctly with no extra configuration
- **High-volume document generation** — smaller PDFs mean less bandwidth and storage at scale
- **Any existing `FontFamily.Register` call** — the saving applies automatically; no code changes needed

## What You'll Learn

1. **Automatic subsetting** — how `FontFamily.Register` now embeds only used glyphs
2. **Composite-glyph closure** — why accented letters and conjuncts don't break when unrelated glyphs are blanked
3. **Measuring the effect** — comparing on-disk font size to the embedded, subsetted result
4. **Current scope** — what stage-1 subsetting trims today, and what's left for a future release

## File Output

Generates: `17_font_subsetting_showcase.pdf`

A single-page document rendering composite Latin glyphs and Devanagari conjuncts/reph through two registered custom fonts, with the measured byte counts printed to the console when the sample runs.
