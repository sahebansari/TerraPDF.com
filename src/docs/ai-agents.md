---
title: "TerraPDF for AI Agents"
description: "A machine-readable TerraPDF contract for AI coding agents: one URL to hand your agent, a skill for coding assistants, PDF tools for agent frameworks and MCP, the full verified API surface, and the mistakes that stop generated code from compiling."
layout: base.njk
docPage: true
permalink: /docs/ai-agents/
---
# TerraPDF for AI Agents

This page is the context an AI coding agent needs to write **correct, compiling
TerraPDF code on the first try**. It is written to be read by a machine, and it
is also the page to read yourself if you want the whole API on one screen.

Everything below is verified against **TerraPDF 2.3.0**. Members marked
**[2.3+]** were added in 2.3.0 and do not compile against older versions.

---

## Give your agent one URL

| URL | What it contains | Use when |
|-----|------------------|----------|
| `https://terrapdf.com/llms-full.txt` | This contract **plus every documentation guide**, concatenated into one plain-text file | **Default.** One fetch, no follow-up requests |
| `https://terrapdf.com/llms.txt` | A short index linking to each guide | Your agent prefers to fetch pages on demand |
| `https://terrapdf.com/docs/ai-agents.md` | This page only, as raw Markdown | You only need the API contract, not the guides |

Both `.txt` files are plain text with no navigation, no HTML, and no
JavaScript, so they cost an agent nothing to parse.

### Paste-ready prompt

```text
Read https://terrapdf.com/llms-full.txt first. It is the complete API contract
for TerraPDF, a zero-dependency C# PDF library.

Then, using TerraPDF only (no other PDF library), write: <describe the document>

Follow the "Rules that prevent almost every failure" section exactly. Do not
invent API members — if something you need is not in the reference, say so
instead of guessing.
```

### Project rules file

Drop this into `CLAUDE.md`, `AGENTS.md`, `.github/copilot-instructions.md`,
`.cursor/rules/`, or your agent's equivalent, so the contract is loaded on every
task in the repo. If your assistant supports skills, install the
[TerraPDF skill](#tooling-for-ai-agents) instead: it loads only when PDF code is involved.

```markdown
## PDF generation

This project generates PDFs with TerraPDF (NuGet: `TerraPDF`).
Before writing or editing any PDF-generating code, read
https://terrapdf.com/llms-full.txt and follow its API contract.

Key invariants: every container holds exactly one child; `PublishPdf(...)` is
the only output call; colours are hex strings from `TerraPDF.Helpers.Color`;
the standard-14 fonts cover WinAnsiEncoding only.
```

---

## Tooling for AI agents

Beyond this page, TerraPDF ships three pieces for AI-assisted development.
Pick by what the AI is doing:

| The AI is… | Use | What it gets |
|------------|-----|--------------|
| **Writing C#** that uses TerraPDF (GitHub Copilot, Cursor, Claude Code, Codex) | The **TerraPDF skill** | This contract as an [Agent Skill](https://agentskills.io): rules, the full API reference, compiling recipes, and troubleshooting, loaded only when PDF code is involved |
| **Creating PDFs at runtime** inside a .NET agent (Microsoft Agent Framework, Semantic Kernel, `IChatClient`) | The **`TerraPDF.Agents`** package | `create_pdf` and `get_pdf_document_format` tools that take a validated JSON document, not generated C# |
| **Either, through MCP** (Copilot, Cursor, Claude, LangChain/LangGraph) | The **`TerraPDF.Mcp`** server | The same PDF tools, plus `get_terrapdf_csharp_guide`, which serves the skill |

### The skill, for coding assistants

Copy [`skills/terrapdf`](https://github.com/sahebansari/TerraPDF/tree/master/skills/terrapdf) from the
repository into your project:

```bash
cp -r skills/terrapdf .github/skills/terrapdf   # GitHub Copilot
cp -r skills/terrapdf .claude/skills/terrapdf   # Claude Code
```

For assistants without skill support, use the
[project rules file](#project-rules-file) above, or connect the MCP server below.

### TerraPDF.Agents, for .NET agents

Do not have a runtime agent write and execute C#: that needs a compiler at
runtime, cannot be validated, and runs model-written code. Instead, the model
describes the document as JSON and calls `create_pdf`:

```json
{
  "title": "Q3 Sales Report",
  "content": [
    { "type": "heading", "level": 1, "text": "Q3 Sales Report" },
    { "type": "paragraph", "text": "Revenue grew **18%** quarter over quarter." },
    { "type": "chart", "chartType": "bar", "labels": ["NA", "EMEA", "APAC"], "values": [430, 455, 240] },
    { "type": "table",
      "columns": [ { "header": "Region", "width": 3 }, { "header": "Revenue", "align": "right" } ],
      "rows": [ ["NA", "$430k"], ["EMEA", "$455k"], ["APAC", "$240k"] ] }
  ]
}
```

Blocks cover headings, paragraphs, lists, tables with totals, key/value pairs,
callouts, nested columns, images, bar/line/pie charts, Code128 barcodes, QR
codes, dividers, spacers, and page breaks. The document can also set headers,
footers, page numbers, a table of contents, custom fonts, a theme, and AES-256
encryption. An invalid document writes nothing; the tool returns every error
with a JSON path (`$.content[2].rows[1]: Row has 5 cells but the table
defines 4 columns.`) so the model can correct itself.

```bash
dotnet add package TerraPDF.Agents
```

```csharp
using TerraPDF.Agents.Tools;

var pdfTools = new TerraPdfTools(new TerraPdfToolOptions { OutputDirectory = "out" });

// Microsoft Agent Framework
AIAgent agent = chatClient.AsAIAgent(
    instructions: "You produce polished PDF reports. Use create_pdf.",
    tools: [.. pdfTools.AsAIFunctions()]);

// Semantic Kernel (the model sees terrapdf_create_pdf, ...)
kernel.Plugins.AddFromFunctions("terrapdf", pdfTools.AsAIFunctions().Select(f => f.AsKernelFunction()));

// Any Microsoft.Extensions.AI IChatClient
var options = new ChatOptions { Tools = [.. pdfTools.AsAIFunctions()] };
```

Tool arguments are model output, so the tools treat them as untrusted. The
model picks a file name, never a directory. Image and font paths cannot escape
the configured asset directory; with none configured, only base64 data is
accepted. URLs are never fetched, and links allow only http, https, and mailto.

### TerraPDF.Mcp, for MCP clients

```bash
dnx TerraPDF.Mcp --yes                 # .NET 10 SDK, no install
dotnet tool install -g TerraPDF.Mcp    # or install terrapdf-mcp globally
```

| Client | Configuration |
|--------|---------------|
| VS Code / GitHub Copilot (`.vscode/mcp.json`) | `{ "servers": { "terrapdf": { "type": "stdio", "command": "dnx", "args": ["TerraPDF.Mcp", "--yes"] } } }` |
| Cursor (`.cursor/mcp.json`), Claude Desktop | `{ "mcpServers": { "terrapdf": { "command": "dnx", "args": ["TerraPDF.Mcp", "--yes"] } } }` |
| Claude Code | `claude mcp add terrapdf -- dnx TerraPDF.Mcp --yes` |
| LangChain / LangGraph | `MultiServerMCPClient({"terrapdf": {"transport": "stdio", "command": "dnx", "args": ["TerraPDF.Mcp", "--yes"]}})` |

PDFs are written to `./pdf-output` (`--output-dir` or `TERRAPDF_OUTPUT_DIR`).
Image and font paths resolve against the working directory (`--asset-dir` or
`TERRAPDF_ASSET_DIR`).

---

## Package and namespaces

```bash
dotnet add package TerraPDF --version 2.3.0
```

Targets `net8.0`, `net9.0`, and `net10.0`. Zero dependencies, no native
binaries, MIT licensed.

```csharp
using TerraPDF.Core;      // Document, descriptors, VectorCanvas, PathDescriptor,
                          // EncryptionOptions, PdfPermissions, ImageFit
using TerraPDF.Helpers;   // Color, FontFamily, PageSize, TextStyle, Unit
using TerraPDF.Infra;     // IContainer, IComponent, IDocument, IDocumentContainer
using TerraPDF.Barcodes;  // QrErrorCorrectionLevel (only if you draw QR codes)
```

---

## The shape of every document

Every TerraPDF document has the same skeleton. Start from this, then fill it in:

```csharp
using TerraPDF.Core;
using TerraPDF.Helpers;

Document.Create(doc =>
{
    doc.MetadataTitle("Quarterly Report");
    doc.MetadataAuthor("Acme Analytics");

    doc.Page(page =>
    {
        page.Size(PageSize.A4);
        page.Margin(2, Unit.Centimetre);
        page.DefaultTextStyle(style => style.FontSize(10));

        page.Header()
            .Text("Quarterly Report")
            .Bold().FontSize(18).FontColor(Color.Blue.Darken2);

        page.Content().PaddingVertical(12).Column(col =>
        {
            col.Spacing(8);
            col.Item().Text("Revenue grew 18% quarter over quarter.");
            col.Item().Table(table =>
            {
                table.ColumnsDefinition(c =>
                {
                    c.RelativeColumn(3);
                    c.RelativeColumn(1);
                });
                table.HeaderRow(row =>
                {
                    row.Cell().Text("Product").Bold();
                    row.Cell().Text("Revenue").Bold();
                });
                table.Row(row =>
                {
                    row.Cell().Text("Widgets");
                    row.Cell().Text("$482,000");
                });
            });
        });

        page.Footer().AlignCenter().Text(t =>
        {
            t.Span("Page ").FontSize(8);
            t.CurrentPageNumber().FontSize(8);
            t.Span(" of ").FontSize(8);
            t.TotalPages().FontSize(8);
        });
    });
}).PublishPdf("report.pdf");
```

The model in one line: **`Document` → `Page` → three slots (`Header`,
`Content`, `Footer`) → a container → decorators → one element.**

---

## Rules that prevent almost every failure

### 1. A container holds exactly one child

This is the single most common mistake. `IContainer` is a *single-child*
container: a second terminal call on the same container **replaces** the first,
silently. Only the last one is drawn.

```csharp
// WRONG — "Title" never appears; it is replaced by "Body"
page.Content().Text("Title");
page.Content().Text("Body");

// RIGHT — a Column holds many items
page.Content().Column(col =>
{
    col.Item().Text("Title").Bold();
    col.Item().Text("Body");
});
```

Use `Column` for vertical stacks, `Row` for horizontal, `Table` for grids.

### 2. `PublishPdf` is the only output call

There is no `Save`, `Generate`, `Render`, `Build`, or `Export`. Three overloads:

```csharp
Document.Create(...).PublishPdf("file.pdf");   // to a path
byte[] bytes = Document.Create(...).PublishPdf();  // to memory
Document.Create(...).PublishPdf(stream);       // to a stream
```

### 3. Decorators chain; elements terminate

Decorators (`Padding`, `Margin`, `Background`, `Border`, `AlignCenter`,
`ShowIf`, `Hyperlink`, …) return `IContainer`, so they chain. Elements (`Text`,
`Image`, `Canvas`, `Table`, `Column`, `Row`, `Barcode`, `QrCode`) end the chain.

```csharp
col.Item()
   .Background(Color.Grey.Lighten4)   // decorator
   .Border(1, Color.Grey.Lighten1)    // decorator
   .Padding(8)                        // decorator
   .AlignCenter()                     // decorator
   .Text("Boxed and centred")         // element — chain ends
   .Bold().FontSize(12);              // TextDescriptor styling, not decorators
```

`ShowIf(condition)` hides everything chained after it when the condition is
false. Before 2.3.0 it did not: the next element replaced the placeholder and
rendered anyway, so on older versions use a C# `if` around the item.

### 4. Colours are hex strings — and the palette is uneven

Every colour parameter is a `string` hex value. `Color` constants are just
named hex strings, so `"#1A3C5E"` works anywhere a `Color.*` does.

**Only `Red`, `Blue`, `Green`, and `Grey` have all ten shades.** Most families
have only `Medium` and `Darken2`. Using a shade that does not exist is a
compile error, and it is the second most common generated-code failure.

| Family | Available shades |
|--------|------------------|
| `Red`, `Blue`, `Green`, `Grey` | `Lighten5` `Lighten4` `Lighten3` `Lighten2` `Lighten1` `Medium` `Darken1` `Darken2` `Darken3` `Darken4` |
| `BlueGrey` | `Lighten5` `Lighten4` `Medium` `Darken2` `Darken4` |
| `Indigo`, `Brown` | `Lighten5` `Medium` `Darken2` |
| `Pink`, `Purple`, `DeepPurple`, `LightBlue`, `Cyan`, `Teal`, `LightGreen`, `Lime`, `Yellow`, `Amber`, `Orange`, `DeepOrange` | `Medium` `Darken2` **only** |
| (top level) | `Color.Black`, `Color.White`, `Color.Transparent` |

When in doubt, use a literal hex string.

### 5. The canvas has its own coordinate rules

- Origin is **top-left**, y increases **downward** — the same as page layout.
- `Text` is the one primitive anchored at its **baseline**, not its top-left.
- `PathDescriptor.Arc` / `Sector` take **centre + radii** (`cx, cy, rx, ry`).
- `FillPie` / `StrokePie` / `DrawPie` take a **bounding box** (`x, y, w, h`).
- Angles start at **3 o'clock** and increase **clockwise**. A pie chart that
  should start at twelve o'clock starts at `-90`.
- The draw callback runs **before layout**, so the canvas cannot tell you its
  width. Compute it yourself: page width minus margins, minus any padding.
- `Grid` is sized when the canvas is drawn, so it fills the laid-out width.
  Before 2.3.0 it drew nothing; on older versions draw grid lines with `Line`.
- **[2.3+]** `Link` and `InternalLink` are invisible: paint the button first,
  then place the link over it. `Dash` on a path affects only its stroke.

### 6. Standard fonts are Latin-only

The built-in standard-14 fonts (`Helvetica`, `Times`, `Courier`) cover
**WinAnsiEncoding** only. Cyrillic, Greek, Devanagari, CJK, `→`, `−`, and most
typographic symbols render as `?` unless you register a TrueType font:

```csharp
FontFamily.Register("Noto", "NotoSans-Regular.ttf");
FontFamily.Register("Noto", "NotoSans-Bold.ttf", bold: true);

col.Item().Text("Привет, धर्म").FontFamily("Noto");
```

Registered fonts are subsetted automatically — only the glyphs the document
draws are embedded.

### 7. Page sizes are tuples, not enums

```csharp
page.Size(PageSize.A4);                       // (595.28, 841.89)
page.Size(PageSize.Landscape(PageSize.A4));   // swapped
page.Size(210, 297, Unit.Millimetre);         // explicit
```

### 8. Encrypt once, before adding pages

```csharp
doc.Encrypt(new EncryptionOptions
{
    UserPassword  = "open-me",
    OwnerPassword = "full-access",
    Permissions   = PdfPermissions.Print | PdfPermissions.CopyText,
    // Algorithm defaults to EncryptionAlgorithm.Aes256
});
```

### 9. A table of contents needs headings

`doc.TableOfContents()` collects `H1()`–`H6()` headings only. Plain `Text()`
calls are never collected, and the TOC page is inserted where you call it.

### 10. Row and column items have distinct methods

```csharp
col.Item()                  // Column: one stacked item
row.RelativeItem(2)         // Row: proportional width (weight)
row.ConstantItem(120)       // Row: fixed width in points
row.AutoItem()              // Row: width of its content
```

---

## API reference

Verified against 2.3.0. Optional parameters show their defaults.

### Entry points

| Member | Signature |
|--------|-----------|
| `Document.Create` | `static DocumentComposer Create(Action<IDocumentContainer> compose)` |
| `Document.Create` | `static DocumentComposer Create(IDocument document)` |
| Output | `void PublishPdf(string path)` · `byte[] PublishPdf()` · `void PublishPdf(Stream stream)` |

### Document level (`IDocumentContainer` / `DocumentComposer`)

| Member | Signature |
|--------|-----------|
| Page | `void Page(Action<PageDescriptor> configure)` |
| TOC | `void TableOfContents(Action<PageDescriptor>? configure = null)` |
| Bookmark | `void Bookmark(string title, int pageNumber)` |
| Bookmark | `void Bookmark(string title, int pageNumber, double top)` |
| Bookmark | `void Bookmark(string title, int pageNumber, string parentTitle)` |
| Bookmark | `void Bookmark(string title, int pageNumber, string parentTitle, double top)` |
| Metadata | `MetadataTitle` · `MetadataAuthor` · `MetadataSubject` · `MetadataKeywords` · `MetadataCreator`, each `(string?)` |
| Encryption | `void Encrypt(EncryptionOptions options)` |

Bookmark page numbers are **1-based**.

### `PageDescriptor`

| Member | Signature |
|--------|-----------|
| Size | `Size((double Width, double Height) size)` · `Size(double widthPt, double heightPt)` · `Size(double width, double height, Unit unit)` |
| Margin | `Margin(double value)` · `Margin(double value, Unit unit)` · `Margin(double top, double right, double bottom, double left)` |
| Margin | `MarginVertical(double)` · `MarginHorizontal(double)` |
| Background | `PageColor(string hexColor)` |
| Text default | `DefaultTextStyle(Func<TextStyle, TextStyle> configure)` |
| Slots | `IContainer Header()` · `IContainer Content()` · `IContainer Footer()` |
| Header scope | `HeaderOnFirstPageOnly()` |

### Container decorators (`IContainer` extensions)

| Group | Members |
|-------|---------|
| Padding | `Padding(v)` · `Padding(v, Unit)` · `PaddingVertical` · `PaddingHorizontal` · `PaddingTop` · `PaddingBottom` · `PaddingLeft` · `PaddingRight` |
| Margin | `Margin(v)` · `Margin(v, Unit)` · `MarginVertical` · `MarginHorizontal` · `MarginTop` · `MarginBottom` · `MarginLeft` · `MarginRight` |
| Background | `Background(string hexColor)` |
| Border | `Border(double lineWidth, string hexColor)` · `Border(double lineWidth = 1)` · `BorderTop/Bottom/Left/Right(double lineWidth, string hexColor = "#000000")` |
| Rounded | `RoundedBorder(double radius = 8, double lineWidth = 1, string hexColor = "#000000")` · `RoundedBox(double radius = 8, string fillHexColor = "#FFFFFF", string borderHexColor = "#000000", double lineWidth = 1)` |
| Align | `AlignLeft()` · `AlignCenter()` · `AlignRight()` · `AlignMiddle()` · `AlignBottom()` |
| Rules | `LineHorizontal(double lineWidth = 1, string hexColor = "#000000")` · `LineVertical(...)` |
| Flow | `ShowIf(bool condition)` (see [rule 3](#section-3-decorators-chain-elements-terminate)) · `PageBreak()` |
| Links | `Hyperlink(string url)` · `InternalLink(int pageNumber, double? top = null)` · `Bookmark(string title, string? parentTitle = null)` |
| Compose | `Component(IComponent component)` |

### Container elements (chain terminators)

| Element | Signature |
|---------|-----------|
| Text | `TextDescriptor Text(string text)` · `TextDescriptor Text(Action<TextDescriptor> compose)` |
| Headings | `H1(string)` … `H6(string)`, each returning `TextDescriptor` |
| Layout | `Column(Action<ColumnDescriptor>)` · `Row(Action<RowDescriptor>)` · `Table(Action<TableDescriptor>)` |
| Image | `Image(string filePath)` · `Image(string filePath, double width)` · `Image(byte[])` · `Image(byte[], double width)` · `Image(Stream)` · `Image(Stream, double width)` |
| Canvas | `Canvas(double height, Action<VectorCanvas> draw)` |
| Barcode | `Barcode(string data, double? width = null, double height = 40, string hexColor = "#000000", string backgroundHexColor = "#FFFFFF", bool showCaption = false, double quietZoneModules = 10)` |
| QR | `QrCode(string data, double? size = null, QrErrorCorrectionLevel level = QrErrorCorrectionLevel.M, string hexColor = "#000000", string backgroundHexColor = "#FFFFFF", int quietZoneModules = 4)` |

### `ColumnDescriptor` / `RowDescriptor` / `TableDescriptor`

| Type | Members |
|------|---------|
| `ColumnDescriptor` | `Spacing(double)` · `Item()` · `PageBreak()` · `AlignItemsLeft/Center/Right()` |
| `RowDescriptor` | `Spacing(double)` · `AutoItem()` · `RelativeItem(double weight = 1)` · `ConstantItem(double widthPt)` |
| `TableDescriptor` | `ColumnsDefinition(Action<ColumnsDefinitionDescriptor>)` · `HeaderRow(Action<TableRowDescriptor>)` · `Row(Action<TableRowDescriptor>)` |
| `ColumnsDefinitionDescriptor` | `RelativeColumn(double weight = 1)` · `ConstantColumn(double widthPt)` |
| `TableRowDescriptor` | `IContainer Cell(int columnSpan = 1, int rowSpan = 1)` |

### `TextDescriptor` and `SpanDescriptor`

| Type | Members |
|------|---------|
| `TextDescriptor` | `FontSize(double)` · `FontColor(string)` · `FontFamily(string)` · `Bold()` · `SemiBold()` · `Italic()` · `Underline()` · `Strikethrough()` · `LineHeight(double)` · `AlignLeft/Center/Right()` · `Justify()` |
| `TextDescriptor` (composite) | `Span(string text, Func<TextStyle, TextStyle>? styleAction = null)` · `CurrentPageNumber()` · `TotalPages()` |
| `SpanDescriptor` | `Bold()` · `SemiBold()` · `Italic()` · `Underline()` · `Strikethrough()` · `FontSize(double)` · `FontColor(string)` · `FontFamily(string)` |
| `TextStyle` (immutable) | same setters, each returning a new instance; plus `NormalWeight()` · `NormalStyle()` · `NoUnderline()` · `NoStrikethrough()` |

### `VectorCanvas`

Every fill and stroke primitive takes a trailing `opacity` (default `1`).
Stroke methods that take `dashPattern` (alternating dash and gap lengths in
points, copied; `null` = solid) also take `dashPhase` (offset into the pattern).

| Method | Signature |
|--------|-----------|
| Line | `Line(double x1, double y1, double x2, double y2, string hexColor = "#000000", double lineWidth = 1, double opacity = 1, double[]? dashPattern = null, double dashPhase = 0)` |
| Rect | `FillRect(x, y, width, height, hexColor = "#000000", opacity = 1)` |
| Rect | `StrokeRect(x, y, width, height, hexColor = "#000000", lineWidth = 1, opacity = 1, double[]? dashPattern = null, dashPhase = 0)` |
| Rect | `DrawRect(x, y, width, height, fillHex = "#FFFFFF", strokeHex = "#000000", lineWidth = 1, opacity = 1, double[]? dashPattern = null, dashPhase = 0)` |
| Rounded | `FillRoundedRect(x, y, width, height, radius, hexColor = "#000000", opacity = 1)` |
| Rounded | `StrokeRoundedRect(x, y, width, height, radius, hexColor = "#000000", lineWidth = 1, opacity = 1, dashPattern = null, dashPhase = 0)`: dash **[2.3+]** |
| Rounded | `DrawRoundedRect(x, y, width, height, radius, fillHex = "#FFFFFF", strokeHex = "#000000", lineWidth = 1, opacity = 1, dashPattern = null, dashPhase = 0)`: dash **[2.3+]** |
| Circle | `FillCircle(cx, cy, radius, hexColor = "#000000", opacity = 1)` · `StrokeCircle(cx, cy, radius, hexColor = "#000000", lineWidth = 1, opacity = 1)` · `DrawCircle(cx, cy, radius, fillHex = "#FFFFFF", strokeHex = "#000000", lineWidth = 1, opacity = 1)`. No dash parameters: for a dashed circle use `StrokeEllipse(cx, cy, r, r, ...)` |
| Ellipse | `FillEllipse(cx, cy, rx, ry, hexColor = "#000000", opacity = 1)` |
| Ellipse | `StrokeEllipse(cx, cy, rx, ry, hexColor = "#000000", lineWidth = 1, opacity = 1, dashPattern = null, dashPhase = 0)`: dash **[2.3+]** |
| Ellipse | `DrawEllipse(cx, cy, rx, ry, fillHex = "#FFFFFF", strokeHex = "#000000", lineWidth = 1, opacity = 1, dashPattern = null, dashPhase = 0)`: dash **[2.3+]** |
| Pie | `FillPie(x, y, width, height, startAngle, sweepAngle, fillHex = "#000000", opacity = 1)` |
| Pie | `StrokePie(x, y, width, height, startAngle, sweepAngle, strokeHex = "#000000", lineWidth = 1, opacity = 1, dashPattern = null, dashPhase = 0)`: dash **[2.3+]** |
| Pie | `DrawPie(x, y, width, height, startAngle, sweepAngle, fillHex = "#FFFFFF", strokeHex = "#000000", lineWidth = 1, opacity = 1, dashPattern = null, dashPhase = 0)`: dash **[2.3+]** |
| Text | `Text(string text, double x, double y, string hexColor = "#000000", double fontSize = 12, string? fontFamily = null, bool bold = false, bool italic = false, double opacity = 1, double angle = 0)` |
| Measure | `static double MeasureTextWidth(string text, double fontSize, string? fontFamily = null, bool bold = false, bool italic = false)` |
| Image | `Image(byte[] imageData, double x, double y, double width, double height, ImageFit fit = ImageFit.Stretch)`, plus `string filePath` and `Stream` overloads |
| Image size | `static (double Width, double Height) GetImageSizeInPoints(byte[] imageData)` |
| Path | `Path(Action<PathDescriptor> configure)` |
| Grid | `Grid(double cellWidth, double? cellHeight = null, string hexColor = "#CCCCCC", double lineWidth = 0.5)` |
| Link **[2.3+]** | `Link(double x, double y, double width, double height, string url)` |
| Internal link **[2.3+]** | `InternalLink(double x, double y, double width, double height, int pageNumber, double? top = null)` |
| Bookmark **[2.3+]** | `Bookmark(string title, double y = 0, string? parentTitle = null)` |
| QR code **[2.3+]** | `QrCode(string data, double x, double y, double size, QrErrorCorrectionLevel level = QrErrorCorrectionLevel.M, string hexColor = "#000000", string? backgroundHex = null, int quietZoneModules = 4)` |

> `Grid` is sized at draw time to the canvas's laid-out width. **Before 2.3.0 it drew nothing.** On older versions, draw grid lines with `Line`.

Links, bookmarks, and QR codes **[2.3+]**:

- `Link` and `InternalLink` draw nothing. Paint the button or label first,
  then place the link over the same rectangle.
- `InternalLink`'s `pageNumber` is the 1-based physical page. Rendering throws
  `InvalidOperationException` if the document has fewer pages. `top` is the
  distance from the top of the target page; `null` fits the whole page.
- `Bookmark` targets the page the canvas is drawn on, at canvas-relative `y`
  (negative values clamp to 0). `parentTitle` nests it under an earlier
  bookmark with that title. A repeated (title, parent) pair is recorded once,
  so a canvas repeated on every page adds one entry.
- `QrCode`'s `size` includes the quiet zone. `backgroundHex = null` leaves the
  square transparent. Data too large for the level throws
  `NotSupportedException` at the `QrCode` call, not at render time. For a QR
  code in the layout flow, use `container.QrCode(...)` instead.

### `PathDescriptor`

`MoveTo(x, y)` · `LineTo(x, y)` · `CurveTo(cx1, cy1, cx2, cy2, x, y)` ·
`Close()` · `Rect(x, y, width, height)` · `Ellipse(cx, cy, rx, ry)` ·
`Circle(cx, cy, radius)` · `Arc(cx, cy, rx, ry, startAngle, sweepAngle)` ·
`Sector(cx, cy, rx, ry, startAngle, sweepAngle)` ·
`Polyline(params (double X, double Y)[])` · `Polygon(params (double X, double Y)[])` ·
`Fill(string hexColor)` · `Stroke(string hexColor, double lineWidth = 1)` ·
`UseEvenOddFill()` · `Opacity(double opacity)`

**[2.3+]**: `RoundedRect(x, y, width, height, radius)` ·
`FillLinearGradient(string fromHex, string toHex, double angle = 0)` ·
`FillRadialGradient(string centerHex, string edgeHex)` ·
`Dash(double[] pattern, double phase = 0)`

- `RoundedRect` clamps the radius to half the shorter side.
- Gradients are two-stop and span the path's bounding box. The linear
  `angle` is in degrees clockwise from left-to-right: 0 runs left to right, 90
  runs top to bottom. The radial gradient runs from `centerHex` at the centre
  to `edgeHex` at half the larger side. End colours extend past the axis.
- `Fill` and the gradient methods replace each other; the last call wins.
  `Stroke`, `UseEvenOddFill`, `Opacity`, and `Dash` still apply to a gradient.
- `Dash` affects only the stroke, so it needs `.Stroke(...)`.

### Enums and helpers

| Type | Values |
|------|--------|
| `Unit` | `Point` `Millimetre` `Centimetre` `Inch` |
| `ImageFit` | `Stretch` `Contain` `Cover` `CoverTopLeft` `CropTopLeft` |
| `EncryptionAlgorithm` | `Aes256` (default) `Aes128` |
| `PdfPermissions` | `None` `Print` `PrintLowResolution` `ModifyContents` `CopyText` `ModifyAnnotations` `FillForms` `ExtractForAccessibility` `AssembleDocument` `All` — combine with `\|` |
| `QrErrorCorrectionLevel` | `L` `M` (default) `Q` `H` |
| `PageSize` | `A0`–`A6` `Letter` `Legal` `Tabloid` `Executive` · `Landscape(size)` |
| `FontFamily` | `static void Register(string familyName, string fontFilePath, bool bold = false, bool italic = false)` — also `byte[]` and `Stream` overloads |

### Reusable pieces

```csharp
class InvoiceHeader : IComponent
{
    public void Compose(IContainer container) =>
        container.Background(Color.Blue.Darken2).Padding(10).Text("INVOICE");
}

class MyReport : IDocument
{
    public void Compose(IDocumentContainer container) =>
        container.Page(page => page.Content().Text("Hello"));
}

Document.Create(new MyReport()).PublishPdf("report.pdf");
```

---

## Mistakes that break generated code

| Wrong | Right | Why |
|-------|-------|-----|
| Two `.Text(...)` on one container | Wrap in `Column`, use `col.Item()` | A container holds one child; the second replaces the first |
| `.Save(path)` / `.Generate()` | `.PublishPdf(path)` | No other output method exists |
| `Color.Orange.Lighten3` | `Color.Orange.Medium` | Most families only have `Medium` and `Darken2` |
| `Color.FromHex("#FF0000")` | `"#FF0000"` | Colour parameters are plain strings |
| `page.Size(PageSize.A4.Landscape)` | `page.Size(PageSize.Landscape(PageSize.A4))` | `PageSize` members are tuples, not objects |
| `canvas.Text(...)` positioned by top-left | Pass the **baseline** y | `Text` is the one baseline-anchored primitive |
| `FillPie(cx, cy, rx, ry, ...)` | `FillPie(x, y, width, height, ...)` | Pies take a bounding box; only `Arc`/`Sector` take centre + radii |
| Cyrillic/Devanagari in a standard font | `FontFamily.Register(...)` then `.FontFamily("Name")` | Standard-14 fonts are WinAnsiEncoding only |
| `doc.Encrypt(...)` after `doc.Page(...)` | Call `Encrypt` first | Encryption must be configured before pages |
| `Text("Chapter 1")` expecting a TOC entry | `H1("Chapter 1")` | Only `H1`–`H6` are collected |
| `row.Item()` | `row.RelativeItem()` / `ConstantItem()` / `AutoItem()` | `Item()` exists on `ColumnDescriptor` only |
| `ShowIf(cond)` on TerraPDF 2.2.0 or earlier | `if (cond) col.Item().Text(...);` | Before 2.3.0, `ShowIf(false)` was overwritten by the chained element |
| `canvas.Grid(20)` on TerraPDF 2.2.0 or earlier | Draw lines with `Line(...)` | Before 2.3.0, `Grid` saw a zero-sized canvas and drew nothing |
| `canvas.StrokeCircle(..., dashPattern: ...)` | `canvas.StrokeEllipse(cx, cy, r, r, ..., dashPattern: ...)` | Circle methods have no dash parameters |
| `p.FillLinearGradient(...).Fill("#FFF")` expecting both | Keep one | `Fill` and gradients replace each other; the last call wins |

---

## Before you hand back the code

1. **It compiles.** `dotnet build` — most failures are a missing `using` or a colour shade that does not exist.
2. **It runs and writes a file.** Check the PDF is non-empty and opens.
3. **Nothing is silently dropped.** Every container has exactly one child; anything that should stack is inside a `Column`, `Row`, or `Table`.
4. **Non-Latin text has a registered font.** Search the content for anything outside Latin-1 and confirm a `FontFamily.Register` covers it.
5. **Nothing overflows.** Canvas drawings stay inside the declared height; a canvas does not paginate.
6. **Only real API members are used.** If it is not in the reference above, it does not exist — say so rather than guessing.

---

## Worked examples

Every sample below is a complete, runnable program, shown with its full source
and the PDF it produces. The full set is at [terrapdf.com/samples/](/samples/);
the most useful starting points for an agent:

- [Invoice](/samples/invoice/) — tables, totals, and a structured business document
- [Simple Report](/samples/simple-report/) — text, rules, tables, page numbers
- [Report with Table of Contents](/samples/report-with-toc/) — headings and TOC generation
- [Canvas Media Showcase](/samples/canvas-media-showcase/) — images, arcs, pies, dashes, rotated text
- [Custom Font Embedding](/samples/custom-font-showcase/) — full Unicode via registered fonts
- [Encryption & Security](/samples/encryption-showcase/) — passwords and permission flags
