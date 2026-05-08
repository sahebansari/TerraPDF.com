# TerraPDF.com

TerraPDF.com website built with [Eleventy](https://www.11ty.dev/), a simple static site generator.

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run serve
```

This starts a local development server at http://localhost:8080 with live reload.

### Build for Production

```bash
npm run build
```

This generates static files in the `_site/` directory.

## Project Structure

```
├── _includes/       # Partial templates (header, footer, etc.)
├── _layouts/        # Page layouts
├── src/             # Content pages and templates
├── css/             # Stylesheets
├── js/              # JavaScript files
├── images/          # Image assets
├── .eleventy.js     # Eleventy configuration
└── package.json     # Project dependencies
```

## Template Engine

Uses Nunjucks (`.njk`) templates with Markdown support.

## License

MIT
