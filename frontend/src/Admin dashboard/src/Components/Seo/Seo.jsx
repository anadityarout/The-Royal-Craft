import React, { useEffect, useState } from "react";
import "./Seo.css";

// =====================================================
// SEO API
// =====================================================

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/seo";

// =====================================================
// WEBSITE URL
// =====================================================

const SITE_URL = "https://theroyalkraft.com";

// =====================================================
// SEO PAGES
// =====================================================

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

// =====================================================
// PAGE ROUTES
// IMPORTANT:
// These must match Appweb.jsx routes.
// =====================================================

const PAGE_ROUTES = {
  Home: "",
  Product: "product",
  Project: "project",
  Service: "service",
  Shop: "shop",
  Blog: "blog",
  Gallery: "gallery",
  About: "about",
  Contact: "contact",
};

// =====================================================
// EMPTY SEO FORM
// =====================================================

const emptySeo = {
  page: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  canonicalUrl: "",
  altText: "",
};

// =====================================================
// SEO COMPONENT
// =====================================================

const Seo = () => {
  // ===================================================
  // STATES
  // ===================================================

  const [showForm, setShowForm] = useState(false);

  const [seoList, setSeoList] = useState([]);

  const [editIndex, setEditIndex] = useState(null);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [seoData, setSeoData] = useState(emptySeo);

  // ===================================================
  // LOAD SEO WHEN PAGE OPENS
  // ===================================================

  useEffect(() => {
    loadSeo();
  }, []);

  // ===================================================
  // LOAD SEO DATA
  // ===================================================

  const loadSeo = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}?t=${Date.now()}`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load SEO data: ${response.status}`
        );
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setSeoList(data);
      } else {
        setSeoList([]);
      }
    } catch (error) {
      console.error(
        "Error loading SEO:",
        error
      );

      setSeoList([]);

      alert("Failed to load SEO data.");
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // GENERATE CANONICAL URL
  // ===================================================

  const generateCanonicalUrl = (page) => {
    const route = PAGE_ROUTES[page];

    if (route === undefined) {
      return "";
    }

    const baseUrl =
      SITE_URL.replace(/\/+$/, "");

    // HOME
    if (!route) {
      return `${baseUrl}/`;
    }

    // OTHER PAGES
    return `${baseUrl}/${route}`;
  };

  // ===================================================
  // VALIDATE CANONICAL URL
  // ===================================================

  const isValidCanonicalUrl = (value) => {
    if (!value || !value.trim()) {
      return false;
    }

    try {
      const url = new URL(
        value.trim()
      );

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

  // ===================================================
  // HANDLE INPUT CHANGE
  // ===================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setSeoData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===================================================
  // HANDLE PAGE CHANGE
  // ===================================================

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

  // ===================================================
  // RESET FORM
  // ===================================================

  const resetForm = () => {
    setSeoData({
      ...emptySeo,
    });

    setEditIndex(null);

    setShowForm(false);
  };

  // ===================================================
  // SAVE / UPDATE SEO
  // ===================================================

  const handleSave = async () => {
    // -----------------------------------------------
    // VALIDATE REQUIRED FIELDS
    // -----------------------------------------------

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

    // -----------------------------------------------
    // CANONICAL URL
    // -----------------------------------------------

    let finalCanonicalUrl =
      seoData.canonicalUrl.trim();

    // Automatically generate if empty
    if (!finalCanonicalUrl) {
      finalCanonicalUrl =
        generateCanonicalUrl(
          seoData.page
        );
    }

    // -----------------------------------------------
    // VALIDATE CANONICAL URL
    // -----------------------------------------------

    if (
      !isValidCanonicalUrl(
        finalCanonicalUrl
      )
    ) {
      alert(
        "Please enter a valid Canonical URL.\n\nExample:\nhttps://theroyalkraft.com/about"
      );

      return;
    }

    // -----------------------------------------------
    // CREATE PAYLOAD
    // -----------------------------------------------

    const payload = {
      ...(seoData.id
        ? {
            id: seoData.id,
          }
        : {}),

      page: seoData.page.trim(),

      metaTitle:
        seoData.metaTitle.trim(),

      metaDescription:
        seoData.metaDescription.trim(),

      metaKeywords:
        seoData.metaKeywords.trim(),

      canonicalUrl:
        finalCanonicalUrl,

      altText:
        seoData.altText.trim(),
    };

    try {
      setSaving(true);

      let response;

      // =================================================
      // UPDATE
      // =================================================

      if (editIndex !== null) {
        response = await fetch(
          API_URL,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Accept:
                "application/json",
            },

            body: JSON.stringify(
              payload
            ),
          }
        );
      }

      // =================================================
      // CREATE
      // =================================================

      else {
        response = await fetch(
          API_URL,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Accept:
                "application/json",
            },

            body: JSON.stringify(
              payload
            ),
          }
        );
      }

      // =================================================
      // READ RESPONSE
      // =================================================

      const result =
        await response.json();

      // =================================================
      // ERROR
      // =================================================

      if (!response.ok) {
        alert(
          result.message ||
            "Something went wrong while saving SEO."
        );

        return;
      }

      // =================================================
      // SUCCESS
      // =================================================

      alert(
        result.message ||
          (
            editIndex !== null
              ? "SEO updated successfully."
              : "SEO saved successfully."
          )
      );

      // Reload latest data
      await loadSeo();

      // Reset form
      resetForm();
    } catch (error) {
      console.error(
        "Error saving SEO:",
        error
      );

      alert(
        "Failed to save SEO."
      );
    } finally {
      setSaving(false);
    }
  };

  // ===================================================
  // EDIT SEO
  // ===================================================

  const handleEdit = (item) => {
    const savedCanonical =
      item.canonicalUrl?.trim() ||
      "";

    const canonicalUrl =
      isValidCanonicalUrl(
        savedCanonical
      )
        ? savedCanonical
        : generateCanonicalUrl(
            item.page
          );

    setSeoData({
      id: item.id || "",

      page: item.page || "",

      metaTitle:
        item.metaTitle || "",

      metaDescription:
        item.metaDescription || "",

      metaKeywords:
        item.metaKeywords || "",

      canonicalUrl,

      altText:
        item.altText || "",
    });

    // IMPORTANT:
    // Store ID in editIndex because
    // PUT request needs the record ID.

    setEditIndex(
      item.id || null
    );

    setShowForm(true);
  };

  // ===================================================
  // DELETE SEO
  // ===================================================

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this SEO record?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      setSaving(true);

      const response =
        await fetch(
          API_URL,
          {
            method: "DELETE",

            headers: {
              "Content-Type":
                "application/json",

              Accept:
                "application/json",
            },

            body: JSON.stringify({
              id,
            }),
          }
        );

      const result =
        await response.json();

      // =================================================
      // ERROR
      // =================================================

      if (!response.ok) {
        alert(
          result.message ||
            "Failed to delete SEO."
        );

        return;
      }

      // =================================================
      // SUCCESS
      // =================================================

      alert(
        result.message ||
          "SEO deleted successfully."
      );

      // Reload latest data
      await loadSeo();
    } catch (error) {
      console.error(
        "Delete Error:",
        error
      );

      alert(
        "Failed to delete SEO."
      );
    } finally {
      setSaving(false);
    }
  };

  // ===================================================
  // ADD SEO
  // ===================================================

  const handleAddSeo = () => {
    setSeoData({
      ...emptySeo,
    });

    setEditIndex(null);

    setShowForm(true);
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="seo-container">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="seo-header">

        <h2>
          SEO Management
        </h2>

        <button
          className="add-btn"
          onClick={handleAddSeo}
        >
          + Add SEO
        </button>

      </div>

      {/* =================================================
          FORM
      ================================================= */}

      {showForm && (
        <div className="seo-form">

          <h3>
            {editIndex !== null
              ? "Edit SEO"
              : "Add SEO"}
          </h3>

          {/* =============================================
              PAGE
          ============================================== */}

          <select
            name="page"
            value={seoData.page}
            onChange={handlePageChange}
            disabled={
              editIndex !== null
            }
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

          {/* =============================================
              META TITLE
          ============================================== */}

          <input
            type="text"
            name="metaTitle"
            placeholder="Meta Title"
            value={
              seoData.metaTitle
            }
            onChange={handleChange}
          />

          {/* =============================================
              META DESCRIPTION
          ============================================== */}

          <textarea
            name="metaDescription"
            placeholder="Meta Description"
            value={
              seoData.metaDescription
            }
            onChange={handleChange}
            rows="4"
          />

          {/* =============================================
              META KEYWORDS
          ============================================== */}

          <input
            type="text"
            name="metaKeywords"
            placeholder="Meta Keywords"
            value={
              seoData.metaKeywords
            }
            onChange={handleChange}
          />

          {/* =============================================
              CANONICAL URL
          ============================================== */}

          <input
            type="url"
            name="canonicalUrl"
            placeholder="Canonical URL"
            value={
              seoData.canonicalUrl
            }
            onChange={handleChange}
          />

          {/* =============================================
              CANONICAL HELP
          ============================================== */}

          {seoData.page && (
            <small className="canonical-help">

              Recommended Canonical URL:

              {" "}

              {generateCanonicalUrl(
                seoData.page
              )}

            </small>
          )}

          {/* =============================================
              ALT TEXT
          ============================================== */}

          <input
            type="text"
            name="altText"
            placeholder="Alternative Text"
            value={
              seoData.altText
            }
            onChange={handleChange}
          />

          {/* =============================================
              BUTTONS
          ============================================== */}

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

      {/* =================================================
          TABLE
      ================================================= */}

      <table className="seo-table">

        <thead>

          <tr>

            <th>
              Page
            </th>

            <th>
              Meta Title
            </th>

            <th>
              Description
            </th>

            <th>
              Keywords
            </th>

            <th>
              Canonical URL
            </th>

            <th>
              Alt Text
            </th>

            <th>
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {/* =============================================
              LOADING
          ============================================== */}

          {loading ? (
            <tr>

              <td
                colSpan="7"
                align="center"
              >
                Loading...
              </td>

            </tr>
          )

          /* =============================================
             NO DATA
          ============================================== */

          : seoList.length === 0 ? (
            <tr>

              <td
                colSpan="7"
                align="center"
              >
                No SEO Data Found
              </td>

            </tr>
          )

          /* =============================================
             DATA
          ============================================== */

          : (
            seoList.map(
              (item) => (

                <tr
                  key={item.id}
                >

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

                    {/* =================================
                        EDIT
                    ================================== */}

                    <button
                      className="edit-btn"
                      onClick={() =>
                        handleEdit(item)
                      }
                      disabled={saving}
                    >
                      Edit
                    </button>

                    {/* =================================
                        DELETE
                    ================================== */}

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(
                          item.id
                        )
                      }
                      disabled={saving}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              )
            )
          )}

        </tbody>

      </table>

    </div>
  );
};

export default Seo;