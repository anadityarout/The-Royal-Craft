import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
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

      setProducts(Array.isArray(data) ? data.slice(0, 12) : []);
    } catch (err) {
      console.log(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  const scrollByCard = (direction) => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector(".shop-card");
    const cardWidth = card ? card.offsetWidth + 16 : 300;

    track.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="shop-home">
     <div className="shop-home-inner">
      <div className="shop-home-header">
        <div className="shop-home-heading">
          <span className="shop-subtitle">SHOP NOW</span>
          <h2>
            SHOP THE
            <br />
            ROYAL COLLECTION
          </h2>
        </div>

        <p className="shop-home-desc">
          Handpicked décor accents and luxury pieces available for purchase.
          Bring home the elegance of The Royal Craft.
        </p>
      </div>

      <div className="shop-home-carousel">
        <button
          type="button"
          className="shop-arrow shop-arrow-left"
          onClick={() => scrollByCard("left")}
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="shop-home-right" ref={trackRef}>
          {loading ? (
            <div className="loading">Loading Products...</div>
          ) : (
            products.map((item) => {
              const isWished = wishlist.includes(item.id);

              return (
                <Link to="/shop" key={item.id} className="shop-card">
                  <div className="shop-image-wrap">
                    <img
                      src={item.primaryImage}
                      alt={item.name}
                      className="shop-image"
                    />

                    <button
                      type="button"
                      className={`wishlist-btn ${isWished ? "active" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(item.id);
                      }}
                    >
                      <Heart size={16} fill={isWished ? "#c89b3c" : "none"} />
                    </button>
                  </div>

                  <div className="shop-info">
                    <h4>{item.name}</h4>
                    {item.category && (
                      <span className="shop-category">{item.category}</span>
                    )}

                    <div className="price-row">
                      <div className="price-group">
                        {item.oldPrice && (
                          <span className="old-price">₹{item.oldPrice}</span>
                        )}
                        <span className="price">₹{item.price ?? "—"}</span>
                      </div>

                      <button
                        type="button"
                        className="cart-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // add-to-cart logic here
                        }}
                      >
                        <ShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        <button
          type="button"
          className="shop-arrow shop-arrow-right"
          onClick={() => scrollByCard("right")}
          aria-label="Scroll right"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="shop-home-footer">
        <Link to="/shop">
          <button className="all-btn">VIEW ALL PRODUCTS</button>
        </Link>
      </div>
     </div>
    </section>
  );
};

export default ShopHome;
