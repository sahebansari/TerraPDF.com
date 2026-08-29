const fs = require("fs");
const path = require("path");

module.exports = function(eleventyConfig) {
  // Passthrough copy for static assets
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("samples");
  eleventyConfig.addPassthroughCopy("sample-codes");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy({"robots.txt": "robots.txt"});
  eleventyConfig.addPassthroughCopy("LICENSE");

  // Markdown tables: emit <th scope="col"> for accessibility (WCAG H63).
  // markdown-it only produces <th> from the header row, so "col" is always correct.
  function addThScope(md) {
    md.renderer.rules.th_open = function(tokens, idx, options, env, self) {
      tokens[idx].attrSet("scope", "col");
      return self.renderToken(tokens, idx, options);
    };
    return md;
  }

  // Markdown headings: assign a GitHub-style slug id to every heading, so
  // in-page anchors (TOCs, "see X below" cross-references) have something
  // to point at. markdown-it doesn't do this itself.
  function addHeadingIds(md) {
    const seenByTokens = new WeakMap();

    function slugify(text) {
      return String(text)
        .toLowerCase()
        .replace(/`/g, "")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/[\s_]+/g, "-")
        .replace(/-+/g, "-");
    }

    md.renderer.rules.heading_open = function(tokens, idx, options, env, self) {
      const inlineToken = tokens[idx + 1];
      const text = inlineToken && inlineToken.type === "inline" ? inlineToken.content : "";
      let slug = slugify(text) || "section";
      // IDs must begin with a letter (headings like "[1.5.1] - 2026-07-10"
      // or "1. Create an account" would otherwise slugify to a leading digit).
      if (!/^[a-z]/.test(slug)) {
        slug = "section-" + slug;
      }

      let seen = seenByTokens.get(tokens);
      if (!seen) {
        seen = new Map();
        seenByTokens.set(tokens, seen);
      }
      const count = seen.get(slug) || 0;
      seen.set(slug, count + 1);
      if (count > 0) slug = `${slug}-${count + 1}`;

      tokens[idx].attrSet("id", slug);
      return self.renderToken(tokens, idx, options);
    };
    return md;
  }

  function configureMarkdown(md) {
    return addHeadingIds(addThScope(md));
  }
  eleventyConfig.amendLibrary("md", configureMarkdown);

  // Markdown shortcode for inline markdown
  let markdownIt = require("markdown-it");
  let md = configureMarkdown(markdownIt());
  eleventyConfig.addShortcode("markdown", function(content) {
    return md.render(content);
  });

  function sampleCode(sourceUrl) {
    if (!sourceUrl) {
      return "// No sample source file configured for this page.";
    }

    const relativePath = String(sourceUrl).replace(/^\/+/, "");
    const resolvedPath = path.resolve(__dirname, relativePath);
    const sampleRoot = path.resolve(__dirname, "sample-codes");

    if (!resolvedPath.startsWith(sampleRoot + path.sep)) {
      return `// Invalid sample source path: ${sourceUrl}`;
    }

    try {
      return fs.readFileSync(resolvedPath, "utf8");
    } catch (err) {
      return `// Unable to load sample source code from ${sourceUrl}.`;
    }
  }

  eleventyConfig.addShortcode("sampleCode", sampleCode);
  eleventyConfig.addNunjucksGlobal("sampleCode", sampleCode);

  // Wrap every <pre><code> block in the same editor-window chrome as the
  // homepage showcase panel (titlebar with dots + language label).
  // Skipped: the showcase panel itself (has its own titlebar) and the
  // sample-code modal (its <pre> is sized by the dialog's flex layout).
  const codeWindowLabels = {
    csharp: "C#", cs: "C#", bash: "Terminal", sh: "Terminal", shell: "Terminal",
    console: "Terminal", powershell: "PowerShell", ps1: "PowerShell",
    xml: "XML", html: "HTML", css: "CSS", js: "JavaScript", javascript: "JavaScript",
    json: "JSON", yaml: "YAML", yml: "YAML", text: "Code", plaintext: "Code"
  };

  eleventyConfig.addTransform("codeWindows", function (content) {
    if (!this.page.outputPath || !this.page.outputPath.endsWith(".html")) {
      return content;
    }

    return content.replace(/<pre\b([^>]*)>[\s\S]*?<\/pre>/g, function (block, preAttrs) {
      if (/showcase-pre|sample-code-output/.test(preAttrs)) {
        return block;
      }

      const langMatch = block.match(/<code[^>]*\blanguage-([\w#+-]+)/);
      const lang = langMatch ? langMatch[1].toLowerCase() : null;
      const label = (lang && codeWindowLabels[lang]) ||
        (lang ? lang.charAt(0).toUpperCase() + lang.slice(1) : "Code");

      return '<div class="code-window">'
        + '<div class="code-titlebar">'
        + '<span class="dots" aria-hidden="true"><span></span><span></span><span></span></span>'
        + '<span class="code-titlebar-label">' + label + '</span>'
        + '</div>'
        + block
        + '</div>';
    });
  });

  // Build year for the footer copyright (evaluated at build time)
  eleventyConfig.addNunjucksGlobal("buildYear", new Date().getFullYear());

  // Custom filter for startsWith
  eleventyConfig.addNunjucksFilter("startsWith", function(str, prefix) {
    return String(str).startsWith(prefix);
  });

  eleventyConfig.addNunjucksFilter("htmlDateString", function(dateObj) {
    return new Date(dateObj).toISOString().slice(0, 10);
  });

  // Custom filter for active top-level navigation sections
  eleventyConfig.addNunjucksFilter("isActiveNav", function(currentUrl, navUrl) {
    currentUrl = String(currentUrl || "");
    navUrl = String(navUrl || "");

    if (navUrl === "/") {
      return currentUrl === "/";
    }

    return currentUrl === navUrl || currentUrl.startsWith(navUrl);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
