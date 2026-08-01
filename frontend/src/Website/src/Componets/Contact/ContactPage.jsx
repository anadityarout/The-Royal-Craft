import React from "react";
import "./ContactPage.css";
import PageSeo from "../SeoPage/PageSeo";
import contactImage from "../../assets/contact.png";

const ContactPage = () => {
  return (
    <>
        <PageSeo page="Contact" />
      {/* Banner */}
      <section className="contact-banner">
        <div className="contact-overlay">
          <div className="contact-image">
            <img src={contactImage} alt="Contact Banner" />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="contact-section">
        <div className="contact-container">

          {/* Left */}
          <div className="contact-left">

            <h2>GET IN TOUCH</h2>

            <form className="contact-form">

              <div className="form-group">
                <label>INQUIRY TOPIC *</label>
                <select>
                  <option>General Inquiry</option>
                  <option>Product Inquiry</option>
                  <option>Support</option>
                </select>
              </div>

              <div className="form-group">
                <label>FULL NAME *</label>
                <input type="text" placeholder="Enter your full name" />
              </div>

              <div className="form-group">
                <label>EMAIL ADDRESS *</label>
                <input type="email" placeholder="Enter your email address" />
              </div>

              <div className="form-group">
                <label>PHONE NUMBER</label>
                <input type="text" placeholder="+91 9876543210" />
              </div>

              <div className="form-group">
                <label>BEST TIME TO CONTACT</label>
                <select>
                  <option>Anytime</option>
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                </select>
              </div>

              <div className="form-group">
                <label>SUBJECT *</label>
                <input type="text" placeholder="Enter your subject" />
              </div>

              <div className="form-group">
                <label>MESSAGE *</label>
                <textarea
                  rows="7"
                  placeholder="Please provide details about your inquiry..."
                ></textarea>
              </div>

              <button className="send-btn">
                SEND MESSAGE
              </button>

            </form>

          </div>

          {/* Right */}

          <div className="contact-right">

            <h2>CONTACT INFORMATION</h2>

            <div className="info-card">
              <div className="icon">📍</div>

              <div>
                <h3>Location</h3>
                <p>
                  Royal Craft
                  <br />
                  Bhubaneswar, Odisha, India
                </p>
              </div>
            </div>

            <div className="info-card">
              <div className="icon">✉</div>

              <div>
                <h3>Email</h3>
                <p>info@theroyalcraft.com</p>
                <p>support@theroyalcraft.com</p>
              </div>
            </div>

            <div className="info-card">
              <div className="icon">📞</div>

              <div>
                <h3>Phone</h3>
                <p>+91 9876543210</p>
                <p>Mon–Fri : 9:00 AM - 6:00 PM</p>
              </div>
            </div>

            <div className="info-card">
              <div className="icon">🕒</div>

              <div>
                <h3>Business Hours</h3>

                <p>Monday - Friday : 9:00 AM - 6:00 PM</p>
                <p>Saturday : 10:00 AM - 4:00 PM</p>
                <p>Sunday : Closed</p>

              </div>
            </div>

          </div>

        </div>
      </section>
    </>
  );
};

export default ContactPage;