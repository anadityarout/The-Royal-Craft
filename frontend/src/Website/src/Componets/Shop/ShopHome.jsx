import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./ShopHome.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/shop-product";

const ShopHome = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const trackRef = useRef(null);

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

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Product loading error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // WISHLIST
  // ==============================

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id)
        ? prev.filter((w) => w !== id)
        : [...prev, id]
    );
  };

  // ==============================
  // CAROUSEL
  // ==============================

  const scrollByCard = (direction) => {
    const track = trackRef.current;

    if (!track) return;

    const card = track.querySelector(".shop-card");

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

  return (
    <section className="shop-home">
      <div className="shop-home-inner">

        {/* =========================
            HEADER
        ========================== */}

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

        {/* =========================
            CAROUSEL
        ========================== */}

        <div className="shop-home-carousel">

          {/* LEFT ARROW */}

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

          {/* =========================
              PRODUCTS
          ========================== */}

          <div
            className="shop-home-right"
            ref={trackRef}
          >

            {loading ? (

              <div className="loading">
                Loading Products...
              </div>

            ) : products.length === 0 ? (

              <div className="loading">
                No products available.
              </div>

            ) : (

              products.map((item) => {

                const isWished =
                  wishlist.includes(item.id);

                return (

                  <Link
                    to="/shop"
                    state={{
                      product: item,
                    }}
                    key={item.id}
                    className="shop-card"
                  >

                    {/* =========================
                        PRODUCT IMAGE
                    ========================== */}

                    <div className="shop-image-wrap">

                      <img
                        src={item.primaryImage}
                        alt={
                          item.name ||
                          "Royal Kraft Product"
                        }
                        className="shop-image"
                      />

                      {/* WISHLIST */}

                      <button
                        type="button"
                        className={`wishlist-btn ${
                          isWished
                            ? "active"
                            : ""
                        }`}
                        onClick={(e) => {

                          e.preventDefault();
                          e.stopPropagation();

                          toggleWishlist(
                            item.id
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

                    {/* =========================
                        PRODUCT INFORMATION
                    ========================== */}

                    <div className="shop-info">

                      <h4>
                        {item.name}
                      </h4>

                      {item.category && (
                        <span className="shop-category">
                          {item.category}
                        </span>
                      )}

                      {/* PRICE */}

                      <div className="price-row">

                        <div className="price-group">

                          {item.oldPrice && (
                            <span className="old-price">
                              ₹{item.oldPrice}
                            </span>
                          )}

                          <span className="price">
                            ₹
                            {item.price ??
                              "—"}
                          </span>

                        </div>

                        {/* CART */}

                        <button
                          type="button"
                          className="cart-btn"
                          onClick={(e) => {

                            e.preventDefault();
                            e.stopPropagation();

                            // Add to cart logic
                            console.log(
                              "Add to cart:",
                              item
                            );

                          }}
                          aria-label="Add to cart"
                        >

                          <ShoppingCart
                            size={16}
                          />

                        </button>

                      </div>

                    </div>

                  </Link>

                );

              })

            )}

          </div>

          {/* RIGHT ARROW */}

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

        {/* =========================
            VIEW ALL
        ========================== */}

        <div className="shop-home-footer">

          <Link
            to="/shop"
            state={{
              products: products,
              showAllProducts: true,
            }}
          >
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