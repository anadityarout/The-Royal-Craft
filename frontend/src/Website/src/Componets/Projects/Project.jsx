import React, { useEffect, useState } from "react";
import "./Project.css";
import { useNavigate } from "react-router-dom";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/project";

const Project = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  // =====================================================
  // LOAD PROJECTS
  // =====================================================

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

      // Make sure API response is an array
      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        console.error("Invalid project data:", data);
        setProjects([]);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      setProjects([]);
    }
  };

  // =====================================================
  // ONLY SHOW VALID PROJECTS
  // =====================================================

  const validProjects = projects.filter((item) => {
    const projectImage = item.mainImage?.trim();
    const projectName = item.projectName?.trim();

    // Don't show records without image or project name
    if (!projectImage) return false;
    if (!projectName) return false;

    // Don't show banner records if API contains one
    const type = item.type?.trim().toLowerCase();
    const category = item.category?.trim().toLowerCase();

    if (type === "banner") return false;
    if (category === "banner") return false;

    return true;
  });

  // =====================================================
  // OPEN EXACT PROJECT WITH PROJECT NAME IN URL
  // =====================================================

  const openProject = (project) => {
    const projectSlug = String(project.projectName || "project")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    navigate(`/project/${projectSlug}`, {
      state: {
        selectedProject: project,
      },
    });
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section className="rk-project-section">
      <div className="rk-project-container">

        {/* =====================================================
            LEFT CONTENT
        ===================================================== */}

        <div className="rk-project-content">

          <span className="rk-project-tag">
            FEATURED PROJECTS
          </span>

          <h2 className="rk-project-title">
            Transforming Spaces <br />
            into Iconic Landmarks
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

        {/* =====================================================
            RIGHT PROJECT GRID
        ===================================================== */}

        <div className="rk-project-grid-wrapper">

          <div className="rk-project-grid">

            {validProjects.length > 0 ? (

              validProjects.map((item) => (

                <div
                  className="rk-project-card"
                  key={item.id}
                >

                  {/* =====================================================
                      PROJECT IMAGE
                  ===================================================== */}

                  <div className="rk-project-image">

                    <img
                      src={item.mainImage}
                      alt={item.projectName}
                      loading="lazy"
                    />

                  </div>

                  {/* =====================================================
                      PROJECT FOOTER
                  ===================================================== */}

                  <div className="rk-project-footer">

                    <span className="rk-project-icon">
                      🏛
                    </span>

                    <span className="rk-project-name">
                      {item.projectName}
                    </span>

                    {/* =====================================================
                        ONLY ARROW IS CLICKABLE
                    ===================================================== */}

                    <button
                      type="button"
                      className="rk-project-arrow-btn"
                      onClick={() => openProject(item)}
                      aria-label={`View ${item.projectName}`}
                    >
                      →
                    </button>

                  </div>

                </div>

              ))

            ) : (

              <p className="rk-project-status">
                No projects available.
              </p>

            )}

          </div>

        </div>

      </div>
    </section>
  );
};

export default Project;