const fs = require("fs");
const path = require("path");

module.exports = function(eleventyConfig) {
  // Passthrough copy for static assets
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("fonts");
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
  eleventyConfig.amendLibrary("md", addThScope);

  // Markdown shortcode for inline markdown
  let markdownIt = require("markdown-it");
  let md = addThScope(markdownIt());
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
