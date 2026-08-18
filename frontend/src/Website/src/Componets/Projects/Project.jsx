import React, { useEffect, useState } from "react";
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

  return (
    <section className="rk-project-section">
      <div className="rk-project-container">
        <div className="rk-project-content">
          <span className="rk-project-tag">FEATURED PROJECTS</span>

          <h2 className="rk-project-title">
            Transforming Spaces <br /> into Iconic Landmarks
          </h2>

          <p className="rk-project-desc">
            Our portfolio showcases luxury architectural décor created for
            hotels, banquet halls, villas, temples, resorts, commercial
            buildings, and premium residences across India.
            <br />
            <br />
            Every project is thoughtfully designed to blend elegance,
            durability, and architectural excellence.
          </p>

          <button
            className="rk-project-btn"
            onClick={() => navigate("/project")}
          >
            VIEW ALL PROJECTS
          </button>
        </div>

        <div className="rk-project-grid-wrapper">
          <div className="rk-project-grid">
            {projects.map((item) => (
              <div
                className="rk-project-card"
                key={item.id}
                onClick={() => navigate(`/project/${item.id}`)}
              >
                <div className="rk-project-image">
                  <img src={item.mainImage} alt={item.projectName} />
                </div>

                <div className="rk-project-footer">
                  <span className="rk-project-icon">🏛</span>
                  <span className="rk-project-name">{item.projectName}</span>
                  <span
                    className="rk-project-arrow-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/project");
                    }}
                  >
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Project;