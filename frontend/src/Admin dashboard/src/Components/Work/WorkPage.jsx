import React, { useState, useEffect } from "react";
import "./WorkPage.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/work";

const WorkPage = () => {

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
  image: null,
  preview: "",
  imageUrl: "",
  name: "",
  description: "",
});

  const [images, setImages] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadImages();
  }, []);

  // =====================================
  // Convert Image To Base64
  // =====================================

 const handleImage = (e) => {

  const file = e.target.files[0];

  if (!file) return;

  setForm((prev) => ({
    ...prev,
    image: file,
    preview: URL.createObjectURL(file),
  }));

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

      alert("Unable to load Work Page data.");

    } finally {

      setLoading(false);

    }

  };
  

  
 // =====================================
// Save / Update Image
// =====================================

const saveImage = async () => {

  try {

    // Upload image only if user selected a new one
    let imageUrl = form.preview;

    if (form.image) {

      imageUrl = await uploadImage();

    }

    setLoading(true);

    const response = await fetch(API_URL, {

      method: isEditing ? "PUT" : "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({

        id: editId,

        image: imageUrl,

        name: form.name.trim(),

        description: form.description.trim(),

      }),

    });

    const result = await response.json();

    if (!response.ok) {

      throw new Error(
        result.message || "Operation failed"
      );

    }

    alert(

      isEditing
        ? "Work updated successfully."
        : "Work saved successfully."

    );

    await loadImages();

    resetForm();

  } catch (err) {

    console.error(err);

    alert(err.message);

  } finally {

    setLoading(false);

  }

};


const uploadImage = async () => {

  if (!form.image) {
    return form.preview;
  }

  // Get Upload URL

  const uploadResponse = await fetch(
    `${API_URL}?upload=true&fileName=${encodeURIComponent(form.image.name)}&fileType=${encodeURIComponent(form.image.type)}`
  );

  const uploadData = await uploadResponse.json();

  // Upload file directly to S3

  await fetch(uploadData.uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": form.image.type,
    },
    body: form.image,
  });

  return uploadData.fileUrl;

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
// Edit Image
// =====================================

const editImage = (item) => {

  setIsEditing(true);
  setEditId(item.id);

   setForm({
  image: null,
  preview: item.image,
  imageUrl: item.image,
  name: item.name,
  description: item.description,
});

  setShowForm(true);

};
  // =====================================
  // Reset Form
  // =====================================

  const resetForm = () => {

  setForm({
  image: null,
  preview: "",
  imageUrl: "",
  name: "",
  description: "",
});

  setIsEditing(false);
  setEditId(null);
  setShowForm(false);

};
    return (
    <div className="workpage">

      {/* Header */}

      <div className="header">

        <h2>Work Page</h2>

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
              {loading
  ? isEditing
    ? "Updating..."
    : "Saving..."
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
          No Work images uploaded yet.
        </div>

      )}

    </div>

  );

};

export default WorkPage;