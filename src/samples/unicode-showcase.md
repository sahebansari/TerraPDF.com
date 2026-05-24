---
title: Unicode Showcase - TerraPDF Sample
description: Support for multi-language content, Unicode characters, RTL text, and special encodings using TerraPDF.
layout: sample.njk
permalink: /samples/unicode-showcase/
---


# Unicode Showcase Sample

## Overview

The Unicode Showcase sample demonstrates:
- **Unicode support** — full UTF-8 character support
- **Multi-language content** — various scripts and languages
- **Right-to-left (RTL) text** — Arabic, Hebrew support
- **Special characters** — symbols, emojis, diacritics
- **Encoding** — proper character encoding handling
- **Mixed content** — blending multiple languages and scripts

## Key Features Demonstrated

### 1. Basic Unicode Text
```csharp
col.Item().Text("Hello World - English").FontSize(12).Bold();
col.Item().Text("Hola Mundo - Español").FontSize(12).Bold();
col.Item().Text("Bonjour le Monde - Français").FontSize(12).Bold();
col.Item().Text("Hallo Welt - Deutsch").FontSize(12).Bold();
col.Item().Text("Ciao Mondo - Italiano").FontSize(12).Bold();
```

### 2. Non-Latin Scripts
```csharp
col.Item().PaddingTop(8)
    .Text("Cyrillic: Привет мир").FontSize(12).Bold();

col.Item().Text("Greek: Γεια σας κόσμε").FontSize(12).Bold();

col.Item().Text("Japanese: こんにちは世界").FontSize(12).Bold();

col.Item().Text("Chinese: 你好世界").FontSize(12).Bold();

col.Item().Text("Korean: 안녕하세요 세계").FontSize(12).Bold();

col.Item().Text("Thai: สวัสดี").FontSize(12).Bold();

col.Item().Text("Arabic: مرحبا بالعالم").FontSize(12).Bold();

col.Item().Text("Hebrew: שלום עולם").FontSize(12).Bold();
```

### 3. Special Characters and Symbols
```csharp
col.Item().Text(t =>
{
    t.Span("Copyright: ©  ");
    t.Span("Registered: ®  ");
    t.Span("Trademark: ™  ");
    t.Span("Degree: °  ");
    t.Span("Plus/Minus: ±  ");
    t.Span("Multiplication: ×  ");
    t.Span("Division: ÷");
}).FontSize(12);

col.Item().PaddingTop(8).Text(t =>
{
    t.Span("Arrows: ← → ↑ ↓ ↔ ↕  ");
    t.Span("Math: ∞ ∑ √ ∫  ");
    t.Span("Bullets: • ◦ ▪ ■  ");
    t.Span("Shapes: ◆ ● ■ ▲");
}).FontSize(12);
```

### 4. Diacritical Marks
```csharp
col.Item().PaddingTop(8).Text(t =>
{
    t.Span("French accents: é è ê ë ç");
    t.Span("  ");
    t.Span("German umlauts: ä ö ü ß");
}).FontSize(12);

col.Item().Text(t =>
{
    t.Span("Spanish: ¿ ¡ á í ó ú ñ");
}).FontSize(12);

col.Item().Text(t =>
{
    t.Span("Combining diacritics: a̅ e̊ i̇ o̧ u̇");
}).FontSize(12);
```

### 5. Right-to-Left (RTL) Text
```csharp
col.Item().PaddingTop(12).Text("RIGHT-TO-LEFT SCRIPTS").Bold().FontSize(12);

col.Item().Text("Arabic: النص العربي يكتب من اليمين إلى اليسار")
    .FontSize(11);

col.Item().Text("Hebrew: הטקסט העברי כתוב מימין לשמאל")
    .FontSize(11);

col.Item().Text("Urdu: اردو کا متن دائیں سے بائیں طرف لکھا جاتا ہے")
    .FontSize(11);
```

### 6. Mixed Content
```csharp
col.Item().PaddingTop(12).Text(t =>
{
    t.Span("English ").FontSize(12);
    t.Span("(English) ").FontSize(11).Italic();
    t.Span("日本語 ").FontSize(12);
    t.Span("(Japanese) ").FontSize(11).Italic();
    t.Span("한글 ").FontSize(12);
    t.Span("(Korean)").FontSize(11).Italic();
}).Bold();

col.Item().PaddingTop(6).Text(
    "Price: USD $100 | EUR €85 | GBP £75 | JPY ¥10,000 | CHF ₣95")
    .FontSize(11);

col.Item().Text(
    "Contact: name@domain.com | Tel: +1 (555) 123-4567")
    .FontSize(11);
```

### 7. Currency Symbols
```csharp
col.Item().PaddingTop(8).Text(t =>
{
    t.Span("USD: $100  ");
    t.Span("EUR: €85  ");
    t.Span("GBP: £75  ");
    t.Span("JPY: ¥10000  ");
    t.Span("CHF: ₣95  ");
    t.Span("INR: ₹5000  ");
    t.Span("CNY: ¥600  ");
    t.Span("RUB: ₽7000");
}).FontSize(12);
```

### 8. Quotation Marks Variations
```csharp
col.Item().PaddingTop(8).Text(t =>
{
    t.Span("English: "Hello"  ");
    t.Span("French: « Hello »  ");
    t.Span("German: „Hello"  ");
    t.Span("Spanish: «Hello»");
}).FontSize(11);
```

## Unicode Categories

### Scripts Supported

| Script | Example | Use |
|--------|---------|-----|
| Latin | English, Spanish, French | Western European |
| Cyrillic | Russian, Ukrainian, Serbian | Eastern European |
| Greek | Greek | Modern Greek |
| Arabic | Arabic, Urdu, Persian | Middle Eastern |
| Hebrew | Hebrew | Hebrew text |
| CJK | Chinese, Japanese, Korean | East Asian |
| Devanagari | Hindi, Sanskrit | South Asian |
| Thai | Thai | Southeast Asian |

### Special Character Categories

- **Math symbols** — ∞, ∑, √, ∫
- **Currency** — $, €, £, ¥, ₹
- **Arrows** — →, ←, ↑, ↓
- **Geometric shapes** — ●, ■, ▲, ◆
- **Typographic** — •, –, —, …

## Best Practices

1. **Font selection** — Use Unicode-compatible fonts
2. **Encoding** — Always use UTF-8 encoding
3. **Testing** — Test with various languages
4. **Alignment** — RTL text needs special handling
5. **Mixed content** — Test blending multiple scripts
6. **Fallback fonts** — Plan for missing glyphs

## Use Cases

Perfect for:
- **International documents** — multi-language PDFs
- **Global communications** — multilingual materials
- **Academic papers** — citations in various languages
- **Financial reports** — multi-currency pricing
- **Educational materials** — language learning resources
- **Technical documentation** — code with international comments

## What You'll Learn

1. **Unicode text** — UTF-8 support and encoding
2. **Multi-language support** — various scripts
3. **Special characters** — symbols and diacritics
4. **RTL text** — right-to-left script handling
5. **Mixed content** — blending multiple languages
6. **Currency symbols** — international pricing
7. **Character encoding** — proper handling

## Encoding Details

- **UTF-8** — Full Unicode support
- **Character encoding** — Automatic handling
- **Font fallback** — Graceful degradation
- **Normalization** — Proper text handling

## File Output

Generates: `11_unicode_showcase.pdf`

Creates a comprehensive Unicode showcase demonstrating support for multiple languages, scripts, and special characters suitable for international communications and documentation.
