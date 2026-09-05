import React, { useEffect, useState } from "react";
import {
  useLocation,
  useParams,
  useNavigate,
} from "react-router-dom";

import "./ProjectPage.css";
import PageSeo from "../SeoPage/PageSeo";
import ProjectDetails from "../Projects/ProjectDetails";
import heroImage from "../../assets/1 (5).png";

import {
  UserRound,
  ScrollText,
  Compass,
  Hammer,
  Sparkles,
  Factory,
  Users,
  ClipboardList,
  Truck,
  Award,
} from "lucide-react";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/project";

// =====================================================
// CREATE PROJECT SLUG
// =====================================================

const createProjectSlug = (name) => {
  return String(name || "project")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// =====================================================
// PROJECT JOURNEY
// =====================================================

const journeySteps = [
  {
    no: "01",
    title: "CONSULTATION",
    desc: "Understanding your vision and requirements.",
    icon: UserRound,
  },
  {
    no: "02",
    title: "CONCEPT DESIGN",
    desc: "Creating ideas that bring your vision to life.",
    icon: ScrollText,
  },
  {
    no: "03",
    title: "DETAILED PLANNING",
    desc: "Precision planning and material selection.",
    icon: Compass,
  },
  {
    no: "04",
    title: "CRAFTING",
    desc: "Meticulous craftsmanship by our expert artisans.",
    icon: Hammer,
  },
  {
    no: "05",
    title: "COMPLETION",
    desc: "Delivering timeless spaces that exceed expectations.",
    icon: Sparkles,
  },
];

// =====================================================
// PROJECT STATS
// =====================================================

const journeyStats = [
  {
    icon: Factory,
    value: "20,000+",
    label: "SQ. FT. FACTORY",
  },
  {
    icon: Users,
    value: "1000+",
    label: "SKILLED ARTISANS",
  },
  {
    icon: ClipboardList,
    value: "150+",
    label: "ONGOING PROJECTS",
  },
  {
    icon: Truck,
    value: "PAN INDIA",
    label: "DELIVERY & INSTALLATION",
  },
  {
    icon: Award,
    value: "15+",
    label: "YEARS OF EXCELLENCE",
  },
];

// =====================================================
// PROJECT PAGE
// =====================================================

const ProjectPage = () => {
  const location = useLocation();
  const { projectName } = useParams();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // SELECTED PROJECT
  // =====================================================

  const [selectedProject, setSelectedProject] = useState(
    location.state?.selectedProject || null
  );

  // =====================================================
  // LOAD PROJECTS
  // =====================================================

  useEffect(() => {
    loadProjects();
  }, [projectName]);

  const loadProjects = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load projects");
      }

      const data = await response.json();

      const projectList = Array.isArray(data) ? data : [];

      setProjects(projectList);

      // =====================================================
      // PROJECT URL
      // Example:
      // /project/kings-palace
      // =====================================================

      if (projectName) {
        const foundProject = projectList.find((project) => {
          const slug = createProjectSlug(project.projectName);

          return slug === projectName;
        });

        setSelectedProject(foundProject || null);

        return;
      }

      // =====================================================
      // NORMAL PROJECT PAGE
      // /project
      // =====================================================

      setSelectedProject(null);
    } catch (error) {
      console.error("Error loading projects:", error);

      setProjects([]);
      setSelectedProject(null);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // OPEN EXACT PROJECT
  // =====================================================

  const openProject = (project) => {
    const projectSlug = createProjectSlug(
      project.projectName
    );

    navigate(`/project/${projectSlug}`, {
      state: {
        selectedProject: project,
      },
    });
  };

  // =====================================================
  // BACK TO PROJECT LIST
  // =====================================================

  const closeProject = () => {
    navigate("/project");
  };

  // =====================================================
  // PROJECT LOADING
  // =====================================================

  if (loading && projectName) {
    return (
      <div
        style={{
          minHeight: "60vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          fontWeight: "600",
        }}
      >
        Loading Project...
      </div>
    );
  }

  // =====================================================
  // PROJECT NOT FOUND
  // =====================================================

  if (
    projectName &&
    !selectedProject &&
    !loading
  ) {
    return (
      <div
        style={{
          minHeight: "60vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          padding: "40px 20px",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            margin: "0 0 10px",
            fontSize: "30px",
            color: "#222",
          }}
        >
          Project Not Found
        </h2>

        <p
          style={{
            margin: "0 0 25px",
            color: "#666",
            fontSize: "16px",
          }}
        >
          The project you are looking for could not be found.
        </p>

        <button
          type="button"
          onClick={() => navigate("/project")}
          style={{
            border: "none",
            padding: "12px 25px",
            borderRadius: "6px",
            background: "#c9a15a",
            color: "#fff",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "600",
          }}
        >
          Back to Projects
        </button>
      </div>
    );
  }

  // =====================================================
  // SHOW PROJECT DETAILS
  // =====================================================

  if (selectedProject) {
    return (
      <ProjectDetails
        project={selectedProject}
        onBack={closeProject}
      />
    );
  }

  // =====================================================
  // NORMAL PROJECT PAGE
  // =====================================================

  return (
    <>
      <PageSeo page="Project" />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="rk-hero-page">
        <div className="rk-hero-page-bg">
          <img
            src={heroImage}
            alt="Royal Craft Project"
            className="rk-hero-page-img"
          />

          <div className="rk-hero-page-gradient"></div>
        </div>

        <div className="rk-hero-page-content">
          <div className="rk-hero-page-inner">
            <span className="rk-hero-page-tag">
              CRAFTED TO PERFECTION
            </span>
          </div>
        </div>

        <div className="rk-hero-page-social">

          <a
            href="#"
            className="rk-hero-page-icon"
            aria-label="Mobile"
          >
            📱
          </a>

          <a
            href="#"
            className="rk-hero-page-icon"
            aria-label="Phone"
          >
            📞
          </a>

          <a
            href="#"
            className="rk-hero-page-icon"
            aria-label="Email"
          >
            ✉️
          </a>

        </div>
      </section>

      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="rk-project-intro">
        <div className="rk-project-intro-inner">

          <div className="rk-project-intro-left">

            <span className="rk-project-intro-tag">
              BUILT ON TRUST. INSPIRED BY VISION.
            </span>

            <h2 className="rk-project-intro-title">
              SPACES THAT INSPIRE
            </h2>

            <div className="rk-project-intro-line"></div>

          </div>

          <div className="rk-project-intro-right">

            <p>
              From palatial residences to luxury commercial spaces,
              each project reflects our commitment to excellence,
              innovation, and timeless design.
            </p>

          </div>

        </div>
      </section>

      {/* =====================================================
          PROJECT GRID
      ===================================================== */}

      <section className="rk-project-grid-section">

        {loading ? (

          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              fontSize: "22px",
              fontWeight: "600",
            }}
          >
            Loading Projects...
          </div>

        ) : projects.length === 0 ? (

          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
            }}
          >
            <h2>
              No Projects Found
            </h2>

            <p>
              Projects uploaded from the Admin Dashboard
              will appear here.
            </p>
          </div>

        ) : (

          <div className="rk-project-grid">

            {projects.map((project) => (

              <div
                className="rk-project-grid-card"
                key={project.id}
                onClick={() => openProject(project)}
                style={{
                  cursor: "pointer",
                }}
              >

                {/* PROJECT IMAGE */}

                <div className="rk-project-grid-image">

                  <img
                    src={project.mainImage}
                    alt={
                      project.projectName ||
                      "Project"
                    }
                  />

                </div>

                {/* PROJECT NAME */}

                <div className="rk-project-grid-name">

                  <h3>
                    {project.projectName}
                  </h3>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="rk-project-cta">

        <div className="rk-project-cta-bg">

          <img
            src="https://picsum.photos/1600/400?random=70"
            alt="Craftsmanship"
            className="rk-project-cta-img"
          />

          <div className="rk-project-cta-gradient"></div>

        </div>

        <div className="rk-project-cta-content">

          <div className="rk-project-cta-container">

            <div className="rk-project-cta-inner">

              <span className="rk-project-cta-tag">
                HAVE A PROJECT IN MIND?
              </span>

              <h2 className="rk-project-cta-title">
                LET'S CRAFT SOMETHING
                <br />
                EXTRAORDINARY TOGETHER.
              </h2>

              <button
                type="button"
                className="rk-project-cta-btn"
              >
                DISCUSS YOUR PROJECT
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          PROJECT JOURNEY
      ===================================================== */}

      <section className="rk-journey-section">

        {/* JOURNEY HEADER */}

        <div className="rk-journey-header">

          <div>

            <span className="rk-journey-tag">
              OUR PROJECT JOURNEY
            </span>

            <h2 className="rk-journey-title">
              FROM CONCEPT TO CREATION
            </h2>

            <div className="rk-journey-line"></div>

          </div>

          <p className="rk-journey-desc">
            Every project we undertake follows a thoughtful
            process that ensures precision, transparency,
            and perfection at every stage.
          </p>

        </div>

        {/* =====================================================
            JOURNEY STEPS
        ===================================================== */}

        <div className="rk-journey-steps">

          {journeySteps.map((step, index) => {

            const Icon = step.icon;

            return (
              <React.Fragment key={step.no}>

                <div className="rk-journey-step">

                  <Icon
                    className="rk-journey-step-icon"
                    size={30}
                    strokeWidth={1.5}
                  />

                  <div className="rk-journey-step-text">

                    <div className="rk-journey-step-no">
                      {step.no}
                    </div>

                    <h4>
                      {step.title}
                    </h4>

                    <p>
                      {step.desc}
                    </p>

                  </div>

                </div>

                {index <
                  journeySteps.length - 1 && (
                  <span className="rk-journey-arrow">
                    →
                  </span>
                )}

              </React.Fragment>
            );

          })}

        </div>

        {/* =====================================================
            STATS
        ===================================================== */}

        <div className="rk-journey-stats">

          {journeyStats.map((item, index) => {

            const Icon = item.icon;

            return (
              <React.Fragment key={index}>

                <div className="rk-journey-stat">

                  <Icon
                    className="rk-journey-stat-icon"
                    size={28}
                    strokeWidth={1.5}
                  />

                  <div>

                    <strong>
                      {item.value}
                    </strong>

                    <span>
                      {item.label}
                    </span>

                  </div>

                </div>

                {index <
                  journeyStats.length - 1 && (
                  <div className="rk-journey-stat-divider"></div>
                )}

              </React.Fragment>
            );

          })}

        </div>

      </section>
    </>
  );
};

export default ProjectPage;