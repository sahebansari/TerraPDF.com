---
title: "Changelog"
description: "Version history, release notes, fixes, and feature updates for the TerraPDF C# PDF generation library."
layout: base.njk
docPage: true
permalink: /changelog/
---
# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.1.0] - 2026-09-03

Three additions, all backward compatible: font embedding now subsets
automatically, the vector canvas gained real translucency, and the vector
canvas can place text. No public API was removed or changed — existing calls
keep behaving exactly as before.

### Added (automatic font subsetting)
- **`FontFamily.Register(...)` now embeds only the glyphs a document actually
  shows**, instead of the whole font file. Every glyph a document never draws
  is blanked out of the font's `glyf` table — glyph IDs are never renumbered,
  so `cmap`, `hmtx`, `GSUB`, and `Identity-H`/`CIDToGIDMap` all stay valid
  with no other change. Fully automatic; no new API.
- **Composite-glyph closure.** Accented Latin letters and Devanagari
  conjuncts are commonly composite glyphs — built from component glyphs no
  content stream ever references by ID directly. Blanking computes the
  closure of shown glyphs under their composite references first, so an
  accent or conjunct never loses a component that happens to be otherwise
  unused.
- Measured, not assumed: a custom-font sample with mixed Latin/Cyrillic/Greek
  text dropped from 718KB to 320KB (55% smaller); a Devanagari report using
  two font variants (regular + bold) dropped from 152KB to 77KB (49%
  smaller). Tables sized per glyph regardless of usage (`hmtx`, `loca`,
  `cmap`, `GSUB`/`GPOS`, `post`, `name`) are not yet trimmed — see "Known
  limitations."

### Added (graphics state / constant alpha)
- **`/ExtGState` and the `gs` operator** — the first transparency mechanism
  in the writer beyond per-pixel image `/SMask`. Distinct opacity values used
  anywhere in a document are deduplicated into shared `/ExtGState` resources,
  the same way repeated images and fonts already are.
- Every `VectorCanvas` fill/stroke primitive (`Line`, `FillRect`/`StrokeRect`/
  `DrawRect`, the rounded-rectangle and ellipse/circle families, `Path`) takes
  a trailing `opacity` parameter (`1` = fully opaque, the default — omitting
  it costs nothing, no `/ExtGState` is emitted at all). `PathDescriptor`
  gained a matching `.Opacity(...)` fluent setter.

### Added (text on the vector canvas)
- **`VectorCanvas.Text(text, x, y, ...)`** places one line of text with its
  baseline at `(x, y)` — the one canvas primitive that isn't top-left
  anchored. Renders through a registered custom font when `fontFamily` names
  one, otherwise the standard-14 families. Supports `opacity` like every
  other primitive (ghosted/watermark-style canvas text).
- **`VectorCanvas.MeasureTextWidth(...)`** (`static`) — measures a label in
  the same font `Text` would render it in, for centering or right-aligning
  before placing it.

### Fixed (samples)
- `10_VectorGraphicsShowcase.cs`: four shapes were repositioned to stop
  bleeding past the page margin, and the donut chart's doubled-up legend
  (bare canvas swatches plus a separate, awkwardly wrapped text list) was
  rebuilt as a single swatch-plus-label pass using the new
  `VectorCanvas.Text`.

### Known limitations
- Font subsetting does not renumber glyph IDs or shrink tables sized per
  glyph regardless of usage, so the size win on a full font is well short of
  what a 99%+ shrink in `glyf` alone would suggest. Full re-indexed
  subsetting may follow in a future version.
- `/ExtGState` opacity is wired through `VectorCanvas` and canvas text only;
  `DrawImage`, flowed text (`TextBlock`), and `Background()`/border colours
  do not yet take an opacity parameter.

---

## [2.0.1] - 2026-08-28

A table-correctness release. Every fix below addresses a case that produced a
valid PDF with visibly wrong geometry — cells drawn on top of one another, or
rows running off the bottom of the page — rather than an error. No public API
changed; documents that do not use table spans and do not overflow a page are
byte-for-byte identical to 2.0.0.

### Added
- New sample: `16_table_spans_showcase.pdf` — a seven-page document covering
  every fix below. Pages 1-2 demonstrate `columnSpan`, `rowSpan`, the two
  together, and a spanned cell growing the rows it covers, each next to the
  code that produced it. Pages 3-5 are a header-less ledger whose accounts are
  joined by row spans, split across three pages to show the spans surviving the
  breaks intact. Pages 6-7 are a table placed straight into the content slot
  with no `Column` wrapper, paginating with its grouped two-column header
  repeated on both pages.

### Fixed (table column and row spans)
- **`Cell(columnSpan:)` no longer overlaps the cell that follows it.** The row
  cursor advanced by one column regardless of the span just placed, so in a
  three-column table a `columnSpan: 2` cell followed by a normal cell put that
  cell in column 2 — inside the span — and left column 3 empty. Cells are now
  placed in the first column not already covered by an earlier cell.
- **`Cell(rowSpan:)` now reserves its columns in the rows below it.** Each row
  started its cursor at column 1 with no record of what the previous rows had
  spanned, so the row after a `rowSpan: 2` cell drew its first cell at the same
  origin, on top of the spanned cell.
- **Spanned cells are measured and grow the rows they cover.** `GetRowHeights`
  skipped every cell with `RowSpan > 1`, so a spanned cell contributed no height:
  content taller than the rows it covered overflowed past the table, and a row
  containing only spanned cells collapsed to zero height. Row heights are now
  computed in two passes, the second distributing any shortfall evenly across
  the rows a spanned cell covers.
- Spans below `1` are treated as `1` rather than producing a zero-width or
  zero-height cell.

All three defects produced valid PDFs that silently drew cells on top of each
other, and none of them were covered by the test suite. New
`TableSpanTests` asserts on the rectangles actually emitted into the content
stream — placement, width, height, and pairwise non-overlap — including a
grouped header span repeated across a multi-page table.

### Fixed (table pagination)
- **A table with no header row now splits across pages.** Only tables declaring
  a `HeaderRow` were split between rows; a header-less table taller than the
  page was placed whole and its overflowing rows simply ran off the bottom.
  Header-less tables are now split when — and only when — they cannot fit a
  page, so a short one is still drawn as an ordinary item and the decorators
  wrapped around it (background, border) keep painting.
- **A table placed directly in the content slot now paginates.** The layout pass
  looked for a top-level `Column` and sent anything else down a single-page
  path, so `page.Content().Table(…)` overflowed instead of splitting. Such a
  table is now wrapped in a synthetic one-item column and takes the same
  row-splitting path. Content that fits on one page is unaffected and still
  receives the whole content box.
- **A row span is no longer cut in half at a page break.** The splitter moved one
  row at a time, so a break landing inside a `rowSpan` left a truncated cell on
  the first page with nothing continuing it overleaf. Data rows are now grouped
  into the smallest runs that no row span crosses, and a group is never divided
  between pages. A group taller than a whole page is still forced out so layout
  always makes progress.

`TablePaginationTests` covers each case, including the row-span break at seven
different page offsets — the defect only appeared at offsets where the break
happened to fall inside a spanned pair.

### Known limitations
- A row span that starts in a *header* row and extends into data rows renders
  correctly on the first page, but is truncated to the header rows on every
  continuation page: the header block repeats while the data rows it also
  covers stay behind on the page before. Row spans that start in a data row are
  unaffected — those are grouped and never split. Keep header rows
  self-contained if a table is expected to paginate.

---

## [2.0.0] - 2026-07-23

### Added
- **Custom font embedding** — `FontFamily.Register(...)` embeds a TrueType font (regular,
  bold, italic, bold-italic) as a `Type0`/`CIDFontType2` composite font with `Identity-H`
  encoding, giving full Unicode text support beyond the standard-14 fonts'
  `WinAnsiEncoding` range (brand typefaces, Cyrillic, Greek, and beyond). Fonts are
  embedded once per document regardless of how many times they're used, and requesting
  an unregistered style falls back to the closest registered variant instead of throwing.
- **Devanagari-aware rendering** (pure C#, no native dependency, none planned):
  - Matra reordering — the vowel sign ि (`U+093F`) is moved to its correct pre-consonant
    visual position.
  - Conjunct ligatures — the font's own `half`/`akhn`/`cjct` GSUB features are substituted
    so स्व, स्थ, क्ष, ज्ञ etc. render as proper joined forms.
  - Reph — cluster-initial र् (धर्म, वर्तमान, दुर्बलता) is reordered and substituted via
    the font's `rphf` feature.
  - Below-base/post-base 'ra' — क्र, त्र, प्र, ष्ट्र substituted via the font's `rkrf`
    feature.
- New `docs/custom-fonts.md` guide.
- New sample: `15_child_nutrition_india_report.pdf` — a full multi-page Hindi-language
  report exercising the new Devanagari shaping corrections.

### Fixed
- Word-wrap: a single word/token wider than the line now breaks at character boundaries
  instead of overflowing the container.

### Changed
- **Breaking (none):** version bumped `1.5.1` → `2.0.0` to reflect the scope of the new
  font subsystem, not a breaking API change.
- CI (`ci.yml`): added a nuget.org connectivity canary as the last step of every run.
- Publish workflow (`publish.yml`): added pre-publish connectivity and `NUGET_API_KEY`
  authentication checks, so a dead network path or a stale key is caught before
  `Pack`/`Push` — previously such a failure could only be recovered by bumping the
  version, since nuget.org rejects re-pushing the same version.

---

## [1.5.1] - 2026-07-10

### Added
- **.NET 10 target** — the library now multi-targets `net8.0`, `net9.0` and
  `net10.0` (the current LTS). No API or behaviour changes; existing .NET 8/9
  consumers are unaffected.

### Changed
- Test suite now runs once per supported runtime (`net8.0`, `net9.0`,
  `net10.0`); the sample app moved to `net10.0`.
- CI workflows install the .NET 8/9/10 SDKs; `global.json` now requires the
  .NET 10 SDK (with `rollForward: latestMajor`).
- Consolidated the two overlapping CI workflows into a single `ci.yml`.
- Migrated the solution to the XML-based `.slnx` format (`TerraPDF.slnx`).

---

## [1.5.0] - 2026-07-06

### Added (barcodes & QR codes)
- **`container.Barcode(data, ...)`** — Code128 (Subset B) barcode generation, encoding printable ASCII (0x20-0x7E). Supports an explicit or auto-fill width, custom module/background colour, an optional human-readable caption rendered below the bars, and a configurable quiet zone.
- **`container.QrCode(data, ...)`** — from-scratch ISO/IEC 18004 QR code generator: byte-mode encoding, automatic version selection (1-40), all four error correction levels (`QrErrorCorrectionLevel.L/M/Q/H`), Reed-Solomon error correction, and full mask-pattern penalty scoring. Supports an explicit or auto-fill size, custom module/background colour, and a configurable quiet zone.
- Both render as **vector-filled rectangles** (one rect per bar / per contiguous run of dark QR modules), matching the existing `VectorCanvas` rendering style — crisp at any zoom, no raster image pipeline, and placeable anywhere an `IContainer` is exposed (`Column`, `Row`, `Table` cell, header, footer).
- New `PdfPage.AddFilledRects` batch primitive: emits one colour operator followed by many `re` ops and a single trailing fill, avoiding a redundant colour-set/fill pair per module on symbols with thousands of modules.

---

## [1.4.0] - 2026-07-04

### Added
- **AES-256 PDF encryption by default** (Standard Security Handler Revision 6, SHA-2 key derivation, PDF 2.0 output). `EncryptionOptions.Algorithm` lets you opt back into AES-128 (`EncryptionAlgorithm.Aes128`) for legacy viewers.
- **Images from bytes and streams** — `container.Image(byte[])` and `container.Image(Stream)` overloads (with optional width), for images from databases, embedded resources, or generated data. Format is now detected from magic bytes rather than the file extension.
- **PNG transparency** — RGBA PNGs keep their alpha channel via a `/SMask` soft mask; indexed-transparency (tRNS) PNGs still render opaque.
- **Image deduplication** — identical image data reused across pages is embedded once and shared document-wide.
- **Anchor-based bookmarks** — `container.Bookmark("Title"[, parentTitle])` marks its content as an outline destination; the page number and position are resolved automatically at render time. The page-number-based `Bookmark(title, pageNumber)` API remains available.
- **Paragraphs split across pages** — a text block taller than the remaining page now flows onto the next page instead of overflowing.
- **`FontFamily(string)`** on `TextDescriptor`, `SpanDescriptor`, and `TextStyle` now actually works — supports Helvetica, Times, and Courier (plus common aliases like "Arial"), with `Bold()`/`Italic()` staying within the selected family.

### Fixed
- Bookmark destinations now use zoom-retaining `/XYZ` coordinates instead of `/Fit`/`/FitH`, and land at the correct position.
- Height-constrained images preserve aspect ratio instead of being squashed.
- Table of Contents heading scan now traverses decorators, hyperlinks, and bookmark anchors.
- Encrypted documents no longer leak metadata, bookmark titles, or hyperlink URIs in plaintext — everything is encrypted with the owning object's key.
- Document metadata is now referenced from the PDF trailer, so viewers display it correctly.
- Pagination now works through all decorators (`Margin`, `RoundedBorder`, `RoundedBox`, per-edge borders).
- Negative-value validation added to the single-side `Padding*`/`Margin*` overloads.

### Changed
- **Breaking:** `TextDescriptor.Span(string, Action<TextStyle>)` is now `Span(string, Func<TextStyle, TextStyle>)`. `TextStyle` is immutable, so the callback must return the configured style: `t.Span("hi", s => s.Bold())`.
- Content streams are now Flate-compressed, and serialization is streamed instead of buffered in memory — smaller files, lower peak memory.
- Fragment-based layout engine — page counting and rendering now always agree.

---

## [1.3.0] - 2026-05-19

### Added
- **AES-128 PDF Encryption** using the PDF Standard Security Handler.
- `EncryptionOptions` with `UserPassword`, `OwnerPassword`, and `Permissions`.
- `PdfPermissions` flags for `Print`, `CopyText`, `ModifyContents`,
  `ModifyAnnotations`, `FillForms`, `ExtractForAccessibility`,
  `AssembleDocument`, `PrintLowResolution`, `All`, and `None`.
- Per-object AES-128 CBC encryption of content streams and image XObjects.
- Encrypted documents are emitted as PDF 1.6, the minimum version required for AES encryption.
- Encryption tests covering password combinations, permission flags, multi-page documents, metadata, null guards, and output-size sanity.

### Fixed
- Encrypted PDFs now write the random `/ID` array to the trailer so viewers can reproduce the file encryption key.
- Removed invalid `/Filter /Crypt` entries from content streams and JPEG image dictionaries.
- AES encryption now uses the correct padding behavior for decrypted content.
- Sample output folders are created automatically before sample PDFs are written.
- Encryption showcase badges use WinAnsi-safe ASCII symbols.

---

## [1.2.3]

### Added
- **Vector Graphics / Canvas API** via `container.Canvas(height, draw)`.
- `VectorCanvas` primitives for lines, rectangles, rounded rectangles, circles, ellipses, arbitrary Bezier paths, polygons, and grids.
- `PathDescriptor` helpers for `MoveTo`, `LineTo`, `CurveTo`, `Close`, `Rect`, `Ellipse`, `Circle`, `Polyline`, `Polygon`, `Fill`, `Stroke`, and even-odd fill.
- Vector graphics sample demonstrating primitives, custom paths, charts, progress bars, callouts, and icon-grid patterns.
- Unicode and WinAnsiEncoding showcase sample covering Windows-1252 specials, Latin-1 characters, full byte-to-glyph reference grids, font comparison, and glyph metrics.
- Documentation guides for vector graphics and Unicode / character encoding.

### Fixed
- Several language sample sentences now avoid characters outside WinAnsiEncoding so output PDFs do not show replacement `?` glyphs.
- Win-1252 showcase tables now use proportional column definitions to avoid page overflow.

---

## [1.2.2] - 2026-05-04

### Added
- **Table of Contents generation** — `container.TableOfContents()` creates a TOC page populated with headings collected from `.H1()`–`.H6()`, with hierarchical numbering (e.g. 1, 1.1, 1.1.1) and clickable internal links.
- **Internal links (GoTo)** — `container.InternalLink(pageNumber, top?)` creates intra-document navigation that preserves current zoom level and scrolls to the target heading.
- **Section headings** — `.H1()` through `.H6()` methods with sensible default styles (size + weight), each returning `TextDescriptor` for further customisation.

### Fixed
- Internal link zoom issue — `/FitH` replaced with `/XYZ` so clicking TOC entries no longer resets zoom.
- Page number display in TOC now excludes TOC page count (TOC treated as page zero), while links still point to correct physical pages.
- `HeadingRecorder` propagation through `DrawingContext.At` fixed so TOC entries are correctly collected.

---

## [1.2.1] - 2026-05-03

### Documentation
- Corrected all `GeneratePdf()` → `PublishPdf()` method references throughout README and all documentation files
- Fixed `Color.Blue` hex values: Darken2 (`#1976D2`), added missing Darken3 (`#1565C0`) and Darken4 (`#0D47A1`)
- Added `PageBreak()` to `ColumnDescriptor` API table in layout guide
- Documented `HeaderOnFirstPageOnly()` page method for first-page-only headers
- Clarified `RelativeItem()` default weight = 1 in row-and-column layout guide
- Added `FontFamily(string)` to `TextDescriptor` methods table in text-and-spans guide

---

## [1.2.0] - 2025-07-14

### Added
- `Underline()` style method on `TextDescriptor` and `SpanDescriptor`. Draws an
  underline beneath the text. Can be combined with `Strikethrough()`.
- `LineHeight(double)` style method on `TextDescriptor`. Sets a line-height
  multiplier (e.g. `1.0` = tight, `1.4` = default, `2.0` = double-spaced).
  Also accepted by `DefaultTextStyle` for page-wide control.
  `TextStyle.LineHeightMultiplier` property exposed for custom render logic.
- `RoundedBorder(radius, lineWidth, hexColor)` decorator — draws a rounded-corner
  stroke border around child content. Corner radius is automatically clamped to
  half the shorter dimension.
- `RoundedBox(radius, fillHexColor, borderHexColor, lineWidth)` decorator —
  fills the area with `fillHexColor` and draws a rounded-corner border in one
  call. Equivalent to `Background + RoundedBorder` but rendered as a single path.
- `BorderTop(lineWidth, hexColor)`, `BorderBottom`, `BorderLeft`, `BorderRight`
  per-edge border decorators. Each side is independently configurable with its
  own width and colour. The `hexColor` parameter defaults to `"#000000"`.
- `PageBreak()` container extension — inserts an explicit page-break marker
  inside a `Column`. Silently skipped when it falls at the very start of a page.
- `Hyperlink(url)` container extension — wraps child content in a clickable PDF
  URI annotation (`/Annots` with `/URI` action). Clicking the area in a
  conforming PDF viewer navigates to the given URL.
- `HighPriorityFeatureTests.cs` — 20 new tests covering all five features above
  (underline, hyperlink, per-edge borders, line height, and their combinations).
- `RoundedBorderTests.cs` — dedicated tests for `RoundedBorder` and `RoundedBox`
  geometry, clamping behaviour, and validation.
- `PageBreakTests.cs` — tests for explicit page-break positioning.
- `HeaderFirstPageOnlyTests.cs` — tests verifying that the header slot can be
  conditionally rendered only on the first page using `ShowIf`.

### Fixed
- **Breaking (behaviour):** `TextDescriptor.Span().Bold()` / `.Italic()` /
  `.Strikethrough()` etc. previously mutated the whole block's `SpanStyle`
  instead of the individual span's style. Now correctly isolated.

### Changed
- Folder `Fluent` renamed to `Core` (`TerraPDF.Core` namespace).
- Folder `Infrastructure` renamed to `Infra` (`TerraPDF.Infra` namespace).

---

## [1.1.0] - 2025-06-01

### Added
- `Margin`, `MarginVertical`, `MarginHorizontal`, `MarginTop`, `MarginBottom`,
  `MarginLeft`, `MarginRight` decorator methods with full `Unit` overloads.
  Margin is outer spacing — the margin region stays transparent, background
  and border start after the gap.
- `SpanDescriptor` — per-span fluent builder returned by `TextDescriptor.Span()`,
  `CurrentPageNumber()`, and `TotalPages()`. Style methods chained after
  `.Span(...)` now apply **only to that span**, not the whole `TextBlock`.
- Complete documentation suite under `docs/`:
  `getting-started.md`, `text-and-spans.md`, `layout.md`, `decorators.md`,
  `images.md`, `colors.md`, `page-sizes-and-units.md`,
  `components-and-templates.md`, `row-and-column-layout.md`.
- `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`.
- Input validation (using `ArgumentNullException.ThrowIfNull`,
  `ArgumentException.ThrowIfNullOrWhiteSpace`,
  `ArgumentOutOfRangeException.ThrowIfNegative/ThrowIfNegativeOrZero`)
  on every public API entry point.
- 62 new tests across `ValidationTests` and `BehaviourTests` (92 total).

### Fixed
- **Breaking (behaviour):** `TextDescriptor.Span().Bold()` / `.Italic()` /
  `.Strikethrough()` etc. previously mutated the whole block's `SpanStyle`
  instead of the individual span's style. Now correctly isolated.

### Changed
- Folder `Fluent` renamed to `Core` (`TerraPDF.Core` namespace).
- Folder `Infrastructure` renamed to `Infra` (`TerraPDF.Infra` namespace).

---

## [1.0.0] - 2025-01-01

### Added
- Initial release.
- PDF 1.7 generation with zero native dependencies.
- Text styling: bold, italic, bold-italic, strikethrough, underline, font size, colour.
- Multi-span text blocks with mixed styles.
- `Column` (vertical stacking) and `Row` (horizontal layout) with
  `RelativeItem`, `AutoItem`, and `ConstantItem` sizing.
- `Table` with relative and constant columns, `HeaderRow` (repeats on
  continuation pages), alternating-row support.
- `Padding` with all side variants and `Unit` overloads.
- `Background`, `Border`, `Alignment` (horizontal + vertical), `ShowIf`.
- Horizontal and vertical rule lines.
- PNG and JPEG image embedding.
- `IComponent` reusable content blocks.
- `IDocument` reusable document templates.
- Headers, footers, page numbers (`CurrentPageNumber`, `TotalPages`).
- Multi-page documents with automatic table pagination.
- Full Material Design colour palette (`Color.*`).
- Standard page sizes including ISO A-series, Letter, Legal, Tabloid,
  Executive, and `Landscape()` helper.
- `Unit` system: Point, Millimetre, Centimetre, Inch.
- Targets .NET 8 and .NET 9.
- CI workflow (GitHub Actions): build, test, coverage.
- Publish workflow (GitHub Actions): NuGet + symbols on release tag.

[Unreleased]: https://github.com/sahebansari/TerraPDF/compare/v2.1.0...HEAD
[2.1.0]: https://github.com/sahebansari/TerraPDF/compare/v2.0.1...v2.1.0
[2.0.1]: https://github.com/sahebansari/TerraPDF/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/sahebansari/TerraPDF/compare/v1.5.1...v2.0.0
[1.5.1]: https://github.com/sahebansari/TerraPDF/compare/v1.5.0...v1.5.1
[1.5.0]: https://github.com/sahebansari/TerraPDF/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/sahebansari/TerraPDF/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/sahebansari/TerraPDF/compare/v1.2.3...v1.3.0
[1.2.3]: https://github.com/sahebansari/TerraPDF/compare/v1.2.2...v1.2.3
[1.2.2]: https://github.com/sahebansari/TerraPDF/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/sahebansari/TerraPDF/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/sahebansari/TerraPDF/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/sahebansari/TerraPDF/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/sahebansari/TerraPDF/releases/tag/v1.0.0
