---
title: Child Nutrition India Report - TerraPDF Devanagari Sample
description: A full multi-page Hindi-language report built with TerraPDF — Devanagari-script headings, running text, bullet lists, and data tables from an embedded TrueType font.
layout: sample.njk
permalink: /samples/child-nutrition-india-report/
---

# Child Nutrition in India — Devanagari Report Sample

## Overview

The Child Nutrition in India sample is a complete three-page Hindi-language report, composed
entirely in Devanagari script. It demonstrates:
- **Devanagari text rendering** — headings, running paragraphs, bullet lists, and data tables
- **An embedded Devanagari font** — Noto Sans Devanagari (SIL Open Font License), regular and bold
- **Matra reordering** — the vowel sign ि drawn before its consonant (प्रतिशत, ठिगनापन)
- **Conjunct ligatures** — स्वास्थ्य, स्थिति joined via the font's own `half`/`akhn`/`cjct` GSUB features
- **Reph** — cluster-initial र् reordered and substituted (दुर्बलता, वर्तमान)
- **Below/post-base ra** — प्र, क्र, त्र substituted via the font's `rkrf` feature (प्रधानमंत्री)
- **Multi-page structure** — running headers, footers, and page numbers in Devanagari

All of this is **pure C#** — no native shaping engine, no HarfBuzz, no external dependency.

## Key Features Demonstrated

### 1. Registering a Devanagari Font

```csharp
FontFamily.Register("Noto Sans Devanagari", fontPath);
FontFamily.Register("Noto Sans Devanagari", boldFontPath, bold: true);
```

### 2. Devanagari Headers and Footers

```csharp
page.Header().Column(col =>
{
    col.Item().Background(brand).PaddingVertical(10).PaddingHorizontal(14).Row(hdr =>
    {
        hdr.RelativeItem().AlignMiddle()
           .Text("भारत में बाल पोषण")
           .FontFamily("Noto Sans Devanagari").Bold().FontSize(18);
        hdr.AutoItem().AlignRight().AlignMiddle()
           .Text(subtitle).FontFamily("Noto Sans Devanagari").FontSize(10);
    });
    col.Item().Background(brand2).Canvas(3, _ => { });
});
```

### 3. Page Numbers in Devanagari

```csharp
row.AutoItem().AlignRight().Text(t =>
{
    t.Span("पृष्ठ ").FontFamily("Noto Sans Devanagari").FontSize(8);
    t.CurrentPageNumber().FontSize(8);
    t.Span(" / ").FontSize(8);
    t.TotalPages().FontSize(8);
});
```

### 4. Indicator Table

```csharp
(string Indicator, string Value, string Note)[] stats =
[
    ("ठिगनापन", "35.5%", "आयु के अनुसार कम लंबाई"),
    ("दुर्बलता",  "19.3%", "लंबाई के अनुसार कम वजन"),
    ("कम वजन",  "32.1%", "आयु के अनुसार कम वजन"),
    ("एनीमिया", "67.1%", "6-59 माह के बच्चों में"),
];
```

Note ठिगनापन (matra reordering) and दुर्बलता (reph) — both render correctly straight from the
font's own GSUB tables.

### 5. Government Schemes Section

```csharp
(string Scheme, string Detail)[] schemes =
[
    ("पोषण अभियान", "2018 में शुरू किया गया राष्ट्रीय पोषण मिशन …"),
    ("एकीकृत बाल विकास सेवा योजना", "आंगनवाड़ी केंद्रों के माध्यम से पूरक पोषण …"),
    ("मध्याह्न भोजन योजना", "सरकारी विद्यालयों में बच्चों को पका हुआ पौष्टिक भोजन …"),
    ("प्रधानमंत्री मातृ वंदना योजना", "गर्भवती और स्तनपान कराने वाली माताओं को …"),
];
```

प्रधानमंत्री exercises the post-base ra substitution (प्र) via the font's `rkrf` feature.

## Report Structure

| Page | Section |
|------|---------|
| 1 | परिचय — introduction, and वर्तमान स्थिति, the national-average indicator table |
| 2 | कुपोषण के प्रमुख कारण — causes, and प्रमुख सरकारी योजनाएं — government schemes |
| 3 | सिफारिशें — recommendations, and निष्कर्ष — conclusion |

## Known Limitations

TerraPDF's Devanagari support applies four corrections automatically to any custom-font text:
matra reordering, conjunct ligature substitution, reph, and below/post-base ra. What is
**not** covered is `blwf` — below-base forms for consonants other than र, which needs
contextual GSUB lookups the reader does not yet parse. See the
[Custom Fonts guide](/docs/custom-fonts/) for the full picture.

## Use Cases

Perfect for:
- **Government and NGO reporting** — statutory reports in Indian languages
- **Regional-language documents** — statements, notices, and certificates in Hindi
- **Multilingual publishing** — Devanagari alongside Latin script in one document
- **Education material** — worksheets and handbooks in regional scripts

## What You'll Learn

1. **Script support** — how a registered font unlocks Devanagari end to end
2. **Shaping corrections** — what TerraPDF fixes automatically, and what it doesn't
3. **Multi-page composition** — headers, footers, and page numbers in a non-Latin script
4. **Tables in Devanagari** — indicator tables and scheme listings
5. **Real-world layout** — a full report rather than a glyph sample sheet

## File Output

Generates: `15_child_nutrition_india_report.pdf`

A three-page Hindi-language report on child nutrition in India, exercising every Devanagari
shaping correction TerraPDF applies.
