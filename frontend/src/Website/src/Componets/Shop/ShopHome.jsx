import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import "./ShopHome.css";

// =====================================================
// API
// =====================================================

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/shop-product";

const FALLBACK_IMAGE = "https://via.placeholder.com/400x400?text=No+Image";

// =====================================================
// CREATE PRODUCT SLUG
// =====================================================

const createProductSlug = (name) => {
  return String(name || "product")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// =====================================================
// SHOP HOME
// =====================================================

const ShopHome = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const trackRef = useRef(null);

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load products.");
      }

      const data = await response.json();

      // Handle different API response formats
      let productList = [];

      if (Array.isArray(data)) {
        productList = data;
      } else if (Array.isArray(data?.products)) {
        productList = data.products;
      } else if (Array.isArray(data?.items)) {
        productList = data.items;
      } else if (Array.isArray(data?.data)) {
        productList = data.data;
      }

      setProducts(productList);
    } catch (error) {
      console.error("Product loading error:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // WISHLIST
  // =====================================================

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id)
        ? prev.filter((wishlistId) => wishlistId !== id)
        : [...prev, id]
    );
  };

  // =====================================================
  // CAROUSEL
  // =====================================================

  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [products, loading]);

  const scrollByCard = (direction) => {
    const el = trackRef.current;
    if (!el || !el.firstElementChild) return;

    const card = el.firstElementChild;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;

    el.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: "smooth",
    });
  };

  // =====================================================
  // IMAGE ERROR HANDLER
  // =====================================================

  const handleImageError = (event) => {
    if (event.currentTarget.src !== FALLBACK_IMAGE) {
      event.currentTarget.src = FALLBACK_IMAGE;
    }
  };

  const hasProducts = !loading && products.length > 0;

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <section className="shop-home">
      <div className="shop-home-inner">
        {/* ===== Header (centered) ===== */}

        <div className="shop-home-header">
          <span className="shop-subtitle">SHOP NOW</span>

          <h2 className="shop-home-title">
            Shop The Royal{" "}
            <span className="shop-home-title-gold">Collection</span>
          </h2>

          <p className="shop-home-desc">
            Handpicked décor accents and luxury pieces available for purchase.
            Bring home the elegance of The Royal Kraft.
          </p>
        </div>

        {/* ===== Carousel ===== */}

        <div className="shop-home-carousel">
          {loading && <div className="shop-state">Loading Products...</div>}

          {!loading && products.length === 0 && (
            <div className="shop-state">No products available.</div>
          )}

          {hasProducts && (
            <>
              <button
                type="button"
                className="shop-arrow shop-arrow-left"
                onClick={() => scrollByCard(-1)}
                disabled={!canPrev}
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>

              <div
                className="shop-home-track"
                ref={trackRef}
                onScroll={updateArrows}
              >
                {products.map((item, index) => {
                  const productId =
                    item.id || item.productId || item._id || index;

                  const isWished = wishlist.includes(productId);
                  const productSlug = createProductSlug(item.name);

                  return (
                    <Link
                      to={`/product/${productSlug}`}
                      state={{ product: item }}
                      key={productId}
                      className="shop-card"
                    >
                      {/* Image */}

                      <div className="shop-image-wrap">
                        <img
                          src={
                            item.primaryImage ||
                            item.image ||
                            item.imageUrl ||
                            FALLBACK_IMAGE
                          }
                          alt={item.name || "Royal Kraft Product"}
                          className="shop-image"
                          loading="lazy"
                          onError={handleImageError}
                        />

                        <button
                          type="button"
                          className={`wishlist-btn ${isWished ? "active" : ""}`}
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            toggleWishlist(productId);
                          }}
                          aria-label={
                            isWished
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                        >
                          <Heart
                            size={18}
                            fill={isWished ? "currentColor" : "none"}
                          />
                        </button>
                      </div>

                      {/* Info */}

                      <div className="shop-info">
                        <h4>{item.name || "Product Name"}</h4>

                        {item.category && (
                          <span className="shop-category">{item.category}</span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>

              <button
                type="button"
                className="shop-arrow shop-arrow-right"
                onClick={() => scrollByCard(1)}
                disabled={!canNext}
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* ===== Centered button ===== */}

        <div className="shop-home-footer">
          <Link to="/product" className="all-btn">
            VIEW ALL PRODUCTS <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ShopHome;