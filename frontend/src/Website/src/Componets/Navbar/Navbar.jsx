import React, { useState } from "react";
import "./Navbar.css";

import {
  FaBars,
  FaTimes,
  FaHome,
  FaShoppingBag,
  FaProjectDiagram,
  FaCogs,
  FaBoxOpen,
} from "react-icons/fa";

import { Link, useLocation } from "react-router-dom";

import logo from "../../assets/navbar.png";
import ConsultationPopup from "../Popup/ConsultationPopup";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  const location = useLocation();

  // =====================================================
  // CLOSE MENU
  // =====================================================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // =====================================================
  // BOOK CONSULTATION
  // =====================================================

  const handleBookClick = () => {
    closeMenu();
    setPopupOpen(true);
  };

  // =====================================================
  // DESKTOP NAVIGATION
  //
  // ABOUT + GALLERY ARE NOT HERE
  // =====================================================

  const desktopNavLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Projects",
      path: "/project",
    },
    {
      name: "Product",
      path: "/product",
    },
    {
      name: "Service",
      path: "/service",
    },
    {
      name: "Shop",
      path: "/shop",
    },
    {
      name: "Blog",
      path: "/blog",
    },
    {
      name: "Contact",
      path: "/contact",
    },
  ];

  // =====================================================
  // MOBILE / TABLET MENU
  //
  // ABOUT + GALLERY ARE ADDED HERE
  // =====================================================

  const mobileNavLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Projects",
      path: "/project",
    },
    {
      name: "Product",
      path: "/product",
    },
    {
      name: "Service",
      path: "/service",
    },
    {
      name: "Shop",
      path: "/shop",
    },
    {
      name: "Blog",
      path: "/blog",
    },
    {
      name: "Gallery",
      path: "/gallery",
    },
    {
      name: "About",
      path: "/about",
    },
    {
      name: "Contact",
      path: "/contact",
    },
  ];

  // =====================================================
  // MOBILE + TABLET BOTTOM NAVIGATION
  // =====================================================

  const bottomNavLinks = [
    {
      name: "Home",
      path: "/",
      icon: <FaHome />,
    },
    {
      name: "Shop",
      path: "/shop",
      icon: <FaShoppingBag />,
    },
    {
      name: "Project",
      path: "/project",
      icon: <FaProjectDiagram />,
    },
    {
      name: "Service",
      path: "/service",
      icon: <FaCogs />,
    },
    {
      name: "Product",
      path: "/product",
      icon: <FaBoxOpen />,
    },
  ];

  // =====================================================
  // ACTIVE BOTTOM LINK
  // =====================================================

  const isBottomActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname === path;
  };

  return (
    <>
      {/* =====================================================
          TOP NAVBAR
      ===================================================== */}

      <header className="navbar">

        <div className="navbar-container">

          {/* =================================================
              LOGO
          ================================================= */}

          <div className="logo">
            <Link
              to="/"
              onClick={closeMenu}
            >
              <img
                src={logo}
                alt="The Royal Craft Logo"
              />
            </Link>
          </div>


          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <nav className="desktop-nav-menu">

            {desktopNavLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={
                  location.pathname === item.path
                    ? "active-link"
                    : ""
                }
              >
                {item.name}
              </Link>
            ))}

            {/* BOOK CONSULTATION */}

            <button
              type="button"
              className="nav-cta-btn"
              onClick={handleBookClick}
            >
              Book Consultation
            </button>

          </nav>


          {/* =================================================
              MOBILE / TABLET HAMBURGER
          ================================================= */}

          <button
            type="button"
            className="menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={
              menuOpen
                ? "Close Menu"
                : "Open Menu"
            }
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <FaTimes />
            ) : (
              <FaBars />
            )}
          </button>

        </div>


        {/* =====================================================
            MOBILE / TABLET SIDE MENU
        ===================================================== */}

        <nav
          className={`mobile-side-menu ${
            menuOpen ? "active" : ""
          }`}
        >

          {mobileNavLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMenu}
              className={
                location.pathname === item.path
                  ? "active-link"
                  : ""
              }
            >
              {item.name}
            </Link>
          ))}


          {/* BOOK CONSULTATION */}

          <button
            type="button"
            className="nav-cta-btn"
            onClick={handleBookClick}
          >
            Book Consultation
          </button>

        </nav>


        {/* =====================================================
            CONSULTATION POPUP
        ===================================================== */}

        <ConsultationPopup
          isOpen={popupOpen}
          onClose={() => setPopupOpen(false)}
        />

      </header>


      {/* =====================================================
          MOBILE + TABLET BOTTOM NAVIGATION
      ===================================================== */}

      <nav
        className="mobile-bottom-nav"
        aria-label="Mobile navigation"
      >

        <div className="mobile-bottom-nav-inner">

          {bottomNavLinks.map((item) => {

            const active = isBottomActive(
              item.path
            );

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-bottom-item ${
                  active
                    ? "bottom-active"
                    : ""
                }`}
                aria-label={item.name}
              >

                <span className="mobile-bottom-icon">
                  {item.icon}
                </span>

                <span className="mobile-bottom-label">
                  {item.name}
                </span>

              </Link>
            );
          })}

        </div>

      </nav>
    </>
  );
};

export default Navbar;