import React, { useEffect, useMemo, useState } from "react";
import "./ServicePage.css";
import PageSeo from "../SeoPage/PageSeo";
import { Building2, ArrowRight } from "lucide-react";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/service";

const categories = [
  "All",
  "Air Conditioning",
  "Architectural Layout",
  "Electrical Lighting",
  "Fire Fighting",
  "MEP (Mechanical & Electrical & Plumbing)",
  "STP (Sewage Treatment Plants)",
];

const ServicePage = () => {
  /* =======================================================
     CATEGORY
  ======================================================= */

  const [selectedCategory, setSelectedCategory] = useState("All");

  /* =======================================================
     SERVICES
  ======================================================= */

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =======================================================
     COMPANIES
  ======================================================= */

  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);

  /* =======================================================
     BANNER
  ======================================================= */

  const [banner, setBanner] = useState(null);
  const [bannerLoading, setBannerLoading] = useState(true);

  /* =======================================================
     LOAD ALL DATA
  ======================================================= */

  useEffect(() => {
    loadBanner();
    loadServices();
    loadCompanies();
  }, []);

  /* =======================================================
     LOAD BANNER
  ======================================================= */

  const loadBanner = async () => {
    try {
      setBannerLoading(true);

      const response = await fetch(
        `${API_URL}?type=banner`
      );

      if (!response.ok) {
        throw new Error("Failed to load banner");
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setBanner(data[0]);
      } else {
        setBanner(null);
      }
    } catch (err) {
      console.error("Banner loading error:", err);
      setBanner(null);
    } finally {
      setBannerLoading(false);
    }
  };

  /* =======================================================
     LOAD SERVICES
  ======================================================= */

  const loadServices = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}?type=service`
      );

      if (!response.ok) {
        throw new Error("Failed to load services");
      }

      const data = await response.json();

      setServices(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Services loading error:",
        err
      );

      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     LOAD COMPANIES
  ======================================================= */

  const loadCompanies = async () => {
    try {
      setCompaniesLoading(true);

      const response = await fetch(
        `${API_URL}?type=logo`
      );

      if (!response.ok) {
        throw new Error("Failed to load companies");
      }

      const data = await response.json();

      setCompanies(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Companies loading error:",
        err
      );

      setCompanies([]);
    } finally {
      setCompaniesLoading(false);
    }
  };

  /* =======================================================
     FILTER SERVICES
  ======================================================= */

  const filteredServices = useMemo(() => {
    if (selectedCategory === "All") {
      return services;
    }

    return services.filter(
      (item) =>
        String(item.category || "")
          .trim()
          .toLowerCase() ===
        selectedCategory
          .trim()
          .toLowerCase()
    );
  }, [services, selectedCategory]);

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <div className="service-page">

      {/* =================================================
          SEO
      ================================================= */}

      <PageSeo page="Service" />

      {/* =================================================
          SERVICE BANNER
          
          Same visual style as HomeSlider/ProductPage.
          Image controls the height automatically.
      ================================================= */}

      <section className="service-page-banner">

        {bannerLoading ? (

          <div className="service-page-empty">
            Loading...
          </div>

        ) : banner ? (

          <>

            {/* ===========================================
                BANNER IMAGE
            =========================================== */}

            {banner.image && (
              <img
                src={banner.image}
                alt={
                  banner.name ||
                  "Our Services"
                }
                className="service-page-banner-image"
                loading="eager"
                fetchPriority="high"
              />
            )}

            {/* ===========================================
                LIGHT OVERLAY
            =========================================== */}

            <div className="service-page-banner-overlay"></div>

            {/* ===========================================
                BANNER CONTENT
            =========================================== */}

            <div className="service-page-banner-content">

              {/* =========================================
                  BRAND LABEL
              ========================================= */}

              <span className="service-page-banner-kicker">
                THE ROYAL KRAFT
              </span>

              {/* =========================================
                  BANNER NAME
              ========================================= */}

              {banner.name && (
                <h1>
                  {banner.name}
                </h1>
              )}

              {/* =========================================
                  BANNER DESCRIPTION
              ========================================= */}

              {banner.description && (
                <p>
                  {banner.description}
                </p>
              )}

              {/* =========================================
                  CTA
              ========================================= */}

              <button
                type="button"
                className="service-page-banner-cta"
                onClick={() => {
                  document
                    .querySelector(
                      ".service-page-filter"
                    )
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
              >
                <span>
                  Explore Collection
                </span>

                <ArrowRight size={18} />
              </button>

            </div>

          </>

        ) : (

          <div className="service-page-empty">
            No Banner Available
          </div>

        )}

      </section>

      {/* =================================================
          OUR COMPANIES
      ================================================= */}

      <section className="service-page-companies">

        <div className="service-page-companies-wrapper">

          <h2 className="service-page-companies-title">

            <span className="service-page-companies-line" />

            Our Companies

            <span className="service-page-companies-line" />

          </h2>

          {companiesLoading ? (

            <div className="service-page-empty">
              Loading...
            </div>

          ) : companies.length > 0 ? (

            <div className="service-page-companies-grid">

              {companies.map((company) => (

                <a
                  href={company.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="service-page-company-card"
                  key={company.id}
                  style={{
                    backgroundImage: `url(${company.image})`,
                  }}
                >

                  <span className="service-page-company-overlay" />

                  <div className="service-page-company-footer">

                    <div className="service-page-company-name">

                      <span className="service-page-company-icon">
                        <Building2 size={16} />
                      </span>

                      <span>
                        {company.name}
                      </span>

                    </div>

                    <span className="service-page-company-arrow">
                      <ArrowRight size={18} />
                    </span>

                  </div>

                </a>

              ))}

            </div>

          ) : (

            <div className="service-page-empty">
              No Companies Available
            </div>

          )}

        </div>

      </section>

      {/* =================================================
          CATEGORY FILTER
      ================================================= */}

      <section className="service-page-filter">

        <div className="service-page-filter-wrapper">

          {categories.map((category) => (

            <button
              key={category}
              type="button"
              className={`service-page-filter-btn ${
                selectedCategory === category
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setSelectedCategory(category)
              }
            >
              {category}
            </button>

          ))}

        </div>

      </section>

      {/* =================================================
          SERVICES
      ================================================= */}

      <section className="service-page-list">

        {loading ? (

          <div className="service-page-empty">
            Loading...
          </div>

        ) : filteredServices.length > 0 ? (

          <div className="service-page-grid">

            {filteredServices.map(
              (service, index) => (

                <div
                  className="service-page-card"
                  key={
                    service.id ||
                    service.key ||
                    `service-${index}`
                  }
                >

                  {/* =====================================
                      SERVICE IMAGE
                  ===================================== */}

                  <img
                    src={service.image}
                    alt={
                      service.name ||
                      "Service"
                    }
                    className="service-page-image"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "/no-image.png";
                    }}
                  />

                  {/* =====================================
                      SERVICE CONTENT
                  ===================================== */}

                  <div className="service-page-content">

                    <h3>
                      {service.name}
                    </h3>

                  </div>

                </div>

              )
            )}

          </div>

        ) : (

          <div className="service-page-empty">
            No Services Available
          </div>

        )}

      </section>

    </div>
  );
};

export default ServicePage;