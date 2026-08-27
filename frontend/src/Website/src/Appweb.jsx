import React from "react";
import {
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";

import Navbar from "./Componets/Navbar/Navbar";
import PageSeo from "./Componets/SeoPage/PageSeo";

import HomeSlider from "./Componets/Home/HomeSlider";
import About from "./Componets/About/About";
import Counter from "./Componets/Counting/Counter";
import Work from "./Componets/Work/Work";
import Product from "./Componets/Product/Product";
import Process from "./Componets/Process/Process";

import ProductPage from "./Componets/ProductPage/ProductPage";
import ServicePage from "./Componets/Service/ServicePage";
import BlogPage from "./Componets/Blog/BlogPage";
import GalleryPage from "./Componets/Gallery/GalleryPage";
import AboutPage from "./Componets/AboutPage/AboutPage";
import Footer from "./Componets/Footer/Footer";
import ContactPage from "./Componets/Contact/ContactPage";

import Shop from "./Componets/Shop/Shop";
import ShopHome from "./Componets/Shop/ShopHome";
import ShopPage from "./Componets/Shop/ShopPage";

import Project from "./Componets/Projects/Project";
import WhyChooseUs from "./Componets/Choose/WhyChooseUs";
import Banner from "./Componets/Banner/Banner";
import ProjectPage from "./Componets/Projects/ProjectPage";
import Client from "./Componets/Client/Client";
import Popup from "./Componets/Popup/Popup";


/* =========================================================
   HOME
========================================================= */

function Home() {
  return (
    <>
      <PageSeo page="Home" />

      <HomeSlider />
      <Counter />
      <Process />
      <About />
      <Work />

      {/* SHOP HOME */}
      <ShopHome />

      <Product />
      <Project />
      <WhyChooseUs />
      <Client />
      <Banner />
      <Popup />
    </>
  );
}


/* =========================================================
   SHOP ROUTE
========================================================= */

function ShopRoute() {
  const location = useLocation();

  const product = location.state?.product;

  const showAllProducts =
    location.state?.showAllProducts;

  /*
   * PRODUCT CLICKED FROM SHOP HOME
   *
   * ShopHome sends:
   *
   * state={{
   *   product: item
   * }}
   *
   * So directly open ShopPage.
   */

  if (product && !showAllProducts) {
    return (
      <ShopPage
        product={product}
        onBack={() => window.history.back()}
      />
    );
  }

  /*
   * VIEW ALL PRODUCTS
   *
   * If there is no selected product,
   * show the normal Shop listing.
   */

  return <Shop />;
}


/* =========================================================
   WEBSITE LAYOUT
========================================================= */

function WebsiteLayout() {
  return (
    <>
      <Navbar />

      <Outlet />

      <Footer />
    </>
  );
}


/* =========================================================
   404 PAGE
========================================================= */

function NotFound() {
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

      <a
        href="/"
        style={{
          display: "inline-block",
          padding: "13px 28px",
          background: "#e6009e",
          color: "#ffffff",
          textDecoration: "none",
          borderRadius: "6px",
          fontSize: "15px",
          fontWeight: "600",
        }}
      >
        Back to Home
      </a>
    </div>
  );
}


/* =========================================================
   APP
========================================================= */

function App() {
  return (
    <Routes>

      {/* =====================================================
          ALL VALID WEBSITE PAGES
      ===================================================== */}

      <Route element={<WebsiteLayout />}>

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* PROJECT */}

        <Route
          path="/project"
          element={<ProjectPage />}
        />


        {/* PRODUCT */}

        <Route
          path="/product"
          element={<ProductPage />}
        />


        {/* SHOP */}

        <Route
          path="/shop"
          element={<ShopRoute />}
        />


        {/* SERVICE */}

        <Route
          path="/service"
          element={<ServicePage />}
        />


        {/* BLOG */}

        <Route
          path="/blog"
          element={<BlogPage />}
        />


        {/* GALLERY */}

        <Route
          path="/gallery"
          element={<GalleryPage />}
        />


        {/* ABOUT */}

        <Route
          path="/about"
          element={<AboutPage />}
        />


        {/* CONTACT */}

        <Route
          path="/contact"
          element={<ContactPage />}
        />

      </Route>


      {/* =====================================================
          INVALID URL
      ===================================================== */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}

export default App;