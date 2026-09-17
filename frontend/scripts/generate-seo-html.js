/**
 * ============================================================
 * generate-seo-html.js
 * ============================================================
 *
 * Run this AFTER `vite build`.
 *
 * Generates separate index.html files for every SEO page.
 *
 * SEO generated:
 *
 * 1. <title>
 * 2. Meta description
 * 3. Meta keywords
 * 4. Canonical
 * 5. Open Graph
 * 6. Twitter / X
 * 7. Page-specific Schema.org JSON-LD
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

const SITE_URL =
  "https://theroyalkraft.com";

/* ============================================================
   WEBSITE NAME
============================================================ */

const SITE_NAME =
  "The Royal Kraft";

/* ============================================================
   DEFAULT OG IMAGE
============================================================ */

/*
 * Put this file here:
 *
 * public/og-image.jpg
 *
 * It will be copied to:
 *
 * dist/og-image.jpg
 *
 * Recommended size:
 *
 * 1200 x 630 px
 */

const DEFAULT_OG_IMAGE =
  `${SITE_URL}/og-image.jpg`;

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

const PAGE_ROUTE_MAP = {
  Home: "",

  Shop: "shop",

  Blog: "blog",

  Gallery: "gallery",

  About: "about",

  Contact: "contact",

  Product: "product",

  Project: "project",

  Service: "service",
};

/* ============================================================
   MAIN
============================================================ */

async function main() {
  console.log("");

  console.log(
    "=============================================="
  );

  console.log(
    "           SEO HTML GENERATOR"
  );

  console.log(
    "=============================================="
  );

  console.log("");

  /* ==========================================================
     CHECK DIST
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
     READ TEMPLATE
  ========================================================== */

  const template =
    fs.readFileSync(
      TEMPLATE_PATH,
      "utf-8"
    );

  console.log(
    "✅ Vite template found."
  );

  console.log("");

  /* ==========================================================
     FETCH SEO DATA
  ========================================================== */

  console.log(
    "Fetching SEO data from:"
  );

  console.log(
    SEO_API
  );

  console.log("");

  let response;

  try {
    response =
      await fetch(SEO_API);
  } catch (error) {
    console.error(
      "❌ Could not connect to SEO API."
    );

    console.error(error);

    process.exit(1);
  }

  /* ==========================================================
     CHECK RESPONSE
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
    seoList =
      await response.json();
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
     GENERATE HTML
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
       CANONICAL
    ======================================================== */

    const finalCanonicalUrl =
      getCanonicalUrl(routePath);

    /* ========================================================
       TITLE
    ======================================================== */

    const finalTitle =
      metaTitle &&
      String(metaTitle).trim()
        ? String(metaTitle).trim()
        : SITE_NAME;

    /* ========================================================
       DESCRIPTION
    ======================================================== */

    const finalDescription =
      metaDescription &&
      String(metaDescription).trim()
        ? String(metaDescription).trim()
        : `Discover ${SITE_NAME} and our architectural and decorative solutions.`;

    /* ========================================================
       OG
    ======================================================== */

    const ogTitle =
      finalTitle;

    const ogDescription =
      finalDescription;

    const ogImage =
      DEFAULT_OG_IMAGE;

    /* ========================================================
       TWITTER
    ======================================================== */

    const twitterTitle =
      finalTitle;

    const twitterDescription =
      finalDescription;

    const twitterImage =
      ogImage;

    /* ========================================================
       SCHEMA
    ======================================================== */

    const schema =
      createSchema({
        page,
        title: finalTitle,
        description: finalDescription,
        url: finalCanonicalUrl,
        image: ogImage,
      });

    /* ========================================================
       LOG
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
      `Meta Title: ${finalTitle}`
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
      `OG Image: ${ogImage}`
    );

    console.log(
      `Schema: ${getSchemaName(page)}`
    );

    console.log(
      "----------------------------------------------"
    );

    /* ========================================================
       INJECT SEO
    ======================================================== */

    const html =
      injectSeoTags(
        template,
        {
          page,
          metaTitle: finalTitle,
          metaDescription: finalDescription,
          metaKeywords,
          canonicalUrl:
            finalCanonicalUrl,

          ogTitle,
          ogDescription,
          ogImage,

          twitterTitle,
          twitterDescription,
          twitterImage,

          schema,
        }
      );

    /* ========================================================
       OUTPUT DIRECTORY
    ======================================================== */

    const outDir =
      routePath
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

    const outFile =
      path.join(
        outDir,
        "index.html"
      );

    /* ========================================================
       WRITE
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
    "SEO tags generated:"
  );

  console.log(
    "✅ Title"
  );

  console.log(
    "✅ Meta Description"
  );

  console.log(
    "✅ Meta Keywords"
  );

  console.log(
    "✅ Canonical"
  );

  console.log(
    "✅ Open Graph"
  );

  console.log(
    "✅ Twitter/X"
  );

  console.log(
    "✅ Page-specific Schema"
  );

  console.log(
    "❌ FAQ Schema NOT included"
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

function getCanonicalUrl(routePath) {
  const baseUrl =
    SITE_URL.replace(
      /\/+$/,
      ""
    );

  /* ==========================================================
     HOME
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

  return `${baseUrl}/${cleanRoute}`;
}

/* ============================================================
   CREATE PAGE-SPECIFIC SCHEMA
============================================================ */

function createSchema({
  page,
  title,
  description,
  url,
  image,
}) {
  /* ==========================================================
     ORGANIZATION
  ========================================================== */

  const organization = {
    "@type": "Organization",

    "@id":
      `${SITE_URL}/#organization`,

    name:
      SITE_NAME,

    url:
      SITE_URL,

    logo: {
      "@type":
        "ImageObject",

      url:
        image,
    },
  };

  /* ==========================================================
     HOME
     Organization + LocalBusiness
  ========================================================== */

  if (page === "Home") {
    return {
      "@context":
        "https://schema.org",

      "@graph": [
        {
          ...organization,
        },

        {
          "@type":
            "LocalBusiness",

          "@id":
            `${SITE_URL}/#localbusiness`,

          name:
            SITE_NAME,

          url:
            SITE_URL,

          image:
            image,

          telephone:
            "+91-8130462200",

          email:
            "info@theroyalkraft.com",

          address: {
            "@type":
              "PostalAddress",

            streetAddress:
              "108, First Floor, DLF Galleria Mall, Mayur Vihar Phase-1 Extension, Near Metro Mayur Vihar Extension",

            addressLocality:
              "New Delhi",

            postalCode:
              "110091",

            addressCountry:
              "IN",
          },

          parentOrganization: {
            "@id":
              `${SITE_URL}/#organization`,
          },
        },
      ],
    };
  }

  /* ==========================================================
     ABOUT
     AboutPage + Organization
  ========================================================== */

  if (page === "About") {
    return {
      "@context":
        "https://schema.org",

      "@graph": [
        {
          "@type":
            "AboutPage",

          "@id":
            `${url}#aboutpage`,

          url:
            url,

          name:
            title,

          description:
            description,

          about: {
            "@id":
              `${SITE_URL}/#organization`,
          },

          primaryImageOfPage: {
            "@type":
              "ImageObject",

            url:
              image,
          },
        },

        organization,
      ],
    };
  }

  /* ==========================================================
     PRODUCT
     CollectionPage + ItemList
  ========================================================== */

  if (page === "Product") {
    return {
      "@context":
        "https://schema.org",

      "@type":
        "CollectionPage",

      "@id":
        `${url}#product-category`,

      url:
        url,

      name:
        title,

      description:
        description,

      about: {
        "@type":
          "Thing",

        name:
          "FRP Architectural and Decorative Products",
      },

      mainEntity: {
        "@type":
          "ItemList",

        "@id":
          `${url}#itemlist`,

        name:
          "The Royal Kraft Products",

        itemListOrder:
          "https://schema.org/ItemListOrderAscending",

        numberOfItems:
          0,
      },

      primaryImageOfPage: {
        "@type":
          "ImageObject",

        url:
          image,
      },
    };
  }

  /* ==========================================================
     SHOP
     CollectionPage + ItemList
  ========================================================== */

  /* ==========================================================
   SHOP
   CollectionPage + ItemList + BreadcrumbList
========================================================== */

if (page === "Shop") {
  return {
    "@context": "https://schema.org",

    "@graph": [
      /* ======================================================
         SHOP PAGE
      ====================================================== */

      {
        "@type": "CollectionPage",

        "@id": `${url}#shop`,

        url: url,

        name: title,

        description: description,

        mainEntity: {
          "@type": "ItemList",

          "@id": `${url}#itemlist`,

          name: "The Royal Kraft Shop",

          itemListOrder:
            "https://schema.org/ItemListOrderAscending",

          numberOfItems: 0,
        },

        provider: {
          "@id": `${SITE_URL}/#organization`,
        },

        primaryImageOfPage: {
          "@type": "ImageObject",

          url: image,
        },
      },

      /* ======================================================
         BREADCRUMB
      ====================================================== */

      {
        "@type": "BreadcrumbList",

        "@id": `${url}#breadcrumb`,

        itemListElement: [
          {
            "@type": "ListItem",

            position: 1,

            name: "Home",

            item: `${SITE_URL}/`,
          },

          {
            "@type": "ListItem",

            position: 2,

            name: "Shop",

            item: `${SITE_URL}/shop`,
          },
        ],
      },
    ],
  };
}

  /* ==========================================================
     SERVICE
     Service
  ========================================================== */

  if (page === "Service") {
    return {
      "@context":
        "https://schema.org",

      "@type":
        "Service",

      "@id":
        `${url}#service`,

      name:
        title,

      description:
        description,

      url:
        url,

      image:
        image,

      provider: {
        "@id":
          `${SITE_URL}/#organization`,
      },

      areaServed: {
        "@type":
          "Country",

        name:
          "India",
      },
    };
  }

  /* ==========================================================
     PROJECT
     CollectionPage + ItemList
  ========================================================== */

  if (page === "Project") {
    return {
      "@context":
        "https://schema.org",

      "@type":
        "CollectionPage",

      "@id":
        `${url}#projects`,

      url:
        url,

      name:
        title,

      description:
        description,

      about: {
        "@type":
          "Thing",

        name:
          "Architectural and Decorative Projects",
      },

      mainEntity: {
        "@type":
          "ItemList",

        "@id":
          `${url}#itemlist`,

        name:
          "The Royal Kraft Projects",

        itemListOrder:
          "https://schema.org/ItemListOrderAscending",

        numberOfItems:
          0,
      },

      provider: {
        "@id":
          `${SITE_URL}/#organization`,
      },

      primaryImageOfPage: {
        "@type":
          "ImageObject",

        url:
          image,
      },
    };
  }

  /* ==========================================================
     BLOG
     Blog
  ========================================================== */

  if (page === "Blog") {
    return {
      "@context":
        "https://schema.org",

      "@type":
        "Blog",

      "@id":
        `${url}#blog`,

      url:
        url,

      name:
        title,

      description:
        description,

      publisher: {
        "@id":
          `${SITE_URL}/#organization`,
      },

      image:
        image,
    };
  }

  /* ==========================================================
     GALLERY
     ImageGallery
  ========================================================== */

  if (page === "Gallery") {
    return {
      "@context":
        "https://schema.org",

      "@type":
        "ImageGallery",

      "@id":
        `${url}#imagegallery`,

      url:
        url,

      name:
        title,

      description:
        description,

      image:
        image,

      publisher: {
        "@id":
          `${SITE_URL}/#organization`,
      },
    };
  }

  /* ==========================================================
     CONTACT
     ContactPage
  ========================================================== */

  if (page === "Contact") {
    return {
      "@context":
        "https://schema.org",

      "@type":
        "ContactPage",

      "@id":
        `${url}#contactpage`,

      url:
        url,

      name:
        title,

      description:
        description,

      isPartOf: {
        "@type":
          "WebSite",

        name:
          SITE_NAME,

        url:
          SITE_URL,
      },
    };
  }

  /* ==========================================================
     FALLBACK
  ========================================================== */

  return {
    "@context":
      "https://schema.org",

    "@type":
      "WebPage",

    "@id":
      `${url}#webpage`,

    url:
      url,

    name:
      title,

    description:
      description,
  };
}

/* ============================================================
   GET SCHEMA NAME FOR TERMINAL
============================================================ */

function getSchemaName(page) {
  switch (page) {
    case "Home":
      return "Organization + LocalBusiness";

    case "About":
      return "AboutPage + Organization";

    case "Product":
      return "CollectionPage + ItemList";

    case "Shop":
      return "CollectionPage + ItemList";

    case "Service":
      return "Service";

    case "Project":
      return "CollectionPage + ItemList";

    case "Blog":
      return "Blog";

    case "Gallery":
      return "ImageGallery";

    case "Contact":
      return "ContactPage";

    default:
      return "WebPage";
  }
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

    ogTitle,
    ogDescription,
    ogImage,

    twitterTitle,
    twitterDescription,
    twitterImage,

    schema,
  }
) {
  let output =
    html;

  /* ==========================================================
     REMOVE EXISTING TITLE
  ========================================================== */

  output =
    output.replace(
      /<title>[\s\S]*?<\/title>/gi,
      ""
    );

  /* ==========================================================
     REMOVE DESCRIPTION
  ========================================================== */

  output =
    output.replace(
      /\s*<meta\s+name=["']description["'][^>]*>/gi,
      ""
    );

  /* ==========================================================
     REMOVE KEYWORDS
  ========================================================== */

  output =
    output.replace(
      /\s*<meta\s+name=["']keywords["'][^>]*>/gi,
      ""
    );

  /* ==========================================================
     REMOVE CANONICAL
  ========================================================== */

  output =
    output.replace(
      /\s*<link\s+rel=["']canonical["'][^>]*>/gi,
      ""
    );

  /* ==========================================================
     REMOVE OG
  ========================================================== */

  output =
    output.replace(
      /\s*<meta\s+property=["']og:[^"']+["'][^>]*>/gi,
      ""
    );

  /* ==========================================================
     REMOVE TWITTER
  ========================================================== */

  output =
    output.replace(
      /\s*<meta\s+name=["']twitter:[^"']+["'][^>]*>/gi,
      ""
    );

  /* ==========================================================
     REMOVE OLD SCHEMA
  ========================================================== */

  output =
    output.replace(
      /\s*<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,
      ""
    );

  /* ==========================================================
     TITLE
  ========================================================== */

  const titleTag =
    `<title>${escapeHtml(
      metaTitle || SITE_NAME
    )}</title>`;

  /* ==========================================================
     DESCRIPTION
  ========================================================== */

  const descriptionTag =
    metaDescription &&
    String(metaDescription).trim()
      ? `<meta name="description" content="${escapeHtml(
          metaDescription
        )}">`
      : "";

  /* ==========================================================
     KEYWORDS
  ========================================================== */

  const keywordsTag =
    metaKeywords &&
    String(metaKeywords).trim()
      ? `<meta name="keywords" content="${escapeHtml(
          metaKeywords
        )}">`
      : "";

  /* ==========================================================
     CANONICAL
  ========================================================== */

  const canonicalTag =
    canonicalUrl
      ? `<link rel="canonical" href="${escapeHtml(
          canonicalUrl
        )}">`
      : "";

  /* ==========================================================
     OPEN GRAPH
  ========================================================== */

  const ogTags = [
    `<meta property="og:title" content="${escapeHtml(
      ogTitle
    )}">`,

    `<meta property="og:description" content="${escapeHtml(
      ogDescription
    )}">`,

    `<meta property="og:type" content="website">`,

    `<meta property="og:url" content="${escapeHtml(
      canonicalUrl
    )}">`,

    `<meta property="og:site_name" content="${escapeHtml(
      SITE_NAME
    )}">`,

    `<meta property="og:image" content="${escapeHtml(
      ogImage
    )}">`,
  ].join("\n    ");

  /* ==========================================================
     TWITTER / X
  ========================================================== */

  const twitterTags = [
    `<meta name="twitter:card" content="summary_large_image">`,

    `<meta name="twitter:title" content="${escapeHtml(
      twitterTitle
    )}">`,

    `<meta name="twitter:description" content="${escapeHtml(
      twitterDescription
    )}">`,

    `<meta name="twitter:image" content="${escapeHtml(
      twitterImage
    )}">`,
  ].join("\n    ");

  /* ==========================================================
     SCHEMA
  ========================================================== */

  const schemaTag =
    `<script type="application/ld+json">\n${JSON.stringify(
      schema,
      null,
      2
    )}\n</script>`;

  /* ==========================================================
     COMBINE
  ========================================================== */

  const seoTags = [
    titleTag,
    descriptionTag,
    keywordsTag,
    canonicalTag,
    ogTags,
    twitterTags,
    schemaTag,
  ]
    .filter(Boolean)
    .join("\n    ");

  /* ==========================================================
     INSERT BEFORE HEAD
  ========================================================== */

  if (/<\/head>/i.test(output)) {
    output =
      output.replace(
        /<\/head>/i,
        `    ${seoTags}\n  </head>`
      );
  } else {
    console.warn(
      "⚠️ </head> was not found in dist/index.html."
    );
  }

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
   RUN
============================================================ */

main().catch(
  (error) => {
    console.error("");

    console.error(
      "❌ SEO generation failed:"
    );

    console.error("");

    console.error(error);

    console.error("");

    process.exit(1);
  }
);