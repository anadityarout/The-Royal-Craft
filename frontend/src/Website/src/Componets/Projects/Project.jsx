import React, { useRef, useEffect, useState } from "react";
import "./Project.css";
import { useNavigate } from "react-router-dom";
const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/project";


const Project = () => {
    const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

useEffect(() => {
  loadProjects();
}, []);

const loadProjects = async () => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to load projects");
    }

    const data = await response.json();

    setProjects(data);
  } catch (error) {
    console.error("Error loading projects:", error);
    setProjects([]);
  }
};
  const sliderRef = useRef();

  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -360, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 360, behavior: "smooth" });
  };

  return (
    <section className="rk-project-section">
      <div className="rk-project-container">
        <div className="rk-project-content">
          <span className="rk-project-tag">OUR SIGNATURE PROJECTS</span>

          <h2 className="rk-project-title">
            CRAFTING LANDMARKS <br /> ACROSS INDIA
          </h2>

          <p className="rk-project-desc">
            From concept to creation, we bring ideas to life and turn
            properties into iconic destinations.
          </p>

          <button
  className="rk-project-btn"
  onClick={() => navigate("/project")}
>
  VIEW ALL PROJECTS
</button>
        </div>

        <div className="rk-project-slider-wrapper">
          <button className="rk-project-arrow left" onClick={scrollLeft}>
            ←
          </button>

          <div className="rk-project-slider" ref={sliderRef}>
            {projects.map((item) => (
  <div className="rk-project-card" key={item.id}>
    <div className="rk-project-image">
      <img
        src={item.mainImage}
        alt={item.projectName}
      />
    </div>
  </div>
))}
          </div>

          <button className="rk-project-arrow right" onClick={scrollRight}>
            →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Project;