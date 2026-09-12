/**
 * ============================================================
 * generate-seo-html.js
 * ============================================================
 *
 * Run this AFTER `vite build`.
 *
 * This script:
 *
 * 1. Reads dist/index.html as the template.
 * 2. Fetches SEO data from your SEO API.
 * 3. Generates a separate index.html for every page.
 * 4. Adds:
 *
 *    - <title>
 *    - <meta name="description">
 *    - <meta name="keywords">
 *    - <link rel="canonical">
 *
 * 5. Automatically generates canonical URLs from the page route.
 *
 * IMPORTANT:
 *
 * The canonicalUrl stored in MongoDB/API is NOT trusted.
 * Canonical URLs are generated automatically from:
 *
 *    https://theroyalkraft.com
 *
 * This prevents incorrect values such as:
 *
 *    w
 *    e
 *    ssd
 *    https://yourdomain.com/gallery
 *
 * from being used as canonical URLs.
 *
 * ============================================================
 *
 * Usage:
 *
 * npm run build
 *
 * node scripts/generate-seo-html.js
 *
 * Then upload the complete dist/ folder to S3.
 *
 * ============================================================
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/* ============================================================
   PATH
============================================================ */

const __dirname = path.dirname(
  fileURLToPath(import.meta.url)
);

/* ============================================================
   SEO API
============================================================ */

const SEO_API =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/seo";

/* ============================================================
   WEBSITE URL
============================================================ */

/*
 * Your real live website.
 *
 * IMPORTANT:
 * Do NOT add a trailing slash here.
 */

const SITE_URL = "https://theroyalkraft.com";

/* ============================================================
   DIST DIRECTORY
============================================================ */

const DIST_DIR = path.join(
  __dirname,
  "..",
  "dist"
);

/* ============================================================
   TEMPLATE FILE
============================================================ */

const TEMPLATE_PATH = path.join(
  DIST_DIR,
  "index.html"
);

/* ============================================================
   PAGE ROUTES
============================================================ */

/*
 * The key must exactly match the "page"
 * value coming from your SEO API.
 *
 * Example:
 *
 * API:
 * {
 *   "page": "Home"
 * }
 *
 * becomes:
 *
 * https://theroyalkraft.com/
 *
 * API:
 * {
 *   "page": "Shop"
 * }
 *
 * becomes:
 *
 * https://theroyalkraft.com/shop
 */

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

/* ============================================================
   MAIN
============================================================ */

async function main() {
  console.log("");
  console.log("==============================================");
  console.log("           SEO HTML GENERATOR");
  console.log("==============================================");
  console.log("");

  /* ==========================================================
     STEP 1 — CHECK DIST
  ========================================================== */

  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(
      `❌ Could not find:\n${TEMPLATE_PATH}`
    );

    console.error("");

    console.error(
      'Please run "npm run build" first.'
    );

    console.error("");

    process.exit(1);
  }

  /* ==========================================================
     STEP 2 — READ TEMPLATE
  ========================================================== */

  const template = fs.readFileSync(
    TEMPLATE_PATH,
    "utf-8"
  );

  console.log("✅ Vite template found.");
  console.log("");

  /* ==========================================================
     STEP 3 — FETCH SEO DATA
  ========================================================== */

  console.log("Fetching SEO data from:");

  console.log(SEO_API);

  console.log("");

  let response;

  try {
    response = await fetch(SEO_API);
  } catch (error) {
    console.error(
      "❌ Could not connect to SEO API."
    );

    console.error(error);

    process.exit(1);
  }

  /* ==========================================================
     CHECK API RESPONSE
  ========================================================== */

  if (!response.ok) {
    console.error(
      `❌ SEO API returned ${response.status} ${response.statusText}`
    );

    process.exit(1);
  }

  /* ==========================================================
     READ JSON
  ========================================================== */

  let seoList;

  try {
    seoList = await response.json();
  } catch (error) {
    console.error(
      "❌ SEO API returned invalid JSON."
    );

    console.error(error);

    process.exit(1);
  }

  /* ==========================================================
     CHECK ARRAY
  ========================================================== */

  if (!Array.isArray(seoList)) {
    console.error(
      "❌ SEO API did not return an array."
    );

    process.exit(1);
  }

  console.log(
    `Found ${seoList.length} SEO records.`
  );

  console.log("");

  /* ==========================================================
     NO SEO DATA
  ========================================================== */

  if (seoList.length === 0) {
    console.warn(
      "⚠️ No SEO records were found."
    );

    console.warn(
      "Nothing was generated."
    );

    return;
  }

  /* ==========================================================
     STEP 4 — GENERATE HTML
  ========================================================== */

  let generatedCount = 0;

  for (const entry of seoList) {
    /* ========================================================
       READ SEO DATA
    ======================================================== */

    const {
      page,
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
    } = entry;

    /* ========================================================
       CHECK PAGE
    ======================================================== */

    if (!page) {
      console.warn(
        "⚠️ SEO record does not have a page name."
      );

      console.warn(
        "Skipping this record."
      );

      console.log("");

      continue;
    }

    /* ========================================================
       FIND ROUTE
    ======================================================== */

    const routePath =
      PAGE_ROUTE_MAP[page];

    /* ========================================================
       UNKNOWN PAGE
    ======================================================== */

    if (routePath === undefined) {
      console.warn(
        `⚠️ Skipping "${page}".`
      );

      console.warn(
        "No route mapping exists in PAGE_ROUTE_MAP."
      );

      console.log("");

      continue;
    }

    /* ========================================================
       GENERATE CANONICAL URL
    ======================================================== */

    /*
     * IMPORTANT:
     *
     * We intentionally DO NOT use canonicalUrl
     * from the API here.
     *
     * This prevents bad database values like:
     *
     *    "w"
     *    "e"
     *    "ssd"
     *    "https://yourdomain.com/gallery"
     *
     * from being used.
     */

    const finalCanonicalUrl =
      getCanonicalUrl(routePath);

    /* ========================================================
       LOG INFORMATION
    ======================================================== */

    console.log(
      "----------------------------------------------"
    );

    console.log(
      `Page: ${page}`
    );

    console.log(
      `Route: /${routePath}`
    );

    console.log(
      `Meta Title: ${
        metaTitle || "The Royal Craft"
      }`
    );

    console.log(
      `Canonical from API: ${
        canonicalUrl || "EMPTY"
      }`
    );

    console.log(
      `Final Canonical: ${finalCanonicalUrl}`
    );

    console.log(
      "----------------------------------------------"
    );

    /* ========================================================
       INJECT SEO
    ======================================================== */

    const html = injectSeoTags(
      template,
      {
        metaTitle,
        metaDescription,
        metaKeywords,
        canonicalUrl:
          finalCanonicalUrl,
      }
    );

    /* ========================================================
       CREATE OUTPUT DIRECTORY
    ======================================================== */

    const outDir = routePath
      ? path.join(
          DIST_DIR,
          routePath
        )
      : DIST_DIR;

    fs.mkdirSync(
      outDir,
      {
        recursive: true,
      }
    );

    /* ========================================================
       OUTPUT FILE
    ======================================================== */

    const outFile = path.join(
      outDir,
      "index.html"
    );

    /* ========================================================
       WRITE FILE
    ======================================================== */

    fs.writeFileSync(
      outFile,
      html,
      "utf-8"
    );

    console.log(
      `✅ Wrote: ${outFile}`
    );

    console.log("");

    generatedCount++;
  }

  /* ==========================================================
     COMPLETE
  ========================================================== */

  console.log(
    "=============================================="
  );

  console.log(
    "          SEO GENERATION COMPLETE"
  );

  console.log(
    "=============================================="
  );

  console.log("");

  console.log(
    `Generated ${generatedCount} HTML page(s).`
  );

  console.log("");

  console.log(
    "Website:"
  );

  console.log(
    SITE_URL
  );

  console.log("");

  console.log(
    "You can now upload the dist/ folder to S3."
  );

  console.log("");
}

/* ============================================================
   GET CANONICAL URL
============================================================ */

/*
 * Automatically generates canonical URL.
 *
 * Examples:
 *
 * Home:
 * https://theroyalkraft.com/
 *
 * Shop:
 * https://theroyalkraft.com/shop
 *
 * Blog:
 * https://theroyalkraft.com/blog
 *
 * Gallery:
 * https://theroyalkraft.com/gallery
 */

function getCanonicalUrl(routePath) {
  /* ==========================================================
     CLEAN WEBSITE URL
  ========================================================== */

  const baseUrl =
    SITE_URL.replace(
      /\/+$/,
      ""
    );

  /* ==========================================================
     HOME PAGE
  ========================================================== */

  if (!routePath) {
    return `${baseUrl}/`;
  }

  /* ==========================================================
     CLEAN ROUTE
  ========================================================== */

  const cleanRoute =
    routePath.replace(
      /^\/+|\/+$/g,
      ""
    );

  /* ==========================================================
     RETURN URL
  ========================================================== */

  return `${baseUrl}/${cleanRoute}`;
}

/* ============================================================
   INJECT SEO TAGS
============================================================ */

function injectSeoTags(
  html,
  {
    metaTitle,
    metaDescription,
    metaKeywords,
    canonicalUrl,
  }
) {
  let output = html;

  /* ==========================================================
     REMOVE EXISTING TITLE
  ========================================================== */

  output = output.replace(
    /<title>[\s\S]*?<\/title>/gi,
    ""
  );

  /* ==========================================================
     REMOVE EXISTING DESCRIPTION
  ========================================================== */

  output = output.replace(
    /\s*<meta\s+name=["']description["'][^>]*>/gi,
    ""
  );

  /* ==========================================================
     REMOVE EXISTING KEYWORDS
  ========================================================== */

  output = output.replace(
    /\s*<meta\s+name=["']keywords["'][^>]*>/gi,
    ""
  );

  /* ==========================================================
     REMOVE EXISTING CANONICAL
  ========================================================== */

  output = output.replace(
    /\s*<link\s+rel=["']canonical["'][^>]*>/gi,
    ""
  );

  /* ==========================================================
     CREATE TITLE
  ========================================================== */

  const titleTag =
    `<title>${escapeHtml(
      metaTitle ||
        "The Royal Craft"
    )}</title>`;

  /* ==========================================================
     CREATE DESCRIPTION
  ========================================================== */

  const descriptionTag =
    metaDescription &&
    String(metaDescription).trim()
      ? `<meta name="description" content="${escapeHtml(
          metaDescription
        )}">`
      : "";

  /* ==========================================================
     CREATE KEYWORDS
  ========================================================== */

  const keywordsTag =
    metaKeywords &&
    String(metaKeywords).trim()
      ? `<meta name="keywords" content="${escapeHtml(
          metaKeywords
        )}">`
      : "";

  /* ==========================================================
     CREATE CANONICAL
  ========================================================== */

  const canonicalTag =
    canonicalUrl
      ? `<link rel="canonical" href="${escapeHtml(
          canonicalUrl
        )}">`
      : "";

  /* ==========================================================
     COMBINE TAGS
  ========================================================== */

  const seoTags = [
    titleTag,
    descriptionTag,
    keywordsTag,
    canonicalTag,
  ]
    .filter(Boolean)
    .join("\n    ");

  /* ==========================================================
     INSERT BEFORE </head>
  ========================================================== */

  if (/<\/head>/i.test(output)) {
    output = output.replace(
      /<\/head>/i,
      `    ${seoTags}\n  </head>`
    );
  } else {
    console.warn(
      "⚠️ </head> was not found in dist/index.html."
    );
  }

  /* ==========================================================
     RETURN HTML
  ========================================================== */

  return output;
}

/* ============================================================
   ESCAPE HTML
============================================================ */

function escapeHtml(value) {
  return String(value)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    );
}

/* ============================================================
   RUN SCRIPT
============================================================ */

main().catch((error) => {
  console.error("");

  console.error(
    "❌ SEO generation failed:"
  );

  console.error("");

  console.error(error);

  console.error("");

  process.exit(1);
});