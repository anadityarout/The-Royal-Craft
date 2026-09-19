import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import "./ProductPage.css";
import PageSeo from "../SeoPage/PageSeo";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/product";

/* =========================================================
   PRODUCT CATEGORIES
========================================================= */

const categories = [
  "All",
  "Exterior",
  "Fiber Mandap",
  "Fiber Gate",
  "Fiber Work",
  "Fiber Stage",
  "Fountain",
  "Gazebo",
  "Interior",
  "Urli",
  "Statue",
];

/* =========================================================
   PRODUCT PAGE
========================================================= */

const ProductPage = () => {
  /* =======================================================
     CATEGORY
  ======================================================= */

  const [activeCategory, setActiveCategory] = useState("All");

  /* =======================================================
     PRODUCTS
  ======================================================= */

  const [products, setProducts] = useState([]);

  /* =======================================================
     BANNER
  ======================================================= */

  const [banner, setBanner] = useState(null);

  /* =======================================================
     LOADING
  ======================================================= */

  const [loading, setLoading] = useState(true);

  /* =======================================================
     SEARCH
  ======================================================= */

  const [search, setSearch] = useState("");

  /* =======================================================
     LOAD PRODUCTS + BANNER
  ======================================================= */

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      /* ===================================================
         GET DATA FROM API
      =================================================== */

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const data = await response.json();

      const allItems = Array.isArray(data) ? data : [];

      /* ===================================================
         FIND BANNER
         
         Supports:
         category: "banner"

         OR

         type: "Banner"
      =================================================== */

      const bannerItem = allItems.find((item) => {
        const category = String(
          item.category || item.type || ""
        )
          .trim()
          .toLowerCase();

        return category === "banner";
      });

      setBanner(bannerItem || null);

      /* ===================================================
         ONLY PRODUCTS

         Banner will NOT appear in product cards.
      =================================================== */

      const productItems = allItems.filter((item) => {
        const category = String(
          item.category || item.type || ""
        )
          .trim()
          .toLowerCase();

        return category !== "banner";
      });

      setProducts(productItems);
    } catch (err) {
      console.error("Error loading products:", err);

      setProducts([]);
      setBanner(null);
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     FILTER PRODUCTS
  ======================================================= */

  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        /* ================================================
           CATEGORY MATCH
        ================================================= */

        const itemCategory = String(item.category || "")
          .trim()
          .toLowerCase();

        const selectedCategory = activeCategory
          .trim()
          .toLowerCase();

        const categoryMatch =
          activeCategory === "All" ||
          itemCategory === selectedCategory;

        /* ================================================
           SEARCH MATCH
        ================================================= */

        const searchText = search.trim().toLowerCase();

        const productName = String(
          item.name || ""
        ).toLowerCase();

        const productDescription = String(
          item.description || ""
        ).toLowerCase();

        const searchMatch =
          !searchText ||
          productName.includes(searchText) ||
          productDescription.includes(searchText);

        return categoryMatch && searchMatch;
      })
      .sort((a, b) =>
        String(a.name || "").localeCompare(
          String(b.name || "")
        )
      );
  }, [products, activeCategory, search]);

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <>
      {/* ===================================================
          SEO
      =================================================== */}

      <PageSeo page="Product" />

      {/* ===================================================
          PRODUCT PAGE BANNER
          
          Same visual style as HomeSlider
          but image height remains AUTO.
      =================================================== */}

      {banner?.bannerImage && (
        <section className="product-page-banner">

          {/* =================================================
              BANNER IMAGE
          ================================================= */}

          <img
            src={banner.bannerImage}
            alt={
              banner.bannerName ||
              "The Royal Kraft Products"
            }
            className="product-page-banner-image"
            loading="eager"
            fetchPriority="high"
          />

          {/* =================================================
              DARK OVERLAY
          ================================================= */}

          <div className="product-page-banner-overlay"></div>

          {/* =================================================
              BANNER CONTENT
          ================================================= */}

          <div className="product-page-banner-content">

            {/* =============================================
                KICKER / BRAND
            ============================================= */}

            <span className="product-page-banner-kicker">
              THE ROYAL KRAFT
            </span>

            {/* =============================================
                BANNER NAME
            ============================================= */}

            {banner?.bannerName && (
              <h1>
                {banner.bannerName}
              </h1>
            )}

            {/* =============================================
                BANNER DESCRIPTION
            ============================================= */}

            {banner?.bannerDescription && (
              <p>
                {banner.bannerDescription}
              </p>
            )}

            {/* =============================================
                CTA BUTTON
            ============================================= */}

            <button
              type="button"
              className="product-page-banner-cta"
              onClick={() => {
                document
                  .querySelector(".product-search-section")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
            >
              <span>Explore Collection</span>

              <ArrowRight size={18} />
            </button>

          </div>

        </section>
      )}

      {/* ===================================================
          SEARCH
      =================================================== */}

      <section className="product-search-section">

        <div className="product-search-wrapper">

          <input
            type="text"
            placeholder="Search Products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="product-search-input"
          />

        </div>

      </section>

      {/* ===================================================
          CATEGORIES
      =================================================== */}

      <section className="product-page-filter">

        <div className="product-page-filter-wrapper">

          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`product-page-filter-btn ${
                activeCategory === category
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveCategory(category)
              }
            >
              {category}
            </button>
          ))}

        </div>

      </section>

      {/* ===================================================
          PRODUCTS
      =================================================== */}

      <section className="product-page-list">

        {loading ? (
          <h3 className="product-message">
            Loading Products...
          </h3>
        ) : filteredProducts.length === 0 ? (
          <h3 className="product-message">
            No Products Found
          </h3>
        ) : (
          <div className="product-page-grid">

            {filteredProducts.map((product, index) => (
              <div
                className="product-page-card"
                key={
                  product.id ||
                  product.key ||
                  `product-${index}`
                }
              >

                {/* =========================================
                    PRODUCT IMAGE
                ========================================= */}

                <img
                  src={product.image}
                  alt={
                    product.altText ||
                    product.name ||
                    "Product"
                  }
                  className="product-page-image"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/no-image.png";
                  }}
                />

                {/* =========================================
                    PRODUCT CONTENT
                ========================================= */}

                <div className="product-page-content">

                  <h3>
                    {product.name}
                  </h3>

                  {product.description && (
                    <p>
                      {product.description}
                    </p>
                  )}

                  {product.category && (
                    <span className="product-category">
                      {product.category}
                    </span>
                  )}

                </div>

              </div>
            ))}

          </div>
        )}

      </section>
    </>
  );
};

export default ProductPage;