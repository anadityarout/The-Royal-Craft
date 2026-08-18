import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Gem, PencilRuler, Settings, Truck } from "lucide-react";
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

  const features = [
    {
      icon: Gem,
      title: "Premium",
      lines: ["Premium Quality", "Fiber Materials"],
    },
    {
      icon: PencilRuler,
      title: "Custom",
      lines: ["Custom Designs", "Tailored for You"],
    },
    {
      icon: Settings,
      title: "Expert",
      lines: ["Expert Installation", "& Setup"],
    },
    {
      icon: Truck,
      title: "Pan India",
      lines: ["Pan India", "Delivery & Support"],
    },
  ];

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
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div className="feature-card" key={feature.title}>
              <div className="feature-badge">
                <span className="feature-badge-arc"></span>
                <span className="feature-badge-line feature-badge-line-left"></span>
                <span className="feature-badge-line feature-badge-line-right"></span>
                <div className="feature-badge-circle">
                  <Icon size={26} strokeWidth={1.5} />
                </div>
              </div>

              <h4 className="feature-title">{feature.title}</h4>
              <div className="feature-underline"></div>

              <p className="feature-text">
                {feature.lines.map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < feature.lines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>

              <span className="feature-card-curve"></span>
            </div>
          );
        })}
      </div>

      <div className="features-tagline">
        <span className="tagline-dot"></span>
        <span className="tagline-line"></span>
        <span className="tagline-text">COMPLETE ROYAL KRAFT SOLUTIONS</span>
        <span className="tagline-line"></span>
        <span className="tagline-dot"></span>
      </div>
      <div className="tagline-flourish">❦</div>
    </section>
  );
};

export default About;
