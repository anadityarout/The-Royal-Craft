import React, { useEffect, useState } from "react";
import "./Gallery.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/gallery";

const Gallery = () => {

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    image: null,
    preview: "",
    primaryName: "",
    secondaryName: "",
    description: "",
  });

  const [gallery, setGallery] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load gallery");
      }

      const data = await response.json();

      setGallery(data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }
  };

  const handleImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setForm((prev) => ({
      ...prev,
      image: file,
      preview: URL.createObjectURL(file),
    }));
  };

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {

      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);

      reader.onerror = (error) => reject(error);

    });
      const resetForm = () => {
    setForm({
      image: null,
      preview: "",
      primaryName: "",
      secondaryName: "",
      description: "",
    });
  };

  const saveGallery = async () => {

    if (!form.image) {
      alert("Please upload an image.");
      return;
    }

    try {

      const base64Image = await convertToBase64(form.image);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64Image,
          primaryName: form.primaryName,
          secondaryName: form.secondaryName,
          description: form.description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      await loadGallery();

      resetForm();

      setShowForm(false);

      alert("Gallery image uploaded successfully.");

    } catch (err) {

      console.log(err);

      alert("Upload failed.");

    }
  };

  const deleteGallery = async (id) => {

    if (!window.confirm("Delete this image?")) return;

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

      await loadGallery();

    } catch (err) {

      console.log(err);

      alert("Delete failed.");

    }

  };

  return (

    <div className="gallery-page">

      <div className="header">

        <h2>Gallery Page</h2>

        <button onClick={() => setShowForm(true)}>
          + Add Image
        </button>

      </div>

      {showForm && (

        <div className="upload-box">

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
          />

          <input
            type="text"
            placeholder="Primary Name (Optional)"
            value={form.primaryName}
            onChange={(e) =>
              setForm({
                ...form,
                primaryName: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Secondary Name (Optional)"
            value={form.secondaryName}
            onChange={(e) =>
              setForm({
                ...form,
                secondaryName: e.target.value,
              })
            }
          />

          <textarea
            rows="4"
            placeholder="Description (Optional)"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          <div className="btns">

            <button onClick={saveGallery}>
              Save
            </button>

            <button
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
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
                        className="delete-btn"
                        onClick={() => deleteGallery(item.id)}
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