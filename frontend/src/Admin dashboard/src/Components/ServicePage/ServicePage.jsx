import React, { useEffect, useState } from "react";
import "./ServicePage.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/service";

const ServicePage = () => {
  const categories = [
    "Air Conditioning",
    "Architectural Layout",
    "Electrical Lighting",
    "Fire Fighting",
    "MEP (Mechanical & Electrical & Plumbing)",
    "STP (Sewage Treatment Plants)",
  ];

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    category: "",
    image: null,
    preview: "",
    name: "",
    description: "",
    date: "",
  });

  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load services");
      }

      const data = await response.json();

      setServices(data);
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
      category: "",
      image: null,
      preview: "",
      name: "",
      description: "",
      date: "",
    });
  };

  const saveService = async () => {
    if (
      !form.category ||
      !form.image ||
      !form.name ||
      !form.description ||
      !form.date
    ) {
      alert("Please fill all fields.");
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
          category: form.category,
          image: base64Image,
          name: form.name,
          description: form.description,
          date: form.date,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save service");
      }

      await loadServices();

      resetForm();

      setShowForm(false);

      alert("Service added successfully.");

    } catch (err) {
      console.log(err);
      alert("Upload failed.");
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Delete this service?")) return;

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

      await loadServices();

    } catch (err) {
      console.log(err);
      alert("Delete failed.");
    }
  };

  return (
    <div className="servicepage">

      <div className="header">
        <h2>Service Page</h2>

        <button onClick={() => setShowForm(true)}>
          + Add Image
        </button>
      </div>

      {showForm && (
        <div className="upload-box">

          <select
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
              })
            }
          >
            <option value="">Select Service Category</option>

            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
          />

          <input
            type="text"
            placeholder="Service Name"
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
            placeholder="Service Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          <input
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm({
                ...form,
                date: e.target.value,
              })
            }
          />

          <div className="btns">

            <button onClick={saveService}>
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
            Loading services...
          </div>

        ) : (

          <table>

            <thead>
              <tr>
                <th>No</th>
                <th>Preview</th>
                <th>Category</th>
                <th>Type</th>
                <th>Name</th>
                <th>Description</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {services.length > 0 ? (

                services.map((item, index) => (

                  <tr key={item.id}>

                    <td>{index + 1}</td>

                    <td>

                      <img
                        src={item.image}
                        alt={item.name}
                        className="preview-image"
                      />

                    </td>

                    <td>

                      <span className="category-badge">
                        {item.category}
                      </span>

                    </td>

                    <td>Image</td>

                    <td>{item.name}</td>

                    <td>{item.description}</td>

                    <td>{item.date}</td>

                    <td>

                      <button
                        className="delete-btn"
                        onClick={() => deleteService(item.id)}
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
                    }}
                  >
                    No services found.
                    <br />
                    Click <strong>+ Add Image</strong> to add your first service.
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

export default ServicePage;