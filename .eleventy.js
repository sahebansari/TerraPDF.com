module.exports = function(eleventyConfig) {
  // Passthrough copy for static assets
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("samples");
  eleventyConfig.addPassthroughCopy("sample-codes");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy({"robots.txt": "robots.txt"});
  eleventyConfig.addPassthroughCopy({"sitemap.xml": "sitemap.xml"});
  eleventyConfig.addPassthroughCopy("LICENSE");

  // Markdown shortcode for inline markdown
  let markdownIt = require("markdown-it");
  let md = markdownIt();
  eleventyConfig.addShortcode("markdown", function(content) {
    return md.render(content);
  });

  // Custom filter for startsWith
  eleventyConfig.addNunjucksFilter("startsWith", function(str, prefix) {
    return String(str).startsWith(prefix);
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
