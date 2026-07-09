---
title: "Changelog"
description: "Version history, release notes, fixes, and feature updates for the TerraPDF C# PDF generation library."
layout: base.njk
docPage: true
permalink: /changelog/
robots: noindex, follow
---
# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[Unreleased]: https://github.com/sahebansari/TerraPDF/compare/v1.5.0...HEAD
[1.5.0]: https://github.com/sahebansari/TerraPDF/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/sahebansari/TerraPDF/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/sahebansari/TerraPDF/compare/v1.2.3...v1.3.0
[1.2.3]: https://github.com/sahebansari/TerraPDF/compare/v1.2.2...v1.2.3
[1.2.2]: https://github.com/sahebansari/TerraPDF/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/sahebansari/TerraPDF/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/sahebansari/TerraPDF/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/sahebansari/TerraPDF/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/sahebansari/TerraPDF/releases/tag/v1.0.0
