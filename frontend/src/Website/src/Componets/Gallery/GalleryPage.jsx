import React, { useEffect, useState } from "react";
import "./GalleryPage.css";
import PageSeo from "../SeoPage/PageSeo";
import galleryBanner from "../../assets/Gallery.jpg";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/gallery";

const GalleryPage = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      setError(false);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load gallery");
      }

      const data = await response.json();

      setGallery(data);
    } catch (err) {
      console.log(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageSeo page="Gallery" />

      <div className="gallery-page">
        {/* Banner */}
        <div className="gallery-banner">
          <img src={galleryBanner} alt="Gallery Banner" />
        </div>

        {/* Intro */}
        <section className="gallery-intro">
          <span className="gallery-tag">OUR GALLERY</span>

          <h2 className="gallery-title">
            Crafted with Precision,
            <br />
            <span>Inspired by Vision</span>
          </h2>

          <p className="gallery-description">
            A glimpse into our journey of transforming ideas into
            remarkable spaces and structures.
          </p>
        </section>

        {/* Gallery */}
        <div className="gallery-container">
          {loading ? (
            <h3 style={{ textAlign: "center" }}>Loading...</h3>
          ) : error ? (
            <h3 style={{ textAlign: "center" }}>
              Something went wrong. Please try again later.
            </h3>
          ) : gallery.length > 0 ? (
            gallery.map((item, index) => (
              <div className="gallery-card" key={item.id || `gallery-${index}`}>
                <img
                  src={item.image}
                  alt={item.primaryName || "Gallery image"}
                  loading="lazy"
                />

                {(item.primaryName ||
                  item.secondaryName ||
                  item.description) && (
                  <div className="gallery-content">
                    {item.primaryName && <h3>{item.primaryName}</h3>}
                    {item.secondaryName && <h5>{item.secondaryName}</h5>}
                    {item.description && <p>{item.description}</p>}
                  </div>
                )}
              </div>
            ))
          ) : (
            <h3 style={{ textAlign: "center" }}>No Gallery Images Found</h3>
          )}
        </div>
      </div>
    </>
  );
};

export default GalleryPage;
