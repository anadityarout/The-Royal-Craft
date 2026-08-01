import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Sidebar from "./Components/Sidebar/Sidebar";
import HomePage from "./Components/Home/Homepage";
import AboutPage from "./Components/HomeAbout/AboutPage";
import WorkPage from "./Components/Work/WorkPage";
import ProductPage from "./Components/ProductPage/ProductPage";
import ServicePage from "./Components/ServicePage/ServicePage";
import Gallery from "./Components/Gallery/Gallery";
import Shop from "./Components/Shop/Shop";
import BlogPage from "./Components/Blog/BlogPage";
import About from "./Components/About/About";
import Contact from "./Components/Contact/Contact";
import Leads from "./Components/Lead/Leads";
import ProjectAdmin from "./Components/Project/ProjectAdmin";
import ProcessAdmin from "./Components/ProcessAdmin/ProcessAdmin";
import ChooseAdmin from "./Components/ChooseAdmin/ChooseAdmin";
import Login from "./Components/Login/Login";
import Seo from "./Components/Seo/Seo";

// Wrap any route that needs login
function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user");
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

function Appadmin() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/admin/login";

  return (
    <div style={{ display: "flex" }}>
      {!hideSidebar && <Sidebar />}

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="login" element={<Login />} />

          <Route index element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="homepage" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="aboutpage" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
          <Route path="workpage" element={<ProtectedRoute><WorkPage /></ProtectedRoute>} />
          <Route path="productpage" element={<ProtectedRoute><ProductPage /></ProtectedRoute>} />
          <Route path="servicepage" element={<ProtectedRoute><ServicePage /></ProtectedRoute>} />
          <Route path="gallery" element={<ProtectedRoute><Gallery /></ProtectedRoute>} />
          <Route path="shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
          <Route path="blogpage" element={<ProtectedRoute><BlogPage /></ProtectedRoute>} />
          <Route path="about" element={<ProtectedRoute><About /></ProtectedRoute>} />
          <Route path="contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
          <Route path="leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
          <Route path="projectadmin" element={<ProtectedRoute><ProjectAdmin /></ProtectedRoute>} />
          <Route path="processadmin" element={<ProtectedRoute><ProcessAdmin /></ProtectedRoute>} />
          <Route path="chooseadmin" element={<ProtectedRoute><ChooseAdmin /></ProtectedRoute>} />
          <Route path="seo" element={<ProtectedRoute><Seo /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default Appadmin;
