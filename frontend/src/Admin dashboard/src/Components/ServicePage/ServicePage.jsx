import React, { useEffect, useState } from "react";
import "./ServicePage.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/service";

const ServicePage = () => {
  const categories = [
    "Air Conditioning",
    "Architectural Layout",
    "Electrical Lighting",
    "Fire Fighting",
    "MEP (Mechanical & Electrical & Plumbing)",
    "STP (Sewage Treatment Plants)",
  ];

  // ==========================================
  // FORM STATE
  // ==========================================

  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showLogoForm, setShowLogoForm] = useState(false);

  const [form, setForm] = useState({
    category: "",
    image: null,
    preview: "",
    name: "",
    description: "",
    date: "",
  });

  const [logoForm, setLogoForm] = useState({
    image: null,
    preview: "",
    name: "",
    description: "",
    url: "",
  });

  // ==========================================
  // DATA
  // ==========================================

  const [services, setServices] = useState([]);
  const [logos, setLogos] = useState([]);

  const [loading, setLoading] = useState(false);

  const [isEditingService, setIsEditingService] = useState(false);
  const [isEditingLogo, setIsEditingLogo] = useState(false);

  const [editServiceId, setEditServiceId] = useState(null);
  const [editLogoId, setEditLogoId] = useState(null);

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    loadServices();
    loadLogos();
  }, []);

  // ==========================================
  // LOAD SERVICES
  // ==========================================

  const loadServices = async () => {
    try {
      const response = await fetch(`${API_URL}?type=service`);

      if (!response.ok) {
        throw new Error("Failed to load services");
      }

      const data = await response.json();

      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Service loading error:", err);
    }
  };

  // ==========================================
  // LOAD LOGOS
  // ==========================================

  const loadLogos = async () => {
    try {
      const response = await fetch(`${API_URL}?type=logo`);

      if (!response.ok) {
        throw new Error("Failed to load logos");
      }

      const data = await response.json();

      setLogos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Logo loading error:", err);
    }
  };

  // ==========================================
  // UPLOAD IMAGE TO S3
  // ==========================================

  const uploadImage = async (file, type) => {
    const response = await fetch(
      `${API_URL}?upload=true&type=${type}&fileName=${encodeURIComponent(
        file.name
      )}&fileType=${encodeURIComponent(file.type)}`
    );

    if (!response.ok) {
      throw new Error("Unable to get upload URL.");
    }

    const uploadData = await response.json();

    const uploadResponse = await fetch(uploadData.uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error("Image upload failed.");
    }

    return {
      fileUrl: uploadData.fileUrl,
      key: uploadData.key,
    };
  };

  // ==========================================
  // SERVICE IMAGE
  // ==========================================

  const handleServiceImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setForm((prev) => ({
      ...prev,
      image: file,
      preview: URL.createObjectURL(file),
    }));
  };

  // ==========================================
  // LOGO IMAGE
  // ==========================================

  const handleLogoImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setLogoForm((prev) => ({
      ...prev,
      image: file,
      preview: URL.createObjectURL(file),
    }));
  };

  // ==========================================
  // RESET SERVICE FORM
  // ==========================================

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

  // ==========================================
  // RESET LOGO FORM
  // ==========================================

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

  // ==========================================
  // SAVE SERVICE
  // ==========================================

  const saveService = async () => {
    if (
      !form.category ||
      !form.name.trim() ||
      !form.description.trim() ||
      !form.date
    ) {
      alert("Please fill all service fields.");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = form.preview;
      let imageKey = "";

      // Upload new image
      if (form.image) {
        const uploadData = await uploadImage(form.image, "service");

        imageUrl = uploadData.fileUrl;
        imageKey = uploadData.key;
      }

      // Image required while adding
      if (!isEditingService && !imageUrl) {
        alert("Please select a service image.");
        setLoading(false);
        return;
      }

      const response = await fetch(API_URL, {
        method: isEditingService ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editServiceId,
          type: "service",

          category: form.category,

          image: imageUrl,

          imageKey: imageKey,

          name: form.name.trim(),

          description: form.description.trim(),

          date: form.date,
        }),
      });

      if (!response.ok) {
        throw new Error(
          isEditingService
            ? "Failed to update service."
            : "Failed to save service."
        );
      }

      await loadServices();

      resetServiceForm();

      alert(
        isEditingService
          ? "Service updated successfully."
          : "Service added successfully."
      );
    } catch (err) {
      console.log(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SAVE LOGO
  // ==========================================

  const saveLogo = async () => {
    if (
      !logoForm.name.trim() ||
      !logoForm.description.trim() ||
      !logoForm.url.trim()
    ) {
      alert("Please fill all logo fields.");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = logoForm.preview;
      let imageKey = "";

      // Upload logo image
      if (logoForm.image) {
        const uploadData = await uploadImage(logoForm.image, "logo");

        imageUrl = uploadData.fileUrl;
        imageKey = uploadData.key;
      }

      // Logo image required while adding
      if (!isEditingLogo && !imageUrl) {
        alert("Please select a logo image.");
        setLoading(false);
        return;
      }

      const response = await fetch(API_URL, {
        method: isEditingLogo ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editLogoId,
          type: "logo",

          image: imageUrl,

          imageKey: imageKey,

          name: logoForm.name.trim(),

          description: logoForm.description.trim(),

          url: logoForm.url.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(
          isEditingLogo
            ? "Failed to update logo."
            : "Failed to save logo."
        );
      }

      await loadLogos();

      resetLogoForm();

      alert(
        isEditingLogo
          ? "Logo updated successfully."
          : "Logo added successfully."
      );
    } catch (err) {
      console.log(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE SERVICE
  // ==========================================

  const deleteService = async (id) => {
    if (!window.confirm("Delete this service?")) return;

    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          type: "service",
        }),
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      await loadServices();

      alert("Service deleted successfully.");
    } catch (err) {
      console.log(err);
      alert("Delete failed.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE LOGO
  // ==========================================

  const deleteLogo = async (id) => {
    if (!window.confirm("Delete this company logo?")) return;

    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          type: "logo",
        }),
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      await loadLogos();

      alert("Logo deleted successfully.");
    } catch (err) {
      console.log(err);
      alert("Delete failed.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // EDIT SERVICE
  // ==========================================

  const editService = (service) => {
    setIsEditingService(true);

    setEditServiceId(service.id);

    setForm({
      category: service.category || "",

      image: null,

      preview: service.image || "",

      name: service.name || "",

      description: service.description || "",

      date: service.date || "",
    });

    setShowServiceForm(true);

    setShowLogoForm(false);
  };

  // ==========================================
  // EDIT LOGO
  // ==========================================

  const editLogo = (logo) => {
    setIsEditingLogo(true);

    setEditLogoId(logo.id);

    setLogoForm({
      image: null,

      preview: logo.image || "",

      name: logo.name || "",

      description: logo.description || "",

      url: logo.url || "",
    });

    setShowLogoForm(true);

    setShowServiceForm(false);
  };

  return (
    <div className="service-page">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="header">
        <h2>Service Page</h2>

        <div className="header-buttons">

          {/* ADD SERVICE */}

          <button
            disabled={loading}
            onClick={() => {
              resetServiceForm();
              setShowServiceForm(true);
              setShowLogoForm(false);
            }}
          >
            + Add Image
          </button>

          {/* ADD LOGO */}

          <button
            disabled={loading}
            onClick={() => {
              resetLogoForm();
              setShowLogoForm(true);
              setShowServiceForm(false);
            }}
          >
            + Add Logo
          </button>

        </div>
      </div>

      {/* ==========================================
          SERVICE FORM
      ========================================== */}

      {showServiceForm && (
        <div className="service-form">

          <h3>
            {isEditingService
              ? "Edit Service"
              : "Add Service"}
          </h3>

          {/* CATEGORY */}

          <select
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
              })
            }
          >
            <option value="">
              Select Service Category
            </option>

            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>

          {/* IMAGE */}

          <label>Service Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleServiceImage}
          />

          {form.preview && (
            <img
              src={form.preview}
              alt="Service Preview"
              className="preview-image"
            />
          )}

          {/* NAME */}

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

          {/* DESCRIPTION */}

          <textarea
            rows="4"
            placeholder="Service Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          {/* DATE */}

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
              onClick={resetServiceForm}
              disabled={loading}
            >
              Cancel
            </button>

          </div>
        </div>
      )}

      {/* ==========================================
          LOGO FORM
      ========================================== */}

      {showLogoForm && (
        <div className="service-form logo-form">

          <h3>
            {isEditingLogo
              ? "Edit Company Logo"
              : "Add Company Logo"}
          </h3>

          {/* LOGO IMAGE */}

          <label>Company Logo</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleLogoImage}
          />

          {logoForm.preview && (
            <img
              src={logoForm.preview}
              alt="Logo Preview"
              className="logo-preview"
            />
          )}

          {/* COMPANY NAME */}

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

          {/* DESCRIPTION */}

          <textarea
            rows="4"
            placeholder="Company Description"
            value={logoForm.description}
            onChange={(e) =>
              setLogoForm({
                ...logoForm,
                description: e.target.value,
              })
            }
          />

          {/* URL */}

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
              onClick={resetLogoForm}
              disabled={loading}
            >
              Cancel
            </button>

          </div>
        </div>
      )}

      {/* ==========================================
          SERVICES TABLE
      ========================================== */}

      <div className="section-title">
        <h3>Services</h3>
      </div>

      <div className="table-container">

        <table>

          <thead>
            <tr>
              <th>No</th>
              <th>Preview</th>
              <th>Category</th>
              <th>Name</th>
              <th>Description</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {services.length > 0 ? (

              services.map((item, index) => (

                <tr key={item.id}>

                  <td>{index + 1}</td>

                  <td>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="preview-image"
                    />
                  </td>

                  <td>
                    <span className="category-badge">
                      {item.category}
                    </span>
                  </td>

                  <td>{item.name}</td>

                  <td>{item.description}</td>

                  <td>{item.date}</td>

                  <td>

                    <button
                      className="edit-btn"
                      onClick={() =>
                        editService(item)
                      }
                      disabled={loading}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteService(item.id)
                      }
                      disabled={loading}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: "40px",
                  }}
                >
                  No services found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* ==========================================
          COMPANY LOGOS
      ========================================== */}

      <div className="section-title logo-section-title">
        <h3>Company Logos</h3>
      </div>

      <div className="table-container">

        <table>

          <thead>

            <tr>
              <th>No</th>
              <th>Logo</th>
              <th>Company Name</th>
              <th>Description</th>
              <th>URL</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {logos.length > 0 ? (

              logos.map((item, index) => (

                <tr key={item.id}>

                  <td>{index + 1}</td>

                  <td>

                    <img
                      src={item.image}
                      alt={item.name}
                      className="logo-table-image"
                    />

                  </td>

                  <td>
                    <strong>
                      {item.name}
                    </strong>
                  </td>

                  <td>
                    {item.description}
                  </td>

                  <td>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Website
                    </a>

                  </td>

                  <td>

                    <button
                      className="edit-btn"
                      onClick={() =>
                        editLogo(item)
                      }
                      disabled={loading}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteLogo(item.id)
                      }
                      disabled={loading}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "40px",
                  }}
                >
                  No company logos found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default ServicePage;