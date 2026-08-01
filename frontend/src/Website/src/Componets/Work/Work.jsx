import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Work.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/work";

const Work = () => {
    const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [workText, setWorkText] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWork();
  }, []);

  const loadWork = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to load work data");
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

        setWorkText({
          name: withText?.name || "",
          description: withText?.description || "",
        });
      }
    } catch (err) {
      console.error("Work API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Use up to 3 images for the grid
  const galleryImages = images.slice(0, 3);

  return (
    <section className="work">
      <div className="work-container">
        {/* Left: Text content */}
        <div className="work-content">
            <span className="work-tag">OUR IMPRESSIVE WORK</span>
             <div className="work-line"></div>
          {workText.name && (
            <h2 className="work-title">{workText.name}</h2>
          )}

          {workText.description && (
            <p className="work-description">{workText.description}</p>
          )}

          <button
  className="view-projects"
  onClick={() => navigate("/project")}
>
  VIEW ALL PROJECTS <span>→</span>
</button>
        </div>

        {/* Right: Image Gallery */}
        <div className="work-gallery">
          {loading ? (
            <div className="work-loading">Loading...</div>
          ) : (
            galleryImages.map((item) => (
              <div className="work-card" key={item.id}>
                <img src={item.image} alt={item.name || "Work"} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Work;