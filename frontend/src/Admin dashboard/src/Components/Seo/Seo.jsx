import React, { useEffect, useState } from "react";
import "./Seo.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/seo";

/*
 * IMPORTANT:
 * Replace this with your REAL production website URL.
 *
 * Example:
 * https://www.yourwebsite.com
 *
 * Do NOT add "/" at the end.
 */
const SITE_URL = "https://theroyalkraft.com";

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

/*
 * URL path for each page
 */
const PAGE_ROUTES = {
  Home: "",
  Product: "Product",
  Project: "Project",
  Service: "Service",
  Shop: "shop",
  Blog: "blog",
  Gallery: "gallery",
  About: "about",
  Contact: "contact",
};

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

  const [saving, setSaving] = useState(false);

  const [seoData, setSeoData] = useState(emptySeo);

  /*
   * ============================================
   * Load SEO
   * ============================================
   */

  useEffect(() => {
    loadSeo();
  }, []);

  const loadSeo = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load SEO data.");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setSeoList(data);
      } else {
        setSeoList([]);
      }
    } catch (error) {
      console.error("Error loading SEO:", error);

      setSeoList([]);

      alert("Failed to load SEO data.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * ============================================
   * Generate Canonical URL
   * ============================================
   */

  const generateCanonicalUrl = (page) => {
    const route = PAGE_ROUTES[page];

    if (route === undefined) {
      return "";
    }

    const baseUrl = SITE_URL.replace(/\/+$/, "");

    if (!route) {
      return `${baseUrl}/`;
    }

    return `${baseUrl}/${route}`;
  };

  /*
   * ============================================
   * Validate Canonical URL
   * ============================================
   */

  const isValidCanonicalUrl = (value) => {
    if (!value || !value.trim()) {
      return false;
    }

    try {
      const url = new URL(value.trim());

      if (
        url.protocol !== "http:" &&
        url.protocol !== "https:"
      ) {
        return false;
      }

      if (!url.hostname) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  };

  /*
   * ============================================
   * Handle Input Change
   * ============================================
   */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSeoData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
   * ============================================
   * Page Change
   * ============================================
   */

  const handlePageChange = (e) => {
    const page = e.target.value;

    setSeoData((prev) => ({
      ...prev,
      page,
      canonicalUrl: page
        ? generateCanonicalUrl(page)
        : "",
    }));
  };

  /*
   * ============================================
   * Reset Form
   * ============================================
   */

  const resetForm = () => {
    setSeoData(emptySeo);

    setEditIndex(null);

    setShowForm(false);
  };

  /*
   * ============================================
   * Save SEO
   * ============================================
   */

  const handleSave = async () => {
    /*
     * Required fields
     */

    if (
      !seoData.page ||
      !seoData.metaTitle.trim() ||
      !seoData.metaDescription.trim()
    ) {
      alert(
        "Please fill Page, Meta Title and Meta Description."
      );

      return;
    }

    /*
     * Create final canonical URL
     */

    let finalCanonicalUrl =
      seoData.canonicalUrl.trim();

    /*
     * If empty, automatically generate it.
     */

    if (!finalCanonicalUrl) {
      finalCanonicalUrl = generateCanonicalUrl(
        seoData.page
      );
    }

    /*
     * Validate canonical URL
     */

    if (!isValidCanonicalUrl(finalCanonicalUrl)) {
      alert(
        "Please enter a valid Canonical URL.\n\nExample:\nhttps://www.yourdomain.com/about"
      );

      return;
    }

    /*
     * Prepare data
     */

    const payload = {
      ...(seoData.id ? { id: seoData.id } : {}),

      page: seoData.page.trim(),

      metaTitle: seoData.metaTitle.trim(),

      metaDescription:
        seoData.metaDescription.trim(),

      metaKeywords:
        seoData.metaKeywords.trim(),

      canonicalUrl: finalCanonicalUrl,

      altText: seoData.altText.trim(),
    };

    try {
      setSaving(true);

      let response;

      /*
       * UPDATE
       */

      if (editIndex !== null) {
        response = await fetch(API_URL, {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        });
      }

      /*
       * CREATE
       */

      else {
        response = await fetch(API_URL, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        });
      }

      const result = await response.json();

      if (!response.ok) {
        alert(
          result.message ||
            "Something went wrong while saving SEO."
        );

        return;
      }

      alert(
        result.message ||
          "SEO saved successfully."
      );

      await loadSeo();

      resetForm();
    } catch (error) {
      console.error(
        "Error saving SEO:",
        error
      );

      alert("Failed to save SEO.");
    } finally {
      setSaving(false);
    }
  };

  /*
   * ============================================
   * Edit SEO
   * ============================================
   */

  const handleEdit = (item) => {
    /*
     * If old data contains invalid canonical URL,
     * automatically replace it with the correct one.
     */

    const savedCanonical =
      item.canonicalUrl?.trim() || "";

    const canonicalUrl =
      isValidCanonicalUrl(savedCanonical)
        ? savedCanonical
        : generateCanonicalUrl(item.page);

    setSeoData({
      id: item.id,

      page: item.page || "",

      metaTitle: item.metaTitle || "",

      metaDescription:
        item.metaDescription || "",

      metaKeywords:
        item.metaKeywords || "",

      canonicalUrl,

      altText: item.altText || "",
    });

    setEditIndex(item.id);

    setShowForm(true);
  };

  /*
   * ============================================
   * Delete SEO
   * ============================================
   */

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this SEO record?"
    );

    if (!confirmDelete) {
      return;
    }

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
        alert(
          result.message ||
            "Failed to delete SEO."
        );

        return;
      }

      alert(
        result.message ||
          "SEO deleted successfully."
      );

      await loadSeo();
    } catch (error) {
      console.error(
        "Delete Error:",
        error
      );

      alert("Failed to delete SEO.");
    }
  };

  /*
   * ============================================
   * Add SEO
   * ============================================
   */

  const handleAddSeo = () => {
    setSeoData(emptySeo);

    setEditIndex(null);

    setShowForm(true);
  };

  /*
   * ============================================
   * Render
   * ============================================
   */

  return (
    <div className="seo-container">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="seo-header">

        <h2>SEO Management</h2>

        <button
          className="add-btn"
          onClick={handleAddSeo}
        >
          + Add SEO
        </button>

      </div>

      {/* =========================================
          FORM
      ========================================= */}

      {showForm && (
        <div className="seo-form">

          <h3>
            {editIndex !== null
              ? "Edit SEO"
              : "Add SEO"}
          </h3>

          {/* PAGE */}

          <select
            name="page"
            value={seoData.page}
            onChange={handlePageChange}
          >
            <option value="">
              Select Page
            </option>

            {pages.map((page) => (
              <option
                key={page}
                value={page}
              >
                {page}
              </option>
            ))}
          </select>

          {/* META TITLE */}

          <input
            type="text"
            name="metaTitle"
            placeholder="Meta Title"
            value={seoData.metaTitle}
            onChange={handleChange}
          />

          {/* DESCRIPTION */}

          <textarea
            name="metaDescription"
            placeholder="Meta Description"
            value={seoData.metaDescription}
            onChange={handleChange}
            rows="4"
          />

          {/* KEYWORDS */}

          <input
            type="text"
            name="metaKeywords"
            placeholder="Meta Keywords"
            value={seoData.metaKeywords}
            onChange={handleChange}
          />

          {/* CANONICAL URL */}

          <input
            type="url"
            name="canonicalUrl"
            placeholder="Canonical URL"
            value={seoData.canonicalUrl}
            onChange={handleChange}
          />

          {seoData.page && (
            <small className="canonical-help">
              Recommended Canonical URL:
              {" "}
              {generateCanonicalUrl(
                seoData.page
              )}
            </small>
          )}

          {/* ALT TEXT */}

          <input
            type="text"
            name="altText"
            placeholder="Alternative Text"
            value={seoData.altText}
            onChange={handleChange}
          />

          {/* BUTTONS */}

          <div className="btn-group">

            <button
              className="save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editIndex !== null
                ? "Update SEO"
                : "Save SEO"}
            </button>

            <button
              className="cancel-btn"
              onClick={resetForm}
              disabled={saving}
            >
              Cancel
            </button>

          </div>

        </div>
      )}

      {/* =========================================
          TABLE
      ========================================= */}

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

              <td
                colSpan="7"
                align="center"
              >
                Loading...
              </td>

            </tr>
          ) : seoList.length === 0 ? (
            <tr>

              <td
                colSpan="7"
                align="center"
              >
                No SEO Data Found
              </td>

            </tr>
          ) : (
            seoList.map((item) => (

              <tr key={item.id}>

                <td>
                  {item.page}
                </td>

                <td>
                  {item.metaTitle}
                </td>

                <td>
                  {item.metaDescription}
                </td>

                <td>
                  {item.metaKeywords}
                </td>

                <td>
                  {item.canonicalUrl}
                </td>

                <td>
                  {item.altText}
                </td>

                <td>

                  <button
                    className="edit-btn"
                    onClick={() =>
                      handleEdit(item)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(item.id)
                    }
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