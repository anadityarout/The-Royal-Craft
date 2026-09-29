import React, { useEffect, useState } from "react";

import {
  Routes,
  Route,
  Outlet,
  useLocation,
  useParams,
  useNavigate,
} from "react-router-dom";

// =====================================================
// NAVBAR
// =====================================================

import Navbar from "./Componets/Navbar/Navbar";

// =====================================================
// SEO
// =====================================================

import PageSeo from "./Componets/SeoPage/PageSeo";

// =====================================================
// HOME COMPONENTS
// =====================================================

import HomeSlider from "./Componets/Home/HomeSlider";
import About from "./Componets/About/About";
import Counter from "./Componets/Counting/Counter";
import Work from "./Componets/Work/Work";
import Process from "./Componets/Process/Process";

// =====================================================
// PAGES
// =====================================================

import ServicePage from "./Componets/Service/ServicePage";
import BlogPage from "./Componets/Blog/BlogPage";
import GalleryPage from "./Componets/Gallery/GalleryPage";
import AboutPage from "./Componets/AboutPage/AboutPage";
import ContactPage from "./Componets/Contact/ContactPage";

// =====================================================
// PRODUCT
// =====================================================

import Product from "./Componets/Shop/Product";
import ShopHome from "./Componets/Shop/ShopHome";
import ShopPage from "./Componets/Shop/ShopPage";

// =====================================================
// OTHER COMPONENTS
// =====================================================

import Project from "./Componets/Projects/Project";
import WhyChooseUs from "./Componets/Choose/WhyChooseUs";
import Banner from "./Componets/Banner/Banner";
import ProjectPage from "./Componets/Projects/ProjectPage";
import Client from "./Componets/Client/Client";
import Footer from "./Componets/Footer/Footer";
import Popup from "./Componets/Popup/Popup";

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
// SCROLL TO TOP
// =====================================================

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}

// =====================================================
// HOME
// =====================================================

function Home() {
  return (
    <>
      <HomeSlider />

      <Counter />

      <Process />

      <About />

      <Work />

      {/* =================================================
          PRODUCT HOME
      ================================================= */}

      <ShopHome />

      <Project />

      <WhyChooseUs />

      <Client />

      <Banner />

      <Popup />
    </>
  );
}

// =====================================================
// PRODUCT DETAIL ROUTE
// =====================================================

function ProductDetailRoute() {
  const { productSlug } = useParams();

  const location = useLocation();

  const navigate = useNavigate();

  // ===================================================
  // PRODUCT FROM NAVIGATION STATE
  // ===================================================

  const [product, setProduct] = useState(
    location.state?.product || null
  );

  // ===================================================
  // LOADING
  // ===================================================

  const [loading, setLoading] = useState(
    !location.state?.product
  );

  // ===================================================
  // LOAD PRODUCT
  // ===================================================

  useEffect(() => {
    // -------------------------------------------------
    // Product came from Product.jsx
    // -------------------------------------------------

    if (location.state?.product) {
      setProduct(location.state.product);
      setLoading(false);

      return;
    }

    // -------------------------------------------------
    // Direct URL / Refresh
    // -------------------------------------------------

    const loadProduct = async () => {
      try {
        setLoading(true);

        const response = await fetch(PRODUCT_API);

        if (!response.ok) {
          throw new Error("Unable to load products.");
        }

        const data = await response.json();

        const products = Array.isArray(data) ? data : [];

        const foundProduct = products.find((item) => {
          const itemSlug = createProductSlug(item.name);

          return itemSlug === productSlug;
        });

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Product loading error:", error);

        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productSlug, location.state]);

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          color: "#333",
        }}
      >
        Loading Product...
      </div>
    );
  }

  // ===================================================
  // PRODUCT NOT FOUND
  // ===================================================

  if (!product) {
    return (
      <div
        style={{
          minHeight: "60vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          padding: "40px 20px",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            margin: "0 0 10px",
            fontSize: "28px",
            color: "#222",
          }}
        >
          Product Not Found
        </h2>

        <p
          style={{
            margin: "0 0 25px",
            color: "#666",
          }}
        >
          The product you are looking for could not be found.
        </p>

        <button
          type="button"
          onClick={() => navigate("/product")}
          style={{
            border: "none",
            padding: "12px 25px",
            borderRadius: "6px",
            background: "#1268f3",
            color: "#fff",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "600",
          }}
        >
          Back to Product
        </button>
      </div>
    );
  }

  // ===================================================
  // PRODUCT DETAIL PAGE
  // ===================================================

  return (
    <ShopPage
      product={product}
      onBack={() => navigate("/product")}
    />
  );
}

// =====================================================
// WEBSITE LAYOUT
// =====================================================

function WebsiteLayout() {
  const location = useLocation();

  // ===================================================
  // SEO PAGE
  // ===================================================

  const getSeoPage = () => {
    const path = location.pathname.toLowerCase();

    // HOME
    if (path === "/") {
      return "Home";
    }

    // PROJECT
    if (
      path === "/project" ||
      path.startsWith("/project/")
    ) {
      return "Project";
    }

    // SERVICE
    if (path === "/service") {
      return "Service";
    }

    // PRODUCT
    if (
      path === "/product" ||
      path.startsWith("/product/")
    ) {
      return "Product";
    }

    // BLOG
    if (path === "/blog") {
      return "Blog";
    }

    // GALLERY
    if (path === "/gallery") {
      return "Gallery";
    }

    // ABOUT
    if (path === "/about") {
      return "About";
    }

    // CONTACT
    if (path === "/contact") {
      return "Contact";
    }

    return "";
  };

  const seoPage = getSeoPage();

  return (
    <>
      {/* =================================================
          DYNAMIC SEO
      ================================================= */}

      {seoPage && <PageSeo page={seoPage} />}

      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar />

      {/* =================================================
          PAGE CONTENT
      ================================================= */}

      <Outlet />

      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer />
    </>
  );
}

// =====================================================
// 404 PAGE
// =====================================================

function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        background: "#ffffff",
        padding: "40px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontSize: "clamp(100px, 18vw, 220px)",
          lineHeight: "0.85",
          fontWeight: "800",
          color: "#e6009e",
          letterSpacing: "-8px",
          marginBottom: "30px",
        }}
      >
        404
      </div>

      <h1
        style={{
          margin: "0 0 15px",
          fontSize: "36px",
          fontWeight: "700",
          color: "#222",
        }}
      >
        Page Not Found
      </h1>

      <p
        style={{
          margin: "0 0 30px",
          fontSize: "17px",
          color: "#666",
        }}
      >
        Sorry, the page you are looking for doesn't exist.
      </p>

      <button
        type="button"
        onClick={() => navigate("/")}
        style={{
          display: "inline-block",
          padding: "13px 28px",
          background: "#e6009e",
          color: "#ffffff",
          border: "none",
          borderRadius: "6px",
          fontSize: "15px",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Back to Home
      </button>
    </div>
  );
}

// =====================================================
// APP
// =====================================================

function App() {
  return (
    <>
      {/* =================================================
          SCROLL TO TOP
      ================================================= */}

      <ScrollToTop />

      {/* =================================================
          ROUTES
      ================================================= */}

      <Routes>
        {/* =================================================
            WEBSITE LAYOUT
        ================================================= */}

        <Route element={<WebsiteLayout />}>

          {/* =================================================
              HOME
          ================================================= */}

          <Route
            path="/"
            element={<Home />}
          />

          {/* =================================================
              PROJECT
          ================================================= */}

          <Route
            path="/project"
            element={<ProjectPage />}
          />

          <Route
            path="/project/:projectName"
            element={<ProjectPage />}
          />

          {/* =================================================
              PRODUCT
          ================================================= */}

          <Route
            path="/product"
            element={<Product />}
          />

          {/* =================================================
              PRODUCT DETAILS
          ================================================= */}

          <Route
            path="/product/:productSlug"
            element={<ProductDetailRoute />}
          />

          {/* =================================================
              SERVICE
          ================================================= */}

          <Route
            path="/service"
            element={<ServicePage />}
          />

          {/* =================================================
              BLOG
          ================================================= */}

          <Route
            path="/blog"
            element={<BlogPage />}
          />

          {/* =================================================
              GALLERY
          ================================================= */}

          <Route
            path="/gallery"
            element={<GalleryPage />}
          />

          {/* =================================================
              ABOUT
          ================================================= */}

          <Route
            path="/about"
            element={<AboutPage />}
          />

          {/* =================================================
              CONTACT
          ================================================= */}

          <Route
            path="/contact"
            element={<ContactPage />}
          />

        </Route>

        {/* =================================================
            INVALID URL
        ================================================= */}

        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </>
  );
}

export default App;