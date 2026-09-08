import React, { useState, useEffect } from "react";
import "./ProjectAdmin.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/project";

const ProjectAdmin = () => {

  /* =========================================================
     FORM STATES
  ========================================================= */

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [projectDate, setProjectDate] = useState("");
  const [location, setLocation] = useState("");


  /* =========================================================
     MAIN IMAGE
  ========================================================= */

  const [mainImage, setMainImage] = useState(null);
  const [mainPreview, setMainPreview] = useState("");


  /* =========================================================
     GALLERY IMAGES
  ========================================================= */

  const [galleryImages, setGalleryImages] = useState([]);


  /* =========================================================
     PROJECT LIST
  ========================================================= */

  const [projects, setProjects] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [editId, setEditId] = useState(null);


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
     LOAD PROJECTS
  ========================================================= */

  useEffect(() => {
    loadProjects();
  }, []);


  const loadProjects = async () => {

    try {

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          "Unable to load projects."
        );
      }

      const data = await response.json();

      setProjects(
        Array.isArray(data) ? data : []
      );

    } catch (err) {

      console.log(err);

      setProjects([]);

    }

  };


  /* =========================================================
     KEEP CURRENT PAGE VALID
  ========================================================= */

  useEffect(() => {

    const pages = Math.max(
      1,
      Math.ceil(
        projects.length /
          PROJECTS_PER_PAGE
      )
    );

    setCurrentPage((page) =>
      Math.min(page, pages)
    );

  }, [projects.length]);


  /* =========================================================
     UPLOAD IMAGE TO S3
  ========================================================= */

  const uploadImage = async (file) => {

    const response = await fetch(
      `${API_URL}?upload=true&fileName=${encodeURIComponent(
        file.name
      )}&fileType=${encodeURIComponent(
        file.type
      )}`
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
     MAIN IMAGE
  ========================================================= */

  const handleMainImage = (e) => {

    const file =
      e.target.files[0];

    if (!file) return;

    setMainImage(file);

    setMainPreview(
      URL.createObjectURL(file)
    );

  };


  /* =========================================================
     ADD GALLERY IMAGE
  ========================================================= */

  const addGalleryImage = () => {

    setGalleryImages([
      ...galleryImages,
      {
        file: null,
        preview: "",
      },
    ]);

  };


  /* =========================================================
     CHANGE GALLERY IMAGE
  ========================================================= */

  const handleGalleryImage = (
    index,
    e
  ) => {

    const file =
      e.target.files[0];

    if (!file) return;

    const updated =
      [...galleryImages];

    updated[index] = {
      file,
      preview:
        URL.createObjectURL(file),
    };

    setGalleryImages(updated);

  };


  /* =========================================================
     REMOVE GALLERY IMAGE
  ========================================================= */

  const removeGalleryImage = (
    index
  ) => {

    setGalleryImages(
      galleryImages.filter(
        (_, i) => i !== index
      )
    );

  };


  /* =========================================================
     SAVE PROJECT
  ========================================================= */

  const handleSave = async () => {

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


    try {

      setLoading(true);


      /* =====================================
         MAIN IMAGE
      ===================================== */

      let mainImageUrl =
        mainPreview;

      if (mainImage) {

        mainImageUrl =
          await uploadImage(
            mainImage
          );

      }


      /* =====================================
         GALLERY IMAGES
      ===================================== */

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

        } else {

          if (image.preview) {

            galleryUrls.push(
              image.preview
            );

          }

        }

      }


      /* =====================================
         API REQUEST
      ===================================== */

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

              projectName,

              description,

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
        await response.json().catch(
          () => ({})
        );


      if (!response.ok) {

        throw new Error(
          result.message ||
            "Unable to save project."
        );

      }


      await loadProjects();


      /* =====================================
         AFTER ADD / UPDATE
      ===================================== */

      if (!isEditing) {

        setCurrentPage(1);

      }


      resetForm();


      alert(
        isEditing
          ? "Project updated successfully."
          : "Project saved successfully."
      );


    } catch (err) {

      console.error(err);

      alert(err.message);

    } finally {

      setLoading(false);

    }

  };


  /* =========================================================
     DELETE PROJECT
  ========================================================= */

  const deleteProject = async (
    id
  ) => {

    if (
      !window.confirm(
        "Delete this project?"
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
        await response.json().catch(
          () => ({})
        );


      if (!response.ok) {

        throw new Error(
          result.message ||
            "Unable to delete project."
        );

      }


      await loadProjects();


      alert(
        "Project deleted successfully."
      );


    } catch (err) {

      console.error(err);

      alert(err.message);

    } finally {

      setLoading(false);

    }

  };


  /* =========================================================
     RESET FORM
  ========================================================= */

  const resetForm = () => {

    setProjectName("");

    setDescription("");

    setProjectDate("");

    setLocation("");

    setMainImage(null);

    setMainPreview("");

    setGalleryImages([]);

    setIsEditing(false);

    setEditId(null);

    setShowForm(false);

  };


  /* =========================================================
     EDIT PROJECT
  ========================================================= */

  const editProject = (
    project
  ) => {

    setIsEditing(true);

    setEditId(project.id);

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


    setShowForm(true);

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


    /* Scroll to top */

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
          PAGE HEADER
      ===================================================== */}

      <div className="table-header">

        <h1>
          Project Admin
        </h1>


        <button
          className="add-btn"
          onClick={() => {

            resetForm();

            setShowForm(true);

          }}

          disabled={loading}
        >
          + Add Project
        </button>

      </div>


      {/* =====================================================
          ADD / EDIT PROJECT FORM
      ===================================================== */}

      {showForm && (
        <>


          {/* =================================================
              MAIN IMAGE
          ================================================= */}

          <div className="section">

            <h3>
              Main Image
            </h3>


            <input
              type="file"
              accept="image/*"
              onChange={
                handleMainImage
              }
            />


            {mainPreview && (

              <img
                src={mainPreview}
                alt="Main Preview"
                className="preview-image"
              />

            )}

          </div>


          {/* =================================================
              GALLERY IMAGES
          ================================================= */}

          <div className="section">

            <div className="gallery-header">

              <h3>
                Gallery Images
              </h3>


              <button
                className="add-btn"
                type="button"
                onClick={
                  addGalleryImage
                }
              >
                + Add Image
              </button>

            </div>


            {galleryImages.map(
              (image, index) => (

                <div
                  className="gallery-card"
                  key={index}
                >

                  <h4>
                    Image {index + 1}
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
                      src={image.preview}
                      alt={`Gallery ${index + 1}`}
                      className="preview-image"
                    />

                  )}


                  <button
                    className="remove-btn"
                    type="button"
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

          </div>


          {/* =================================================
              PROJECT DETAILS
          ================================================= */}

          <div className="section">

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
                value={projectName}
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
                value={description}
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
                  value={projectDate}
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
                  value={location}
                  onChange={(e) =>
                    setLocation(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>


            {/* Save */}

            <div className="save-section">

              <button
                className="save-btn"
                onClick={
                  handleSave
                }
                disabled={loading}
              >

                {loading
                  ? isEditing
                    ? "Updating..."
                    : "Saving..."
                  : isEditing
                  ? "Update Project"
                  : "Save Project"}

              </button>

            </div>

          </div>

        </>
      )}


      {/* =====================================================
          SAVED PROJECTS
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
                  Project Name
                </th>

                <th>
                  Description
                </th>

                <th>
                  Gallery Images
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
                  (project, index) => (

                    <tr
                      key={project.id}
                    >


                      {/* Number */}

                      <td>
                        {startIndex +
                          index +
                          1}
                      </td>


                      {/* Preview */}

                      <td>

                        <img
                          src={
                            project.mainImage
                          }
                          alt={
                            project.projectName
                          }
                          className="table-image"
                        />

                      </td>


                      {/* Project Name */}

                      <td>
                        {project.projectName}
                      </td>


                      {/* Description */}

                      <td className="desc-cell">

                        {project.description ||
                          "-"}

                      </td>


                      {/* Gallery Count */}

                      <td>

                        <span className="gallery-count">

                          {project.galleryImages
                            ? project
                                .galleryImages
                                .length
                            : 0}{" "}
                          Images

                        </span>

                      </td>


                      {/* Date */}

                      <td>
                        {project.projectDate ||
                          "-"}
                      </td>


                      {/* Location */}

                      <td>
                        {project.location ||
                          "-"}
                      </td>


                      {/* Actions */}

                      <td>

                        <div className="project-actions">

                          <button
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


            {/* Previous */}

            <button
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
              
            </button>


            {/* Page Numbers */}

            <div className="page-numbers">

              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) =>
                  index + 1
              ).map((page) => (

                <button
                  key={page}
                  className={`page-btn ${
                    currentPage === page
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    goToPage(page)
                  }
                >
                  {page}
                </button>

              ))}

            </div>


            {/* Next */}

            <button
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
              
            </button>


          </div>

        )}

      </div>

    </div>

  );

};

export default ProjectAdmin;