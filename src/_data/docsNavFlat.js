const docsNav = require("./docsNav.json");

// Flattens the grouped sidebar nav into a single ordered list with
// precomputed prev/next links, so the layout can look up "current" by
// URL with a plain set-in-a-loop (Nunjucks has no writable namespace
// object like Jinja2, so this can't be computed inline in the template).
//
// /docs/ (Getting Started) is the documentation home and isn't a group
// in docsNav.json — it's the dedicated "Documentation Home" sidebar
// link instead — but it still needs to lead into the first guide, so
// it's prepended here as the head of the chain.
module.exports = function () {
  const flat = [{ url: "/docs/", title: "Getting Started" }];
  docsNav.forEach((group) => {
    group.items.forEach((item) => {
      flat.push({ url: item.url, title: item.title });
    });
  });

  return flat.map((item, index) => ({
    ...item,
    prev: index > 0 ? flat[index - 1] : null,
    next: index < flat.length - 1 ? flat[index + 1] : null,
  }));
};
