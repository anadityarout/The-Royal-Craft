import React, { useEffect, useState } from "react";
import "./Shop.css";
import BannerImage from "../../assets/banner.jpg";
import PageSeo from "../SeoPage/PageSeo";
import ShopPage from "../Shop/ShopPage";
import {
  FiSearch,
  FiTruck,
  FiShield,
  FiHeadphones,
} from "react-icons/fi";

const PRODUCT_API =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/shop-product";

const Shop = () => {


  /* ===========================
     Categories
  =========================== */

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

  /* ===========================
      Banner
  =========================== */

  const [shopData, setShopData] = useState({
      image: BannerImage,
  });

  /* ===========================
      Products
  =========================== */

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  /* ===========================
      Search
  =========================== */

  const [search, setSearch] = useState("");

  /* ===========================
      Category
  =========================== */

  const [selectedCategory, setSelectedCategory] =
    useState("All Products");

  const [sortBy, setSortBy] =
    useState("Newest");

  const [loading, setLoading] =
    useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showProductPage, setShowProductPage] = useState(false);

  /* ===========================
      Load Data
  =========================== */

  useEffect(() => {

    loadData();

  }, []);

  const loadData = async () => {

    try {

      setLoading(true);

      // Banner

      const banner =
        localStorage.getItem("shopBanner");

      if (banner) {

        const data = JSON.parse(banner);

        setShopData({

          title:
            data.title || "Shop",

          breadcrumb:
            data.breadcrumb ||
            "Home > Shop",

          image: data.image || BannerImage,

        });

      }

      // Products

      const response =
        await fetch(PRODUCT_API);

      if (!response.ok) {

        throw new Error(         
          "Unable to load products."
        );

      }

      const productData =
        await response.json();

      setProducts(productData);

      setFilteredProducts(productData);

    } catch (err) {

      console.log(err);

      setProducts([]);

      setFilteredProducts([]);

    } finally {

      setLoading(false);

    }

  };

  /* ===========================
      Filter Products
  =========================== */
  /* ===========================
    Filter Products
=========================== */

const filterProducts = (
  searchText,
  category,
  sort = sortBy
) => {

  let result = [...products];

  // ==========================
  // Category Filter
  // ==========================

  if (category !== "All Products") {

    result = result.filter(
      (item) =>
        item.category === category
    );

  }

  // ==========================
  // Search Filter
  // ==========================

  if (searchText.trim() !== "") {

    const keyword =
      searchText.toLowerCase();

    result = result.filter((item) =>

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

  // ==========================
  // Sort
  // ==========================

  if (sort === "Newest") {

    result.sort(
      (a, b) =>
        new Date(b.created) -
        new Date(a.created)
    );

  } else {

    result.sort(
      (a, b) =>
        new Date(a.created) -
        new Date(b.created)
    );

  }

  setFilteredProducts(result);

};

/* ===========================
    Search
=========================== */

const handleSearch = (e) => {

  const value = e.target.value;

  setSearch(value);

  filterProducts(
    value,
    selectedCategory,
    sortBy
  );

};

/* ===========================
    Category
=========================== */

const handleCategory = (category) => {

  setSelectedCategory(category);

  filterProducts(
    search,
    category,
    sortBy
  );

};

/* ===========================
    Sorting
=========================== */

const handleSort = (e) => {

  const value = e.target.value;

  setSortBy(value);

  filterProducts(
    search,
    selectedCategory,
    value
  );

};
// ===========================
// Show Product Details Page
// ===========================

if (showProductPage && selectedProduct) {
  return (
    <ShopPage
      product={selectedProduct}
      onBack={() => {
        setShowProductPage(false);
        setSelectedProduct(null);
      }}
    />
  );
}

return (
    <>
        <PageSeo page="Shop" />

  <div className="shop-page">

    {/* ================= Banner ================= */}

    <section className="shop-banner">

  <img
    src={shopData.image}
    alt="Shop Banner"
    className="shop-banner-img"
  />

  <div className="shop-container">
    <div className="shop-content">
      <h1>{shopData.title}</h1>

      <div className="breadcrumb">
        <span>{shopData.title}</span>
      </div>
    </div>
  </div>

</section>
    {/* ================= Shop ================= */}

    <section className="shop-body">

      {/* Search */}

      <div className="search-section">

        <div className="search-left">

          <FiSearch className="search-icon" />

          <input
            type="text"
            placeholder="Search by product name, category..."
            value={search}
            onChange={handleSearch}
          />

          <button className="search-btn">
            Search
          </button>

        </div>

        <div className="search-right">

          <div className="feature-item">

            <FiTruck className="feature-icon" />

            <div>

              <h4>Pan India Delivery</h4>

              <p>Reliable & On-time</p>

            </div>

          </div>

          <div className="feature-item">

            <FiShield className="feature-icon" />

            <div>

              <h4>Quality Assured</h4>

              <p>Premium Materials</p>

            </div>

          </div>

          <div className="feature-item">

            <FiHeadphones className="feature-icon" />

            <div>

              <h4>Need Help?</h4>

              <p>+91 93118 26565</p>

            </div>

          </div>

        </div>

      </div>

      {/* Categories */}

      <div className="category-row">

        {categories.map((category) => (

          <button
            key={category}
            onClick={() =>
              handleCategory(category)
            }
            className={
              selectedCategory === category
                ? "category-btn active"
                : "category-btn"
            }
          >

            {category}

          </button>

        ))}

      </div>

      {/* Sort */}

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

      {/* Loading */}

      {loading && (

        <div
          style={{
            textAlign: "center",
            padding: "40px",
            fontSize: "18px",
          }}
        >
          Loading Products...
        </div>

      )}

      {/* Products */}
      {/* Products */}

<div className="product-grid">

  {!loading && filteredProducts.length > 0 ? (

    filteredProducts.map((product, index) => (

      <div
        className="product-card"
        key={product.id || index}
      >

        {/* Product Image */}

        <div
          className="product-image"
          onClick={() => {
            setSelectedProduct(product);
            setShowProductPage(true);
          }}
        >

          <img
            src={
              product.primaryImage ||
              "https://via.placeholder.com/400x400?text=No+Image"
            }
            alt={product.name}
          />

        </div>

        {/* Product Details */}

        <div className="product-info">

  <span className="product-category">
    {product.category}
  </span>

  <h3 className="product-name">
    {product.name || "Product Name"}
  </h3>

  <div className="product-buttons">

    <button
      className="view-btn"
      onClick={() => {
        setSelectedProduct(product);
        setShowProductPage(true);
      }}
    >
      View Details
    </button>

    

  </div>

</div>

      </div>

    ))

  ) : (

    !loading && (

      <div className="no-product">

        <img
          src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png"
          alt="No Product"
        />

        <h2>No Products Found</h2>

        <p>

          Try another search keyword or choose another category.

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
