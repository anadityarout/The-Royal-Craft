import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Project.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/project";

// Splits the title so the last word can be shown in gold
const TITLE = "Transforming Spaces into Iconic Landmarks";

const splitTitle = (text) => {
  const words = text.trim().split(/\s+/);
  return {
    first: words.slice(0, -1).join(" "),
    gold: words[words.length - 1],
  };
};

const Project = () => {
  const navigate = useNavigate();
  const trackRef = useRef(null);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  // =====================================================
  // LOAD PROJECTS
  // =====================================================

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);

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
    } finally {
      setLoading(false);
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
  // CAROUSEL
  // =====================================================

  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  // Re-check the arrows whenever the track or its cards change size
  // (window resize, images loading, breakpoint changes)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    updateArrows();

    const observer = new ResizeObserver(updateArrows);
    observer.observe(el);
    Array.from(el.children).forEach((child) => observer.observe(child));

    window.addEventListener("resize", updateArrows);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateArrows);
    };
  }, [projects, loading]);

  const scrollByCard = (direction) => {
    const el = trackRef.current;
    if (!el || !el.firstElementChild) return;

    const card = el.firstElementChild;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;

    el.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: "smooth",
    });
  };

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

  const title = splitTitle(TITLE);
  const hasProjects = !loading && validProjects.length > 0;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section className="rk-project-section">
      <div className="rk-project-container">
        {/* ===== Header (centered) ===== */}

        <div className="rk-project-head">
          <span className="rk-project-tag">FEATURED PROJECTS</span>

          <h2 className="rk-project-title">
            {title.first}{" "}
            <span className="rk-project-title-gold">{title.gold}</span>
          </h2>

          <p className="rk-project-desc">
            Our portfolio showcases luxury architectural décor created for
            hotels, banquet halls, villas, temples, resorts, commercial
            buildings, and premium residences across India.
          </p>
        </div>

        {/* ===== Carousel ===== */}

        <div className="rk-project-carousel">
          {loading && <div className="rk-project-state">Loading...</div>}

          {!loading && validProjects.length === 0 && (
            <div className="rk-project-state">No projects available.</div>
          )}

          {hasProjects && (
            <>
              <button
                type="button"
                className="rk-project-arrow rk-project-arrow-prev"
                onClick={() => scrollByCard(-1)}
                disabled={!canPrev}
                aria-label="Previous"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <div
                className="rk-project-track"
                ref={trackRef}
                onScroll={updateArrows}
              >
                {validProjects.map((item, index) => (
                  <article
                    className="rk-project-card"
                    key={item.id ?? index}
                  >
                    {/* Image (not clickable) */}

                    <div className="rk-project-image">
                      <img
                        src={item.mainImage}
                        alt={item.projectName}
                        loading="lazy"
                      />
                    </div>

                    {/* Footer: name + ONLY the arrow is clickable */}

                    <div className="rk-project-footer">
                      <h3 className="rk-project-name">{item.projectName}</h3>

                      <button
                        type="button"
                        className="rk-project-arrow-btn"
                        onClick={() => openProject(item)}
                        aria-label={`View ${item.projectName}`}
                      >
                        →
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <button
                type="button"
                className="rk-project-arrow rk-project-arrow-next"
                onClick={() => scrollByCard(1)}
                disabled={!canNext}
                aria-label="Next"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* ===== Centered button ===== */}

        <div className="rk-project-cta">
          <button
            type="button"
            className="rk-project-btn"
            onClick={() => navigate("/project")}
          >
            VIEW ALL PROJECTS <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Project;