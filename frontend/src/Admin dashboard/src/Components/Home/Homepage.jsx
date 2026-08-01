import React, { useState, useEffect } from "react";
import "./Homepage.css";

 const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/home";

const Homepage = () => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
const [editId, setEditId] = useState(null);

 const [form, setForm] = useState({
  image: null,
  preview: "",
  name: "",
  description: "",
});
  const [images, setImages] = useState([]);

  useEffect(() => {
    loadImages();
  }, []);

  // ===========================
  // Convert Image To Base64
  // ===========================

  const handleImage = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  setForm((prev) => ({
    ...prev,
    image: file,
    preview: URL.createObjectURL(file),
  }));
};

             
  // ===========================
  // Load Images
  // ===========================

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
      alert("Unable to load homepage data.");
    } finally {
      setLoading(false);
    }
  };

  const uploadToS3 = async (file) => {

  const response = await fetch(
    `${API_URL}?upload=true&fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}`
  );

  if (!response.ok) {
    throw new Error("Unable to get upload URL");
  }

  const uploadData = await response.json();

  await fetch(uploadData.uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  return uploadData.imageUrl;
};
    // ===========================
  // Save Image
  // ===========================

   const saveImage = async () => {

  if (!form.image || !form.name.trim()) {
    alert("Please select an image.");
    return;
  }

  try {

    setLoading(true);

    const imageUrl = await uploadToS3(form.image);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: imageUrl,
        name: form.name,
        description: form.description,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    alert("Saved Successfully");

    await loadImages();

    resetForm();

  } catch (err) {

    console.error(err);

    alert(err.message);

  } finally {

    setLoading(false);

  }

};

  const editImage = (item) => {
  setShowForm(true);
  setIsEditing(true);
  setEditId(item.id);

  setForm({
    image: null,
    preview: item.image,
    base64: "",
    name: item.name,
    description: item.description,
  });
};

const updateImage = async () => {

  try {

    setLoading(true);

    let imageUrl = form.preview;

    if (form.image) {
      imageUrl = await uploadToS3(form.image);
    }

    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editId,
        image: imageUrl,
        name: form.name,
        description: form.description,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    alert("Updated Successfully");

    await loadImages();

    resetForm();

  } catch (err) {

    console.error(err);

    alert(err.message);

  } finally {

    setLoading(false);

  }

};
  // ===========================
  // Delete Image
  // ===========================

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

  // ===========================
  // Reset Form
  // ===========================

  const resetForm = () => {

  setForm({
    image: null,
    preview: "",
    name: "",
    description: "",
  });

  setShowForm(false);
  setIsEditing(false);
  setEditId(null);

};
    return (
    <div className="homepage">

      {/* Header */}
      <div className="header">

        <h2>Homepage</h2>

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
  onClick={isEditing ? updateImage : saveImage}
  disabled={loading}
>
  {loading
    ? "Saving..."
    : isEditing
    ? "Update"
    : "Save"}
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
                      src={item.image}
                      alt={item.name}
                      className="preview-image"
                    />

                  </td>

                  <td>Image</td>

                  <td>{item.name}</td>

                  <td>{item.description}</td>

                  <td>
                    {item.created
                      ? new Date(item.created).toLocaleDateString("en-GB")
                      : "-"}
                  </td>

                  <td>
  <div className="action-buttons">
    <button
      className="edit-btn"
      onClick={() => editImage(item)}
      disabled={loading}
    >
      Edit
    </button>

    <button
      className="delete-btn"
      onClick={() => deleteImage(item.id)}
      disabled={loading}
    >
      Delete
    </button>
  </div>
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
            padding: "40px",
            color: "#777",
            fontSize: "18px",
          }}
        >
          No homepage images found.
        </div>

      )}

    </div>

  );

};

export default Homepage;