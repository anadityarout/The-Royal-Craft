import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

const SEO_API =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/seo";

const SITE_URL = "https://theroyalkraft.com";

const DEFAULT_SEO = {
  metaTitle: "The Royal Kraft",
  metaDescription:
    "The Royal Kraft provides architectural and decorative FRP solutions.",
  metaKeywords:
    "The Royal Kraft, FRP, architectural, decorative, FRP products",
  canonicalUrl: "",
};

const PageSeo = ({ page }) => {
  const [seo, setSeo] = useState(DEFAULT_SEO);

  useEffect(() => {
    let cancelled = false;

    const loadSeo = async () => {
      try {
        const response = await fetch(
          `${SEO_API}?page=${encodeURIComponent(page)}&t=${Date.now()}`,
          {
            method: "GET",
            cache: "no-store",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`SEO API error: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("SEO API did not return an array.");
        }

        const pageSeo = data.find(
          (item) =>
            String(item.page || "").trim().toLowerCase() ===
            String(page || "").trim().toLowerCase()
        );

        if (cancelled) return;

        if (pageSeo) {
          setSeo({
            metaTitle:
              pageSeo.metaTitle?.trim() ||
              DEFAULT_SEO.metaTitle,

            metaDescription:
              pageSeo.metaDescription?.trim() ||
              DEFAULT_SEO.metaDescription,

            metaKeywords:
              pageSeo.metaKeywords?.trim() ||
              DEFAULT_SEO.metaKeywords,

            canonicalUrl:
              pageSeo.canonicalUrl?.trim() || "",
          });
        } else {
          setSeo(DEFAULT_SEO);
        }
      } catch (error) {
        console.error("SEO Error:", error);

        if (!cancelled) {
          setSeo(DEFAULT_SEO);
        }
      }
    };

    // Load immediately
    loadSeo();

    // Check for new SEO every 30 seconds
    const interval = setInterval(() => {
      loadSeo();
    }, 30000);

    // Reload when user comes back to the tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadSeo();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      cancelled = true;

      clearInterval(interval);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [page]);

  const canonicalUrl =
    seo.canonicalUrl || getDefaultCanonical(page);

  return (
    <Helmet>
      {/* TITLE */}
      <title>
        {seo.metaTitle || DEFAULT_SEO.metaTitle}
      </title>

      {/* DESCRIPTION */}
      <meta
        name="description"
        content={
          seo.metaDescription ||
          DEFAULT_SEO.metaDescription
        }
      />

      {/* KEYWORDS */}
      <meta
        name="keywords"
        content={
          seo.metaKeywords ||
          DEFAULT_SEO.metaKeywords
        }
      />

      {/* CANONICAL */}
      {canonicalUrl && (
        <link
          rel="canonical"
          href={canonicalUrl}
        />
      )}

      {/* OPEN GRAPH */}
      <meta
        property="og:title"
        content={
          seo.metaTitle ||
          DEFAULT_SEO.metaTitle
        }
      />

      <meta
        property="og:description"
        content={
          seo.metaDescription ||
          DEFAULT_SEO.metaDescription
        }
      />

      <meta
        property="og:type"
        content="website"
      />

      <meta
        property="og:url"
        content={canonicalUrl}
      />

      <meta
        property="og:site_name"
        content="The Royal Kraft"
      />

      <meta
        property="og:image"
        content={`${SITE_URL}/og-image.jpg`}
      />

      {/* TWITTER / X */}
      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={
          seo.metaTitle ||
          DEFAULT_SEO.metaTitle
        }
      />

      <meta
        name="twitter:description"
        content={
          seo.metaDescription ||
          DEFAULT_SEO.metaDescription
        }
      />

      <meta
        name="twitter:image"
        content={`${SITE_URL}/og-image.jpg`}
      />
    </Helmet>
  );
};

function getDefaultCanonical(page) {
  const routes = {
    Home: "/",
    Product: "/product",
    Project: "/project",
    Service: "/service",
    Shop: "/shop",
    Blog: "/blog",
    Gallery: "/gallery",
    About: "/about",
    Contact: "/contact",
  };

  const route = routes[page];

  if (route === undefined) {
    return "";
  }

  return `${SITE_URL}${route}`;
}

export default PageSeo;