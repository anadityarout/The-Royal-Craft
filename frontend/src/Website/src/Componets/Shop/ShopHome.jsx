import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./ShopHome.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/shop-product";

const FALLBACK_IMAGE =
  "https://via.placeholder.com/400x400?text=No+Image";

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

      // =================================================
      // HANDLE DIFFERENT API RESPONSE FORMATS
      // =================================================

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
      console.error(
        "Product loading error:",
        error
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // WISHLIST
  // =====================================================

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      if (prev.includes(id)) {
        return prev.filter(
          (wishlistId) => wishlistId !== id
        );
      }

      return [...prev, id];
    });
  };

  // =====================================================
  // CAROUSEL
  // =====================================================

  const scrollByCard = (direction) => {
    const track = trackRef.current;

    if (!track) return;

    const card =
      track.querySelector(".shop-card");

    const cardWidth = card
      ? card.offsetWidth + 16
      : 300;

    track.scrollBy({
      left:
        direction === "left"
          ? -cardWidth
          : cardWidth,
      behavior: "smooth",
    });
  };

  // =====================================================
  // IMAGE ERROR HANDLER
  // =====================================================

  const handleImageError = (event) => {
    if (
      event.currentTarget.src !==
      FALLBACK_IMAGE
    ) {
      event.currentTarget.src =
        FALLBACK_IMAGE;
    }
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <section className="shop-home">
      <div className="shop-home-inner">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="shop-home-header">

          <div className="shop-home-heading">

            <span className="shop-subtitle">
              SHOP NOW
            </span>

            <h2>
              SHOP THE
              <br />
              ROYAL COLLECTION
            </h2>

          </div>

          <p className="shop-home-desc">
            Handpicked décor accents and luxury
            pieces available for purchase. Bring
            home the elegance of The Royal Kraft.
          </p>

        </div>

        {/* =================================================
            CAROUSEL
        ================================================= */}

        <div className="shop-home-carousel">

          {/* =================================================
              LEFT ARROW
          ================================================= */}

          <button
            type="button"
            className="shop-arrow shop-arrow-left"
            onClick={() =>
              scrollByCard("left")
            }
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>

          {/* =================================================
              PRODUCTS
          ================================================= */}

          <div
            className="shop-home-right"
            ref={trackRef}
          >

            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (
              <div className="loading">
                Loading Products...
              </div>
            )}

            {/* =================================================
                EMPTY PRODUCTS
            ================================================= */}

            {!loading &&
              products.length === 0 && (
                <div className="loading">
                  No products available.
                </div>
              )}

            {/* =================================================
                PRODUCT LIST
            ================================================= */}

            {!loading &&
              products.length > 0 &&
              products.map((item, index) => {

                const productId =
                  item.id ||
                  item.productId ||
                  item._id ||
                  index;

                const isWished =
                  wishlist.includes(
                    productId
                  );

                const productSlug =
                  createProductSlug(
                    item.name
                  );

                return (
                  <Link
                    to={`/shop/${productSlug}`}
                    state={{
                      product: item,
                    }}
                    key={productId}
                    className="shop-card"
                  >

                    {/* =================================================
                        PRODUCT IMAGE
                    ================================================= */}

                    <div className="shop-image-wrap">

                      <img
                        src={
                          item.primaryImage ||
                          item.image ||
                          item.imageUrl ||
                          FALLBACK_IMAGE
                        }
                        alt={
                          item.name ||
                          "Royal Kraft Product"
                        }
                        className="shop-image"
                        loading="lazy"
                        onError={
                          handleImageError
                        }
                      />

                      {/* =================================================
                          WISHLIST BUTTON
                      ================================================= */}

                      <button
                        type="button"
                        className={`wishlist-btn ${
                          isWished
                            ? "active"
                            : ""
                        }`}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();

                          toggleWishlist(
                            productId
                          );
                        }}
                        aria-label={
                          isWished
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                      >
                        <Heart
                          size={16}
                          fill={
                            isWished
                              ? "#c89b3c"
                              : "none"
                          }
                        />
                      </button>

                    </div>

                    {/* =================================================
                        PRODUCT INFORMATION
                    ================================================= */}

                    <div className="shop-info">

                      <h4>
                        {item.name ||
                          "Product Name"}
                      </h4>

                      {item.category && (
                        <span className="shop-category">
                          {item.category}
                        </span>
                      )}

                    </div>

                  </Link>
                );
              })}

          </div>

          {/* =================================================
              RIGHT ARROW
          ================================================= */}

          <button
            type="button"
            className="shop-arrow shop-arrow-right"
            onClick={() =>
              scrollByCard("right")
            }
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>

        </div>

        {/* =================================================
            VIEW ALL PRODUCTS
        ================================================= */}

        <div className="shop-home-footer">

          <Link to="/shop">
            <button
              type="button"
              className="all-btn"
            >
              VIEW ALL PRODUCTS
            </button>
          </Link>

        </div>

      </div>
    </section>
  );
};

export default ShopHome;