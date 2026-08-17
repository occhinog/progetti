import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");
const failures = [];
const htmlFiles = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".html")) htmlFiles.push(full);
  }
}

function fail(file, message) {
  failures.push(`${path.relative(root, file)}: ${message}`);
}

function resolveLocal(url) {
  const clean = url.split("#")[0].split("?")[0];
  if (!clean) return null;
  let destination = path.join(root, clean.replace(/^\//, ""));
  if (clean.endsWith("/")) destination = path.join(destination, "index.html");
  return destination;
}

walk(root);

const optionBPages = new Set([
  "index.html",
  "academy/index.html",
  "aziende/index.html",
  "pro-bono/index.html",
  "attivita/index.html",
  "contatti/index.html",
  "guides/index.html",
  "guides/codex-cli-server/index.html",
]);

const expectedCanonicals = new Map([
  ["index.html", "https://businessai.academy/"],
  ["academy/index.html", "https://businessai.academy/academy/"],
  ["aziende/index.html", "https://businessai.academy/aziende/"],
  ["pro-bono/index.html", "https://businessai.academy/pro-bono/"],
  ["attivita/index.html", "https://businessai.academy/attivita/"],
  ["contatti/index.html", "https://businessai.academy/contatti/"],
  ["guides/index.html", "https://guides.businessai.academy/"],
  ["guides/codex-cli-server/index.html", "https://guides.businessai.academy/codex-cli-server/"],
  ["guides/second-brain/index.html", "https://guides.businessai.academy/second-brain/"],
  ["guides/mcp/index.html", "https://guides.businessai.academy/mcp/"],
  ["guides/automazioni/index.html", "https://guides.businessai.academy/automazioni/"],
  ["jul26/index.html", "https://jul26.businessai.academy/"],
  ["jul26/deck/index.html", "https://jul26.businessai.academy/deck/"],
  ["sep26/index.html", "https://sep26.businessai.academy/"],
]);

for (const file of htmlFiles) {
  const source = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file).split(path.sep).join("/");
  if (!/<html\s+lang="it"/i.test(source)) fail(file, "missing Italian language declaration");
  if (!/<title>[^<]+<\/title>/i.test(source)) fail(file, "missing title");
  if (!/<meta\s+name="description"\s+content="[^"]+"/i.test(source)) fail(file, "missing meta description");
  if (!/<main(?:\s|>)/i.test(source)) fail(file, "missing main landmark");
  const h1Count = [...source.matchAll(/<h1(?:\s|>)/gi)].length;
  if (h1Count !== 1) fail(file, `expected exactly one h1, found ${h1Count}`);
  const skipTarget = source.match(/class="skip-link"\s+href="#([^"]+)"/i)?.[1];
  if (!skipTarget) fail(file, "missing skip link");
  else if (!new RegExp(`\\sid=["']${skipTarget}["']`).test(source)) fail(file, `missing skip-link target #${skipTarget}`);
  if (/&(?!amp;|lt;|gt;|quot;|#\d+;|#x[0-9a-f]+;)/i.test(source)) fail(file, "contains an unescaped ampersand");
  for (const icon of ["favicon-16.png", "favicon-32.png", "apple-touch-icon.png"]) {
    if (!source.includes(icon)) fail(file, `missing ${icon} declaration`);
  }
  const expectedStylesheet = optionBPages.has(relative) ? "/assets/css/option-b.css?v=2" : "/assets/css/styles.css?v=3";
  if (!source.includes(expectedStylesheet)) fail(file, `missing current stylesheet ${expectedStylesheet}`);

  if (path.basename(file) !== "404.html") {
    if (!/<link\s+rel="canonical"\s+href="https:\/\/[^"]+"/i.test(source)) fail(file, "missing canonical URL");
    for (const property of ["og:title", "og:description", "og:url"]) {
      if (!new RegExp(`<meta\\s+property=["']${property}["']\\s+content=["'][^"']+["']`, "i").test(source)) fail(file, `missing ${property}`);
    }
    for (const name of ["twitter:title", "twitter:description"]) {
      if (!new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["'][^"']+["']`, "i").test(source)) fail(file, `missing ${name}`);
    }

    const expectedCanonical = expectedCanonicals.get(relative);
    if (expectedCanonical) {
      const canonical = source.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
      const ogUrl = source.match(/<meta\s+property="og:url"\s+content="([^"]+)"/i)?.[1];
      if (canonical !== expectedCanonical) fail(file, `canonical must be ${expectedCanonical}`);
      if (ogUrl !== expectedCanonical) fail(file, `og:url must be ${expectedCanonical}`);
    }
  }

  if (/guides\/(second-brain|mcp|automazioni)\/index\.html$/.test(file) && /property="og:image"/i.test(source)) {
    fail(file, "guide detail must not inherit the site-wide social image");
  }

  if (file.includes(`${path.sep}guides${path.sep}`)) {
    const productionGuideLinks = [...source.matchAll(/<a\b[^>]*>/gi)]
      .map((match) => match[0].match(/\shref="([^"]+)"/i)?.[1])
      .filter(Boolean);
    if (productionGuideLinks.some((href) => /^\/guides(?:\/|#|$)/i.test(href))) fail(file, "production Guide link incorrectly retains local /guides prefix");
    if (!source.includes("https://guides.businessai.academy/")) fail(file, "missing canonical Guides host link");
  }

  const ids = [...source.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  for (const id of new Set(duplicates)) fail(file, `duplicate id #${id}`);

  for (const match of source.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\salt="[^"]*"/i.test(match[0])) fail(file, `image without alt: ${match[0].slice(0, 90)}`);
  }

  for (const match of source.matchAll(/<a\b[^>]*target="_blank"[^>]*>/gi)) {
    if (!/\srel="[^"]*noopener[^"]*"/i.test(match[0])) fail(file, `target=_blank without noopener: ${match[0].slice(0, 110)}`);
  }

  const refs = [
    ...source.matchAll(/\s(?:href|src)="([^"]+)"/gi),
    ...source.matchAll(/\sdata-local-href="([^"]+)"/gi),
  ].map((match) => match[1]);

  for (const ref of refs) {
    if (!ref.startsWith("/") || ref.startsWith("//")) continue;
    const destination = resolveLocal(ref);
    if (destination && !fs.existsSync(destination)) fail(file, `missing local target ${ref}`);

    const fragment = ref.includes("#") ? ref.split("#")[1] : "";
    if (fragment && destination && fs.existsSync(destination)) {
      const targetSource = fs.readFileSync(destination, "utf8");
      if (!new RegExp(`\\sid=["']${fragment}["']`).test(targetSource)) fail(file, `missing anchor ${ref}`);
    }
  }

  for (const match of source.matchAll(/<a\b[^>]*href="([^"]+)"/gi)) {
    const href = match[1];
    if (/\/(?:api|survey|feedback|dona)(?:\/|\.|$)/i.test(href)) fail(file, `obsolete operational link ${href}`);
  }

  if (source.includes("version https://git-lfs.github.com/spec/v1")) fail(file, "contains a Git LFS pointer");
}

const required = [
  "index.html",
  "academy/index.html",
  "aziende/index.html",
  "pro-bono/index.html",
  "attivita/index.html",
  "contatti/index.html",
  "guides/index.html",
  "guides/codex-cli-server/index.html",
  "guides/second-brain/index.html",
  "guides/mcp/index.html",
  "guides/automazioni/index.html",
  "jul26/index.html",
  "jul26/deck/index.html",
  "sep26/index.html",
  "assets/css/styles.css",
  "assets/css/option-b.css",
  "assets/js/site.js",
  "favicon-16.png",
  "favicon-32.png",
  "apple-touch-icon.png",
  "README.md",
];

for (const item of required) {
  if (!fs.existsSync(path.join(root, item))) failures.push(`missing required file: ${item}`);
}

if (failures.length) {
  console.error(`Validation failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML files with no structural or local-link errors.`);
