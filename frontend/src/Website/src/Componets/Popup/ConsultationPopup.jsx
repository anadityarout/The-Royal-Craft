import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "./ConsultationPopup.css";

// =====================================================
// AWS CONSULTANT API
// =====================================================

const CONSULTANT_API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/consultant";

/**
 * ConsultationPopup
 *
 * Sends consultation form data to:
 *
 * Website
 *   ↓
 * POST /consultant
 *   ↓
 * API Gateway
 *   ↓
 * royalcraft-consultant Lambda
 *   ↓
 * S3 → data/consultant.json
 */
export default function ConsultationPopup({
  isOpen,
  onClose,
}) {
  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    service: "",
    budget: "",
    details: "",
  });

  // =====================================================
  // SUBMIT STATE
  // =====================================================

  const [submitting, setSubmitting] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  // =====================================================
  // ERROR MESSAGE
  // =====================================================

  const [error, setError] =
    useState("");

  // =====================================================
  // LOCK BACKGROUND SCROLL
  // =====================================================

  useEffect(() => {
    document.body.style.overflow =
      isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // =====================================================
  // CLOSE ON ESC
  // =====================================================

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      onKey
    );

    return () =>
      window.removeEventListener(
        "keydown",
        onKey
      );
  }, [onClose]);

  // =====================================================
  // RESET SUCCESS / ERROR WHEN OPENED
  // =====================================================

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setError("");
    }
  }, [isOpen]);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove old error when user starts typing
    if (error) {
      setError("");
    }
  };

  // =====================================================
  // HANDLE FORM SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      // ================================================
      // SEND DATA TO AWS API GATEWAY
      // ================================================

      const response = await fetch(
        CONSULTANT_API_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            fullName:
              formData.fullName.trim(),

            phone:
              formData.phone.trim(),

            email:
              formData.email.trim(),

            city:
              formData.city.trim(),

            service:
              formData.service,

            budget:
              formData.budget,

            details:
              formData.details.trim(),
          }),
        }
      );

      // ================================================
      // READ API RESPONSE
      // ================================================

      const result =
        await response.json();

      console.log(
        "Consultant API response:",
        result
      );

      // ================================================
      // CHECK RESPONSE
      // ================================================

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to book consultation."
        );
      }

      // ================================================
      // SUCCESS
      // ================================================

      console.log(
        "Consultation submitted successfully:",
        result.consultant
      );

      setSubmitted(true);

      // ================================================
      // CLEAR FORM
      // ================================================

      setFormData({
        fullName: "",
        phone: "",
        email: "",
        city: "",
        service: "",
        budget: "",
        details: "",
      });
    } catch (err) {
      console.error(
        "Consultation submit failed:",
        err
      );

      setError(
        err.message ||
          "Unable to book consultation. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // DON'T SHOW POPUP
  // =====================================================

  if (!isOpen) {
    return null;
  }

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div
      className="rk-cp-overlay"
      onClick={onClose}
    >

      <div
        className="rk-cp-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* ==========================================
            CLOSE BUTTON
        ========================================== */}

        <button
          className="rk-cp-close"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          <X size={18} />
        </button>

        {/* ==========================================
            SUCCESS
        ========================================== */}

        {submitted ? (

          <div className="rk-cp-success">

            <h3>
              Thank you!
            </h3>

            <p>
              We've received your
              consultation request and
              will get in touch within
              24 hours.
            </p>

            <button
              type="button"
              className="rk-cp-submit"
              onClick={onClose}
            >
              Close
            </button>

          </div>

        ) : (

          <>
            {/* ======================================
                HEADING
            ====================================== */}

            <span className="rk-cp-eyebrow">
              Get Started
            </span>

            <h2 className="rk-cp-title">
              Book Your{" "}
              <em>
                Consultation
              </em>
            </h2>

            <p className="rk-cp-subtitle">
              Tell us a little about your
              project and our team will get
              in touch within 24 hours.
            </p>

            {/* ======================================
                ERROR
            ====================================== */}

            {error && (

              <div
                style={{
                  marginBottom: "15px",
                  padding: "12px",
                  borderRadius: "6px",
                  background:
                    "#fff1f1",
                  color: "#c62828",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>

            )}

            {/* ======================================
                FORM
            ====================================== */}

            <form
              className="rk-cp-form"
              onSubmit={handleSubmit}
            >

              {/* ====================================
                  NAME + PHONE
              ==================================== */}

              <div className="rk-cp-row">

                <div className="rk-cp-field">

                  <label>
                    Full Name *
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    placeholder="Your full name"
                    value={
                      formData.fullName
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>

                <div className="rk-cp-field">

                  <label>
                    Phone Number *
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 XXXXX XXXXX"
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>

              </div>

              {/* ====================================
                  EMAIL + CITY
              ==================================== */}

              <div className="rk-cp-row">

                <div className="rk-cp-field">

                  <label>
                    Email Address *
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>

                <div className="rk-cp-field">

                  <label>
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    placeholder="Your city"
                    value={
                      formData.city
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

              </div>

              {/* ====================================
                  SERVICE + BUDGET
              ==================================== */}

              <div className="rk-cp-row">

                <div className="rk-cp-field">

                  <label>
                    Service *
                  </label>

                  <select
                    name="service"
                    value={
                      formData.service
                    }
                    onChange={
                      handleChange
                    }
                    required
                  >

                    <option value="">
                      Select a service
                    </option>

                    <option value="Architectural Design">
                      Architectural Design
                    </option>

                    <option value="MEP Design">
                      MEP Design
                    </option>

                    <option value="FRP Construction">
                      FRP Construction
                    </option>

                    <option value="Luxury Décor">
                      Luxury Décor
                    </option>

                    <option value="Hospitality / Resort Construction">
                      Hospitality / Resort
                      Construction
                    </option>

                    <option value="Villa / Farmhouse Construction">
                      Villa / Farmhouse
                      Construction
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

                <div className="rk-cp-field">

                  <label>
                    Budget Range
                  </label>

                  <select
                    name="budget"
                    value={
                      formData.budget
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="">
                      Select budget
                    </option>

                    <option value="Under ₹25 Lakhs">
                      Under ₹25 Lakhs
                    </option>

                    <option value="₹25 Lakhs - 1 Crore">
                      ₹25 Lakhs – 1 Crore
                    </option>

                    <option value="₹1 - 5 Crore">
                      ₹1 – 5 Crore
                    </option>

                    <option value="₹5 Crore+">
                      ₹5 Crore+
                    </option>

                  </select>

                </div>

              </div>

              {/* ====================================
                  PROJECT DETAILS
              ==================================== */}

              <div className="rk-cp-field">

                <label>
                  Project Details *
                </label>

                <textarea
                  name="details"
                  placeholder="Tell us about your project..."
                  rows={4}
                  value={
                    formData.details
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </div>

              {/* ====================================
                  SUBMIT
              ==================================== */}

              <button
                type="submit"
                className="rk-cp-submit"
                disabled={submitting}
              >

                {submitting
                  ? "Booking..."
                  : "Book Consultation"}

              </button>

            </form>
          </>

        )}

      </div>

    </div>
  );
}