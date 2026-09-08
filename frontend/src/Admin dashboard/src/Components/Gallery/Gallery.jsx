import React, { useEffect, useState } from "react";
import "./Gallery.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/gallery";

const Gallery = () => {

  /* =====================================
     Categories / States
  ===================================== */

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(false);

  const [gallery, setGallery] = useState([]);

  const [isEditing, setIsEditing] = useState(false);

  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    image: null,
    preview: "",
    primaryName: "",
    secondaryName: "",
    description: "",
  });


  /* =====================================
     PAGINATION
  ===================================== */

  const GALLERY_PER_PAGE = 5;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(
    gallery.length / GALLERY_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * GALLERY_PER_PAGE;

  const currentGallery = gallery.slice(
    startIndex,
    startIndex + GALLERY_PER_PAGE
  );


  /* =====================================
     Automatically Fix Page After Delete
  ===================================== */

  useEffect(() => {

    const pages = Math.max(
      1,
      Math.ceil(gallery.length / GALLERY_PER_PAGE)
    );

    setCurrentPage((page) =>
      Math.min(page, pages)
    );

  }, [gallery.length]);


  /* =====================================
     Load Gallery
  ===================================== */

  useEffect(() => {

    loadGallery();

  }, []);


  const loadGallery = async () => {

    try {

      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {

        throw new Error(
          "Failed to load gallery."
        );

      }

      const data = await response.json();

      setGallery(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.log(err);

      setGallery([]);

    } finally {

      setLoading(false);

    }

  };


  /* =====================================
     Upload Image To S3
  ===================================== */

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

    const uploadResponse = await fetch(
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


  /* =====================================
     Select Image
  ===================================== */

  const handleImage = (e) => {

    const file =
      e.target.files[0];

    if (!file) return;

    setForm((prev) => ({
      ...prev,
      image: file,
      preview:
        URL.createObjectURL(file),
    }));

  };


  /* =====================================
     Reset Form
  ===================================== */

  const resetForm = () => {

    setForm({
      image: null,
      preview: "",
      primaryName: "",
      secondaryName: "",
      description: "",
    });

    setIsEditing(false);

    setEditId(null);

    setShowForm(false);

  };


  /* =====================================
     Save Gallery
  ===================================== */

  const saveGallery = async () => {

    try {

      if (
        !isEditing &&
        !form.image
      ) {

        alert(
          "Please upload an image."
        );

        return;

      }

      setLoading(true);


      /* ==========================
         Upload Image
      ========================== */

      let imageUrl = form.preview;

      if (form.image) {

        imageUrl =
          await uploadImage(
            form.image
          );

      }


      /* ==========================
         Payload
      ========================== */

      const payload = {

        id: editId,

        image: imageUrl,

        primaryName:
          form.primaryName,

        secondaryName:
          form.secondaryName,

        description:
          form.description,

      };


      /* ==========================
         Save / Update
      ========================== */

      const response = await fetch(
        API_URL,
        {
          method: isEditing
            ? "PUT"
            : "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(payload),

        }
      );


      const result =
        await response.json();


      if (!response.ok) {

        throw new Error(
          result.message ||
            (isEditing
              ? "Unable to update gallery."
              : "Unable to save gallery.")
        );

      }


      await loadGallery();

      resetForm();


      alert(
        isEditing
          ? "Gallery updated successfully."
          : "Gallery added successfully."
      );


    } catch (err) {

      console.error(err);

      alert(err.message);

    } finally {

      setLoading(false);

    }

  };


  /* =====================================
     Edit Gallery
  ===================================== */

  const editGallery = (item) => {

    setIsEditing(true);

    setEditId(item.id);

    setForm({

      image: null,

      preview: item.image,

      primaryName:
        item.primaryName || "",

      secondaryName:
        item.secondaryName || "",

      description:
        item.description || "",

    });

    setShowForm(true);

  };


  /* =====================================
     Delete Gallery
  ===================================== */

  const deleteGallery = async (id) => {

    if (
      !window.confirm(
        "Delete this image?"
      )
    ) {

      return;

    }


    try {

      setLoading(true);


      const response = await fetch(
        API_URL,
        {
          method: "DELETE",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              id,
            }),

        }
      );


      const result =
        await response.json();


      if (!response.ok) {

        throw new Error(
          result.message ||
            "Delete failed."
        );

      }


      await loadGallery();


      alert(
        "Gallery deleted successfully."
      );


    } catch (err) {

      console.error(err);

      alert(err.message);

    } finally {

      setLoading(false);

    }

  };


  /* =====================================
     PAGE CHANGE
  ===================================== */

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


  /* =====================================
     RETURN
  ===================================== */

  return (

    <div className="gallery-page">


      {/* =====================================
          HEADER
      ===================================== */}

      <div className="gallery-header">

        <h2>
          Gallery Page
        </h2>


        <button
          onClick={() => {

            resetForm();

            setShowForm(true);

          }}

          disabled={loading}
        >
          + Add Image
        </button>

      </div>


      {/* =====================================
          UPLOAD FORM
      ===================================== */}

      {showForm && (

        <div className="upload-box">

          <h3>

            {isEditing
              ? "Edit Gallery"
              : "Add Gallery"}

          </h3>


          {/* Image */}

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
          />


          {/* Image Preview */}

          {form.preview && (

            <div className="gallery-image-preview">

              <img
                src={form.preview}
                alt="Preview"
                className="preview-image"
              />

            </div>

          )}


          {/* Primary Name */}

          <input
            type="text"
            placeholder="Primary Name (Optional)"
            value={
              form.primaryName
            }

            onChange={(e) =>
              setForm((prev) => ({
                ...prev,

                primaryName:
                  e.target.value,

              }))
            }
          />


          {/* Secondary Name */}

          <input
            type="text"
            placeholder="Secondary Name (Optional)"
            value={
              form.secondaryName
            }

            onChange={(e) =>
              setForm((prev) => ({
                ...prev,

                secondaryName:
                  e.target.value,

              }))
            }
          />


          {/* Description */}

          <textarea
            rows="4"
            placeholder="Description (Optional)"
            value={
              form.description
            }

            onChange={(e) =>
              setForm((prev) => ({
                ...prev,

                description:
                  e.target.value,

              }))
            }
          />


          {/* Buttons */}

          <div className="btns">

            <button
              onClick={saveGallery}
              disabled={loading}
            >

              {loading
                ? isEditing
                  ? "Updating..."
                  : "Saving..."
                : isEditing
                ? "Update Gallery"
                : "Save Gallery"}

            </button>


            <button
              onClick={resetForm}
              disabled={loading}
            >
              Cancel
            </button>

          </div>

        </div>

      )}


      {/* =====================================
          GALLERY TABLE
      ===================================== */}

      <div className="table-container">

        {loading ? (

          <div className="gallery-loading">
            Loading gallery...
          </div>

        ) : (

          <table>

            <thead>

              <tr>

                <th>
                  No
                </th>

                <th>
                  Preview
                </th>

                <th>
                  Primary Name
                </th>

                <th>
                  Secondary Name
                </th>

                <th>
                  Description
                </th>

                <th>
                  Type
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {currentGallery.length > 0 ? (

                currentGallery.map(
                  (item, index) => (

                    <tr
                      key={item.id}
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
                          src={item.image}
                          alt={
                            item.primaryName ||
                            "Gallery"
                          }
                          className="preview-image"
                        />

                      </td>


                      {/* Primary Name */}

                      <td>

                        {item.primaryName ||
                          "-"}

                      </td>


                      {/* Secondary Name */}

                      <td>

                        {item.secondaryName ||
                          "-"}

                      </td>


                      {/* Description */}

                      <td>

                        {item.description ||
                          "-"}

                      </td>


                      {/* Type */}

                      <td>
                        Image
                      </td>


                      {/* Actions */}

                      <td>

                        <div className="action-buttons">

                          <button
                            className="edit-btn"
                            onClick={() =>
                              editGallery(
                                item
                              )
                            }
                            disabled={loading}
                          >
                            Edit
                          </button>


                          <button
                            className="delete-btn"
                            onClick={() =>
                              deleteGallery(
                                item.id
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

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    className="empty-gallery"
                  >

                    No gallery images
                    found.

                    <br />

                    Click{" "}
                    <strong>
                      + Add Image
                    </strong>{" "}
                    to upload your
                    first image.

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        )}

      </div>


      {/* =====================================
          PAGINATION
      ===================================== */}

      {gallery.length >
        GALLERY_PER_PAGE && (

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

  );

};

export default Gallery;