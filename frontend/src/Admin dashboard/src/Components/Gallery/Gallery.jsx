import React, { useEffect, useState } from "react";
import "./Gallery.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/gallery";

const Gallery = () => {

  /* =====================================
     States
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

        throw new Error("Failed to load gallery.");

      }

      const data = await response.json();

      setGallery(Array.isArray(data) ? data : []);

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
      )}&fileType=${encodeURIComponent(file.type)}`

    );

    if (!response.ok) {

      throw new Error("Unable to get upload URL.");

    }

    const uploadData = await response.json();

    await fetch(uploadData.uploadUrl, {

      method: "PUT",

      headers: {

        "Content-Type": file.type,

      },

      body: file,

    });

    return uploadData.fileUrl;

  };

  /* =====================================
     Select Image
  ===================================== */

  const handleImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setForm((prev) => ({

      ...prev,

      image: file,

      preview: URL.createObjectURL(file),

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

      if (!isEditing && !form.image) {

        alert("Please upload an image.");

        return;

      }

      setLoading(true);

      // ==========================
      // Upload Image
      // ==========================

      let imageUrl = form.preview;

      if (form.image) {

        imageUrl = await uploadImage(form.image);

      }

      // ==========================
      // Payload
      // ==========================

      const payload = {

        id: editId,

        image: imageUrl,

        primaryName: form.primaryName,

        secondaryName: form.secondaryName,

        description: form.description,

      };

      // ==========================
      // Save / Update
      // ==========================

      const response = await fetch(API_URL, {

        method: isEditing ? "PUT" : "POST",

        headers: {

          "Content-Type": "application/json",

        },

        body: JSON.stringify(payload),

      });

      const result = await response.json();

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

      primaryName: item.primaryName || "",

      secondaryName: item.secondaryName || "",

      description: item.description || "",

    });

    setShowForm(true);

  };

  /* =====================================
     Delete Gallery
  ===================================== */

  const deleteGallery = async (id) => {

    if (!window.confirm("Delete this image?")) {

      return;

    }

    try {

      setLoading(true);

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

        throw new Error(

          result.message ||

          "Delete failed."

        );

      }

      await loadGallery();

      alert("Gallery deleted successfully.");

    } catch (err) {

      console.error(err);

      alert(err.message);

    } finally {

      setLoading(false);

    }

  };
  return (

<div className="gallery-page">

  {/* ===========================
      Header
  ============================ */}

  <div className="header">

    <h2>Gallery Page</h2>

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

  {/* ===========================
      Upload Form
  ============================ */}

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

      {form.preview && (

        <div
          style={{
            marginTop: "15px",
          }}
        >

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
        value={form.primaryName}
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
        value={form.secondaryName}
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
        value={form.description}
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
        {/* ===========================
          Gallery Table
      ============================ */}

      <div className="table-container">

        {loading ? (

          <div
            style={{
              textAlign: "center",
              padding: "40px",
              fontSize: "18px",
            }}
          >
            Loading gallery...
          </div>

        ) : (

          <table>

            <thead>

              <tr>

                <th>No</th>

                <th>Preview</th>

                <th>Primary Name</th>

                <th>Secondary Name</th>

                <th>Description</th>

                <th>Type</th>

                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {gallery.length > 0 ? (

                gallery.map((item, index) => (

                  <tr key={item.id}>

                    <td>{index + 1}</td>

                    <td>

                      <img
                        src={item.image}
                        alt={item.primaryName || "Gallery"}
                        className="preview-image"
                      />

                    </td>

                    <td>

                      {item.primaryName || "-"}

                    </td>

                    <td>

                      {item.secondaryName || "-"}

                    </td>

                    <td>

                      {item.description || "-"}

                    </td>

                    <td>Image</td>

                    <td>

                      <button
                        className="edit-btn"
                        onClick={() => editGallery(item)}
                        disabled={loading}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteGallery(item.id)
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
                      color: "#777",
                    }}
                  >

                    No gallery images found.

                    <br />

                    Click <strong>+ Add Image</strong> to upload your first image.

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        )}

      </div>

    </div>

  );

};

export default Gallery;