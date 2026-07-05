---
title: "Images"
description: "Embed PNG and JPEG images in TerraPDF PDFs from files, byte arrays, or streams, with transparency, deduplication, and automatic aspect ratio."
layout: base.njk
docPage: true
permalink: /docs/images/
---
# Images

TerraPDF supports **PNG** and **JPEG** image embedding — from a file path, a
`byte[]`, or a `Stream` — with automatic aspect-ratio preservation, PNG
transparency, and automatic deduplication of repeated images.

---

## Basic Usage

### Fill available width

The image scales to fill the full width of its container slot while keeping the
original aspect ratio. Height is calculated automatically.

```csharp
container.Image("path/to/photo.jpg");
container.Image("path/to/diagram.png");
```

### Fixed width

Constrains the image to a specific width in PDF points. Height is still computed
from the aspect ratio. Useful for logos and icons that should not fill the page.

```csharp
container.Image("logo.png", 120);      // 120 pt wide
container.Image("thumbnail.jpg", 60);
```

---

## Loading from Bytes or Streams

Images don't have to come from disk. `container.Image(byte[])` and
`container.Image(Stream)` overloads (each with an optional `width`) accept
image data from anywhere — embedded resources, a database blob, or bytes
downloaded at runtime. The format (PNG or JPEG) is detected from the data's
magic bytes, not a file extension.

```csharp
// From an embedded resource
using Stream logo = assembly.GetManifestResourceStream("MyApp.Assets.logo.png")!;
container.Image(logo, 120);   // caller owns and disposes the stream

// From bytes fetched at runtime
byte[] photoBytes = await httpClient.GetByteArrayAsync(photoUrl);
container.AlignCenter().Image(photoBytes, 200);

// From a database blob
byte[] avatarBytes = await db.GetAvatarBytesAsync(userId);
container.Image(avatarBytes);
```

Stream overloads read the stream to the end and do not dispose it — the
caller remains responsible for disposal.

---

## Positioning Fixed-Width Images

Because `Image()` returns `IContainer`, wrap it with an alignment decorator to
control horizontal position:

```csharp
// Centred logo
container.AlignCenter().Image("logo.png", 150);

// Right-aligned stamp
container.AlignRight().Image("stamp.png", 80);

// Left-aligned (default, no wrapper needed)
container.Image("icon.png", 32);
```

---

## Combining with Other Decorators

Images participate in the full decorator chain:

```csharp
// Logo inside a padded, bordered box
container
    .Border(1, Color.Grey.Lighten2)
    .Padding(8)
    .AlignCenter()
    .Image("logo.png", 100);

// Full-width banner with a bottom accent bar
page.Header().Column(col =>
{
    col.Item().Image("banner.jpg");
    col.Item().Background(Color.Blue.Darken2).Padding(3);
});
```

---

## Supported Formats

| Format | Extensions | Detected via |
|--------|------------|--------------|
| PNG | `.png` | Magic bytes (`byte[]`/`Stream`) or extension (file path) |
| JPEG | `.jpg`, `.jpeg` | Magic bytes (`byte[]`/`Stream`) or extension (file path) |

> Files are read from the file-system path supplied at render time.
> Use `AppContext.BaseDirectory` to resolve paths relative to the executable:
> ```csharp
> string logo = Path.Combine(AppContext.BaseDirectory, "logo.png");
> container.Image(logo, 120);
> ```

---

## Transparency

PNG images with an alpha channel (RGBA) keep their transparency — the alpha
data is embedded as a PDF `/SMask` soft mask, so the image composites
correctly over whatever content sits behind it. Fully opaque PNGs skip the
mask entirely, keeping file size down.

> **Limitation:** indexed-transparency PNGs (palette-based images using a
> `tRNS` chunk instead of a full alpha channel) are not currently supported
> and will render fully opaque. Re-save the source as RGBA if you need
> transparency preserved.

---

## Deduplication

If the same image bytes are used multiple times in a document — a repeated
logo in a header, footer, or across many pages — TerraPDF embeds the image
data once and shares it document-wide, instead of duplicating the bytes for
every occurrence. This keeps output files small for documents like
multi-page reports or catalogues with a repeating brand mark.

---

## Checking File Existence

When the image file may not be present (e.g. optional branding), guard with a
file check and provide a text fallback:

```csharp
if (File.Exists(logoPath))
    container.Image(logoPath, 100);
else
    container.Text("CompanyName").Bold().FontSize(18);
```
