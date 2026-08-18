// ShopPage.jsx

import React, { useState } from "react";
import "./ShopPage.css";

import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Phone,
  Search,
  X,
  Check,
  PenTool,
  Package,
  CloudSun,
  Wrench,
  ArrowRight,
  Scan,
  Palette,
  Flower2,
  Award,
  Lightbulb,
  Landmark,
} from "lucide-react";

// =====================================================
// AWS ENQUIRY API
// =====================================================

const ENQUIRY_API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/enquiry";

// =====================================================
// DEFAULT FEATURES
// =====================================================

const DEFAULT_FEATURES = [
  {
    icon: "design",
    label: "Custom Design Available",
  },
  {
    icon: "material",
    label: "Premium Fiber Material",
  },
  {
    icon: "weather",
    label: "Weather Resistant",
  },
  {
    icon: "installation",
    label: "Installation Support",
  },
];

const FEATURE_ICONS = {
  design: PenTool,
  material: Package,
  weather: CloudSun,
  installation: Wrench,
};

// =====================================================
// DEFAULT HIGHLIGHTS
// =====================================================

const DEFAULT_HIGHLIGHTS = [
  "Elegant & Royal Designs",
  "High Quality Fiber Construction",
  "Lightweight & Durable",
  "Any Size & Any Theme",
  "On-time Delivery & Installation",
];

// =====================================================
// CUSTOMIZATION ICONS
// =====================================================

const CUSTOMIZATION_ICONS = {
  size: Scan,
  finish: Palette,
  theme: Flower2,
  branding: Award,
  lighting: Lightbulb,
  architecture: Landmark,
};

// =====================================================
// DEFAULT CUSTOMIZATION FEATURES
// =====================================================

const DEFAULT_CUSTOMIZATION_FEATURES = [
  {
    icon: "size",
    title: "Custom Size",
    text: "As per your venue",
  },
  {
    icon: "finish",
    title: "Custom Finishes",
    text: "Multiple color options",
  },
  {
    icon: "theme",
    title: "Themed Designs",
    text: "Traditional / Modern",
  },
  {
    icon: "branding",
    title: "Branding & Logo",
    text: "Add your logo / initials",
  },
  {
    icon: "lighting",
    title: "Lighting Integration",
    text: "LED & decorative lighting",
  },
  {
    icon: "architecture",
    title: "Architectural Elements",
    text: "Pillars, arches, motifs & more",
  },
];

// =====================================================
// PROCESS CARDS
// =====================================================

const PROCESS_CARDS = [
  {
    number: "01",
    title: "Custom Design",
    text: "Tailored designs as per your theme, space and requirements.",
  },
  {
    number: "02",
    title: "Premium Quality",
    text: "High-grade fiber material ensuring durability and perfect finish.",
  },
  {
    number: "03",
    title: "Expert Craftsmanship",
    text: "Skilled artisans creating intricate details with perfection.",
  },
  {
    number: "04",
    title: "End-to-End Support",
    text: "From concept to installation, we handle everything for you.",
  },
];

const TABS = [
  "Overview",
  "Specifications",
  "Customization",
];

// =====================================================
// SHOP PAGE
// =====================================================

const ShopPage = ({
  product,
  onBack,
  relatedProducts = [],
}) => {
  // =====================================================
  // STATES
  // =====================================================

  const [activeIndex, setActiveIndex] = useState(0);

  const [activeTab, setActiveTab] =
    useState("Overview");

  const [showEnquiry, setShowEnquiry] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
  });

  // =====================================================
  // PRODUCT CHECK
  // =====================================================

  if (!product) {
    return null;
  }

  // =====================================================
  // PRODUCT GALLERY
  // =====================================================

  const gallery = [
    product.primaryImage,

    ...(product.secondaryImages || []).map(
      (item) => item.image
    ),
  ].filter(Boolean);

  const selectedImage =
    gallery[activeIndex] || "";

  // =====================================================
  // PRODUCT FEATURES
  // =====================================================

  const features =
    product.features &&
    product.features.length > 0
      ? product.features
      : DEFAULT_FEATURES;

  // =====================================================
  // PRODUCT HIGHLIGHTS
  // =====================================================

  const highlights =
    product.highlights &&
    product.highlights.length > 0
      ? product.highlights
      : DEFAULT_HIGHLIGHTS;

  // =====================================================
  // CUSTOMIZATION FEATURES
  // =====================================================

  const customizationFeatures =
    product.customizationFeatures &&
    product.customizationFeatures.length > 0
      ? product.customizationFeatures
      : DEFAULT_CUSTOMIZATION_FEATURES;

  // =====================================================
  // WHATSAPP
  // =====================================================

  const whatsappNumber =
    product.whatsapp || "918130462200";

  const whatsappMessage =
    encodeURIComponent(
      `Hi, I'm interested in ${
        product.name || "your product"
      }. I saw on your website. Could you please share more details and pricing?`
    );

  // =====================================================
  // IMAGE PREVIOUS
  // =====================================================

  const goPrev = () => {
    if (gallery.length === 0) return;

    setActiveIndex((index) =>
      index === 0
        ? gallery.length - 1
        : index - 1
    );
  };

  // =====================================================
  // IMAGE NEXT
  // =====================================================

  const goNext = () => {
    if (gallery.length === 0) return;

    setActiveIndex((index) =>
      index === gallery.length - 1
        ? 0
        : index + 1
    );
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // OPEN ENQUIRY
  // =====================================================

  const openEnquiry = () => {
    setShowEnquiry(true);
  };

  // =====================================================
  // CLOSE ENQUIRY
  // =====================================================

  const closeEnquiry = () => {
    if (submitting) return;

    setShowEnquiry(false);
  };

  // =====================================================
  // SUBMIT ENQUIRY TO AWS
  // =====================================================

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    // =================================================
    // VALIDATION
    // =================================================

    if (!formData.fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!formData.email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    if (!formData.phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }

    if (!formData.city.trim()) {
      alert("Please enter your city.");
      return;
    }

    // Prevent duplicate submissions
    if (submitting) {
      return;
    }

    setSubmitting(true);

    try {
      // =================================================
      // DATA SENT TO LAMBDA
      // =================================================

      const enquiryData = {
        fullName: formData.fullName.trim(),

        email: formData.email.trim(),

        phone: formData.phone.trim(),

        city: formData.city.trim(),

        productId:
          product?.id || "",

        productName:
          product?.name ||
          "Unknown Product",

        category:
          product?.category || "",
      };

      console.log(
        "Sending enquiry:",
        enquiryData
      );

      // =================================================
      // POST /enquiry
      // =================================================

      const response = await fetch(
        ENQUIRY_API_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            enquiryData
          ),
        }
      );

      // =================================================
      // READ RESPONSE
      // =================================================

      let result;

      try {
        result =
          await response.json();
      } catch (error) {
        throw new Error(
          "Invalid response from server."
        );
      }

      console.log(
        "Enquiry API response:",
        result
      );

      // =================================================
      // API ERROR
      // =================================================

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to submit enquiry."
        );
      }

      // =================================================
      // SUCCESS
      // =================================================

      alert(
        "Enquiry submitted successfully! Our team will contact you soon."
      );

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        city: "",
      });

      // Close popup
      setShowEnquiry(false);
    } catch (error) {
      console.error(
        "Enquiry submission failed:",
        error
      );

      alert(
        error.message ||
          "Unable to submit enquiry. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="rk-shop-details">

      <div className="rk-shop-details-inner">

        {/* =================================================
            BREADCRUMB
        ================================================= */}

        <div className="rk-shop-breadcrumb">

          <span onClick={onBack}>
            Home
          </span>

          <ChevronRight size={14} />

          <span onClick={onBack}>
            Shop
          </span>

          <ChevronRight size={14} />

          <span>
            {product.category}
          </span>

          <ChevronRight size={14} />

          <span className="rk-breadcrumb-current">
            {product.name}
          </span>

        </div>

        {/* =================================================
            MAIN SECTION
        ================================================= */}

        <div className="rk-shop-main">

          {/* ================= LEFT ================= */}

          <div className="rk-shop-left">

            <div className="rk-main-image-box">

              {selectedImage && (
                <img
                  src={selectedImage}
                  alt={product.name}
                />
              )}

              <button
                type="button"
                className="rk-image-zoom-btn"
                aria-label="Zoom image"
              >
                <Search size={16} />
              </button>

              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    className="rk-image-nav rk-image-nav-prev"
                    onClick={goPrev}
                    aria-label="Previous image"
                  >
                    <ChevronLeft
                      size={20}
                    />
                  </button>

                  <button
                    type="button"
                    className="rk-image-nav rk-image-nav-next"
                    onClick={goNext}
                    aria-label="Next image"
                  >
                    <ChevronRight
                      size={20}
                    />
                  </button>
                </>
              )}

            </div>

            {/* THUMBNAILS */}

            {gallery.length > 1 && (
              <div className="rk-thumbnail-wrapper">

                {gallery.map(
                  (img, index) => (
                    <div
                      key={index}
                      className={
                        activeIndex ===
                        index
                          ? "rk-thumbnail active"
                          : "rk-thumbnail"
                      }
                      onClick={() =>
                        setActiveIndex(
                          index
                        )
                      }
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${
                          index + 1
                        }`}
                      />
                    </div>
                  )
                )}

              </div>
            )}

          </div>

          {/* ================= RIGHT ================= */}

          <div className="rk-shop-right">

            <span className="rk-product-category">
              {product.category}
            </span>

            <h1>
              {product.name}
            </h1>

            <p className="rk-product-description">
              {product.description}
            </p>

            {/* FEATURES */}

            <div className="rk-feature-grid">

              {features.map(
                (feature, index) => {
                  const Icon =
                    FEATURE_ICONS[
                      feature.icon
                    ] || PenTool;

                  return (
                    <div
                      className="rk-feature-item"
                      key={index}
                    >
                      <div className="rk-feature-icon">
                        <Icon
                          size={20}
                        />
                      </div>

                      <span>
                        {feature.label}
                      </span>

                    </div>
                  );
                }
              )}

            </div>

            {/* ACTION BUTTONS */}

            <div className="rk-shop-actions">

              <button
                type="button"
                className="rk-enquiry-btn"
                onClick={openEnquiry}
              >
                <MessageCircle
                  size={18}
                />

                Enquiry Now

                <ArrowRight
                  size={16}
                />
              </button>

              <a
                className="rk-whatsapp-btn"
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone size={16} />

                Chat on WhatsApp
              </a>

            </div>

            <div className="rk-consultation-note">
              <span>
                Get expert consultation
                for your custom project
              </span>
            </div>

          </div>

        </div>

        {/* =================================================
            TABS
        ================================================= */}

        <div className="rk-product-tabs">

          {TABS.map((tab) => (
            <button
              type="button"
              key={tab}
              className={
                activeTab === tab
                  ? "rk-tab active"
                  : "rk-tab"
              }
              onClick={() =>
                setActiveTab(tab)
              }
            >
              {tab}
            </button>
          ))}

        </div>

        {/* =================================================
            OVERVIEW
        ================================================= */}

        {activeTab ===
          "Overview" && (

          <div className="rk-tab-panel rk-overview-panel">

            <div className="rk-overview-text">

              <span className="rk-overview-label">
                Overview
              </span>

              <p>
                {product.overview ||
                  "No overview available for this product."}
              </p>

              <ul className="rk-highlight-list">

                {highlights.map(
                  (highlight, index) => (
                    <li key={index}>
                      <Check
                        size={16}
                      />

                      {highlight}
                    </li>
                  )
                )}

              </ul>

            </div>

            <div className="rk-overview-image">

              <img
                src={
                  product.overviewImage ||
                  product.primaryImage
                }
                alt={product.name}
              />

            </div>

          </div>
        )}

        {/* =================================================
            SPECIFICATIONS
        ================================================= */}

        {activeTab ===
          "Specifications" && (

          <div className="rk-tab-panel">

            <h2>
              Specifications
            </h2>

            {product.specifications &&
            product.specifications
              .length > 0 ? (

              <table className="rk-spec-table">

                <tbody>

                  {product.specifications.map(
                    (
                      item,
                      index
                    ) => (
                      <tr key={index}>

                        <td className="rk-spec-title">
                          {item.title}
                        </td>

                        <td className="rk-spec-value">
                          {item.value}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            ) : (

              <div className="rk-no-specification">
                No specifications
                available.
              </div>

            )}

          </div>
        )}

        {/* =================================================
            CUSTOMIZATION
        ================================================= */}

        {activeTab ===
          "Customization" && (

          <div className="rk-tab-panel rk-customization-panel">

            <h2 className="rk-customization-heading">
              Customization Available
            </h2>

            <p className="rk-customization-intro">
              {product.customization ||
                "We understand that every venue is unique. That's why we offer complete customization to match your theme, space and preferences."}
            </p>

            <div className="rk-customization-grid">

              {customizationFeatures.map(
                (item, index) => {
                  const Icon =
                    CUSTOMIZATION_ICONS[
                      item.icon
                    ] || Scan;

                  return (
                    <div
                      className="rk-customization-item"
                      key={index}
                    >

                      <div className="rk-customization-icon">
                        <Icon
                          size={22}
                        />
                      </div>

                      <div>

                        <h4>
                          {item.title}
                        </h4>

                        <p>
                          {item.text}
                        </p>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

            {/* CUSTOM DESIGN CTA */}

            <div className="rk-customization-cta">

              <div className="rk-customization-cta-icon">
                <Landmark
                  size={28}
                />
              </div>

              <div className="rk-customization-cta-text">

                <h3>
                  Need a Custom Design?
                </h3>

                <p>
                  Share your requirements
                  and our design team will
                  create a solution
                  specifically for your
                  venue.
                </p>

              </div>

              <button
                type="button"
                className="rk-customization-cta-btn"
                onClick={openEnquiry}
              >
                Request a Consultation

                <ArrowRight
                  size={16}
                />
              </button>

            </div>

          </div>
        )}

        {/* =================================================
            PROCESS CARDS
        ================================================= */}

        <div className="rk-process-cards">

          {PROCESS_CARDS.map(
            (card, index) => (

              <div
                className="rk-process-card"
                key={index}
              >

                <div className="rk-process-number">
                  {card.number}
                </div>

                <h3>
                  {card.title}
                </h3>

                <p>
                  {card.text}
                </p>

              </div>
            )
          )}

        </div>

        {/* =================================================
            EXPLORE MORE
        ================================================= */}

        {relatedProducts.length >
          0 && (

          <div className="rk-explore-section">

            <div className="rk-explore-header">

              <h2>
                Explore More Designs
              </h2>

              <span className="rk-view-all">
                View All Products

                <ArrowRight
                  size={14}
                />
              </span>

            </div>

            <div className="rk-explore-grid">

              {relatedProducts.map(
                (item, index) => (

                  <div
                    className="rk-explore-card"
                    key={
                      item.id ||
                      index
                    }
                    onClick={
                      item.onClick
                    }
                  >

                    <div className="rk-explore-image">

                      <img
                        src={item.image}
                        alt={item.name}
                      />

                    </div>

                    <h4>
                      {item.name}
                    </h4>

                    <span className="rk-explore-link">

                      View Details

                      <ArrowRight
                        size={12}
                      />

                    </span>

                  </div>
                )
              )}

            </div>

          </div>
        )}

        {/* =================================================
            BOTTOM CTA
        ================================================= */}

        <div className="rk-shop-cta">

          <div className="rk-shop-cta-text">

            <h3>
              Have a Custom Project in
              Mind?
            </h3>

            <p>
              Let's create something
              extraordinary together.
            </p>

          </div>

          <button
            type="button"
            className="rk-shop-cta-btn"
            onClick={openEnquiry}
          >
            Request a Consultation

            <ArrowRight
              size={16}
            />
          </button>

        </div>

      </div>

      {/* =================================================
          ENQUIRY MODAL
      ================================================= */}

      {showEnquiry && (

        <div
          className="rk-enquiry-overlay"
          onClick={closeEnquiry}
        >

          <div
            className="rk-enquiry-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* CLOSE */}

            <button
              type="button"
              className="rk-enquiry-close"
              onClick={closeEnquiry}
              disabled={submitting}
              aria-label="Close enquiry form"
            >
              <X size={18} />
            </button>

            <h3>
              Enquiry Form
            </h3>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
            >

              {/* FULL NAME */}

              <div className="rk-enquiry-field">

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
                  disabled={
                    submitting
                  }
                  required
                />

              </div>

              {/* EMAIL */}

              <div className="rk-enquiry-field">

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
                  disabled={
                    submitting
                  }
                  required
                />

              </div>

              {/* PHONE */}

              <div className="rk-enquiry-field">

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
                  disabled={
                    submitting
                  }
                  required
                />

              </div>

              {/* CITY */}

              <div className="rk-enquiry-field">

                <label>
                  City *
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
                  disabled={
                    submitting
                  }
                  required
                />

              </div>

              {/* BUTTONS */}

              <div className="rk-enquiry-actions">

                <button
                  type="submit"
                  className="rk-enquiry-submit-btn"
                  disabled={
                    submitting
                  }
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Enquiry"}
                </button>

                <button
                  type="button"
                  className="rk-enquiry-cancel-btn"
                  onClick={
                    closeEnquiry
                  }
                  disabled={
                    submitting
                  }
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default ShopPage;