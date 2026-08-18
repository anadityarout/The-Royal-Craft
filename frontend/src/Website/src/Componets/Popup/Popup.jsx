import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "./Popup.css";

// ==========================================
// API GATEWAY
// ==========================================
// Replace this with your actual API Gateway URL.
// Example:
const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/customer";

export default function Popup() {
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // OPEN POPUP AFTER 2 SECONDS
  // ==========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // ==========================================
  // LOCK BACKGROUND SCROLL
  // ==========================================

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ==========================================
  // CLOSE WITH ESC
  // ==========================================

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear previous error
    if (error) {
      setError("");
    }
  };

  // ==========================================
  // SUBMIT CUSTOMER
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      // ----------------------------------------
      // Basic validation
      // ----------------------------------------

      const fullName = formData.fullName.trim();
      const email = formData.email.trim();
      const phone = formData.phone.trim();

      if (!fullName || !email || !phone) {
        throw new Error(
          "Please fill in all required fields."
        );
      }

      // ----------------------------------------
      // Send customer to AWS API Gateway
      // ----------------------------------------

      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          fullName,
          email,
          phone,
        }),
      });

      // ----------------------------------------
      // Read Lambda response
      // ----------------------------------------

      const result = await response.json();

      console.log("Customer API response:", result);

      // ----------------------------------------
      // Check API response
      // ----------------------------------------

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to submit your request."
        );
      }

      // ----------------------------------------
      // SUCCESS
      // ----------------------------------------

      setSubmitted(true);

      setFormData({
        fullName: "",
        email: "",
        phone: "",
      });
    } catch (err) {
      console.error(
        "Customer submission failed:",
        err
      );

      setError(
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // DON'T SHOW POPUP
  // ==========================================

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="rk-p-overlay"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="rk-p-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ==================================
            CLOSE BUTTON
        ================================== */}

        <button
          className="rk-p-close"
          onClick={() => setIsOpen(false)}
          aria-label="Close"
          type="button"
        >
          <X size={18} />
        </button>

        {/* ==================================
            SUCCESS MESSAGE
        ================================== */}

        {submitted ? (
          <div className="rk-p-success">
            <h3>Thank you!</h3>

            <p>
              We've received your details and
              will get in touch within 24 hours.
            </p>

            <button
              type="button"
              className="rk-p-submit"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* ==================================
                TITLE
            ================================== */}

            <h2 className="rk-p-title">
              Get Free Consultation
            </h2>

            <p className="rk-p-subtitle">
              Connect with our experts and explore
              how we can transform your vision into
              reality.
            </p>

            {/* ==================================
                ERROR MESSAGE
            ================================== */}

            {error && (
              <div className="rk-p-error">
                {error}
              </div>
            )}

            {/* ==================================
                FORM
            ================================== */}

            <form
              className="rk-p-form"
              onSubmit={handleSubmit}
            >
              {/* FULL NAME */}

              <div className="rk-p-field">
                <label htmlFor="fullName">
                  Full Name *
                </label>

                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  placeholder="Your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* EMAIL */}

              <div className="rk-p-field">
                <label htmlFor="email">
                  Email Address *
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* PHONE */}

              <div className="rk-p-field">
                <label htmlFor="phone">
                  Phone Number *
                </label>

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* ==================================
                  BUTTONS
              ================================== */}

              <div className="rk-p-actions">
                <button
                  type="submit"
                  className="rk-p-submit"
                  disabled={submitting}
                >
                  {submitting
                    ? "Sending..."
                    : "Request Consultation"}
                </button>

                <button
                  type="button"
                  className="rk-p-cancel"
                  onClick={() => setIsOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* PRIVACY */}

            <p className="rk-p-privacy">
              We respect your privacy. Your
              information is secure with us.
            </p>
          </>
        )}
      </div>
    </div>
  );
}