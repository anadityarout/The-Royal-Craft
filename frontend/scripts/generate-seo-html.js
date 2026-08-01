/**
 * generate-seo-html.js
 *
 * Run this AFTER `vite build`.
 * It reads dist/index.html as a template, fetches your SEO API,
 * and writes a real index.html per page/route with the correct
 * <title>, <meta description>, <meta keywords>, and <link canonical>
 * already baked into the raw HTML (so view-source / crawlers see them).
 *
 * Usage:
 *   node scripts/generate-seo-html.js
 *
 * Then upload the whole dist/ folder to S3 as usual.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SEO_API =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/seo";

// scripts/ is one level inside the project, dist/ is at project root
const DIST_DIR = path.join(__dirname, "..", "dist");
const TEMPLATE_PATH = path.join(DIST_DIR, "index.html");

// Map each SEO API "page" value to the URL path it should live at.
// "" means site root (dist/index.html itself).
const PAGE_ROUTE_MAP = {
  Home: "",
  Project: "project",
  Product: "product",
  Shop: "shop",
  Service: "service",
  Blog: "blog",
  Gallery: "gallery",
  About: "about",
  Contact: "contact",
};

async function main() {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(`Could not find ${TEMPLATE_PATH}. Run "vite build" first.`);
    process.exit(1);
  }

  const template = fs.readFileSync(TEMPLATE_PATH, "utf-8");

  console.log("Fetching SEO data from", SEO_API);
  const res = await fetch(SEO_API);
  if (!res.ok) {
    console.error("Failed to fetch SEO API:", res.status, res.statusText);
    process.exit(1);
  }
  const seoList = await res.json();

  for (const entry of seoList) {
    const { page, metaTitle, metaDescription, metaKeywords, canonicalUrl } = entry;

    const routePath = PAGE_ROUTE_MAP[page];

    if (routePath === undefined) {
      console.warn(`Skipping "${page}" — no route mapping in PAGE_ROUTE_MAP.`);
      continue;
    }

    const html = injectSeoTags(template, { metaTitle, metaDescription, metaKeywords, canonicalUrl });

    const outDir = routePath ? path.join(DIST_DIR, routePath) : DIST_DIR;
    fs.mkdirSync(outDir, { recursive: true });

    const outFile = path.join(outDir, "index.html");
    fs.writeFileSync(outFile, html, "utf-8");

    console.log(`Wrote ${outFile} for page "${page}"`);
  }

  console.log("Done. Upload the dist/ folder to S3 as usual.");
}

function injectSeoTags(html, { metaTitle, metaDescription, metaKeywords, canonicalUrl }) {
  let out = html;

  out = out.replace(
    /<title>.*?<\/title>/i,
    `<title>${escapeHtml(metaTitle || "The Royal Craft")}</title>`
  );

  out = out.replace(/\s*<meta name="description"[^>]*>\s*/gi, "\n");
  out = out.replace(/\s*<meta name="keywords"[^>]*>\s*/gi, "\n");
  out = out.replace(/\s*<link rel="canonical"[^>]*>\s*/gi, "\n");

  const newTags = [
    metaDescription ? `<meta name="description" content="${escapeHtml(metaDescription)}">` : "",
    metaKeywords ? `<meta name="keywords" content="${escapeHtml(metaKeywords)}">` : "",
    canonicalUrl ? `<link rel="canonical" href="${escapeHtml(canonicalUrl)}">` : "",
  ]
    .filter(Boolean)
    .join("\n    ");

  out = out.replace(/(<title>.*?<\/title>)/i, `$1\n    ${newTags}`);

  return out;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});