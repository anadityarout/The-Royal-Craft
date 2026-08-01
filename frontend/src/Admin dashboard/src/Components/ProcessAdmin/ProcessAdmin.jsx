import React, { useState, useEffect } from "react";
import "./ProcessAdmin.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/process";

const ProcessAdmin = () => {

  // ================= Categories =================

  const categories = [
    "Design",
    "Module Making",
    "Fiber Crafting",
    "Finishing",
    "Quality Check",
    "Delivery & Installation",
  ];

  // ================= States =================

  const [showForm, setShowForm] = useState(false);

  const [category, setCategory] = useState("");

  const [processName, setProcessName] = useState("");

  const [description, setDescription] = useState("");

  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState("");

  const [processes, setProcesses] = useState([]);

  const [loading, setLoading] = useState(false);

  // ================= Load Processes =================

  useEffect(() => {
    loadProcesses();
  }, []);

  const loadProcesses = async () => {

    try {

      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load processes.");
      }

      const data = await response.json();

      setProcesses(data);

    } catch (error) {

      console.error(error);

      setProcesses([]);

    } finally {

      setLoading(false);

    }

  };
    // ================= Upload Image to S3 =================

  const uploadImage = async (file) => {

    const response = await fetch(
      `${API_URL}?upload=true&fileName=${encodeURIComponent(
        file.name
      )}&fileType=${encodeURIComponent(file.type)}`
    );

    if (!response.ok) {
      throw new Error("Unable to generate upload URL.");
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

    return uploadData.fileUrl;

  };

  // ================= Select Image =================

  const handleImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    setPreview(URL.createObjectURL(file));

  };
    // ================= Save Process =================

  const handleSave = async () => {

    if (!category) {
  alert("Please select a category.");
  return;
}

if (!image) {
  alert("Please upload an image.");
  return;
}
    try {

      setLoading(true);

      // Upload image to S3
      const imageUrl = await uploadImage(image);

      // Save process data
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          processName,
          description,
          image: imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to save process.");
      }

      // Reload latest data
      await loadProcesses();

      // Reset form
      setCategory("");
      setProcessName("");
      setDescription("");
      setImage(null);
      setPreview("");

      setShowForm(false);

      alert("Process saved successfully!");

    } catch (error) {

      console.error(error);

      alert("Failed to save process.");

    } finally {

      setLoading(false);

    }

  };
    // ================= Delete Process =================

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this process?"
    );

    if (!confirmDelete) return;

    try {

      setLoading(true);

      const response = await fetch(
        `${API_URL}?id=${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Unable to delete process.");
      }

      await loadProcesses();

      alert("Process deleted successfully!");

    } catch (error) {

      console.error(error);

      alert("Failed to delete process.");

    } finally {

      setLoading(false);

    }

  };
return (
  <div className="process-admin">

    {/* ================= Header ================= */}

    <div className="table-header">

      <h1>Process Admin</h1>

      <button
        className="add-btn"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Close Form" : "+ Add Process"}
      </button>

    </div>

    {/* ================= Add Process Form ================= */}

    {showForm && (

      <div className="section">

        <h3>Add New Process</h3>

        {/* Category */}

        <div className="form-group">

          <label>Category</label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >

            <option value="">Select Category</option>

            {categories.map((item, index) => (

              <option
                key={index}
                value={item}
              >
                {item}
              </option>

            ))}

          </select>

        </div>

        {/* Upload Image */}

        <div className="form-group">

          <label>Upload Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
          />

          {preview && (

            <img
              src={preview}
              alt="Preview"
              className="preview-image"
            />

          )}

        </div>

        {/* Process Name */}

        <div className="form-group">

          <label>Process Name</label>

          <input
            type="text"
            placeholder="Enter Process Name"
            value={processName}
            onChange={(e) =>
              setProcessName(e.target.value)
            }
          />

        </div>

        {/* Description */}

        <div className="form-group">

          <label>Description</label>

          <textarea
            rows="5"
            placeholder="Enter Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

        </div>

        <div className="save-section">

          <button
            className="save-btn"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Process"}
          </button>

        </div>

      </div>

    )}

    {/* ================= Saved Processes ================= */}
    <div className="section">

  <div className="table-header">

    <h3>Saved Processes</h3>

  </div>

  <table className="project-table">

    <thead>

      <tr>

        <th>No</th>

        <th>Preview</th>

        <th>Category</th>

        <th>Process Name</th>

        <th>Description</th>

        <th>Action</th>

      </tr>

    </thead>

    <tbody>

      {loading ? (

        <tr>

          <td
            colSpan="6"
            style={{
              textAlign: "center",
              padding: "30px",
            }}
          >
            Loading...
          </td>

        </tr>

      ) : processes.length === 0 ? (

        <tr>

          <td
            colSpan="6"
            style={{
              textAlign: "center",
              padding: "30px",
            }}
          >
            No Process Found
          </td>

        </tr>

      ) : (

        processes.map((process, index) => (

          <tr key={process.id}>
                        <td>{index + 1}</td>

            <td>

              <img
                src={process.image}
                alt={process.processName}
                className="table-image"
              />

            </td>

            <td>{process.category}</td>

            <td>{process.processName}</td>

            <td className="desc-cell">
              {process.description}
            </td>

            <td>

              <button
                className="delete-btn"
                onClick={() => handleDelete(process.id)}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
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

export default ProcessAdmin;