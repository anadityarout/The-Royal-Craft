import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Product.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/product";

// How many cards to show at once, based on viewport width
const getItemsPerView = () => {
  if (window.innerWidth <= 480) return 1;
  if (window.innerWidth <= 768) return 2;
  if (window.innerWidth <= 1100) return 3;
  return 4;
};

const Product = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [startIndex, setStartIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(getItemsPerView());

  useEffect(() => {
    loadProducts();
  }, []);

  // Keep itemsPerView in sync with screen size
  useEffect(() => {
    const handleResize = () => setItemsPerView(getItemsPerView());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset to the first slide whenever the category or item count changes
  useEffect(() => {
    setStartIndex(0);
  }, [activeCategory, itemsPerView]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const data = await response.json();

      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Build unique category list from products
  const categories = [
    "All",
    ...new Set(
      products
        .map((item) => item.category?.trim())
        .filter((cat) => cat)
    ),
  ];

  // Filter products by selected category
  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((item) => item.category === activeCategory);

  const canGoPrev = startIndex > 0;
  const canGoNext = startIndex + itemsPerView < filteredProducts.length;

  // Right arrow -> slide left to right, moving forward to next set
  const handleNext = () => {
    if (!canGoNext) return;
    setStartIndex((prev) =>
      Math.min(prev + itemsPerView, filteredProducts.length - itemsPerView)
    );
  };

  // Left arrow -> slide right to left, moving back to previous set
  const handlePrev = () => {
    if (!canGoPrev) return;
    setStartIndex((prev) => Math.max(prev - itemsPerView, 0));
  };

  const visibleProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerView
  );

  return (
    <section className="product-section">
      {/* Header row */}
      <div className="product-header">
        <div className="product-heading">
          <span className="product-tag">OUR PRODUCTS</span>
          <h2 className="product-title">Our Premium FRP Products.</h2>
        </div>

        <p className="product-description">
          Discover a wide collection of handcrafted FRP products designed to
          add sophistication and grandeur to every space.
        </p>
      </div>

      {/* Product row with arrows */}
      <div className="product-row-wrapper">
        <button
          className="product-arrow product-arrow-left"
          onClick={handlePrev}
          disabled={!canGoPrev}
          aria-label="Previous products"
        >
          <ChevronLeft size={22} />
        </button>

        <div className="product-row">
          {loading ? (
            <p className="product-status">Loading...</p>
          ) : visibleProducts.length > 0 ? (
            visibleProducts.map((item) => (
              <div className="product-card" key={item.id}>
                <div className="product-image">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="product-info">
                  <h3>{item.name}</h3>
                  {item.category && <p>{item.category}</p>}
                </div>
              </div>
            ))
          ) : (
            <p className="product-status">No products available.</p>
          )}
        </div>

        <button
          className="product-arrow product-arrow-right"
          onClick={handleNext}
          disabled={!canGoNext}
          aria-label="Next products"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Button */}
      <div className="product-btn-wrapper">
        <button
          className="view-products"
          onClick={() => navigate("/product")}
        >
          VIEW ALL PRODUCTS
        </button>
      </div>
    </section>
  );
};

export default Product;
