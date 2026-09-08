import React, { useEffect, useState } from "react";
import "./ServicePage.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/service";

const ITEMS_PER_PAGE = 5;

const ServicePage = () => {
  /* =========================================================
     SERVICE CATEGORIES
  ========================================================= */

  const categories = [
    "Air Conditioning",
    "Architectural Layout",
    "Electrical Lighting",
    "Fire Fighting",
    "MEP (Mechanical & Electrical & Plumbing)",
    "STP (Sewage Treatment Plants)",
  ];

  /* =========================================================
     DROPDOWN
  ========================================================= */

  const [showAddDropdown, setShowAddDropdown] =
    useState(false);

  /* =========================================================
     FORM VISIBILITY
  ========================================================= */

  const [showServiceForm, setShowServiceForm] =
    useState(false);

  const [showLogoForm, setShowLogoForm] =
    useState(false);

  /* =========================================================
     SERVICE FORM
  ========================================================= */

  const [form, setForm] = useState({
    category: "",
    image: null,
    preview: "",
    name: "",
    description: "",
    date: "",
  });

  /* =========================================================
     LOGO FORM
  ========================================================= */

  const [logoForm, setLogoForm] = useState({
    image: null,
    preview: "",
    name: "",
    description: "",
    url: "",
  });

  /* =========================================================
     DATA
  ========================================================= */

  const [services, setServices] = useState([]);
  const [logos, setLogos] = useState([]);

  const [loading, setLoading] = useState(false);

  /* =========================================================
     EDIT STATES
  ========================================================= */

  const [isEditingService, setIsEditingService] =
    useState(false);

  const [isEditingLogo, setIsEditingLogo] =
    useState(false);

  const [editServiceId, setEditServiceId] =
    useState(null);

  const [editLogoId, setEditLogoId] =
    useState(null);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const [currentPage, setCurrentPage] = useState(1);

  /* =========================================================
     LOAD DATA
  ========================================================= */

  useEffect(() => {
    loadServices();
    loadLogos();
  }, []);

  /* =========================================================
     LOAD SERVICES
  ========================================================= */

  const loadServices = async () => {
    try {
      const response = await fetch(
        `${API_URL}?type=service`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load services"
        );
      }

      const data = await response.json();

      setServices(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.log(
        "Service loading error:",
        error
      );
    }
  };

  /* =========================================================
     LOAD LOGOS
  ========================================================= */

  const loadLogos = async () => {
    try {
      const response = await fetch(
        `${API_URL}?type=logo`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load logos"
        );
      }

      const data = await response.json();

      setLogos(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.log(
        "Logo loading error:",
        error
      );
    }
  };

  /* =========================================================
     COMBINE SERVICES + LOGOS
  ========================================================= */

  const allItems = [
    ...services.map((item) => ({
      ...item,
      recordType: "service",
    })),

    ...logos.map((item) => ({
      ...item,
      recordType: "logo",
    })),
  ];

  /* =========================================================
     PAGINATION CALCULATION
  ========================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      allItems.length / ITEMS_PER_PAGE
    )
  );

  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE;

  const currentItems = allItems.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  /* =========================================================
     KEEP CURRENT PAGE VALID
  ========================================================= */

  useEffect(() => {
    const pages = Math.max(
      1,
      Math.ceil(
        allItems.length / ITEMS_PER_PAGE
      )
    );

    setCurrentPage((page) =>
      Math.min(page, pages)
    );
  }, [services.length, logos.length]);

  /* =========================================================
     UPLOAD IMAGE
  ========================================================= */

  const uploadImage = async (
    file,
    type
  ) => {
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

    return {
      fileUrl: uploadData.fileUrl,
      key: uploadData.key,
    };
  };

  /* =========================================================
     SERVICE IMAGE CHANGE
  ========================================================= */

  const handleServiceImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setForm((prev) => ({
      ...prev,
      image: file,
      preview:
        URL.createObjectURL(file),
    }));
  };

  /* =========================================================
     LOGO IMAGE CHANGE
  ========================================================= */

  const handleLogoImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setLogoForm((prev) => ({
      ...prev,
      image: file,
      preview:
        URL.createObjectURL(file),
    }));
  };

  /* =========================================================
     RESET SERVICE FORM
  ========================================================= */

  const resetServiceForm = () => {
    setForm({
      category: "",
      image: null,
      preview: "",
      name: "",
      description: "",
      date: "",
    });

    setIsEditingService(false);
    setEditServiceId(null);
    setShowServiceForm(false);
  };

  /* =========================================================
     RESET LOGO FORM
  ========================================================= */

  const resetLogoForm = () => {
    setLogoForm({
      image: null,
      preview: "",
      name: "",
      description: "",
      url: "",
    });

    setIsEditingLogo(false);
    setEditLogoId(null);
    setShowLogoForm(false);
  };

  /* =========================================================
     OPEN ADD SERVICE
  ========================================================= */

  const openAddService = () => {
    resetServiceForm();

    setShowServiceForm(true);
    setShowLogoForm(false);
    setShowAddDropdown(false);
  };

  /* =========================================================
     OPEN ADD LOGO
  ========================================================= */

  const openAddLogo = () => {
    resetLogoForm();

    setShowLogoForm(true);
    setShowServiceForm(false);
    setShowAddDropdown(false);
  };

  /* =========================================================
     SAVE SERVICE
  ========================================================= */

  const saveService = async () => {
    if (
      !form.category ||
      !form.name.trim() ||
      !form.description.trim() ||
      !form.date
    ) {
      alert(
        "Please fill all service fields."
      );
      return;
    }

    try {
      setLoading(true);

      let imageUrl = form.preview;
      let imageKey = "";

      if (form.image) {
        const uploadData =
          await uploadImage(
            form.image,
            "service"
          );

        imageUrl =
          uploadData.fileUrl;

        imageKey =
          uploadData.key;
      }

      if (
        !isEditingService &&
        !imageUrl
      ) {
        alert(
          "Please select a service image."
        );

        setLoading(false);
        return;
      }

      const response = await fetch(
        API_URL,
        {
          method:
            isEditingService
              ? "PUT"
              : "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            id: editServiceId,
            type: "service",
            category: form.category,
            image: imageUrl,
            imageKey: imageKey,
            name: form.name.trim(),
            description:
              form.description.trim(),
            date: form.date,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          isEditingService
            ? "Failed to update service."
            : "Failed to save service."
        );
      }

      await loadServices();

      resetServiceForm();

      setCurrentPage(1);

      alert(
        isEditingService
          ? "Service updated successfully."
          : "Service added successfully."
      );
    } catch (error) {
      console.log(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     SAVE LOGO
  ========================================================= */

  const saveLogo = async () => {
    if (
      !logoForm.name.trim() ||
      !logoForm.description.trim() ||
      !logoForm.url.trim()
    ) {
      alert(
        "Please fill all logo fields."
      );
      return;
    }

    try {
      setLoading(true);

      let imageUrl =
        logoForm.preview;

      let imageKey = "";

      if (logoForm.image) {
        const uploadData =
          await uploadImage(
            logoForm.image,
            "logo"
          );

        imageUrl =
          uploadData.fileUrl;

        imageKey =
          uploadData.key;
      }

      if (
        !isEditingLogo &&
        !imageUrl
      ) {
        alert(
          "Please select a logo image."
        );

        setLoading(false);
        return;
      }

      const response = await fetch(
        API_URL,
        {
          method:
            isEditingLogo
              ? "PUT"
              : "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            id: editLogoId,
            type: "logo",
            image: imageUrl,
            imageKey: imageKey,
            name: logoForm.name.trim(),
            description:
              logoForm.description.trim(),
            url: logoForm.url.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          isEditingLogo
            ? "Failed to update logo."
            : "Failed to save logo."
        );
      }

      await loadLogos();

      resetLogoForm();

      setCurrentPage(1);

      alert(
        isEditingLogo
          ? "Logo updated successfully."
          : "Logo added successfully."
      );
    } catch (error) {
      console.log(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     DELETE ITEM
  ========================================================= */

  const deleteItem = async (item) => {
    const message =
      item.recordType === "logo"
        ? "Delete this company logo?"
        : "Delete this service?";

    if (!window.confirm(message)) {
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

          body: JSON.stringify({
            id: item.id,
            type: item.recordType,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Delete failed"
        );
      }

      if (
        item.recordType ===
        "service"
      ) {
        await loadServices();
      } else {
        await loadLogos();
      }

      alert(
        item.recordType ===
          "logo"
          ? "Logo deleted successfully."
          : "Service deleted successfully."
      );
    } catch (error) {
      console.log(error);
      alert("Delete failed.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     EDIT SERVICE
  ========================================================= */

  const editService = (item) => {
    setIsEditingService(true);
    setEditServiceId(item.id);

    setForm({
      category:
        item.category || "",
      image: null,
      preview:
        item.image || "",
      name:
        item.name || "",
      description:
        item.description || "",
      date:
        item.date || "",
    });

    setShowServiceForm(true);
    setShowLogoForm(false);
    setShowAddDropdown(false);
  };

  /* =========================================================
     EDIT LOGO
  ========================================================= */

  const editLogo = (item) => {
    setIsEditingLogo(true);
    setEditLogoId(item.id);

    setLogoForm({
      image: null,
      preview:
        item.image || "",
      name:
        item.name || "",
      description:
        item.description || "",
      url:
        item.url || "",
    });

    setShowLogoForm(true);
    setShowServiceForm(false);
    setShowAddDropdown(false);
  };

  /* =========================================================
     EDIT ITEM
  ========================================================= */

  const editItem = (item) => {
    if (
      item.recordType ===
      "logo"
    ) {
      editLogo(item);
    } else {
      editService(item);
    }
  };

  /* =========================================================
     GO TO PAGE
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
     FORMAT CREATED DATE
  ========================================================= */

  const getCreatedDate = (item) => {
    const value =
      item.recordType === "service"
        ? item.date
        : item.createdAt ||
          item.created ||
          item.date;

    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString(
      "en-GB"
    );
  };

  /* =========================================================
     GET CATEGORY
  ========================================================= */

  const getCategory = (item) => {
    if (
      item.recordType === "logo"
    ) {
      return "Logo";
    }

    return item.category || "Service";
  };

  /* =========================================================
     GET TYPE
  ========================================================= */

  const getType = (item) => {
    if (
      item.recordType === "logo"
    ) {
      return "Logo";
    }

    return "Image";
  };

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <div className="service-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="service-header">

        <h2>Service Page</h2>

        <div className="add-dropdown-wrapper">

          <button
            className="add-main-btn"
            disabled={loading}
            onClick={() =>
              setShowAddDropdown(
                (prev) => !prev
              )
            }
          >
            + Add Image

            <span className="dropdown-arrow">
              {showAddDropdown
                ? "▲"
                : "▼"}
            </span>
          </button>

          {showAddDropdown && (
            <div className="add-dropdown">

              <button
                type="button"
                onClick={
                  openAddService
                }
              >
                <span>🖼️</span>
                Add Image
              </button>

              <button
                type="button"
                onClick={
                  openAddLogo
                }
              >
                <span>🏢</span>
                Add Logo
              </button>

            </div>
          )}

        </div>

      </div>

      {/* =====================================================
          SERVICE FORM
      ===================================================== */}

      {showServiceForm && (
        <div className="service-form">

          <h3>
            {isEditingService
              ? "Edit Service"
              : "Add Service"}
          </h3>

          <select
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category:
                  e.target.value,
              })
            }
          >

            <option value="">
              Select Service Category
            </option>

            {categories.map(
              (category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              )
            )}

          </select>

          <label>
            Service Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={
              handleServiceImage
            }
          />

          {form.preview && (
            <img
              src={form.preview}
              alt="Service Preview"
              className="form-preview-image"
            />
          )}

          <input
            type="text"
            placeholder="Service Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <textarea
            rows="4"
            placeholder="Service Description"
            value={
              form.description
            }
            onChange={(e) =>
              setForm({
                ...form,
                description:
                  e.target.value,
              })
            }
          />

          <input
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm({
                ...form,
                date: e.target.value,
              })
            }
          />

          <div className="btns">

            <button
              onClick={saveService}
              disabled={loading}
            >
              {loading
                ? isEditingService
                  ? "Updating..."
                  : "Saving..."
                : isEditingService
                ? "Update Service"
                : "Save Service"}
            </button>

            <button
              onClick={
                resetServiceForm
              }
              disabled={loading}
            >
              Cancel
            </button>

          </div>

        </div>
      )}

      {/* =====================================================
          LOGO FORM
      ===================================================== */}

      {showLogoForm && (
        <div className="service-form logo-form">

          <h3>
            {isEditingLogo
              ? "Edit Company Logo"
              : "Add Company Logo"}
          </h3>

          <label>
            Company Logo
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={
              handleLogoImage
            }
          />

          {logoForm.preview && (
            <img
              src={logoForm.preview}
              alt="Logo Preview"
              className="logo-preview"
            />
          )}

          <input
            type="text"
            placeholder="Company Name"
            value={logoForm.name}
            onChange={(e) =>
              setLogoForm({
                ...logoForm,
                name: e.target.value,
              })
            }
          />

          <textarea
            rows="4"
            placeholder="Company Description"
            value={
              logoForm.description
            }
            onChange={(e) =>
              setLogoForm({
                ...logoForm,
                description:
                  e.target.value,
              })
            }
          />

          <input
            type="url"
            placeholder="Company Website URL"
            value={logoForm.url}
            onChange={(e) =>
              setLogoForm({
                ...logoForm,
                url: e.target.value,
              })
            }
          />

          <div className="btns">

            <button
              onClick={saveLogo}
              disabled={loading}
            >
              {loading
                ? isEditingLogo
                  ? "Updating..."
                  : "Saving..."
                : isEditingLogo
                ? "Update Logo"
                : "Save Logo"}
            </button>

            <button
              onClick={
                resetLogoForm
              }
              disabled={loading}
            >
              Cancel
            </button>

          </div>

        </div>
      )}

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="table-container">

        <table>

          <thead>

            <tr>
              <th>No</th>
              <th>Preview</th>
              <th>Type</th>
              <th>Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Created</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {currentItems.length > 0 ? (

              currentItems.map(
                (item, index) => (

                  <tr
                    key={`${item.recordType}-${item.id}`}
                  >

                    {/* NO */}

                    <td>
                      {startIndex +
                        index +
                        1}
                    </td>

                    {/* PREVIEW */}

                    <td>

                      {item.image ? (
                        <img
                          src={
                            item.image
                          }
                          alt={
                            item.name ||
                            "Preview"
                          }
                          className="table-preview"
                        />
                      ) : (
                        <div className="no-image">
                          No Image
                        </div>
                      )}

                    </td>

                    {/* TYPE */}

                    <td>

                      <span
                        className={`type-badge ${
                          item.recordType ===
                          "logo"
                            ? "logo-type"
                            : "image-type"
                        }`}
                      >
                        {getType(item)}
                      </span>

                    </td>

                    {/* NAME */}

                    <td>
                      {item.name ||
                        "-"}
                    </td>

                    {/* DESCRIPTION */}

                    <td>
                      {item.description ||
                        "-"}
                    </td>

                    {/* CATEGORY */}

                    <td>

                      <span
                        className={`category-badge ${
                          item.recordType ===
                          "logo"
                            ? "logo-category"
                            : "service-category"
                        }`}
                      >
                        {getCategory(
                          item
                        )}
                      </span>

                    </td>

                    {/* CREATED */}

                    <td>
                      {getCreatedDate(
                        item
                      )}
                    </td>

                    {/* ACTION */}

                    <td>

                      <button
                        className="edit-btn"
                        onClick={() =>
                          editItem(
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
                          deleteItem(
                            item
                          )
                        }
                        disabled={loading}
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                )
              )

            ) : (

              <tr>

                <td
                  colSpan="8"
                  className="empty-message"
                >
                  No services or logos found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* =====================================================
          SINGLE PAGINATION
      ===================================================== */}

      {totalPages > 1 && (
        <div className="pagination">

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
            ← Previous
          </button>

          <div className="page-numbers">

            {Array.from(
              {
                length: totalPages,
              },
              (_, index) => {

                const pageNumber =
                  index + 1;

                return (
                  <button
                    key={
                      pageNumber
                    }
                    className={`page-btn ${
                      currentPage ===
                      pageNumber
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      goToPage(
                        pageNumber
                      )
                    }
                  >
                    {pageNumber}
                  </button>
                );
              }
            )}

          </div>

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
            Next →
          </button>

        </div>
      )}

    </div>
  );
};

export default ServicePage;