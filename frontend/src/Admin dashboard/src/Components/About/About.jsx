import React, { useEffect, useState } from "react";
import "./About.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/about-page";

const About = () => {
  const [showForm, setShowForm] = useState(false);

  const [abouts, setAbouts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
  slideImage: null,
  slidePreview: "",

  name: "",
  description: "",

  storyImage: null,
  storyPreview: "",

  founderImage: null,
  founderPreview: "",

  lifeImage: null,
  lifePreview: "",
});

  useEffect(() => {
    loadAbout();
  }, []);

  // ==============================
  // Load About Data
  // ==============================
  const loadAbout = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load About data.");
      }

      const data = await response.json();

      setAbouts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setAbouts([]);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // Convert Image To Base64
  // ==============================
  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);

      reader.onerror = (error) => reject(error);
    });

  // ==============================
  // Slide Image Upload
  // ==============================
  const handleSlideImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setForm((prev) => ({
      ...prev,
      slideImage: file,
      slidePreview: URL.createObjectURL(file),
    }));
  };

  const handleStoryImage = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setForm((prev) => ({
    ...prev,
    storyImage: file,
    storyPreview: URL.createObjectURL(file),
  }));
};

const handleFounderImage = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setForm((prev) => ({
    ...prev,
    founderImage: file,
    founderPreview: URL.createObjectURL(file),
  }));
};

const handleLifeImage = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setForm((prev) => ({
    ...prev,
    lifeImage: file,
    lifePreview: URL.createObjectURL(file),
  }));
};

  // ==============================
  // Reset Form
  // ==============================
   const resetForm = () => {
  setForm({
    slideImage: null,
    slidePreview: "",

    name: "",
    description: "",

    storyImage: null,
    storyPreview: "",

    founderImage: null,
    founderPreview: "",

    lifeImage: null,
    lifePreview: "",
  });

  setShowForm(false);
};
    // ==============================
  // Save About
  // ==============================
  const saveAbout = async () => {
    try {
      setSaving(true);

      let slideBase64 = "";
let storyBase64 = "";
let founderBase64 = "";
let lifeBase64 = "";
      // Convert only if image selected
      if (form.slideImage) {
        slideBase64 = await convertToBase64(form.slideImage);
      }

      if (form.storyImage) {
    storyBase64 = await convertToBase64(form.storyImage);
}

if (form.founderImage) {
    founderBase64 = await convertToBase64(form.founderImage);
}

if (form.lifeImage) {
    lifeBase64 = await convertToBase64(form.lifeImage);
}

      const payload = {
  slideImage: slideBase64,

  storyImage: storyBase64,

  founderImage: founderBase64,

  lifeImage: lifeBase64,

  name: form.name.trim(),
  description: form.description.trim(),
};

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save About section.");
      }

      await loadAbout();

      resetForm();

      alert("About section saved successfully.");
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // Delete About
  // ==============================
  const deleteAbout = async (id) => {
    if (!window.confirm("Delete this About section?")) return;

    try {
      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      await loadAbout();

      alert("Deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  };
    return (
    <div className="about-page">
      <div className="header">
        <h2>About Page</h2>

        <button onClick={() => setShowForm(true)}>
          + Add Image
        </button>
      </div>

      {showForm && (
        <div className="upload-box">

          <label className="upload-title">
            Slide Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleSlideImage}
          />

          {form.slidePreview && (
            <img
              src={form.slidePreview}
              alt="Slide Preview"
              className="preview-image"
            />
          )}

          <label className="upload-title">
            About Name
          </label>

          <input
            type="text"
            placeholder="Enter About Name"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />

          <label className="upload-title">
            About Description
          </label>

          <textarea
            rows="5"
            placeholder="Enter About Description"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />

          <label className="upload-title">
  Our Story Image
</label>

<input
  type="file"
  accept="image/*"
  onChange={handleStoryImage}
/>

{form.storyPreview && (
  <img
    src={form.storyPreview}
    alt="Story"
    className="preview-image"
  />
)}

<label className="upload-title">
  Founder's Vision Image
</label>

<input
  type="file"
  accept="image/*"
  onChange={handleFounderImage}
/>

{form.founderPreview && (
  <img
    src={form.founderPreview}
    alt="Founder"
    className="preview-image"
  />
)}

<label className="upload-title">
  Life at Royal Craft Image
</label>

<input
  type="file"
  accept="image/*"
  onChange={handleLifeImage}
/>

{form.lifePreview && (
  <img
    src={form.lifePreview}
    alt="Life"
    className="preview-image"
  />
)}

          <div className="btns">
            <button
              onClick={saveAbout}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>

            <button
              onClick={resetForm}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="table-container">
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              fontSize: "18px",
            }}
          >
            Loading About Data...
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Slide Image</th>
                <th>About Name</th>
                <th>Description</th>
                <th>Our Story</th>
                <th>Founder Vision</th>
                <th>Life at Royal Craft</th>
                <th>Action</th>
                
              </tr>
            </thead>

            <tbody>
              {abouts.length > 0 ? (
                abouts.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>

                    <td>
                      {item.slideImage ? (
                        <img
                          src={item.slideImage}
                          alt="Slide"
                          className="preview-image"
                        />
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>
                      {item.name || "-"}
                    </td>

                    <td
                      style={{
                        maxWidth: "350px",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {item.description || "-"}
                    </td>

                    <td>
  {item.storyImage ? (
    <img
      src={item.storyImage}
      alt="Story"
      className="preview-image"
    />
  ) : (
    "-"
  )}
</td>

<td>
  {item.founderImage ? (
    <img
      src={item.founderImage}
      alt="Founder"
      className="preview-image"
    />
  ) : (
    "-"
  )}
</td>

<td>
  {item.lifeImage ? (
    <img
      src={item.lifeImage}
      alt="Life"
      className="preview-image"
    />
  ) : (
    "-"
  )}
</td>

                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => deleteAbout(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                   colSpan="8"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#777",
                    }}
                  >
                    No About data found.
                    <br />
                    Click <strong>+ Add Image</strong> to upload your first About section.
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

export default About;