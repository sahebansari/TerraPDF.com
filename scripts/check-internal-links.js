/**
 * Internal link checker for the built site.
 *
 * Scans every HTML file in _site and verifies that all root-relative
 * href/src targets resolve to a file (or a directory with index.html)
 * inside _site. External URLs are checked separately by the weekly
 * external-links workflow. Exits non-zero if any link is broken.
 *
 * Usage: node scripts/check-internal-links.js
 */
const fs = require("fs");
const path = require("path");

const root = "_site";
const pages = [];

(function walk(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const p = path.join(dir, entry);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (entry.endsWith(".html")) {
      pages.push(p);
    }
  }
})(root);

let broken = 0;
let checked = 0;

for (const page of pages) {
  const html = fs.readFileSync(page, "utf8");
  for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const target = decodeURIComponent(match[1]);
    checked++;
    const fsPath = path.join(root, target);
    const ok =
      fs.existsSync(fsPath) &&
      (fs.statSync(fsPath).isFile() ||
        fs.existsSync(path.join(fsPath, "index.html")));
    if (!ok) {
      broken++;
      console.error(`BROKEN in ${page}: ${target}`);
    }
  }
}

console.log(`Internal links checked: ${checked}, broken: ${broken}`);
process.exit(broken ? 1 : 0);
