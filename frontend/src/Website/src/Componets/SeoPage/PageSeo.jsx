import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

const SEO_API =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/seo";

const PageSeo = ({ page }) => {
  const [seo, setSeo] = useState({
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    canonicalUrl: "",
  });

  useEffect(() => {
    loadSeo();
  }, [page]);

  const loadSeo = async () => {
    try {
      const response = await fetch(SEO_API);
      const data = await response.json();

      const pageSeo = data.find((item) => item.page === page);

      if (pageSeo) {
        setSeo(pageSeo);
      }
    } catch (err) {
      console.error("SEO Error:", err);
    }
  };

  return (
    <Helmet>
      <title>{seo.metaTitle || "The Royal Craft"}</title>

      <meta
        name="description"
        content={seo.metaDescription || ""}
      />

      <meta
        name="keywords"
        content={seo.metaKeywords || ""}
      />

      {seo.canonicalUrl && (
        <link
          rel="canonical"
          href={seo.canonicalUrl}
        />
      )}
    </Helmet>
  );
};

export default PageSeo;