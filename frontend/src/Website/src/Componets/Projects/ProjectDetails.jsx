import React, { useState, useEffect } from "react";
import "./ProjectDetails.css";

const ProjectDetails = ({ project, onBack }) => {
  if (!project) return null;

  // Use gallery images if available, otherwise use main image
  const images = [
  project.mainImage,
  ...(project.galleryImages || [])
].filter(Boolean);

  const [currentImage, setCurrentImage] = useState(0);

  // Next Image
  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  // Previous Image
  const prevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  // Auto Slide Every 5 Seconds
  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentImage((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="project-details">

      <button
        className="project-back-btn"
        onClick={onBack}
      >
        ← Back to Projects
      </button>

      <div className="project-details-hero">

        {images.length > 1 && (
          <button
            className="slider-arrow left-arrow"
            onClick={prevImage}
          >
            ❮
          </button>
        )}

        <img
          src={images[currentImage]}
          alt={project.projectName}
          className="project-details-image"
        />

        {images.length > 1 && (
          <button
            className="slider-arrow right-arrow"
            onClick={nextImage}
          >
            ❯
          </button>
        )}

      </div>

      <div className="project-details-content">

        <h1 className="project-title">
          {project.projectName}
        </h1>

        <p className="project-description">
          {project.description || "No description available."}
        </p>

        <div className="project-info">

          <div>
            <h4>Location</h4>
            <p>{project.location}</p>
          </div>

          <div>
            <h4>Date</h4>
            <p>{project.projectDate}</p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ProjectDetails;