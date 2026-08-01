import React, { useEffect, useState } from "react";
import "./Seo.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/seo";

const pages = [
  "Home",
  "Product",
  "Project",
  "Service",
  "Shop",
  "Blog",
  "Gallery",
  "About",
  "Contact",
];

const emptySeo = {
  page: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  canonicalUrl: "",
  altText: "",
};

const Seo = () => {

  const [showForm, setShowForm] = useState(false);

  const [seoList, setSeoList] = useState([]);

  const [editIndex, setEditIndex] = useState(null);

  const [loading, setLoading] = useState(false);

  const [seoData, setSeoData] = useState(emptySeo);

  useEffect(() => {
    loadSeo();
  }, []);

  const loadSeo = async () => {

    try {

      setLoading(true);

      const response = await fetch(API_URL);

      const data = await response.json();

      if (Array.isArray(data)) {
        setSeoList(data);
      } else {
        setSeoList([]);
      }

    } catch (error) {

      console.error("Error loading SEO:", error);

      setSeoList([]);

    } finally {

      setLoading(false);

    }

  };
    // ===========================
  // Handle Input Change
  // ===========================

  const handleChange = (e) => {
    setSeoData({
      ...seoData,
      [e.target.name]: e.target.value,
    });
  };

  // ===========================
  // Reset Form
  // ===========================

  const resetForm = () => {
    setSeoData(emptySeo);
    setEditIndex(null);
    setShowForm(false);
  };

  // ===========================
  // Save SEO (POST & PUT)
  // ===========================

  const handleSave = async () => {

    if (
      !seoData.page ||
      !seoData.metaTitle ||
      !seoData.metaDescription
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {

      let response;

      if (editIndex !== null) {

        response = await fetch(API_URL, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(seoData),
        });

      } else {

        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(seoData),
        });

      }

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Something went wrong.");
        return;
      }

      alert(result.message);

      await loadSeo();

      resetForm();

    } catch (error) {

      console.error("Error saving SEO:", error);

      alert("Failed to save SEO.");

    }

  };
    // ===========================
  // Edit SEO
  // ===========================

  const handleEdit = (item) => {

    setSeoData({
      id: item.id,
      page: item.page,
      metaTitle: item.metaTitle,
      metaDescription: item.metaDescription,
      metaKeywords: item.metaKeywords,
      canonicalUrl: item.canonicalUrl,
      altText: item.altText,
    });

    setEditIndex(item.id);

    setShowForm(true);

  };

  // ===========================
  // Delete SEO
  // ===========================

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this SEO record?"
    );

    if (!confirmDelete) return;

    try {

      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {

        alert(result.message || "Failed to delete SEO.");

        return;

      }

      alert(result.message);

      await loadSeo();

    } catch (error) {

      console.error("Delete Error:", error);

      alert("Failed to delete SEO.");

    }

  };

  // ===========================
  // Add New SEO
  // ===========================

  const handleAddSeo = () => {

    setSeoData(emptySeo);

    setEditIndex(null);

    setShowForm(true);

  };
    return (
    <div className="seo-container">

      <div className="seo-header">

        <h2>SEO Management</h2>

        <button
          className="add-btn"
          onClick={handleAddSeo}
        >
          + Add SEO
        </button>

      </div>

      {showForm && (

        <div className="seo-form">

          <h3>
            {editIndex ? "Edit SEO" : "Add SEO"}
          </h3>

          <select
            name="page"
            value={seoData.page}
            onChange={handleChange}
          >
            <option value="">Select Page</option>

            {pages.map((page) => (
              <option
                key={page}
                value={page}
              >
                {page}
              </option>
            ))}

          </select>

          <input
            type="text"
            name="metaTitle"
            placeholder="Meta Title"
            value={seoData.metaTitle}
            onChange={handleChange}
          />

          <textarea
            name="metaDescription"
            placeholder="Meta Description"
            value={seoData.metaDescription}
            onChange={handleChange}
            rows="4"
          />

          <input
            type="text"
            name="metaKeywords"
            placeholder="Meta Keywords"
            value={seoData.metaKeywords}
            onChange={handleChange}
          />

          <input
            type="text"
            name="canonicalUrl"
            placeholder="Canonical URL"
            value={seoData.canonicalUrl}
            onChange={handleChange}
          />

          <input
            type="text"
            name="altText"
            placeholder="Alternative Text"
            value={seoData.altText}
            onChange={handleChange}
          />

          <div className="btn-group">

            <button
              className="save-btn"
              onClick={handleSave}
            >
              {editIndex ? "Update SEO" : "Save SEO"}
            </button>

            <button
              className="cancel-btn"
              onClick={resetForm}
            >
              Cancel
            </button>

          </div>

        </div>

      )}
            <table className="seo-table">

        <thead>

          <tr>

            <th>Page</th>

            <th>Meta Title</th>

            <th>Description</th>

            <th>Keywords</th>

            <th>Canonical URL</th>

            <th>Alt Text</th>

            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {loading ? (

            <tr>

              <td colSpan="7" align="center">
                Loading...
              </td>

            </tr>

          ) : seoList.length === 0 ? (

            <tr>

              <td colSpan="7" align="center">
                No SEO Data Found
              </td>

            </tr>

          ) : (

            seoList.map((item) => (

              <tr key={item.id}>

                <td>{item.page}</td>

                <td>{item.metaTitle}</td>

                <td>{item.metaDescription}</td>

                <td>{item.metaKeywords}</td>

                <td>{item.canonicalUrl}</td>

                <td>{item.altText}</td>

                <td>

                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  );

};

export default Seo;