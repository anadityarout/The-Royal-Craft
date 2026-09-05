import React, { useState, useEffect } from "react";
import "./ProjectDetails.css";

const ProjectDetails = ({ project, onBack }) => {
  // =====================================================
  // PROJECT IMAGES
  // =====================================================

  const images = project
    ? [
        project.mainImage,
        ...(Array.isArray(project.galleryImages)
          ? project.galleryImages
          : []),
      ].filter(Boolean)
    : [];

  // =====================================================
  // CURRENT IMAGE
  // =====================================================

  const [currentImage, setCurrentImage] = useState(0);

  // =====================================================
  // RESET IMAGE WHEN PROJECT CHANGES
  // =====================================================

  useEffect(() => {
    setCurrentImage(0);
  }, [project?.id]);

  // =====================================================
  // AUTO SLIDER
  // =====================================================

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentImage((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length, project?.id]);

  // =====================================================
  // NEXT IMAGE
  // =====================================================

  const nextImage = () => {
    if (images.length <= 1) return;

    setCurrentImage((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  // =====================================================
  // PREVIOUS IMAGE
  // =====================================================

  const prevImage = () => {
    if (images.length <= 1) return;

    setCurrentImage((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  // =====================================================
  // KEYBOARD CONTROLS
  // =====================================================

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        nextImage();
      }

      if (event.key === "ArrowLeft") {
        prevImage();
      }

      if (event.key === "Escape" && onBack) {
        onBack();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [images.length]);

  // =====================================================
  // NO PROJECT
  // =====================================================

  if (!project) {
    return null;
  }

  return (
    <div className="project-details">

      {/* =====================================================
          BACK BUTTON
      ===================================================== */}

      <button
        type="button"
        className="project-back-btn"
        onClick={onBack}
      >
        ← Back to Projects
      </button>

      {/* =====================================================
          PROJECT IMAGE SECTION
      ===================================================== */}

      <div className="project-details-hero">

        {/* LEFT ARROW */}

        {images.length > 1 && (
          <button
            type="button"
            className="slider-arrow left-arrow"
            onClick={prevImage}
            aria-label="Previous image"
          >
            ❮
          </button>
        )}

        {/* MAIN IMAGE */}

        {images.length > 0 ? (
          <img
            key={images[currentImage]}
            src={images[currentImage]}
            alt={`${project.projectName || "Project"} - Image ${
              currentImage + 1
            }`}
            className="project-details-image"
          />
        ) : (
          <div className="project-image-placeholder">
            <span>No project image available</span>
          </div>
        )}

        {/* RIGHT ARROW */}

        {images.length > 1 && (
          <button
            type="button"
            className="slider-arrow right-arrow"
            onClick={nextImage}
            aria-label="Next image"
          >
            ❯
          </button>
        )}

        {/* =====================================================
            IMAGE COUNTER
        ===================================================== */}

        {images.length > 1 && (
          <div className="project-image-counter">
            {currentImage + 1} / {images.length}
          </div>
        )}
      </div>

      {/* =====================================================
          THUMBNAIL GALLERY
      ===================================================== */}

      {images.length > 1 && (
        <div className="project-thumbnail-gallery">

          {images.map((image, index) => (
            <button
              type="button"
              key={`${image}-${index}`}
              className={`project-thumbnail ${
                currentImage === index
                  ? "active-thumbnail"
                  : ""
              }`}
              onClick={() => setCurrentImage(index)}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image}
                alt={`${project.projectName || "Project"} thumbnail ${
                  index + 1
                }`}
              />
            </button>
          ))}

        </div>
      )}

      {/* =====================================================
          PROJECT INFORMATION
      ===================================================== */}

      <div className="project-details-content">

        {/* PROJECT TITLE */}

        <h1 className="project-title">
          {project.projectName || "Project"}
        </h1>

        {/* PROJECT DESCRIPTION */}

        <p className="project-description">
          {project.description ||
            "No description available."}
        </p>

        {/* =====================================================
            PROJECT INFO
        ===================================================== */}

        <div className="project-info">

          {/* LOCATION */}

          <div className="project-info-item">
            <h4>Location</h4>

            <p>
              {project.location || "Not available"}
            </p>
          </div>

          {/* DATE */}

          <div className="project-info-item">
            <h4>Date</h4>

            <p>
              {project.projectDate || "Not available"}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ProjectDetails;