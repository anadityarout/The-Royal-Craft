// Shop.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Shop.css";
import BannerImage from "../../assets/banner.jpg";
import PageSeo from "../SeoPage/PageSeo";

import {
  FiSearch,
  FiTruck,
  FiShield,
  FiHeadphones,
} from "react-icons/fi";

// =====================================================
// PRODUCT API
// =====================================================

const PRODUCT_API =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/shop-product";

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
// SHOP
// =====================================================

const Shop = () => {
  const navigate = useNavigate();

  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = [
    "All Products",
    "Panels",
    "PVC Box",
    "PS Corner",
    "Ceiling Design",
    "Domes",
    "Spacer",
    "Decorative Elements",
    "Stage",
    "Mandap",
    "Food Court",
    "Front Elevation",
    "Main Gate",
    "Fountain",
    "Gazebo",
    "Statue",
    "Interior",
    "Exterior",
    "Railings",
    "Selfie Point",
  ];

  // =====================================================
  // BANNER
  // =====================================================

  const [shopData, setShopData] = useState({
    breadcrumb: "Home > Shop",
    image: BannerImage,
  });

  // =====================================================
  // PRODUCTS
  // =====================================================

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] =
    useState([]);

  // =====================================================
  // SEARCH
  // =====================================================

  const [search, setSearch] = useState("");

  // =====================================================
  // CATEGORY
  // =====================================================

  const [selectedCategory, setSelectedCategory] =
    useState("All Products");

  // =====================================================
  // SORT
  // =====================================================

  const [sortBy, setSortBy] = useState("Newest");

  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // =================================================
      // LOAD SHOP BANNER
      // =================================================

      const banner =
        localStorage.getItem("shopBanner");

      if (banner) {
        try {
          const data = JSON.parse(banner);

          setShopData({
            title: data.title || "Shop",

            breadcrumb:
              data.breadcrumb || "Home > Shop",

            image:
              data.image || BannerImage,
          });
        } catch (error) {
          console.error(
            "Invalid shop banner data:",
            error
          );
        }
      }

      // =================================================
      // LOAD PRODUCTS
      // =================================================

      const response = await fetch(PRODUCT_API);

      if (!response.ok) {
        throw new Error(
          "Unable to load products."
        );
      }

      const productData =
        await response.json();

      const safeProducts =
        Array.isArray(productData)
          ? productData
          : [];

      setProducts(safeProducts);

      setFilteredProducts(
        safeProducts
      );
    } catch (error) {
      console.error(
        "Shop data loading error:",
        error
      );

      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FILTER PRODUCTS
  // =====================================================

  const filterProducts = (
    searchText,
    category,
    sort = sortBy
  ) => {
    let result = [...products];

    // =================================================
    // CATEGORY FILTER
    // =================================================

    if (category !== "All Products") {
      result = result.filter(
        (item) =>
          item.category === category
      );
    }

    // =================================================
    // SEARCH FILTER
    // =================================================

    if (searchText.trim() !== "") {
      const keyword =
        searchText
          .toLowerCase()
          .trim();

      result = result.filter(
        (item) =>
          item.name
            ?.toLowerCase()
            .includes(keyword) ||

          item.category
            ?.toLowerCase()
            .includes(keyword) ||

          item.description
            ?.toLowerCase()
            .includes(keyword)
      );
    }

    // =================================================
    // SORT
    // =================================================

    if (sort === "Newest") {
      result.sort((a, b) => {
        const dateA = new Date(
          a.created || 0
        );

        const dateB = new Date(
          b.created || 0
        );

        return dateB - dateA;
      });
    } else {
      result.sort((a, b) => {
        const dateA = new Date(
          a.created || 0
        );

        const dateB = new Date(
          b.created || 0
        );

        return dateA - dateB;
      });
    }

    setFilteredProducts(result);
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = (e) => {
    const value = e.target.value;

    setSearch(value);

    filterProducts(
      value,
      selectedCategory,
      sortBy
    );
  };

  // =====================================================
  // CATEGORY
  // =====================================================

  const handleCategory = (category) => {
    setSelectedCategory(category);

    filterProducts(
      search,
      category,
      sortBy
    );
  };

  // =====================================================
  // SORT
  // =====================================================

  const handleSort = (e) => {
    const value = e.target.value;

    setSortBy(value);

    filterProducts(
      search,
      selectedCategory,
      value
    );
  };

  // =====================================================
  // OPEN PRODUCT DETAILS
  // =====================================================

  // =====================================================
// OPEN PRODUCT DETAILS
// =====================================================

const openProduct = (product) => {
  if (!product) return;

  // Create URL-friendly product name
  const productSlug =
    createProductSlug(product.name);

  console.log(
    "Opening product:",
    product.name
  );

  console.log(
    "Product URL:",
    `/shop/${productSlug}`
  );

  // =================================================
  // OPEN PRODUCT DETAILS
  // =================================================

  navigate(
    `/shop/${productSlug}`,
    {
      state: {
        product: product,
      },
    }
  );
};

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <>
      <PageSeo page="Shop" />

      <div className="shop-page">

        {/* =================================================
            SHOP BANNER
        ================================================= */}

        <section className="shop-banner">

          <img
            src={shopData.image}
            alt="Shop Banner"
            className="shop-banner-img"
          />

          <div className="shop-container">

            <div className="shop-content">

              <h1>
                {shopData.title}
              </h1>

              <div className="breadcrumb">

                <span>
                  {shopData.title}
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            SHOP BODY
        ================================================= */}

        <section className="shop-body">

          {/* =================================================
              SEARCH + FEATURES
          ================================================= */}

          <div className="search-section">

            {/* SEARCH */}

            <div className="search-left">

              <div className="search-input-wrapper">

                <FiSearch
                  className="search-icon"
                />

                <input
                  type="text"
                  placeholder="Search by product name, category..."
                  value={search}
                  onChange={handleSearch}
                />

              </div>

              <button
                type="button"
                className="search-btn"
                onClick={() =>
                  filterProducts(
                    search,
                    selectedCategory,
                    sortBy
                  )
                }
              >
                Search
              </button>

            </div>

            {/* FEATURES */}

            <div className="search-right">

              <div className="feature-item">

                <FiTruck
                  className="feature-icon"
                />

                <div>

                  <h4>
                    Pan India Delivery
                  </h4>

                  <p>
                    Reliable & On-time
                  </p>

                </div>

              </div>

              <div className="feature-item">

                <FiShield
                  className="feature-icon"
                />

                <div>

                  <h4>
                    Quality Assured
                  </h4>

                  <p>
                    Premium Materials
                  </p>

                </div>

              </div>

              <div className="feature-item">

                <FiHeadphones
                  className="feature-icon"
                />

                <div>

                  <h4>
                    Need Help?
                  </h4>

                  <p>
                    +91 8130462200
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              CATEGORIES
          ================================================= */}

          <div className="category-row">

            {categories.map(
              (category) => (

                <button
                  type="button"
                  key={category}
                  onClick={() =>
                    handleCategory(
                      category
                    )
                  }
                  className={
                    selectedCategory ===
                    category
                      ? "category-btn active"
                      : "category-btn"
                  }
                >
                  {category}
                </button>

              )
            )}

          </div>

          {/* =================================================
              SORT
          ================================================= */}

          <div className="shop-top">

            <div className="sort-box">

              <select
                value={sortBy}
                onChange={handleSort}
              >

                <option value="Newest">
                  Sort by: Newest
                </option>

                <option value="Oldest">
                  Sort by: Oldest
                </option>

              </select>

            </div>

          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (

            <div className="shop-loading">
              Loading Products...
            </div>

          )}

          {/* =================================================
              PRODUCT GRID
          ================================================= */}

          <div className="product-grid">

            {!loading &&
            filteredProducts.length > 0 ? (

              filteredProducts.map(
                (product, index) => (

                  <div
                    className="product-card"
                    key={
                      product.id ||
                      index
                    }
                  >

                    {/* =================================================
                        PRODUCT IMAGE
                    ================================================= */}

                    <div
                      className="product-image"
                      onClick={() =>
                        openProduct(
                          product
                        )
                      }
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {

                        if (
                          e.key === "Enter" ||
                          e.key === " "
                        ) {
                          e.preventDefault();

                          openProduct(
                            product
                          );
                        }

                      }}
                    >

                      <img
                        src={
                          product.primaryImage ||
                          "https://via.placeholder.com/400x400?text=No+Image"
                        }
                        alt={
                          product.name ||
                          "Product"
                        }
                      />

                    </div>

                    {/* =================================================
                        PRODUCT INFORMATION
                    ================================================= */}

                    <div className="product-info">

                      {/* CATEGORY */}

                      {product.category && (

                        <span className="product-category">
                          {product.category}
                        </span>

                      )}

                      {/* NAME */}

                      <h3 className="product-name">

                        {product.name ||
                          "Product Name"}

                      </h3>

                      {/* BUTTON */}

                      <div className="product-buttons">

                        <button
                          type="button"
                          className="view-btn"
                          onClick={() =>
                            openProduct(
                              product
                            )
                          }
                        >
                          View Details
                        </button>

                      </div>

                    </div>

                  </div>

                )
              )

            ) : (

              !loading && (

                <div className="no-product">

                  <img
                    src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png"
                    alt="No Product"
                  />

                  <h2>
                    No Products Found
                  </h2>

                  <p>
                    Try another search
                    keyword or choose
                    another category.
                  </p>

                </div>

              )

            )}

          </div>

        </section>

      </div>
    </>
  );
};

export default Shop;