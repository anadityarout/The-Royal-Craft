import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe,
  FaShieldAlt,
} from "react-icons/fa";

import "./Footer.css";
import logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-overlay">

        <div className="footer-container">

          {/* LEFT SIDE */}

          <div className="footer-about">

            <div className="footer-logo-wrapper">

              <img
                src={logo}
                alt="The Royal Craft"
                className="footer-logo"
              />

            </div>

            <div className="footer-description">

              <p>
                The Royal Craft is a leading provider of premium
                architectural and decorative solutions. We blend
                innovation, craftsmanship and quality to deliver
                timeless creations that elevate spaces and exceed
                expectations.
              </p>

            </div>

            <div className="footer-social">

              <a href="#">
                <FaFacebookF />
              </a>

              <a href="#">
                <FaInstagram />
              </a>

              <a href="#">
                <FaLinkedinIn />
              </a>

              <a href="#">
                <FaPinterestP />
              </a>

              <a href="#">
                <FaYoutube />
              </a>

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="footer-right">

            {/* COMPANY */}

            <div className="footer-column">

              <h3>Company</h3>

              <ul>

                <li>
                  <Link to="/about">About Us</Link>
                </li>

                <li>
                  <Link to="/service">Our Services</Link>
                </li>

                <li>
                  <Link to="/product">Our Products</Link>
                </li>

                <li>
                  <Link to="/gallery">Gallery</Link>
                </li>

                <li>
                  <Link to="/blog">Blog</Link>
                </li>

                <li>
                  <Link to="/contact">Contact Us</Link>
                </li>

              </ul>

            </div>

            {/* SERVICES */}

            <div className="footer-column">

              <h3>Our Services</h3>

              <ul>

                <li>Exterior Solutions</li>

                <li>Interior Solutions</li>

                <li>Decorative Elements</li>

                <li>Fiber Mandap</li>

                <li>Fiber Gate</li>

                <li>Custom Design</li>

              </ul>

            </div>
                        {/* QUICK LINKS */}

            <div className="footer-column">

              <h3>Quick Links</h3>

              <ul>

                <li>
                  <Link to="/">Home</Link>
                </li>

                <li>
                  <Link to="/about">About Us</Link>
                </li>

                <li>
                  <Link to="/product">Products</Link>
                </li>

                <li>
                  <Link to="/service">Services</Link>
                </li>

                <li>
                  <Link to="/gallery">Gallery</Link>
                </li>

                <li>
                  <Link to="/blog">Blog</Link>
                </li>

              </ul>

            </div>

            {/* CONTACT */}

            <div className="footer-column contact-column">

              <h3>Contact Us</h3>

              <div className="contact-item">
                <FaMapMarkerAlt />

                <span>
                  123, Craft House,
                  <br />
                  Bhubaneswar, Odisha, India
                </span>
              </div>

              <div className="contact-item">
                <FaPhoneAlt />

                <span>
                  +91 98765 43210
                </span>
              </div>

              <div className="contact-item">
                <FaEnvelope />

                <span>
                  info@theroyalcraft.com
                </span>
              </div>

              <div className="contact-item">
                <FaGlobe />

                <span>
                  www.theroyalcraft.com
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* FOOTER BOTTOM */}

        <div className="footer-bottom">

          <div className="footer-copy">

            <FaShieldAlt className="shield-icon" />

            <span>
              © 2026 The Royal Craft. All Rights Reserved.
            </span>

          </div>

          <div className="footer-policy">

            <Link to="/privacy-policy">
              Privacy Policy
            </Link>

            <span>|</span>

            <Link to="/terms">
              Terms & Conditions
            </Link>

            <span>|</span>

            <Link to="/sitemap">
              Sitemap
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;