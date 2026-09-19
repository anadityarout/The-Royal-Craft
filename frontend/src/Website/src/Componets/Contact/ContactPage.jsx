import React from "react";
import "./ContactPage.css";
import PageSeo from "../SeoPage/PageSeo";
import contactImage from "../../assets/contact.png";

const ContactPage = () => {
  const royalKraftAddress =
    "108, First Floor, DLF Galleria Mall, Mayur Vihar, Phase-1 Extension, Near Metro Mayur Vihar Extension, New Delhi - 110091";

  const mapQuery = encodeURIComponent(
    "The Royal Kraft, 108 First Floor DLF Galleria Mall Mayur Vihar Phase 1 Extension New Delhi 110091"
  );

  const openMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <>
      <PageSeo page="Contact" />

      {/* =====================================================
          CONTACT BANNER
      ===================================================== */}
      <section className="contact-banner">
        <div className="contact-overlay">
          <div className="contact-image">
            <img src={contactImage} alt="The Royal Kraft Contact" />
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT SECTION
      ===================================================== */}
      <section className="contact-section">
        <div className="contact-container">

          {/* =================================================
              LEFT - CONTACT FORM
          ================================================= */}
          <div className="contact-left">

            <h2>GET IN TOUCH</h2>

            <form className="contact-form">

              <div className="form-group">
                <label>INQUIRY TOPIC *</label>

                <select defaultValue="General Inquiry">
                  <option>General Inquiry</option>
                  <option>Product Inquiry</option>
                  <option>Support</option>
                </select>
              </div>

              <div className="form-group">
                <label>FULL NAME *</label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label>EMAIL ADDRESS *</label>

                <input
                  type="email"
                  placeholder="Enter your email address"
                />
              </div>

              <div className="form-group">
                <label>PHONE NUMBER</label>

                <input
                  type="tel"
                  placeholder="+91 9876543210"
                />
              </div>

              <div className="form-group">
                <label>BEST TIME TO CONTACT</label>

                <select defaultValue="Anytime">
                  <option>Anytime</option>
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                </select>
              </div>

              <div className="form-group">
                <label>SUBJECT *</label>

                <input
                  type="text"
                  placeholder="Enter your subject"
                />
              </div>

              <div className="form-group">
                <label>MESSAGE *</label>

                <textarea
                  rows="7"
                  placeholder="Please provide details about your inquiry..."
                ></textarea>
              </div>

              <button type="submit" className="send-btn">
                SEND MESSAGE
              </button>

            </form>
          </div>

          {/* =================================================
              RIGHT - CONTACT INFORMATION
          ================================================= */}
          <div className="contact-right">

            <h2>CONTACT INFORMATION</h2>

            {/* Location */}
            <div className="info-card">

              <div className="icon">
                📍
              </div>

              <div className="info-content">
                <h3>Location</h3>

                <p>
                  The Royal Kraft
                  <br />
                  {royalKraftAddress}
                </p>
              </div>

            </div>

            {/* Email */}
            <div className="info-card">

              <div className="icon">
                ✉
              </div>

              <div className="info-content">
                <h3>Email</h3>

                <p>
                  <a href="mailto:info@theroyalkraft.com">
                    info@theroyalkraft.com
                  </a>
                </p>
              </div>

            </div>

            {/* Phone */}
            <div className="info-card">

              <div className="icon">
                📞
              </div>

              <div className="info-content">
                <h3>Phone</h3>

                <p>
                  <a href="tel:+918130462200">
                    +91 8130462200
                  </a>
                </p>

                <p>
                  Mon–Sat : 9:30 AM - 5:30 PM
                </p>
              </div>

            </div>

            {/* Business Hours */}
            <div className="info-card">

              <div className="icon">
                🕒
              </div>

              <div className="info-content">
                <h3>Business Hours</h3>

                <p>
                  Monday - Saturday : 9:30 AM - 5:30 PM
                </p>

                <p>
                  Sunday : Closed
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          FIND US / MAP SECTION
      ===================================================== */}
      <section className="contact-location-section">

        <div className="contact-location-container">

          {/* Small heading */}
          <div className="location-heading">

            <div className="location-heading-line"></div>

            <span>FIND US</span>

            <div className="location-heading-line"></div>

          </div>

          {/* Main heading */}
          <h2 className="location-title">
            The Royal Kraft Location
          </h2>

          {/* Description */}
          <p className="location-description">
            Visit our office at Mayur Vihar, New Delhi.
          </p>

          {/* Address */}
          <p className="location-address">
            {royalKraftAddress}
          </p>

          {/* Map */}
          <div className="location-map-wrapper">

           

            <iframe
              title="The Royal Kraft Location"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

          </div>

        </div>

      </section>
    </>
  );
};

export default ContactPage;