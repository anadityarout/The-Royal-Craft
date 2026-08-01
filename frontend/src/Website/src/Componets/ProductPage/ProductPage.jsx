import React, { useEffect, useMemo, useState } from "react";
import "./ProductPage.css";
import productBanner from "../../assets/banner.jpg";
import PageSeo from "../SeoPage/PageSeo";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/product";

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

const ProductPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
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

  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        const categoryMatch =
          activeCategory === "All" ||
          item.category?.trim().toLowerCase() ===
            activeCategory.trim().toLowerCase();

        const searchMatch =
          item.name?.toLowerCase().includes(search.toLowerCase()) ||
          item.description
            ?.toLowerCase()
            .includes(search.toLowerCase());

        return categoryMatch && searchMatch;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products, activeCategory, search]);

  return (
    <>
      <PageSeo page="Product" />

      {/* Banner */}
      <section className="product-page-banner">
        <img
          src={productBanner}
          alt="Royal Craft Products"
          className="product-page-banner-image"
        />
      </section>

      {/* Search */}
      <section className="product-search-section">
        <div className="product-search-wrapper">
          <input
            type="text"
            placeholder="Search Products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="product-search-input"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="product-page-filter">
        <div className="product-page-filter-wrapper">
          {categories.map((category) => (
            <button
              key={category}
              className={`product-page-filter-btn ${
                activeCategory === category ? "active" : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Product Count */}
      {!loading && (
        <div className="product-count">
          <h3>{filteredProducts.length} Products</h3>
        </div>
      )}

      {/* Products */}
      <section className="product-page-list">
        {loading ? (
          <h3 style={{ textAlign: "center", padding: "50px" }}>
            Loading Products...
          </h3>
        ) : filteredProducts.length === 0 ? (
          <h3 style={{ textAlign: "center", padding: "50px" }}>
            No Products Found
          </h3>
        ) : (
          <div className="product-page-grid">
            {filteredProducts.map((product) => (
              <div
                className="product-page-card"
                key={product.id}
              >
                <img
                  src={product.image}
                  alt={product.altText || product.name}
                  className="product-page-image"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.target.src = "/no-image.png";
                  }}
                />

                <div className="product-page-content">
                  <h3>{product.name}</h3>

                  <p>{product.description}</p>

                  <span className="product-category">
                    {product.category}
                  </span>
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