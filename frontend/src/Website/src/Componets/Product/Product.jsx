import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Product.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/product";

const Product = () => {
    const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    loadProducts();
  }, []);

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

  return (
    <section className="product-section">
      {/* Header row */}
      <div className="product-header">
        <div className="product-heading">
          <span className="product-tag">OUR PRODUCTS</span>
          <h2 className="product-title">WHAT WE CRAFT.</h2>
        </div>

        <p className="product-description">
          A wide range of architectural fiber elements and décor products
          crafted to transform ordinary spaces into extraordinary
          experiences.
        </p>
      </div>

      

      {/* Product row */}
      <div className="product-row">
        {loading ? (
          <p className="product-status">Loading...</p>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
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