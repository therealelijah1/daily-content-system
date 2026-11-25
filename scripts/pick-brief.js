#!/usr/bin/env node
// Prints today's format and a random unused brief from prompts/briefs.md.
// Usage: node scripts/pick-brief.js

const fs = require("fs");
const path = require("path");

const ROTATION = {
  1: "Websites",
  2: "Landing pages",
  3: "Apps",
  4: "Logos",
  5: "Graphics",
};

function parseBriefs(markdown) {
  const sections = {};
  let current = null;
  for (const line of markdown.split("\n")) {
    const heading = line.match(/^##\s+(.+)/);
    if (heading) {
      current = heading[1].trim();
      sections[current] = [];
      continue;
    }
    const item = line.match(/^\d+\.\s+(.+)/);
    if (item && current) sections[current].push(item[1].trim());
  }
  return sections;
}

function pick(date = new Date(), random = Math.random) {
  const day = date.getDay();
  const format = ROTATION[day];
  if (!format) return { format: "Rest day", brief: null };
  const file = path.join(__dirname, "..", "prompts", "briefs.md");
  const briefs = parseBriefs(fs.readFileSync(file, "utf8"))[format] || [];
  const brief = briefs.length ? briefs[Math.floor(random() * briefs.length)] : null;
  return { format, brief };
}

if (require.main === module) {
  const { format, brief } = pick();
  console.log(`Format: ${format}`);
  if (brief) console.log(`Brief:  ${brief}`);
}

module.exports = { parseBriefs, pick };
