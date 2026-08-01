import React from "react";
import { Routes, Route } from "react-router-dom";

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
import Project from "./Componets/Projects/Project";
import WhyChooseUs from "./Componets/Choose/WhyChooseUs";
import Banner from "./Componets/Banner/Banner";
import ProjectPage from "./Componets/Projects/ProjectPage";
import Client from "./Componets/Client/Client";

function Home() {
  return (
    <>
      <PageSeo page="Home" />

      <HomeSlider />
      <Counter />
      <Process />
      <About />
      <Work />
      <Product />
      <Project />
      <WhyChooseUs />
      <Client />
      <Banner />
    </>
  );
}

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/project"
          element={<ProjectPage />}
        />

        <Route
          path="/product"
          element={<ProductPage />}
        />

        <Route
          path="/shop"
          element={<Shop />}
        />

        <Route
          path="/service"
          element={<ServicePage />}
        />

        <Route
          path="/blog"
          element={<BlogPage />}
        />

        <Route
          path="/gallery"
          element={<GalleryPage />}
        />

        <Route
          path="/about"
          element={<AboutPage />}
        />

        <Route
          path="/contact"
          element={<ContactPage />}
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;