import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

  import {
  ChevronDown,
  ChevronRight,
  Home,
  Package,
  Briefcase,
  Image,
  ShoppingBag,
  Newspaper,
  Info,
  Phone,
  Users,
  FolderOpen,
  LogOut,
  Search,
  Plus,
} from "lucide-react";

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState("");
  const navigate = useNavigate();

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? "" : menu);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  return (
    <div className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <h2>Admin Panel</h2>
      </div>

      {/* ================= HOME ================= */}

      <div className="menu-section">
        <div
          className="menu-title"
          onClick={() => toggleMenu("home")}
        >
          <span className="menu-left">
            <Home size={18} />
            Home
          </span>

          {openMenu === "home" ? (
            <ChevronDown size={18} />
          ) : (
            <ChevronRight size={18} />
          )}
        </div>

        {openMenu === "home" && (
          <div className="submenu">

            <NavLink
              to="homepage"
              className={({ isActive }) =>
                isActive ? "submenu-item active" : "submenu-item"
              }
            >
              <Image size={16} />
              Home Page
            </NavLink>

            <NavLink
              to="aboutpage"
              className={({ isActive }) =>
                isActive ? "submenu-item active" : "submenu-item"
              }
            >
              <Image size={16} />
              About Page
            </NavLink>

            <NavLink
              to="workpage"
              className={({ isActive }) =>
                isActive ? "submenu-item active" : "submenu-item"
              }
            >
              <Image size={16} />
              Work Page
            </NavLink>

            <NavLink
              to="processadmin"
              className={({ isActive }) =>
                isActive ? "submenu-item active" : "submenu-item"
              }
            >
              <FolderOpen size={16} />
              Process Admin
            </NavLink>

            <NavLink
              to="chooseadmin"
              className={({ isActive }) =>
                isActive ? "submenu-item active" : "submenu-item"
              }
            >
              <FolderOpen size={16} />
              Choose Admin
            </NavLink>

          </div>
        )}
      </div>


      {/* ================= PROJECTS ================= */}

      <div className="menu-section">

        <div
          className="menu-title"
          onClick={() => toggleMenu("projects")}
        >
          <span className="menu-left">
            <FolderOpen size={18} />
            Projects
          </span>

          {openMenu === "projects" ? (
            <ChevronDown size={18} />
          ) : (
            <ChevronRight size={18} />
          )}
        </div>

        {openMenu === "projects" && (
          <div className="submenu">

            <NavLink
              to="projectadmin"
              className={({ isActive }) =>
                isActive ? "submenu-item active" : "submenu-item"
              }
            >
              <Image size={16} />
              Project Admin
            </NavLink>

          </div>
        )}

      </div>

      {/* ================= PRODUCT ================= */}

      <div className="menu-section">

        <div
          className="menu-title"
          onClick={() => toggleMenu("product")}
        >
          <span className="menu-left">
            <Package size={18} />
            Product
          </span>

          {openMenu === "product" ? (
            <ChevronDown size={18} />
          ) : (
            <ChevronRight size={18} />
          )}
        </div>

        {openMenu === "product" && (
          <div className="submenu">

            <NavLink
              to="productpage"
              className={({ isActive }) =>
                isActive ? "submenu-item active" : "submenu-item"
              }
            >
              <Image size={16} />
              Product Page
            </NavLink>

          </div>
        )}

      </div>

      {/* ================= SERVICE ================= */}

      <div className="menu-section">

        <div
          className="menu-title"
          onClick={() => toggleMenu("service")}
        >
          <span className="menu-left">
            <Briefcase size={18} />
            Service
          </span>

          {openMenu === "service" ? (
            <ChevronDown size={18} />
          ) : (
            <ChevronRight size={18} />
          )}
        </div>

        {openMenu === "service" && (
          <div className="submenu">

            <NavLink
              to="servicepage"
              className={({ isActive }) =>
                isActive ? "submenu-item active" : "submenu-item"
              }
            >
              <Image size={16} />
              Service Page
            </NavLink>

          </div>
        )}

      </div>

      {/* ================= GALLERY ================= */}

      <div className="menu-section">

        <div
          className="menu-title"
          onClick={() => toggleMenu("gallery")}
        >
          <span className="menu-left">
            <Image size={18} />
            Gallery
          </span>

          {openMenu === "gallery" ? (
            <ChevronDown size={18} />
          ) : (
            <ChevronRight size={18} />
          )}
        </div>

        {openMenu === "gallery" && (
          <div className="submenu">

            <NavLink
              to="gallery"
              className={({ isActive }) =>
                isActive ? "submenu-item active" : "submenu-item"
              }
            >
              <Image size={16} />
              Gallery Page
            </NavLink>

          </div>
        )}

      </div>

      {/* ================= SHOP ================= */}

      <div className="menu-section">

        <div
          className="menu-title"
          onClick={() => toggleMenu("shop")}
        >
          <span className="menu-left">
            <ShoppingBag size={18} />
            Shop
          </span>

          {openMenu === "shop" ? (
            <ChevronDown size={18} />
          ) : (
            <ChevronRight size={18} />
          )}
        </div>

        {openMenu === "shop" && (
          <div className="submenu">

            <NavLink
              to="shop"
              className={({ isActive }) =>
                isActive ? "submenu-item active" : "submenu-item"
              }
            >
              <Image size={16} />
              Shop Page
            </NavLink>

          </div>
        )}

      </div>

      {/* ================= BLOG ================= */}

      <div className="menu-section">

        <div
          className="menu-title"
          onClick={() => toggleMenu("blog")}
        >
          <span className="menu-left">
            <Newspaper size={18} />
            Blog
          </span>

          {openMenu === "blog" ? (
            <ChevronDown size={18} />
          ) : (
            <ChevronRight size={18} />
          )}
        </div>

        {openMenu === "blog" && (
          <div className="submenu">

            <NavLink
              to="blogpage"
              className={({ isActive }) =>
                isActive ? "submenu-item active" : "submenu-item"
              }
            >
              <Image size={16} />
              Blog Page
            </NavLink>

          </div>
        )}

      </div>

      {/* ================= ABOUT ================= */}

      <div className="menu-section">

        <div
          className="menu-title"
          onClick={() => toggleMenu("about")}
        >
          <span className="menu-left">
            <Info size={18} />
            About
          </span>

          {openMenu === "about" ? (
            <ChevronDown size={18} />
          ) : (
            <ChevronRight size={18} />
          )}
        </div>

        {openMenu === "about" && (
          <div className="submenu">

            <NavLink
              to="about"
              className={({ isActive }) =>
                isActive ? "submenu-item active" : "submenu-item"
              }
            >
              <Image size={16} />
              About
            </NavLink>

          </div>
        )}

      </div>

      {/* ================= CONTACT ================= */}

      <div className="menu-section">

        <div
          className="menu-title"
          onClick={() => toggleMenu("contact")}
        >
          <span className="menu-left">
            <Phone size={18} />
            Contact
          </span>

          {openMenu === "contact" ? (
            <ChevronDown size={18} />
          ) : (
            <ChevronRight size={18} />
          )}
        </div>

        {openMenu === "contact" && (
          <div className="submenu">

            <NavLink
              to="contact"
              className={({ isActive }) =>
                isActive ? "submenu-item active" : "submenu-item"
              }
            >
              <Image size={16} />
              Contact Page
            </NavLink>

          </div>
        )}

      </div>

      {/* ================= LEADS ================= */}

      <div className="menu-section">

        <div
          className="menu-title"
          onClick={() => toggleMenu("leads")}
        >
          <span className="menu-left">
            <Users size={18} />
            Leads
          </span>

          {openMenu === "leads" ? (
            <ChevronDown size={18} />
          ) : (
            <ChevronRight size={18} />
          )}
        </div>

        {openMenu === "leads" && (
          <div className="submenu">

            <NavLink
              to="leads"
              className={({ isActive }) =>
                isActive ? "submenu-item active" : "submenu-item"
              }
            >
              <Users size={16} />
              Customer Leads
            </NavLink>

          </div>
        )}

      </div>

      {/* ================= SEO ================= */}

<div className="menu-section">

  <div
    className="menu-title"
    onClick={() => toggleMenu("seo")}
  >
    <span className="menu-left">
      <Search size={18} />
      SEO
    </span>

    {openMenu === "seo" ? (
      <ChevronDown size={18} />
    ) : (
      <ChevronRight size={18} />
    )}
  </div>

  {openMenu === "seo" && (
    <div className="submenu">

      <NavLink
        to="seo"
        className={({ isActive }) =>
          isActive ? "submenu-item active" : "submenu-item"
        }
      >
        <Plus size={16} />
        Add SEO
      </NavLink>

    </div>
  )}

</div>

      {/* ================= LOGOUT ================= */}

      <div className="menu-section">
        <div
          className="menu-title"
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        >
          <span className="menu-left">
            <LogOut size={18} />
            Logout
          </span>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;
