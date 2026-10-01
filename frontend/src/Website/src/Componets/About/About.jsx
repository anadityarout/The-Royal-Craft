import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./About.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/about";

const About = () => {
  const navigate = useNavigate();

  const [aboutData, setAboutData] = useState({
    image: "",
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

      if (!Array.isArray(data) || data.length === 0) {
        setAboutData({
          image: "",
          name: "",
          description: "",
        });
        return;
      }

      /*
        Sort newest item first
      */
      const sortedData = [...data].sort(
        (a, b) =>
          new Date(b.created || 0) -
          new Date(a.created || 0)
      );

      /*
        Find latest item containing text
      */
      const textItem =
        sortedData.find(
          (item) =>
            item?.name?.trim() ||
            item?.description?.trim()
        ) || sortedData[0];

      /*
        Find latest available image
      */
      const imageItem =
        sortedData.find((item) => item?.image) ||
        sortedData[0];

      setAboutData({
        image: imageItem?.image || "",
        name: textItem?.name || "",
        description: textItem?.description || "",
      });
    } catch (error) {
      console.error("About API Error:", error);

      setAboutData({
        image: "",
        name: "",
        description: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="about-section">
      <div className="about-container">

        {/* =================================================
            IMAGE
        ================================================= */}
        <div className="about-image-wrapper">
          {loading ? (
            <div className="about-image-loading">
              <span className="about-loader"></span>
            </div>
          ) : aboutData.image ? (
            <img
              src={aboutData.image}
              alt={aboutData.name || "The Royal Kraft"}
              className="about-main-image"
            />
          ) : (
            <div className="about-image-empty">
              <span>About Image</span>
            </div>
          )}
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}
        <div className="about-content">

          <span className="about-tag">
            OUR STORY
          </span>

          {aboutData.name && (
            <h2 className="about-title">
              {aboutData.name}
            </h2>
          )}

          <div className="about-gold-line"></div>

          {aboutData.description && (
            <div className="about-description">
              <p>{aboutData.description}</p>
            </div>
          )}

          <button
            type="button"
            className="about-btn"
            onClick={() => navigate("/about")}
          >
            <span>Discover The Royal Kraft</span>
            <span className="about-btn-arrow">→</span>
          </button>

        </div>

      </div>
    </section>
  );
};

export default About;