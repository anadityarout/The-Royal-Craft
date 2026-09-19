import React, { useEffect, useState } from "react";
import "./GalleryPage.css";
import PageSeo from "../SeoPage/PageSeo";
import { ArrowRight } from "lucide-react";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/gallery";

const GalleryPage = () => {
  // =========================================================
  // STATES
  // =========================================================

  const [gallery, setGallery] = useState([]);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // =========================================================
  // LOAD GALLERY + BANNER
  // =========================================================

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      setLoading(true);
      setError(false);

      // =====================================================
      // LOAD NORMAL GALLERY IMAGES
      // =====================================================

      const galleryResponse = await fetch(API_URL);

      if (!galleryResponse.ok) {
        throw new Error("Failed to load gallery");
      }

      const galleryData = await galleryResponse.json();

      setGallery(
        Array.isArray(galleryData) ? galleryData : []
      );

      // =====================================================
      // LOAD GALLERY BANNER
      // =====================================================

      const bannerResponse = await fetch(
        `${API_URL}?type=banner`
      );

      if (bannerResponse.ok) {
        const bannerData = await bannerResponse.json();

        if (bannerData && bannerData.image) {
          setBanner(bannerData);
        } else {
          setBanner(null);
        }
      } else {
        setBanner(null);
      }
    } catch (err) {
      console.error("Gallery page load error:", err);

      setError(true);
      setGallery([]);
      setBanner(null);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SCROLL TO GALLERY
  // =========================================================

  const handleExplore = () => {
    const gallerySection = document.querySelector(
      ".gallery-intro"
    );

    if (gallerySection) {
      gallerySection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <>
      <PageSeo page="Gallery" />

      <div className="gallery-page">

        {/* ===================================================
            GALLERY BANNER
        =================================================== */}

        <section className="gallery-banner">

          {banner?.image ? (
            <img
              src={banner.image}
              alt={
                banner.name || "Gallery Banner"
              }
              className="gallery-banner-image"
            />
          ) : (
            <div className="gallery-banner-empty">
              Gallery
            </div>
          )}

          {/* LIGHT GRADIENT OVERLAY */}

          <div className="gallery-banner-overlay">

            {/* CONTENT */}

            <div className="gallery-banner-container">

              <div className="gallery-banner-content">

                {/* KICKER */}

                <span className="gallery-banner-kicker">
                  THE ROYAL KRAFT
                </span>

                {/* TITLE */}

                <h1>
                  {banner?.name || "Our Gallery"}
                </h1>

                {/* DESCRIPTION */}

                {banner?.description && (
                  <p>
                    {banner.description}
                  </p>
                )}

                {/* CTA */}

                <button
                  type="button"
                  className="gallery-banner-button"
                  onClick={handleExplore}
                >
                  <span>
                    Explore Collection
                  </span>

                  <ArrowRight
                    size={20}
                    strokeWidth={2}
                  />
                </button>

              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            INTRO
        =================================================== */}

        <section className="gallery-intro">

          <span className="gallery-tag">
            OUR GALLERY
          </span>

          <h2 className="gallery-title">
            Crafted with Precision,
            <br />
            <span>
              Inspired by Vision
            </span>
          </h2>

          <p className="gallery-description">
            A glimpse into our journey
            of transforming ideas into
            remarkable spaces and
            structures.
          </p>

        </section>

        {/* ===================================================
            GALLERY
        =================================================== */}

        <div className="gallery-container">

          {loading ? (

            <h3 className="gallery-message">
              Loading...
            </h3>

          ) : error ? (

            <h3 className="gallery-message">
              Something went wrong.
              Please try again later.
            </h3>

          ) : gallery.length > 0 ? (

            gallery.map((item, index) => (

              <div
                className="gallery-card"
                key={
                  item.id ||
                  `gallery-${index}`
                }
              >

                {/* IMAGE */}

                <img
                  src={item.image}
                  alt={
                    item.primaryName ||
                    "Gallery image"
                  }
                  loading="lazy"
                />

                {/* CONTENT */}

                {(item.primaryName ||
                  item.secondaryName ||
                  item.description) && (

                  <div className="gallery-content">

                    {item.primaryName && (
                      <h3>
                        {item.primaryName}
                      </h3>
                    )}

                    {item.secondaryName && (
                      <h5>
                        {item.secondaryName}
                      </h5>
                    )}

                    {item.description && (
                      <p>
                        {item.description}
                      </p>
                    )}

                  </div>

                )}

              </div>

            ))

          ) : (

            <h3 className="gallery-message">
              No Gallery Images Found
            </h3>

          )}

        </div>

      </div>
    </>
  );
};

export default GalleryPage;