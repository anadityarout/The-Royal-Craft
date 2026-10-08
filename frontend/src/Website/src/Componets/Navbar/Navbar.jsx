import React, { useState, useEffect } from "react";
import "./Navbar.css";

import {
  FaBars,
  FaTimes,
  FaHome,
  FaProjectDiagram,
  FaCogs,
  FaBoxOpen,
  FaArrowRight,
} from "react-icons/fa";

import { Link, useLocation } from "react-router-dom";

import logo from "../../assets/navbar.png";
import ConsultationPopup from "../Popup/ConsultationPopup";

// =====================================================
// LINK DATA (outside the component so it isn't rebuilt
// on every render)
// =====================================================

const desktopNavLinks = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/project" },
  { name: "Product", path: "/product" },
  { name: "Service", path: "/service" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

const mobileNavLinks = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/project" },
  { name: "Product", path: "/product" },
  { name: "Service", path: "/service" },
  { name: "Blog", path: "/blog" },
  { name: "Gallery", path: "/gallery" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const bottomNavLinks = [
  { name: "Home", path: "/", icon: <FaHome /> },
  { name: "Project", path: "/project", icon: <FaProjectDiagram /> },
  { name: "Product", path: "/product", icon: <FaBoxOpen /> },
  { name: "Service", path: "/service", icon: <FaCogs /> },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();

  // =====================================================
  // HELPERS
  // =====================================================

  const closeMenu = () => setMenuOpen(false);

  const handleBookClick = () => {
    closeMenu();
    setPopupOpen(true);
  };

  // Active on exact match for "/", and on nested routes
  // (e.g. /project/123) for everything else
  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname === path ||
        location.pathname.startsWith(`${path}/`);

  // =====================================================
  // GLASS GETS A LITTLE DARKER AFTER SCROLLING
  // =====================================================

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // =====================================================
  // CLOSE MENU WHEN THE ROUTE CHANGES (back button, etc.)
  // =====================================================

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // =====================================================
  // LOCK PAGE SCROLL WHILE MENU IS OPEN + ESCAPE TO CLOSE
  // =====================================================

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  // =====================================================
  // CLOSE MENU IF WINDOW IS RESIZED TO DESKTOP WIDTH
  // =====================================================

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 1100) setMenuOpen(false);
    };

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      {/* =====================================================
          TOP NAVBAR (GLASS)
          3 columns on desktop:  logo | links (centered) | CTA
      ===================================================== */}

      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">
          {/* LEFT: LOGO */}

          <div className="logo">
            <Link to="/" onClick={closeMenu}>
              <img src={logo} alt="The Royal Craft Logo" />
            </Link>
          </div>

          {/* CENTER: DESKTOP LINKS */}

          <nav className="desktop-nav-menu" aria-label="Main navigation">
            {desktopNavLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={isActive(item.path) ? "active-link" : ""}
                aria-current={isActive(item.path) ? "page" : undefined}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* RIGHT: DESKTOP CTA */}

          <div className="desktop-cta">
            <button
              type="button"
              className="nav-cta-btn"
              onClick={handleBookClick}
            >
              <span className="cta-text">Book Consultation</span>
              <span className="cta-arrow" aria-hidden="true">
                <FaArrowRight />
              </span>
            </button>
          </div>

          {/* RIGHT: MOBILE / TABLET HAMBURGER */}

          <button
            type="button"
            className="menu-btn"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close Menu" : "Open Menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-side-menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </header>

      {/* =====================================================
          MOBILE OVERLAY
          (outside the header, so the glass blur on the header
          does not trap fixed-position children)
      ===================================================== */}

      <div
        className={`mobile-overlay ${menuOpen ? "active" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      ></div>

      {/* =====================================================
          MOBILE / TABLET SIDE MENU (GLASS)
      ===================================================== */}

      <nav
        id="mobile-side-menu"
        className={`mobile-side-menu ${menuOpen ? "active" : ""}`}
        aria-hidden={!menuOpen}
        aria-label="Mobile menu"
      >
        {mobileNavLinks.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={closeMenu}
            className={isActive(item.path) ? "active-link" : ""}
            aria-current={isActive(item.path) ? "page" : undefined}
          >
            {item.name}
          </Link>
        ))}

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

      {/* =====================================================
          MOBILE + TABLET BOTTOM NAVIGATION (GLASS)
      ===================================================== */}

      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        <div className="mobile-bottom-nav-inner">
          {bottomNavLinks.map((item) => {
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-bottom-item ${
                  active ? "bottom-active" : ""
                }`}
                aria-label={item.name}
                aria-current={active ? "page" : undefined}
              >
                <span className="mobile-bottom-icon">{item.icon}</span>
                <span className="mobile-bottom-label">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
