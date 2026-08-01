import { Routes, Route } from "react-router-dom";

import Appweb from "./Website/src/Appweb";
import Appadmin from "./Admin dashboard/src/Appadmin";

import HomePage from "./Admin dashboard/src/Components/Home/Homepage";
import AboutPage from "./Admin dashboard/src/Components/HomeAbout/AboutPage";
import WorkPage from "./Admin dashboard/src/Components/Work/WorkPage";
import ProductPage from "./Admin dashboard/src/Components/ProductPage/ProductPage";
import ServicePage from "./Admin dashboard/src/Components/ServicePage/ServicePage";
import Gallery from "./Admin dashboard/src/Components/Gallery/Gallery";
import Shop from "./Admin dashboard/src/Components/Shop/Shop";
import BlogPage from "./Admin dashboard/src/Components/Blog/BlogPage";
import About from "./Admin dashboard/src/Components/About/About";
import Contact from "./Admin dashboard/src/Components/Contact/Contact";
import Leads from "./Admin dashboard/src/Components/Lead/Leads";
import ProjectPage from "./Website/src/Componets/Projects/ProjectPage";
import ProjectAdmin from "./Admin dashboard/src/Components/Project/ProjectAdmin";
import ProcessAdmin from "./Admin dashboard/src/Components/ProcessAdmin/ProcessAdmin";
import ChooseAdmin from "./Admin dashboard/src/Components/ChooseAdmin/ChooseAdmin";
import Login from "./Admin dashboard/src/Components/Login/Login";
import Seo from "./Admin dashboard/src/Components/Seo/Seo";
function Appmain() {
  return (
    <Routes>
      <Route path="/*" element={<Appweb />} />

      <Route path="/admin" element={<Appadmin />}>
        <Route index element={<HomePage />} />
        <Route path="homepage" element={<HomePage />} />
        <Route path="aboutpage" element={<AboutPage />} />
        <Route path="workpage" element={<WorkPage />} />
        <Route path="productpage" element={<ProductPage />} />
        <Route path="servicepage" element={<ServicePage />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="shop" element={<Shop />} />
        <Route path="blogpage" element={<BlogPage />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="leads" element={<Leads />} />
        <Route path="projectadmin" element={<ProjectAdmin />} />
        <Route path="processadmin" element={<ProcessAdmin />} />
        <Route path="chooseadmin" element={<chooseAdmin />} />
        <Route path="login" element={<Login />} />
        <Route path="seo" element={<Seo />} />
      </Route>
    </Routes>
  );
}

export default Appmain;