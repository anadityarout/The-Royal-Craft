import React, { useState, useEffect, useRef } from "react";
import "./ProjectAdmin.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/project";

const ProjectAdmin = () => {
  /* =========================================================
     FORM
  ========================================================= */

  const [showForm, setShowForm] = useState(false);

  /* =========================================================
     IMAGE TYPE
     Banner / Project
  ========================================================= */

  const [category, setCategory] = useState("");

  /* =========================================================
     PROJECT DETAILS
  ========================================================= */

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [projectDate, setProjectDate] = useState("");
  const [location, setLocation] = useState("");

  /* =========================================================
     MAIN PROJECT IMAGE
  ========================================================= */

  const [mainImage, setMainImage] = useState(null);
  const [mainPreview, setMainPreview] = useState("");

  /* =========================================================
     BANNER
  ========================================================= */

  const [bannerImage, setBannerImage] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [bannerName, setBannerName] = useState("");
  const [bannerDescription, setBannerDescription] = useState("");

  /* =========================================================
     PROJECT GALLERY IMAGES
  ========================================================= */

  const [galleryImages, setGalleryImages] = useState([]);

  /* =========================================================
     SAVED ITEMS
  ========================================================= */

  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [editId, setEditId] = useState(null);

  /* =========================================================
     FILE REFERENCES
  ========================================================= */

  const mainFileRef = useRef(null);
  const bannerFileRef = useRef(null);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const PROJECTS_PER_PAGE = 5;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(
    projects.length / PROJECTS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * PROJECTS_PER_PAGE;

  const currentProjects = projects.slice(
    startIndex,
    startIndex + PROJECTS_PER_PAGE
  );

  /* =========================================================
     LOAD PROJECTS / BANNERS
  ========================================================= */

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load items.");
      }

      const data = await response.json();

      setProjects(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error("Load error:", err);
      setProjects([]);
    }
  };

  /* =========================================================
     KEEP PAGE VALID
  ========================================================= */

  useEffect(() => {
    const pages = Math.max(
      1,
      Math.ceil(
        projects.length / PROJECTS_PER_PAGE
      )
    );

    setCurrentPage((page) =>
      Math.min(page, pages)
    );
  }, [projects.length]);

  /* =========================================================
     ADD IMAGE BUTTON
     
     IMPORTANT:
     When clicking + Add Image,
     category stays empty.
     User must choose Banner or Project.
  ========================================================= */

  const handleAddImage = () => {
    setShowForm(true);

    setCategory("");

    setProjectName("");
    setDescription("");
    setProjectDate("");
    setLocation("");

    setMainImage(null);
    setMainPreview("");

    setBannerImage(null);
    setBannerPreview("");
    setBannerName("");
    setBannerDescription("");

    setGalleryImages([]);

    setIsEditing(false);
    setEditId(null);

    if (mainFileRef.current) {
      mainFileRef.current.value = "";
    }

    if (bannerFileRef.current) {
      bannerFileRef.current.value = "";
    }
  };

  /* =========================================================
     CATEGORY CHANGE
  ========================================================= */

  const handleCategoryChange = (e) => {
    const value = e.target.value;

    setCategory(value);

    /*
      Clear the other form when changing type.
      This prevents Banner data from mixing with Project data.
    */

    if (value === "Banner") {
      setProjectName("");
      setDescription("");
      setProjectDate("");
      setLocation("");

      setMainImage(null);
      setMainPreview("");

      setGalleryImages([]);

      if (mainFileRef.current) {
        mainFileRef.current.value = "";
      }
    }

    if (value === "Project") {
      setBannerImage(null);
      setBannerPreview("");
      setBannerName("");
      setBannerDescription("");

      if (bannerFileRef.current) {
        bannerFileRef.current.value = "";
      }
    }
  };

  /* =========================================================
     UPLOAD IMAGE TO S3
  ========================================================= */

  const uploadImage = async (file) => {
    if (!file) {
      throw new Error("Please select an image.");
    }

    const response = await fetch(
      `${API_URL}?upload=true&fileName=${encodeURIComponent(
        file.name
      )}&fileType=${encodeURIComponent(file.type)}`
    );

    if (!response.ok) {
      throw new Error(
        "Unable to get upload URL."
      );
    }

    const uploadData =
      await response.json();

    const uploadResponse =
      await fetch(
        uploadData.uploadUrl,
        {
          method: "PUT",

          headers: {
            "Content-Type": file.type,
          },

          body: file,
        }
      );

    if (!uploadResponse.ok) {
      throw new Error(
        "Image upload failed."
      );
    }

    return uploadData.fileUrl;
  };

  /* =========================================================
     MAIN PROJECT IMAGE
  ========================================================= */

  const handleMainImage = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    setMainImage(file);

    setMainPreview(
      URL.createObjectURL(file)
    );
  };

  /* =========================================================
     BANNER IMAGE
  ========================================================= */

  const handleBannerImage = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    setBannerImage(file);

    setBannerPreview(
      URL.createObjectURL(file)
    );
  };

  /* =========================================================
     ADD PROJECT GALLERY IMAGE
  ========================================================= */

  const addProjectImage = () => {
    setGalleryImages((previous) => [
      ...previous,
      {
        file: null,
        preview: "",
      },
    ]);
  };

  /* =========================================================
     CHANGE PROJECT GALLERY IMAGE
  ========================================================= */

  const handleGalleryImage = (
    index,
    e
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    const updated = [
      ...galleryImages,
    ];

    updated[index] = {
      file,
      preview:
        URL.createObjectURL(file),
    };

    setGalleryImages(updated);
  };

  /* =========================================================
     REMOVE PROJECT GALLERY IMAGE
  ========================================================= */

  const removeGalleryImage = (
    index
  ) => {
    setGalleryImages(
      (previous) =>
        previous.filter(
          (_, i) => i !== index
        )
    );
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSave = async () => {
    /* =======================================================
       CATEGORY REQUIRED
    ======================================================= */

    if (!category) {
      alert(
        "Please select Banner or Project."
      );
      return;
    }

    /* =======================================================
       BANNER VALIDATION
    ======================================================= */

    if (category === "Banner") {
      if (
        !bannerImage &&
        !bannerPreview
      ) {
        alert(
          "Please select Banner Image."
        );
        return;
      }

      if (!bannerName.trim()) {
        alert(
          "Please enter Banner Name."
        );
        return;
      }
    }

    /* =======================================================
       PROJECT VALIDATION
    ======================================================= */

    if (category === "Project") {
      if (!projectName.trim()) {
        alert(
          "Please enter Project Name."
        );
        return;
      }

      if (
        !isEditing &&
        !mainImage
      ) {
        alert(
          "Please select Main Image."
        );
        return;
      }
    }

    try {
      setLoading(true);

      /* =====================================================
         BANNER SAVE
      ===================================================== */

      if (category === "Banner") {
        let bannerImageUrl =
          bannerPreview;

        if (bannerImage) {
          bannerImageUrl =
            await uploadImage(
              bannerImage
            );
        }

        const response =
          await fetch(
            API_URL,
            {
              method: isEditing
                ? "PUT"
                : "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                id: editId,

                type: "Banner",

                bannerImage:
                  bannerImageUrl,

                bannerName:
                  bannerName.trim(),

                bannerDescription:
                  bannerDescription.trim(),
              }),
            }
          );

        const result =
          await response
            .json()
            .catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            result.message ||
              result.error ||
              "Unable to save banner."
          );
        }

        await loadProjects();

        if (!isEditing) {
          setCurrentPage(1);
        }

        const wasEditing =
          isEditing;

        resetForm();

        alert(
          wasEditing
            ? "Banner updated successfully."
            : "Banner saved successfully."
        );

        return;
      }

      /* =====================================================
         PROJECT MAIN IMAGE
      ===================================================== */

      let mainImageUrl =
        mainPreview;

      if (mainImage) {
        mainImageUrl =
          await uploadImage(
            mainImage
          );
      }

      /* =====================================================
         PROJECT GALLERY
      ===================================================== */

      const galleryUrls = [];

      for (
        const image of galleryImages
      ) {
        if (image.file) {
          const url =
            await uploadImage(
              image.file
            );

          galleryUrls.push(url);
        } else if (
          image.preview
        ) {
          galleryUrls.push(
            image.preview
          );
        }
      }

      /* =====================================================
         PROJECT API
      ===================================================== */

      const response =
        await fetch(
          API_URL,
          {
            method: isEditing
              ? "PUT"
              : "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id: editId,

              type: "Project",

              projectName:
                projectName.trim(),

              description:
                description.trim(),

              projectDate,

              location,

              mainImage:
                mainImageUrl,

              galleryImages:
                galleryUrls,
            }),
          }
        );

      const result =
        await response
          .json()
          .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.error ||
            "Unable to save project."
        );
      }

      await loadProjects();

      if (!isEditing) {
        setCurrentPage(1);
      }

      const wasEditing =
        isEditing;

      resetForm();

      alert(
        wasEditing
          ? "Project updated successfully."
          : "Project saved successfully."
      );
    } catch (err) {
      console.error(
        "Save error:",
        err
      );

      alert(
        err.message ||
          "Unable to save."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const deleteProject = async (
    id
  ) => {
    if (
      !window.confirm(
        "Delete this item?"
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          API_URL,
          {
            method: "DELETE",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id,
            }),
          }
        );

      const result =
        await response
          .json()
          .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.error ||
            "Unable to delete item."
        );
      }

      await loadProjects();

      alert(
        "Item deleted successfully."
      );
    } catch (err) {
      console.error(err);

      alert(
        err.message ||
          "Unable to delete item."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     RESET FORM
  ========================================================= */

  const resetForm = () => {
    setShowForm(false);

    setCategory("");

    setProjectName("");
    setDescription("");
    setProjectDate("");
    setLocation("");

    setMainImage(null);
    setMainPreview("");

    setBannerImage(null);
    setBannerPreview("");
    setBannerName("");
    setBannerDescription("");

    setGalleryImages([]);

    setIsEditing(false);
    setEditId(null);

    if (mainFileRef.current) {
      mainFileRef.current.value = "";
    }

    if (bannerFileRef.current) {
      bannerFileRef.current.value = "";
    }
  };

  /* =========================================================
     EDIT
  ========================================================= */

  const editProject = (
    project
  ) => {
    setShowForm(true);

    setIsEditing(true);

    setEditId(project.id);

    /* =====================================================
       BANNER
    ===================================================== */

    if (
      project.type === "Banner" ||
      project.bannerImage ||
      project.bannerName ||
      project.bannerDescription
    ) {
      setCategory("Banner");

      setBannerImage(null);

      setBannerPreview(
        project.bannerImage || ""
      );

      setBannerName(
        project.bannerName || ""
      );

      setBannerDescription(
        project.bannerDescription || ""
      );

      setProjectName("");
      setDescription("");
      setProjectDate("");
      setLocation("");

      setMainImage(null);
      setMainPreview("");

      setGalleryImages([]);

      return;
    }

    /* =====================================================
       PROJECT
    ===================================================== */

    setCategory("Project");

    setProjectName(
      project.projectName || ""
    );

    setDescription(
      project.description || ""
    );

    setProjectDate(
      project.projectDate || ""
    );

    setLocation(
      project.location || ""
    );

    setMainImage(null);

    setMainPreview(
      project.mainImage || ""
    );

    setGalleryImages(
      (
        project.galleryImages ||
        []
      ).map((image) => ({
        file: null,
        preview: image,
      }))
    );

    setBannerImage(null);
    setBannerPreview("");
    setBannerName("");
    setBannerDescription("");
  };

  /* =========================================================
     PAGE CHANGE
  ========================================================= */

  const goToPage = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <div className="project-admin">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="table-header">

        <h1>
          Project Admin
        </h1>

        <button
          type="button"
          className="add-btn"
          onClick={
            handleAddImage
          }
          disabled={loading}
        >
          + Add Image
        </button>

      </div>


      {/* =====================================================
          FORM
      ===================================================== */}

      {showForm && (

        <div className="section">

          {/* =================================================
              CATEGORY DROPDOWN
          ================================================= */}

          <div className="category-selector">

            <label>
              Select Image Type
            </label>

            <select
              value={category}
              onChange={
                handleCategoryChange
              }
              disabled={loading}
            >

              <option value="">
                Select Type
              </option>

              <option value="Banner">
                Banner
              </option>

              <option value="Project">
                Project
              </option>

            </select>

          </div>


          {/* =================================================
              BANNER FORM
          ================================================= */}

          {category === "Banner" && (

            <div className="banner-form">

              <h3>
                Banner
              </h3>


              {/* Banner Image */}

              <div className="form-group">

                <label>
                  Banner Image
                </label>

                <input
                  ref={
                    bannerFileRef
                  }
                  type="file"
                  accept="image/*"
                  onChange={
                    handleBannerImage
                  }
                />

                {bannerPreview && (

                  <img
                    src={
                      bannerPreview
                    }
                    alt="Banner Preview"
                    className="preview-image"
                  />

                )}

              </div>


              {/* Banner Name */}

              <div className="form-group">

                <label>
                  Banner Name
                </label>

                <input
                  type="text"
                  placeholder="Enter Banner Name"
                  value={
                    bannerName
                  }
                  onChange={(e) =>
                    setBannerName(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* Banner Description */}

              <div className="form-group">

                <label>
                  Banner Description
                </label>

                <textarea
                  rows="5"
                  placeholder="Enter Banner Description"
                  value={
                    bannerDescription
                  }
                  onChange={(e) =>
                    setBannerDescription(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* Banner Save / Cancel */}

              <div className="save-section">

                <button
                  type="button"
                  className="save-btn"
                  onClick={
                    handleSave
                  }
                  disabled={loading}
                >

                  {loading
                    ? "Saving..."
                    : isEditing
                    ? "Update Banner"
                    : "Save Banner"}

                </button>


                <button
                  type="button"
                  className="cancel-btn"
                  onClick={
                    resetForm
                  }
                  disabled={loading}
                >
                  Cancel
                </button>

              </div>

            </div>

          )}


          {/* =================================================
              PROJECT FORM
          ================================================= */}

          {category === "Project" && (

            <div className="project-form">

              {/* Main Image */}

              <div className="form-group">

                <label>
                  Main Image
                </label>

                <input
                  ref={
                    mainFileRef
                  }
                  type="file"
                  accept="image/*"
                  onChange={
                    handleMainImage
                  }
                />

                {mainPreview && (

                  <img
                    src={
                      mainPreview
                    }
                    alt="Main Preview"
                    className="preview-image"
                  />

                )}

              </div>


              {/* Project Gallery */}

              <div className="gallery-header">

                <h3>
                  Project Images
                </h3>

                <button
                  type="button"
                  className="add-btn"
                  onClick={
                    addProjectImage
                  }
                  disabled={loading}
                >
                  + Add Project Image
                </button>

              </div>


              {galleryImages.map(
                (
                  image,
                  index
                ) => (

                  <div
                    className="gallery-card"
                    key={index}
                  >

                    <h4>
                      Project Image{" "}
                      {index + 1}
                    </h4>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleGalleryImage(
                          index,
                          e
                        )
                      }
                    />

                    {image.preview && (

                      <img
                        src={
                          image.preview
                        }
                        alt={`Project ${
                          index + 1
                        }`}
                        className="preview-image"
                      />

                    )}

                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() =>
                        removeGalleryImage(
                          index
                        )
                      }
                    >
                      Remove
                    </button>

                  </div>

                )
              )}


              {/* Project Details */}

              <h3>
                {isEditing
                  ? "Edit Project"
                  : "Project Details"}
              </h3>


              {/* Project Name */}

              <div className="form-group">

                <label>
                  Project Name
                </label>

                <input
                  type="text"
                  placeholder="Enter Project Name"
                  value={
                    projectName
                  }
                  onChange={(e) =>
                    setProjectName(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* Description */}

              <div className="form-group">

                <label>
                  Description
                </label>

                <textarea
                  rows="5"
                  placeholder="Enter Description"
                  value={
                    description
                  }
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* Date + Location */}

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Date
                  </label>

                  <input
                    type="date"
                    value={
                      projectDate
                    }
                    onChange={(e) =>
                      setProjectDate(
                        e.target.value
                      )
                    }
                  />

                </div>


                <div className="form-group">

                  <label>
                    Location
                  </label>

                  <input
                    type="text"
                    placeholder="Enter Location"
                    value={
                      location
                    }
                    onChange={(e) =>
                      setLocation(
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>


              {/* Project Save / Cancel */}

              <div className="save-section">

                <button
                  type="button"
                  className="save-btn"
                  onClick={
                    handleSave
                  }
                  disabled={loading}
                >

                  {loading
                    ? "Saving..."
                    : isEditing
                    ? "Update Project"
                    : "Save Project"}

                </button>


                <button
                  type="button"
                  className="cancel-btn"
                  onClick={
                    resetForm
                  }
                  disabled={loading}
                >
                  Cancel
                </button>

              </div>

            </div>

          )}

        </div>

      )}


      {/* =====================================================
          SAVED ITEMS
      ===================================================== */}

      <div className="section">

        <div className="table-header">

          <h3>
            Saved Projects
          </h3>

        </div>


        <div className="project-table-wrapper">

          <table className="project-table">

            <thead>

              <tr>

                <th>
                  No
                </th>

                <th>
                  Preview
                </th>

                <th>
                  Type
                </th>

                <th>
                  Name
                </th>

                <th>
                  Description
                </th>

                <th>
                  Date
                </th>

                <th>
                  Location
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {projects.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="no-projects"
                  >
                    No Projects Found
                  </td>

                </tr>

              ) : (

                currentProjects.map(
                  (
                    project,
                    index
                  ) => (

                    <tr
                      key={
                        project.id
                      }
                    >

                      {/* No */}

                      <td>
                        {startIndex +
                          index +
                          1}
                      </td>


                      {/* Preview */}

                      <td>

                        <img
                          src={
                            project.type ===
                            "Banner"
                              ? project.bannerImage
                              : project.mainImage
                          }
                          alt={
                            project.type ===
                            "Banner"
                              ? project.bannerName ||
                                "Banner"
                              : project.projectName ||
                                "Project"
                          }
                          className="table-image"
                        />

                      </td>


                      {/* Type */}

                      <td>

                        {project.type ||
                          "Project"}

                      </td>


                      {/* Name */}

                      <td>

                        {project.type ===
                        "Banner"
                          ? project.bannerName ||
                            "-"
                          : project.projectName ||
                            "-"}

                      </td>


                      {/* Description */}

                      <td className="desc-cell">

                        {project.type ===
                        "Banner"
                          ? project.bannerDescription ||
                            "-"
                          : project.description ||
                            "-"}

                      </td>


                      {/* Date */}

                      <td>

                        {project.type ===
                        "Banner"
                          ? "-"
                          : project.projectDate ||
                            "-"}

                      </td>


                      {/* Location */}

                      <td>

                        {project.type ===
                        "Banner"
                          ? "-"
                          : project.location ||
                            "-"}

                      </td>


                      {/* Actions */}

                      <td>

                        <div className="project-actions">

                          <button
                            type="button"
                            className="edit-btn"
                            onClick={() =>
                              editProject(
                                project
                              )
                            }
                            disabled={loading}
                          >
                            Edit
                          </button>


                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() =>
                              deleteProject(
                                project.id
                              )
                            }
                            disabled={loading}
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>


        {/* =================================================
            PAGINATION
        ================================================= */}

        {projects.length >
          PROJECTS_PER_PAGE && (

          <div className="pagination">

            <button
              type="button"
              className="page-btn prev-next"
              onClick={() =>
                goToPage(
                  currentPage - 1
                )
              }
              disabled={
                currentPage === 1
              }
            >
              ‹
            </button>


            <div className="page-numbers">

              {Array.from(
                {
                  length:
                    totalPages,
                },
                (_, index) =>
                  index + 1
              ).map(
                (page) => (

                  <button
                    type="button"
                    key={page}
                    className={`page-btn ${
                      currentPage ===
                      page
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      goToPage(
                        page
                      )
                    }
                  >
                    {page}
                  </button>

                )
              )}

            </div>


            <button
              type="button"
              className="page-btn prev-next"
              onClick={() =>
                goToPage(
                  currentPage + 1
                )
              }
              disabled={
                currentPage ===
                totalPages
              }
            >
              ›
            </button>

          </div>

        )}

      </div>

    </div>
  );
};

export default ProjectAdmin;