---
title: "Custom Fonts & Full Unicode"
description: "Embed TrueType fonts with FontFamily.Register for full Unicode text, including pure-C# Devanagari-aware shaping — no native dependencies."
layout: base.njk
docPage: true
permalink: /docs/custom-fonts/
---
# Custom Fonts & Full Unicode

The three built-in families — Helvetica, Times, Courier — are rendered through `WinAnsiEncoding`, which covers Western European text but not brand typefaces or scripts outside Windows-1252 (Cyrillic, Greek, Devanagari, and beyond). `FontFamily.Register` embeds a real TrueType font under a name of your choosing, so `.FontFamily(...)` can select it exactly like a built-in family, with full Unicode text wherever the font has glyphs.

No external package is required — font parsing, embedding, and glyph-ID text encoding are implemented entirely in `System`-namespace code.

## Quick Start

```csharp
using TerraPDF.Helpers;

// Register once — e.g. at application startup. Parsing is cached, so this
// is safe from a long-lived server process and reused by every document
// rendered afterwards, including concurrently.
FontFamily.Register("Brand", "fonts/Brand-Regular.ttf");
FontFamily.Register("Brand", "fonts/Brand-Bold.ttf", bold: true);

Document.Create(container =>
{
    container.Page(page =>
    {
        page.Size(PageSize.A4);
        page.DefaultTextStyle(s => s.FontFamily("Brand"));

        page.Content().Column(col =>
        {
            col.Item().Text("Héllo, Привет, Γειά σου").FontSize(18);
            col.Item().Text("Now in bold.").Bold();
        });
    });
})
.PublishPdf("branded.pdf");
```

`.FontFamily("Brand")` and `.Bold()`/`.Italic()` are the same API you already use for the built-in families — nothing else about the fluent API changes.

### `Register` overloads

| Overload | Use when |
|----------|----------|
| `Register(string familyName, string fontFilePath, bool bold = false, bool italic = false)` | Loading directly from a `.ttf`/`.otf` file on disk. |
| `Register(string familyName, byte[] fontFileBytes, bool bold = false, bool italic = false)` | The font data is already in memory — an embedded resource, a download, etc. |
| `Register(string familyName, Stream fontFileStream, bool bold = false, bool italic = false)` | Reading from a stream (read to completion; the stream is not disposed). |

A family can register up to four variants — regular, bold, italic, bold-italic — independently under the same name. Requesting a style that wasn't registered falls back to the closest registered variant instead of throwing: calling `.Bold()` on a family that only registered a regular file just renders with the regular outlines.

## What Gets Embedded

Each registered variant is embedded as a `Type0`/`CIDFontType2` composite font with `Identity-H` encoding: text is addressed by glyph ID rather than a fixed 256-slot table, so any glyph the font contains can be shown, not just Windows-1252. A `ToUnicode` CMap is included so copy/paste and text extraction recover the correct Unicode text.

The font is embedded **once per document**, no matter how many pages or how many times it's used — a registered font used throughout a 200-page report still costs one embedded copy.

Characters the font has no glyph for render as the font's `.notdef` glyph (usually a blank box) instead of throwing — the same graceful-fallback behaviour the standard fonts use, substituting `?` for characters they can't map.

## Automatic Glyph Subsetting

Since v2.1.0, embedding a font blanks every glyph outline the document never draws out of the font's `glyf` table, instead of embedding the whole font file. This is fully automatic — there's no new API, and no change to how you call `FontFamily.Register` or `.FontFamily(...)`.

Glyph IDs are never renumbered, so `cmap`, `hmtx`, `GSUB`, and the `Identity-H`/`CIDToGIDMap` encoding all stay valid with no other change. Accented Latin letters and Devanagari conjuncts are commonly **composite glyphs** — built from component glyphs no content stream ever references by ID directly — so subsetting first computes the closure of every shown glyph's composite references, keeping every component a visible glyph depends on alive.

Measured on real samples: a custom-font document mixing Latin, Cyrillic, and Greek text dropped from 718KB to 320KB (55% smaller); a Devanagari report registering two font variants (regular + bold) dropped from 152KB to 77KB (49% smaller). See the [Font Subsetting Showcase](/samples/font-subsetting-showcase/) sample for a document that measures its own savings.

This is stage-1 subsetting: it blanks unused outlines but doesn't renumber glyph IDs or shrink tables sized per glyph regardless of usage (`hmtx`, `loca`, `cmap`, `GSUB`/`GPOS`, `post`, `name`), so the whole-file win is smaller than the `glyf` table's own reduction (which shrinks by over 99% in both cases above). Full re-indexed subsetting may follow in a later version.

## Devanagari-Aware Rendering

Registering a font that covers Devanagari script gets automatic corrections for any text drawn through it — no opt-in, no public API, purely a font-data-driven substitution done in managed code:

| Correction | What it fixes |
|---|---|
| Matra reordering | ि (`U+093F`) is stored after its consonant in Unicode but must render before it; TerraPDF moves it to the correct visual position. |
| Conjunct ligatures | Reads the font's own `GSUB` table for `half`/`akhn`/`cjct` and substitutes the joined-form glyphs the font defines — स्व, स्थ, क्ष, ज्ञ render properly instead of showing a separate ् mark. |
| Reph | Cluster-initial र् (धर्म, वर्तमान, दुर्बलता) is reordered to the end of its cluster and substituted via the font's `rphf` feature. |
| Below/post-base 'ra' | प्र, क्र, त्र, ष्ट्र substituted via the font's `rkrf` feature — codepoints are already in order, so no reordering is needed here. |

```csharp
FontFamily.Register("NotoDevanagari", "fonts/NotoSansDevanagari-Regular.ttf");

page.DefaultTextStyle(s => s.FontFamily("NotoDevanagari"));
page.Content().Text("धर्म, वर्तमान, दुर्बलता, स्वास्थ्य, क्षमता").FontSize(16);
```

Every correction reads its substitution rules straight from the registered font's own `GSUB` table, so results depend on the font — most well-designed Devanagari fonts define these rules for nearly every consonant.

## Known Limitations

- **TrueType outlines only.** `.ttf` files, and `.otf` files that still carry a `glyf`/`loca` table, are supported. CFF-flavoured OpenType (`OTTO`) and TrueType Collections (`.ttc`) throw `NotSupportedException`.
- **Subsetting is stage 1.** Unused `glyf` outlines are blanked, but `hmtx`, `loca`, `cmap`, `GSUB`/`GPOS`, `post`, and `name` are still sized for the whole font — see [Automatic Glyph Subsetting](#automatic-glyph-subsetting) above.
- **No synthetic bold/italic.** An unregistered style falls back to the closest registered variant rather than skewing or thickening glyphs to fake it.
- **Partial Devanagari shaping.** `blwf` — below-base forms for consonants other than र, used by some fonts for other subjoined forms — relies on contextual GSUB lookups that aren't parsed, so those specific cases may still draw as separate glyphs. This is intentional: TerraPDF stays pure managed C# with no native dependency and won't bundle a full shaping engine (no GPOS mark positioning, no general Indic reordering beyond matra and reph) — this is a scoped, font-data-driven substitution, not a shaping engine.
