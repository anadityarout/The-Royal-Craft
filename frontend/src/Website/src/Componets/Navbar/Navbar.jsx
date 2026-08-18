import React, { useState } from "react";
import "./Navbar.css";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/navbar.png";
import ConsultationPopup from "../Popup/ConsultationPopup";;

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  const location = useLocation();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleBookClick = () => {
    closeMenu();
    setPopupOpen(true);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/Project" },
    { name: "Product", path: "/Product" },
    { name: "Service", path: "/Service" },
    { name: "Shop", path: "/shop" },
    { name: "Blog", path: "/blog" },
    { name: "Gallery", path: "/gallery" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <div className="logo">
          <Link to="/" onClick={closeMenu}>
            <img src={logo} alt="The Royal Craft Logo" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className={`nav-menu ${menuOpen ? "active" : ""}`}>
          {navLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMenu}
              className={location.pathname === item.path ? "active-link" : ""}
            >
              {item.name}
            </Link>
          ))}

          {/* Book Consultation CTA */}
          <button className="nav-cta-btn" onClick={handleBookClick}>
            Book Consultation
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

      </div>

      {/* Popup lives here, controlled entirely by Navbar's own state */}
      <ConsultationPopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
      />
    </header>
  );
};

export default Navbar;
