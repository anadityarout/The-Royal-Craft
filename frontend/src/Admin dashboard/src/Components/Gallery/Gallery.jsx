import React, { useEffect, useState } from "react";
import "./Gallery.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/gallery";

const Gallery = () => {
  // =========================================================
  // MAIN STATES
  // =========================================================

  const [showForm, setShowForm] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [formType, setFormType] = useState("gallery");
  const [loading, setLoading] = useState(false);

  const [gallery, setGallery] = useState([]);

  // =========================================================
  // BANNER STATES
  // =========================================================

  const [banner, setBanner] = useState(null);
  const [bannerEditing, setBannerEditing] = useState(false);

  const [bannerForm, setBannerForm] = useState({
    image: null,
    preview: "",
    name: "",
    description: "",
  });

  // =========================================================
  // GALLERY EDIT STATES
  // =========================================================

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    image: null,
    preview: "",
    primaryName: "",
    secondaryName: "",
    description: "",
  });

  // =========================================================
  // PAGINATION
  // =========================================================

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

  // =========================================================
  // LOAD DATA
  // =========================================================

  useEffect(() => {
    loadGallery();
    loadBanner();
  }, []);

  // =========================================================
  // LOAD GALLERY
  // =========================================================

  const loadGallery = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load gallery.");
      }

      const data = await response.json();

      setGallery(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error("Gallery load error:", err);
      setGallery([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD BANNER
  // =========================================================

  const loadBanner = async () => {
    try {
      const response = await fetch(
        `${API_URL}?type=banner`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load gallery banner."
        );
      }

      const data = await response.json();

      if (data && data.image) {
        setBanner(data);
      } else {
        setBanner(null);
      }
    } catch (err) {
      console.error(
        "Banner load error:",
        err
      );

      setBanner(null);
    }
  };

  // =========================================================
  // UPLOAD IMAGE TO S3
  // =========================================================

  const uploadImage = async (
    file,
    type = "gallery"
  ) => {
    if (!file) {
      throw new Error(
        "Please select an image."
      );
    }

    const response = await fetch(
      `${API_URL}?upload=true&type=${type}&fileName=${encodeURIComponent(
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

  // =========================================================
  // GALLERY IMAGE SELECT
  // =========================================================

  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setForm((prev) => ({
      ...prev,
      image: file,
      preview: URL.createObjectURL(file),
    }));
  };

  // =========================================================
  // BANNER IMAGE SELECT
  // =========================================================

  const handleBannerImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setBannerForm((prev) => ({
      ...prev,
      image: file,
      preview: URL.createObjectURL(file),
    }));
  };

  // =========================================================
  // RESET GALLERY FORM
  // =========================================================

  const resetGalleryForm = () => {
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

  // =========================================================
  // RESET BANNER FORM
  // =========================================================

  const resetBannerForm = () => {
    setBannerForm({
      image: null,
      preview: "",
      name: "",
      description: "",
    });

    setBannerEditing(false);
    setShowForm(false);
  };

  // =========================================================
  // CLOSE EVERYTHING
  // =========================================================

  const closeForm = () => {
    setShowForm(false);
    setShowTypeDropdown(false);
    setFormType("gallery");

    setIsEditing(false);
    setEditId(null);

    setBannerEditing(false);

    setForm({
      image: null,
      preview: "",
      primaryName: "",
      secondaryName: "",
      description: "",
    });

    setBannerForm({
      image: null,
      preview: "",
      name: "",
      description: "",
    });
  };

  // =========================================================
  // SELECT GALLERY PAGE
  // =========================================================

  const selectGalleryPage = () => {
    setFormType("gallery");
    setShowTypeDropdown(false);

    setIsEditing(false);
    setEditId(null);

    setForm({
      image: null,
      preview: "",
      primaryName: "",
      secondaryName: "",
      description: "",
    });

    setShowForm(true);
  };

  // =========================================================
  // SELECT BANNER
  // =========================================================

  const selectBanner = () => {
    setFormType("banner");
    setShowTypeDropdown(false);

    // If banner already exists,
    // open it in EDIT mode.
    setBannerEditing(!!banner);

    setBannerForm({
      image: null,
      preview: banner?.image || "",
      name: banner?.name || "",
      description: banner?.description || "",
    });

    setShowForm(true);
  };

  // =========================================================
  // SAVE GALLERY
  // =========================================================

  const saveGallery = async () => {
    try {
      // New gallery image requires an image
      if (!isEditing && !form.image) {
        alert("Please upload an image.");
        return;
      }

      setLoading(true);

      // =====================================================
      // IMAGE URL
      // =====================================================

      let imageUrl = form.preview;

      if (form.image) {
        imageUrl = await uploadImage(
          form.image,
          "gallery"
        );
      }

      // =====================================================
      // PAYLOAD
      // =====================================================

      const payload = {
        id: editId,
        image: imageUrl,
        primaryName: form.primaryName,
        secondaryName: form.secondaryName,
        description: form.description,
      };

      // =====================================================
      // POST / PUT
      // =====================================================

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

          body: JSON.stringify(payload),
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

      // Reload gallery
      await loadGallery();

      // Close form
      resetGalleryForm();

      alert(
        isEditing
          ? "Gallery updated successfully."
          : "Gallery added successfully."
      );
    } catch (err) {
      console.error(
        "Save gallery error:",
        err
      );

      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SAVE BANNER
  // =========================================================

  const saveBanner = async () => {
    try {
      // =====================================================
      // VALIDATION
      // =====================================================

      if (
        !bannerEditing &&
        !bannerForm.image &&
        !bannerForm.preview
      ) {
        alert(
          "Please upload a banner image."
        );

        return;
      }

      if (
        !bannerForm.name.trim()
      ) {
        alert(
          "Please enter banner name."
        );

        return;
      }

      setLoading(true);

      // =====================================================
      // IMAGE URL
      // =====================================================

      let imageUrl =
        bannerForm.preview;

      // Upload new banner image
      if (bannerForm.image) {
        imageUrl =
          await uploadImage(
            bannerForm.image,
            "banner"
          );
      }

      // =====================================================
      // PAYLOAD
      // =====================================================

      const payload = {
        id:
          banner?.id ||
          "gallery-banner",

        image: imageUrl,

        name:
          bannerForm.name.trim(),

        description:
          bannerForm.description.trim(),
      };

      // =====================================================
      // SAVE BANNER
      // =====================================================

      const response =
        await fetch(
          `${API_URL}?type=banner`,
          {
            method:
              bannerEditing
                ? "PUT"
                : "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                payload
              ),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            (bannerEditing
              ? "Unable to update banner."
              : "Unable to save banner.")
        );
      }

      // =====================================================
      // UPDATE LOCAL BANNER
      // =====================================================

      if (result.data) {
        setBanner(result.data);
      } else {
        await loadBanner();
      }

      // Close banner form
      setBannerEditing(false);
      setShowForm(false);

      setBannerForm({
        image: null,
        preview: "",
        name: "",
        description: "",
      });

      alert(
        bannerEditing
          ? "Gallery banner updated successfully."
          : "Gallery banner saved successfully."
      );
    } catch (err) {
      console.error(
        "Save banner error:",
        err
      );

      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // EDIT GALLERY
  // =========================================================

  const editGallery = (item) => {
    setFormType("gallery");
    setShowTypeDropdown(false);

    setIsEditing(true);
    setEditId(item.id);

    setForm({
      image: null,

      preview:
        item.image || "",

      primaryName:
        item.primaryName || "",

      secondaryName:
        item.secondaryName || "",

      description:
        item.description || "",
    });

    setShowForm(true);
  };

  // =========================================================
  // EDIT BANNER
  // =========================================================

  const editBanner = () => {
    if (!banner) {
      return;
    }

    setFormType("banner");
    setShowTypeDropdown(false);

    setBannerEditing(true);

    setBannerForm({
      image: null,

      preview:
        banner.image || "",

      name:
        banner.name || "",

      description:
        banner.description || "",
    });

    setShowForm(true);
  };

  // =========================================================
  // DELETE GALLERY
  // =========================================================

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
      console.error(
        "Delete gallery error:",
        err
      );

      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // DELETE BANNER
  // =========================================================

  const deleteBanner = async () => {
    if (!banner) {
      return;
    }

    if (
      !window.confirm(
        "Delete this gallery banner?"
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          `${API_URL}?type=banner`,
          {
            method: "DELETE",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id:
                banner.id ||
                "gallery-banner",
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Banner delete failed."
        );
      }

      setBanner(null);

      alert(
        "Gallery banner deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete banner error:",
        err
      );

      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // PAGE CHANGE
  // =========================================================

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

  // =========================================================
  // FIX PAGE AFTER DELETE
  // =========================================================

  useEffect(() => {
    const pages = Math.max(
      1,
      Math.ceil(
        gallery.length /
          GALLERY_PER_PAGE
      )
    );

    setCurrentPage((page) =>
      Math.min(page, pages)
    );
  }, [gallery.length]);

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <div className="gallery-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="gallery-header">

        <h2>
          Gallery Page
        </h2>

        {/* =================================================
            ADD IMAGE DROPDOWN
        ================================================= */}

        <div className="add-image-wrapper">

          <button
            className="add-image-btn"
            onClick={() => {
              setShowTypeDropdown(
                (prev) => !prev
              );
            }}
            disabled={loading}
          >
            + Add Image

            <span className="dropdown-arrow">
              {showTypeDropdown
                ? "▲"
                : "▼"}
            </span>
          </button>

          {showTypeDropdown && (
            <div className="add-image-dropdown">

              {/* BANNER */}

              <button
                type="button"
                onClick={
                  selectBanner
                }
              >
                Banner
              </button>

              {/* GALLERY PAGE */}

              <button
                type="button"
                onClick={
                  selectGalleryPage
                }
              >
                Gallery Page
              </button>

            </div>
          )}

        </div>

      </div>

      {/* =====================================================
          FORM
      ===================================================== */}

      {showForm && (

        <div className="upload-box">

          {/* =================================================
              BANNER FORM
          ================================================= */}

          {formType === "banner" ? (

            <>

              <h3>
                {bannerEditing
                  ? "Edit Gallery Banner"
                  : "Add Gallery Banner"}
              </h3>

              {/* BANNER IMAGE */}

              <label>
                Banner Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleBannerImage
                }
              />

              {/* BANNER PREVIEW */}

              {bannerForm.preview && (
                <div className="gallery-image-preview">

                  <img
                    src={
                      bannerForm.preview
                    }
                    alt="Banner Preview"
                    className="preview-image"
                  />

                </div>
              )}

              {/* BANNER NAME */}

              <input
                type="text"
                placeholder="Banner Name"
                value={
                  bannerForm.name
                }
                onChange={(e) =>
                  setBannerForm(
                    (prev) => ({
                      ...prev,

                      name:
                        e.target.value,
                    })
                  )
                }
              />

              {/* BANNER DESCRIPTION */}

              <textarea
                rows="5"
                placeholder="Banner Description"
                value={
                  bannerForm.description
                }
                onChange={(e) =>
                  setBannerForm(
                    (prev) => ({
                      ...prev,

                      description:
                        e.target.value,
                    })
                  )
                }
              />

              {/* BUTTONS */}

              <div className="btns">

                <button
                  onClick={
                    saveBanner
                  }
                  disabled={loading}
                >
                  {loading
                    ? bannerEditing
                      ? "Updating..."
                      : "Saving..."
                    : bannerEditing
                    ? "Update Banner"
                    : "Save Banner"}
                </button>

                <button
                  onClick={
                    closeForm
                  }
                  disabled={loading}
                >
                  Cancel
                </button>

              </div>

            </>

          ) : (

            /* =================================================
               GALLERY PAGE FORM
            ================================================= */

            <>

              <h3>
                {isEditing
                  ? "Edit Gallery"
                  : "Add Gallery"}
              </h3>

              {/* IMAGE */}

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleImage
                }
              />

              {/* IMAGE PREVIEW */}

              {form.preview && (
                <div className="gallery-image-preview">

                  <img
                    src={
                      form.preview
                    }
                    alt="Preview"
                    className="preview-image"
                  />

                </div>
              )}

              {/* PRIMARY NAME */}

              <input
                type="text"
                placeholder="Primary Name (Optional)"
                value={
                  form.primaryName
                }
                onChange={(e) =>
                  setForm(
                    (prev) => ({
                      ...prev,

                      primaryName:
                        e.target.value,
                    })
                  )
                }
              />

              {/* SECONDARY NAME */}

              <input
                type="text"
                placeholder="Secondary Name (Optional)"
                value={
                  form.secondaryName
                }
                onChange={(e) =>
                  setForm(
                    (prev) => ({
                      ...prev,

                      secondaryName:
                        e.target.value,
                    })
                  )
                }
              />

              {/* DESCRIPTION */}

              <textarea
                rows="4"
                placeholder="Description (Optional)"
                value={
                  form.description
                }
                onChange={(e) =>
                  setForm(
                    (prev) => ({
                      ...prev,

                      description:
                        e.target.value,
                    })
                  )
                }
              />

              {/* BUTTONS */}

              <div className="btns">

                <button
                  onClick={
                    saveGallery
                  }
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
                  onClick={
                    closeForm
                  }
                  disabled={loading}
                >
                  Cancel
                </button>

              </div>

            </>

          )}

        </div>
      )}

      {/* =====================================================
          TABLE
      ===================================================== */}

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

              {/* =================================================
                  BANNER ROW
              ================================================= */}

              {banner && (

                <tr>

                  <td>
                    B
                  </td>

                  <td>

                    <img
                      src={
                        banner.image
                      }
                      alt={
                        banner.name ||
                        "Gallery Banner"
                      }
                      className="preview-image"
                    />

                  </td>

                  <td>
                    {banner.name ||
                      "-"}
                  </td>

                  <td>
                    -
                  </td>

                  <td
                    style={{
                      maxWidth:
                        "350px",
                      whiteSpace:
                        "pre-wrap",
                      wordBreak:
                        "break-word",
                    }}
                  >
                    {banner.description ||
                      "-"}
                  </td>

                  <td>
                    Banner
                  </td>

                  <td>

                    <div className="action-buttons">

                      <button
                        className="edit-btn"
                        onClick={
                          editBanner
                        }
                        disabled={
                          loading
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={
                          deleteBanner
                        }
                        disabled={
                          loading
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              )}

              {/* =================================================
                  GALLERY ROWS
              ================================================= */}

              {currentGallery.length >
              0 ? (

                currentGallery.map(
                  (item, index) => (

                    <tr
                      key={
                        item.id
                      }
                    >

                      {/* NUMBER */}

                      <td>
                        {startIndex +
                          index +
                          1}
                      </td>

                      {/* PREVIEW */}

                      <td>

                        <img
                          src={
                            item.image
                          }
                          alt={
                            item.primaryName ||
                            "Gallery"
                          }
                          className="preview-image"
                        />

                      </td>

                      {/* PRIMARY NAME */}

                      <td>
                        {item.primaryName ||
                          "-"}
                      </td>

                      {/* SECONDARY NAME */}

                      <td>
                        {item.secondaryName ||
                          "-"}
                      </td>

                      {/* DESCRIPTION */}

                      <td
                        style={{
                          maxWidth:
                            "350px",
                          whiteSpace:
                            "pre-wrap",
                          wordBreak:
                            "break-word",
                        }}
                      >
                        {item.description ||
                          "-"}
                      </td>

                      {/* TYPE */}

                      <td>
                        Image
                      </td>

                      {/* ACTION */}

                      <td>

                        <div className="action-buttons">

                          <button
                            className="edit-btn"
                            onClick={() =>
                              editGallery(
                                item
                              )
                            }
                            disabled={
                              loading
                            }
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
                            disabled={
                              loading
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              ) : !banner ? (

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

              ) : null}

            </tbody>

          </table>

        )}

      </div>

      {/* =====================================================
          PAGINATION
      ===================================================== */}

      {gallery.length >
        GALLERY_PER_PAGE && (

        <div className="pagination">

          {/* PREVIOUS */}

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
            ‹
          </button>

          {/* PAGE NUMBERS */}

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

          {/* NEXT */}

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
            ›
          </button>

        </div>

      )}

    </div>
  );
};

export default Gallery;