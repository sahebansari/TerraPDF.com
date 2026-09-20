const fs = require("fs");
const path = require("path");

const docsNav = require("./docsNav.json");
const site = require("./site.json");

const DOCS_DIR = path.join(__dirname, "..", "docs");
const SAMPLES_DIR = path.join(__dirname, "..", "samples");

// The agent-facing primer. It is a normal doc page (/docs/ai-agents/), and its
// body is also the opening section of /llms-full.txt, so the contract an agent
// reads is the same text a human reads — there is no second copy to drift.
const PRIMER_FILE = "ai-agents.md";

// Front matter is YAML-ish and hand-written here rather than pulled in as a
// dependency: these files only ever use `key: "value"` at the top level.
function splitFrontMatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return { data: {}, body: raw };

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = /^(\w+):\s*(.*)$/.exec(line);
    if (pair) data[pair[1]] = pair[2].replace(/^["']|["']$/g, "");
  }
  return { data, body: raw.slice(match[0].length).trimStart() };
}

// Agents fetch the .txt files without a base URL to resolve against, so every
// site-relative link has to become absolute on the way in.
function absolutiseLinks(markdown) {
  return markdown.replace(/\]\((\/[^)]*)\)/g, `](${site.url}$1)`);
}

function readDoc(fileName) {
  const raw = fs.readFileSync(path.join(DOCS_DIR, fileName), "utf8");
  const { data, body } = splitFrontMatter(raw);
  return {
    file: fileName,
    title: data.title || fileName.replace(/\.md$/, ""),
    description: data.description || "",
    url: data.permalink || "",
    body,
  };
}

module.exports = function () {
  const docFiles = fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith(".md"));
  const byUrl = new Map();
  for (const file of docFiles) {
    const doc = readDoc(file);
    if (doc.url) byUrl.set(doc.url, doc);
  }

  const primer = readDoc(PRIMER_FILE);

  // Reading order: Getting Started, then the sidebar's own Core Guides order,
  // then anything that exists on disk but isn't in the nav yet.
  const ordered = [];
  const seen = new Set([primer.url]);
  const push = (url) => {
    const doc = byUrl.get(url);
    if (doc && !seen.has(url)) {
      seen.add(url);
      ordered.push(doc);
    }
  };

  push("/docs/");
  for (const group of docsNav) {
    for (const item of group.items) push(item.url);
  }
  for (const doc of byUrl.values()) push(doc.url);

  const samples = fs
    .readdirSync(SAMPLES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(SAMPLES_DIR, f), "utf8");
      const { data } = splitFrontMatter(raw);
      return {
        title: (data.title || "").replace(/\s*-\s*TerraPDF Sample$/, ""),
        description: data.description || "",
        url: data.permalink || "",
      };
    })
    .filter((s) => s.url)
    .sort((a, b) => a.url.localeCompare(b.url));

  const guides = ordered.map((doc) => ({
    title: doc.title,
    description: doc.description,
    url: doc.url,
    body: absolutiseLinks(doc.body),
  }));

  return {
    primer: {
      title: primer.title,
      url: primer.url,
      body: absolutiseLinks(primer.body),
    },
    guides,
    samples,
    guideCount: guides.length,
    sampleCount: samples.length,
  };
};
