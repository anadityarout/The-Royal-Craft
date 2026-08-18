import React, { useState, useEffect } from "react";
import "./ChooseAdmin.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/choose";

const ChooseAdmin = () => {
  // ================= States =================

  const [showForm, setShowForm] = useState(false);

  const [mediaType, setMediaType] = useState("");

  const [file, setFile] = useState(null);

  const [preview, setPreview] = useState("");

  const [mediaList, setMediaList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

const [editId, setEditId] = useState(null);

  // ================= Load Media =================

  const loadMedia = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      const data = await response.json();

      setMediaList(data);

    } catch (error) {
      console.error("Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  // ================= File Upload =================

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);

    setPreview(URL.createObjectURL(selectedFile));
  };

  // ================= Save =================

  // ================= Save / Update =================

const handleSave = async () => {

  if (!mediaType) {
  alert("Please select media type.");
  return;
}

if (!isEditing && !file) {
  alert("Please upload a file.");
  return;
}

  try {

    setLoading(true);

    let fileUrl = preview;

    if (file) {

      const uploadResponse = await fetch(
        `${API_URL}?upload=true&fileName=${encodeURIComponent(
          file.name
        )}&fileType=${encodeURIComponent(file.type)}`
      );

      const uploadData = await uploadResponse.json();

      await fetch(uploadData.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      fileUrl = uploadData.fileUrl;

    }

    const response = await fetch(API_URL, {

      method: isEditing ? "PUT" : "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({

        id: editId,

        type: mediaType,

        url: fileUrl,

      }),

    });

    if (!response.ok) {

      throw new Error("Save failed");

    }

    await loadMedia();

    resetForm();

    alert(
      isEditing
        ? "Media updated successfully."
        : "Media uploaded successfully."
    );

  } catch (error) {

    console.error(error);

    alert(error.message);

  } finally {

    setLoading(false);

  }

};
    // ================= Delete =================

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this media?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      alert("Media deleted successfully.");

      loadMedia();

    } catch (error) {
      console.error("Delete Error:", error);

      alert("Delete failed.");
    }
  };

  // ================= Edit =================

const handleEdit = (item) => {

  setIsEditing(true);

  setEditId(item.id);

  setMediaType(item.type);

  setPreview(item.url);

  setFile(null);

  setShowForm(true);

};
// ================= Reset =================

const resetForm = () => {

  setShowForm(false);

  setMediaType("");

  setFile(null);

  setPreview("");

  setIsEditing(false);

  setEditId(null);

};

  return (
    <div className="choose-admin">

      {/* ================= Header ================= */}

      <div className="table-header">

        <h1>Choose Us Admin</h1>

        <button
          className="add-btn"
          onClick={() => {

  resetForm();

  setShowForm(true);

}}
        >
          + Add Media
        </button>

      </div>

      {/* ================= Add Media Form ================= */}

      {showForm && (

        <div className="section">

          <h3>
  {isEditing ? "Edit Media" : "Add New Media"}
</h3>

          {/* Media Type */}

          <div className="form-group">

            <label>Media Type</label>

            <select
              value={mediaType}
              onChange={(e) => {
                setMediaType(e.target.value);
                setFile(null);
                setPreview("");
              }}
            >
              <option value="">Select Media Type</option>
              <option value="Image">Image</option>
              <option value="Video">Video</option>
            </select>

          </div>

          {/* Upload */}

          {mediaType && (

            <div className="form-group">

              <label>
                Upload {mediaType}
              </label>

              <input
                type="file"
                accept={
                  mediaType === "Image"
                    ? "image/*"
                    : "video/*"
                }
                onChange={handleFile}
              />

            </div>

          )}
                    {/* ================= Preview ================= */}

          {preview && mediaType === "Image" && (

            <img
              src={preview}
              alt="Preview"
              className="preview-image"
            />

          )}

          {preview && mediaType === "Video" && (

            <video
              src={preview}
              controls
              className="preview-video"
            />

          )}

          {/* ================= Save Button ================= */}

          <div className="save-section">

            <button
  className="save-btn"
  onClick={handleSave}
  disabled={loading}
>
              {loading
  ? isEditing
    ? "Updating..."
    : "Saving..."
  : isEditing
  ? "Update Media"
  : "Save Media"}
            </button>

            <button
              className="delete-btn"
              style={{ marginLeft: "10px" }}
              onClick={resetForm}
            >
              Cancel
            </button>

          </div>

        </div>

      )}

      {/* ================= Saved Media ================= */}

      <div className="section">

        <div className="table-header">

          <h3>Saved Media</h3>

        </div>

        <table className="project-table">

          <thead>

            <tr>
              <th>No</th>
              <th>Type</th>
              <th>Preview</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan="4"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  Loading...
                </td>

              </tr>

            ) : mediaList.length === 0 ? (

              <tr>

                <td
                  colSpan="4"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  No Media Found
                </td>

              </tr>

            ) : (
                            mediaList.map((item, index) => (

                <tr key={item.id}>

                  <td>{index + 1}</td>

                  <td>{item.type}</td>

                  <td>

                    {item.type === "Image" ? (

                      <img
                        src={item.url}
                        alt="Preview"
                        className="table-image"
                      />

                    ) : (

                      <video
                        src={item.url}
                        controls
                        className="table-video"
                      />

                    )}

                  </td>

                  <td>

  <button
    className="edit-btn"
    onClick={() => handleEdit(item)}
    disabled={loading}
  >
    Edit
  </button>

  <button
    className="delete-btn"
    onClick={() => handleDelete(item.id)}
    disabled={loading}
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

    </div>
  );
};

export default ChooseAdmin;