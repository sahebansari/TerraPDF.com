---
title: Table Spans & Pagination Showcase - TerraPDF Sample
description: Span table cells across columns and rows with TerraPDF, and see how tables split across pages without ever cutting a row span in half.
layout: sample.njk
permalink: /samples/table-spans-showcase/
---

# Table Spans & Pagination Showcase Sample

## Overview

The Table Spans & Pagination Showcase sample demonstrates:
- **`Cell(columnSpan:)`** — a cell covering several columns, with the cursor moving past it
- **`Cell(rowSpan:)`** — a cell holding its column in the rows below
- **Both together** — a block spanning a rectangle of the grid
- **Two-pass row measurement** — a spanned cell grows the rows it covers rather than overflowing
- **Header-less pagination** — a table with no `HeaderRow` splitting across pages
- **Content-slot pagination** — a table placed straight into `page.Content()` with no `Column` wrapper
- **Unbreakable spans** — a page break falling above or below a row span, never through it

Every one of these was a defect fixed in **v2.0.1**. Before that release each produced a
perfectly valid PDF with visibly wrong geometry — cells drawn on top of one another, or rows
running off the bottom of the page.

## Key Features Demonstrated

### 1. Column Span

A cell is placed in the first column no earlier cell already covers, so a span moves the
cursor past everything it covers. You write one `Cell` call per cell the row actually
contains — never a placeholder for a column a span already fills.

```csharp
t.Row(r =>
{
    r.Cell(columnSpan: 2).Background("#DCE7F5").Padding(6)
     .Text("columnSpan: 2 — covers columns 1 and 2");
    r.Cell().Padding(6).Text("column 3");   // lands in column 3, not column 2
});
```

### 2. Row Span

```csharp
t.Row(r =>
{
    r.Cell(rowSpan: 3).Padding(6).Text("covers all three rows below");
    r.Cell().Padding(6).Text("row 1, column 2");
    r.Cell().Padding(6).Text("row 1, column 3");
});
t.Row(r =>
{
    // starts at column 2 — column 1 is still held by the span above
    r.Cell().Padding(6).Text("row 2, column 2");
    r.Cell().Padding(6).Text("row 2, column 3");
});
```

### 3. Both Together

```csharp
t.Row(r =>
{
    r.Cell(columnSpan: 2, rowSpan: 2).Padding(6).Text("columnSpan: 2\nrowSpan: 2");
    r.Cell().Padding(6).Text("row 1, column 3");
});
t.Row(r => r.Cell().Padding(6).Text("row 2, column 3"));
```

### 4. A Spanned Cell Grows the Rows It Covers

Row heights are measured in two passes. When a spanned cell needs more room than the rows it
covers currently give it, the shortfall is shared across them rather than letting the content
overflow the table.

```csharp
t.ColumnsDefinition(d => { d.RelativeColumn(2); d.RelativeColumn(1); });
t.Row(r =>
{
    r.Cell(rowSpan: 2).Padding(6).Text(
        "This spanned cell carries far more text than the two short cells beside it. " +
        "Both covered rows grow so the whole paragraph stays inside the cell, and " +
        "nothing spills past the bottom border.");
    r.Cell().Padding(6).Text("short");
});
t.Row(r => r.Cell().Padding(6).Text("short"));
```

### 5. Header-less Table with Row Spans Across Pages

The ledger on pages 3-5 has no header row and is far taller than one page, so it splits
between rows. Each account occupies two rows joined by a `rowSpan`, and those pairs are never
divided by a page break — the split falls above or below a pair, never through it.

```csharp
for (int i = 1; i <= 26; i++)
{
    int n = i;
    t.Row(r =>
    {
        r.Cell(rowSpan: 2).Background("#DCE7F5").Padding(6)
         .Text($"AC-{n:0000}\nGranted {2024 + (n % 3)}").Bold();
        r.Cell().Padding(6).Text($"Opening balance, account {n}");
        r.Cell().Padding(6).AlignRight().Text($"{n * 1250.00m:N2}");
    });
    t.Row(r =>
    {
        r.Cell().Padding(6).Text($"Adjustment posted for account {n}");
        r.Cell().Padding(6).AlignRight().Text($"{n * -184.25m:N2}");
    });
}
```

### 6. A Table Straight in the Content Slot

No `Column` wrapper — the table is the content slot's only child. It is taller than the page
and still paginates, repeating its grouped two-column header on every page:

```csharp
page.Content().PaddingTop(16).Table(t =>
{
    t.ColumnsDefinition(d =>
    {
        d.RelativeColumn(3); d.RelativeColumn(2); d.ConstantColumn(90);
    });

    t.HeaderRow(r =>
    {
        r.Cell(columnSpan: 2).Background("#243B53").Padding(6)
         .Text("Quarterly detail — grouped header spans two columns").Bold();
        r.Cell().Background("#243B53").Padding(6).AlignRight().Text("Total").Bold();
    });

    for (int i = 1; i <= 34; i++) { /* … 34 data rows … */ }
});
```

## API Summary

| Method | Purpose |
|--------|---------|
| `Cell(columnSpan = 1, rowSpan = 1)` | Next free cell slot — the first column no earlier cell covers |
| `HeaderRow(Action<TableRowDescriptor>)` | Header row, repeated at the top of every continuation page |
| `Row(Action<TableRowDescriptor>)` | Data row; runs joined by a row span are never split across pages |

Spans below `1` are treated as `1`. See the [Layout guide](/docs/layout/#spanning-columns-and-rows)
for the full reference.

> **Note:** Keep header rows self-contained. A row span that starts in a *header* row and
> reaches into data rows renders correctly on the first page, but is truncated to the header
> rows on every continuation page. Row spans that start in a data row are unaffected.

## Use Cases

Perfect for:
- **Financial ledgers** — an account code spanning its opening balance and adjustment rows
- **Grouped report headers** — one caption over several related columns
- **Invoices and statements** — a totals block spanning the description columns
- **Comparison matrices** — category labels spanning a run of rows
- **Long data tables** — anything tall enough to need paginating without losing its structure

## What You'll Learn

1. **Cell placement** — how the cursor skips columns a span already covers
2. **Column spans** — grouped headers and full-width banner rows
3. **Row spans** — grouping several rows under one label
4. **Two-pass measurement** — how a tall spanned cell grows the rows beneath it
5. **Pagination rules** — header-less tables, content-slot tables, and repeated headers
6. **Break grouping** — why a page break never lands inside a row span

## File Output

Generates: `16_table_spans_showcase.pdf`

A seven-page document: pages 1-2 demonstrate the span API next to the code that produced it,
pages 3-5 are a header-less ledger split across three pages with its row spans intact, and
pages 6-7 are a content-slot table paginating with its grouped header repeated.
