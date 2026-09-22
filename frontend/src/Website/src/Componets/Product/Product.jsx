import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Product.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/product";

// How many cards to show at once based on viewport width
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

  // =========================================================
  // LOAD PRODUCTS
  // =========================================================
  useEffect(() => {
    loadProducts();
  }, []);

  // =========================================================
  // RESPONSIVE ITEMS PER VIEW
  // =========================================================
  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(getItemsPerView());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // =========================================================
  // RESET CAROUSEL WHEN CATEGORY / SCREEN SIZE CHANGES
  // =========================================================
  useEffect(() => {
    setStartIndex(0);
  }, [activeCategory, itemsPerView]);

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================
  const loadProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const data = await response.json();

      // Make sure we always have an array
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Invalid product data:", data);
        setProducts([]);
      }
    } catch (err) {
      console.error("Error loading products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // ONLY SHOW PRODUCTS
  // =========================================================
  // Banner records are removed completely.
  //
  // This prevents:
  // type: "Banner"
  // category: "banner"
  //
  // from appearing inside the product carousel.
  const productItems = products.filter((item) => {
    const type = item.type?.trim().toLowerCase();
    const category = item.category?.trim().toLowerCase();

    return type !== "banner" && category !== "banner";
  });

  // =========================================================
  // BUILD CATEGORY LIST
  // =========================================================
  const categories = [
    "All",
    ...new Set(
      productItems
        .map((item) => item.category?.trim())
        .filter((category) => category)
    ),
  ];

  // =========================================================
  // FILTER PRODUCTS BY CATEGORY
  // =========================================================
  const filteredProducts =
    activeCategory === "All"
      ? productItems
      : productItems.filter(
          (item) => item.category?.trim() === activeCategory
        );

  // =========================================================
  // CAROUSEL ARROW STATUS
  // =========================================================
  const canGoPrev = startIndex > 0;

  const canGoNext =
    startIndex + itemsPerView < filteredProducts.length;

  // =========================================================
  // NEXT BUTTON
  // =========================================================
  const handleNext = () => {
    if (!canGoNext) return;

    setStartIndex((prev) =>
      Math.min(
        prev + itemsPerView,
        Math.max(filteredProducts.length - itemsPerView, 0)
      )
    );
  };

  // =========================================================
  // PREVIOUS BUTTON
  // =========================================================
  const handlePrev = () => {
    if (!canGoPrev) return;

    setStartIndex((prev) =>
      Math.max(prev - itemsPerView, 0)
    );
  };

  // =========================================================
  // CURRENT VISIBLE PRODUCTS
  // =========================================================
  const visibleProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerView
  );

  return (
    <section className="product-section">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="product-header">

        <div className="product-heading">
          <span className="product-tag">
            OUR PRODUCTS
          </span>

          <h2 className="product-title">
            Our Premium FRP Products.
          </h2>
        </div>

        <p className="product-description">
          Discover a wide collection of handcrafted FRP
          products designed to add sophistication and
          grandeur to every space.
        </p>

      </div>

      {/* =====================================================
          PRODUCT ROW
      ===================================================== */}
      <div className="product-row-wrapper">

        {/* LEFT ARROW */}
        <button
          className="product-arrow product-arrow-left"
          onClick={handlePrev}
          disabled={!canGoPrev}
          aria-label="Previous products"
        >
          <ChevronLeft size={22} />
        </button>

        {/* PRODUCT CARDS */}
        <div className="product-row">

          {loading ? (

            <p className="product-status">
              Loading...
            </p>

          ) : visibleProducts.length > 0 ? (

            visibleProducts.map((item) => (

              <div
                className="product-card"
                key={item.id}
              >

                {/* PRODUCT IMAGE */}
                <div className="product-image">

                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name || "FRP Product"}
                      loading="lazy"
                    />
                  ) : (
                    <div className="product-image-placeholder">
                      No Image
                    </div>
                  )}

                </div>

                {/* PRODUCT INFORMATION */}
                <div className="product-info">

                  <h3>
                    {item.name || "FRP Product"}
                  </h3>

                  {item.category && (
                    <p>
                      {item.category}
                    </p>
                  )}

                </div>

              </div>

            ))

          ) : (

            <p className="product-status">
              No products available.
            </p>

          )}

        </div>

        {/* RIGHT ARROW */}
        <button
          className="product-arrow product-arrow-right"
          onClick={handleNext}
          disabled={!canGoNext}
          aria-label="Next products"
        >
          <ChevronRight size={22} />
        </button>

      </div>

      {/* =====================================================
          VIEW ALL PRODUCTS BUTTON
      ===================================================== */}
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