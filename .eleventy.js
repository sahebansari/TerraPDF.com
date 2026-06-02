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

  // Markdown shortcode for inline markdown
  let markdownIt = require("markdown-it");
  let md = markdownIt();
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
