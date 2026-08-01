import React, { useState, useEffect } from "react";
import "./AboutPage.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/about";

const AboutPage = () => {

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    image: null,
    preview: "",
    base64: "",
    name: "",
    description: "",
  });

  const [images, setImages] = useState([]);

  useEffect(() => {
    loadImages();
  }, []);

  // =====================================
  // Convert Image To Base64
  // =====================================

  const handleImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {

      setForm({
        ...form,
        image: file,
        preview: URL.createObjectURL(file),
        base64: reader.result,
      });

    };

    reader.readAsDataURL(file);

  };

  // =====================================
  // Load Images
  // =====================================

  const loadImages = async () => {

    try {

      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load data");
      }

      const data = await response.json();

      setImages(data);

    } catch (err) {

      console.error(err);

      alert("Unable to load About Page data.");

    } finally {

      setLoading(false);

    }

  };
    // =====================================
  // Save Image
  // =====================================

  const saveImage = async () => {

    if (!form.base64) {
      alert("Please upload an image.");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: form.base64,
          name: form.name,
          description: form.description,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Upload failed");
      }

      alert("About page image saved successfully.");

      await loadImages();

      resetForm();

    } catch (err) {

      console.error(err);

      alert(err.message);

    } finally {

      setLoading(false);

    }

  }; 

  // =====================================
  // Delete Image
  // =====================================

  const deleteImage = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image?"
    );

    if (!confirmDelete) return;

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
        throw new Error(result.message || "Delete failed");
      }

      alert("Deleted successfully.");

      await loadImages();

    } catch (err) {

      console.error(err);

      alert(err.message);

    } finally {

      setLoading(false);

    }

  };

  // =====================================
  // Reset Form
  // =====================================

  const resetForm = () => {

    setForm({
      image: null,
      preview: "",
      base64: "",
      name: "",
      description: "",
    });

    setShowForm(false);

  };
    return (
    <div className="homepage">

      {/* Header */}
      <div className="header">

        <h2>About Page</h2>

        <button
          onClick={() => setShowForm(true)}
          disabled={loading}
        >
          + Add Image
        </button>

      </div>

      {/* Upload Form */}

      {showForm && (

        <div className="upload-box">

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
          />

          {form.preview && (

            <div className="image-preview">

              <img
                src={form.preview}
                alt="Preview"
                className="preview-image"
              />

            </div>

          )}

          <input
            type="text"
            placeholder="Image Name"
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
            placeholder="Image Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          <div className="btns">

            <button
              onClick={saveImage}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
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

      {/* Loading */}

      {loading && (

        <div className="loading">

          Loading...

        </div>

      )}

      {/* Table */}

      {images.length > 0 && (

        <div className="table-container">

          <table>

            <thead>

              <tr>

                <th>No</th>
                <th>Preview</th>
                <th>Type</th>
                <th>Name</th>
                <th>Description</th>
                <th>Created</th>
                <th>Action</th>

              </tr>

            </thead>

            <tbody>
                            {images.map((item, index) => (

                <tr key={item.id}>

                  <td>{index + 1}</td>

                  <td>
                    <img
                      src={item.image || item.preview}
                      alt={item.name}
                      className="preview-image"
                    />
                  </td>

                  <td>Image</td>

                  <td>{item.name}</td>

                  <td>{item.description}</td>

                  <td>{item.created}</td>

                  <td>

                    <button
                      className="delete-btn"
                      onClick={() => deleteImage(item.id)}
                      disabled={loading}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

      {!loading && images.length === 0 && (

        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
            color: "#777",
            fontSize: "16px",
          }}
        >
          No About images uploaded yet.
        </div>

      )}

    </div>

  );

};

export default AboutPage;