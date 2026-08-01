import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./About.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/about";

const About = () => {
    const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [aboutText, setAboutText] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to load About data");
      }
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        // Sort newest first
        const sorted = [...data].sort(
          (a, b) => new Date(b.created) - new Date(a.created)
        );

        setImages(sorted);

        // Find the most recent item that actually has a name/description
        const withText = sorted.find(
          (item) => item.name?.trim() || item.description?.trim()
        );

        setAboutText({
          name: withText?.name || "",
          description: withText?.description || "",
        });
      }
    } catch (err) {
      console.error("About API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Use up to 6 images for the grid
  const galleryImages = images.slice(0, 6);

  return (
    <section className="about-section">
      <div className="about-container">
        {/* Left: Text content */}
        <div className="about-content">
          <span className="about-tag">OUR STORY</span>

          {aboutText.name && (
            <h2 className="about-title">{aboutText.name}</h2>
          )}

          <div className="about-line"></div>

          {aboutText.description && (
            <p className="about-description">{aboutText.description}</p>
          )}

          <button
  className="about-btn"
  onClick={() => navigate("/about")}
>
  Discover Our Story <span>→</span>
</button>
        </div>

        {/* Right: Image Gallery */}
        <div className="about-gallery">
          {loading ? (
            <div className="about-loading">Loading...</div>
          ) : (
            galleryImages.map((item, index) => (
              <div
                className={`gallery-item item-${index + 1}`}
                key={item.id}
              >
                <img src={item.image} alt={item.name || "About"} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Features */}
      <div className="about-features">
        <div className="feature-item">
          <div className="feature-icon">🏵️</div>
          <h4>Premium</h4>
          <p>Materials</p>
        </div>
        <div className="feature-divider"></div>
        <div className="feature-item">
          <div className="feature-icon">🛠️</div>
          <h4>Custom</h4>
          <p>Designs</p>
        </div>
        <div className="feature-divider"></div>
        <div className="feature-item">
          <div className="feature-icon">⚙️</div>
          <h4>Expert</h4>
          <p>Installation</p>
        </div>
        <div className="feature-divider"></div>
        <div className="feature-item">
          <div className="feature-icon">🎧</div>
          <h4>Pan India</h4>
          <p>Delivery</p>
        </div>
      </div>
    </section>
  );
};

export default About;