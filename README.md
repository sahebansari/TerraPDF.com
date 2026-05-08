# TerraPDF.com

Official website for TerraPDF — a lightweight, zero-dependency, pure C# library for generating professional PDF 1.7 documents.

Built with [Eleventy (11ty)](https://www.11ty.dev/) and modern, SEO-optimized design.

## Features

- **Modern UI/UX** — Clean, professional design with responsive layout
- **SEO Optimized** — Meta tags, Open Graph, Twitter cards, and JSON-LD structured data
- **Syntax Highlighting** — Code examples with Highlight.js
- **Mobile-First** — Fully responsive navigation and layout
- **Automated Deployment** — GitHub Actions workflow for continuous deployment to GitHub Pages

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm

### Install Dependencies

```bash
npm ci
```

### Development Server

```bash
npm run serve
```

This starts a local development server at `http://localhost:8080` with live reload.

### Build for Production

```bash
npm run build
```

Generates static files in the `_site/` directory.

### Debug Build

```bash
npm run debug
```

Enables verbose debugging output from Eleventy.

## Project Structure

```
├── _includes/       # Partial templates (header, footer, meta tags)
├── _layouts/        # Page layouts (base.njk with SEO, navigation)
├── src/             # Content pages (index, features, docs, download, etc.)
├── css/             # Stylesheets with CSS custom properties
├── js/              # JavaScript for interactivity
├── images/          # Image assets
├── .eleventy.js     # Eleventy configuration (passthrough copies, markdown-it)
├── .github/
│   └── workflows/
│       └── static.yml   # GitHub Actions deployment workflow
├── package.json     # Project dependencies
└── README.md        # This file
```

## Template Engine

Uses **Nunjucks** (`.njk`) templates with full Markdown support via `markdown-it`.

### Shortcodes

- `{% markdown %}...{% endmarkdown %}` — Renders inline Markdown content

## SEO & Meta Tags

The `base.njk` layout includes:

- Canonical URLs
- Open Graph (Facebook/LinkedIn) meta tags
- Twitter Card meta tags
- Robots meta directives
- JSON-LD structured data for search engines
- Favicon with SVG data URI

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the `main` branch via the `.github/workflows/static.yml` workflow.

### Manual Deployment

1. Push to `main` branch — GitHub Actions handles the rest
2. Site is published to `https://<username>.github.io/TerraPDF.com`

Or disable Jekyll and push manually:

```bash
npm run build
touch _site/.nojekyll
git push origin main
```

## Browser Support

Modern browsers (Chrome, Firefox, Safari, Edge). Uses CSS custom properties and modern JavaScript features.

## License

MIT License — Free for commercial and personal use.
