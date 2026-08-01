import React, { useState, useEffect } from "react";
import "./ProductPage.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/product";

const ProductPage = () => {

  const categories = [
    "Exterior",
    "Fiber Mandap",
    "Fiber Gate",
    "Fiber Work",
    "Fiber Stage",
    "Fountain",
    "Gazebo",
    "Interior",
    "Urli",
    "Statue",
  ];

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    category: "",
    image: null,
    preview: "",
    base64: "",
    name: "",
    description: "",
    date: "",
  });

  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  // =====================================
  // Convert Image To Base64
  // =====================================

  const handleImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {

      setForm((prev) => ({
        ...prev,
        image: file,
        preview: URL.createObjectURL(file),
        base64: reader.result,
      }));

    };

    reader.readAsDataURL(file);

  };

  // =====================================
  // Load Products
  // =====================================

  const loadProducts = async () => {

    try {

      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load products.");
      }

      const data = await response.json();

      setProducts(data);

    } catch (err) {

      console.error(err);

      alert("Unable to load Product data.");

    } finally {

      setLoading(false);

    }

  };
    // =====================================
  // Save Product
  // =====================================

  const saveProduct = async () => {

    if (
      !form.category ||
      !form.base64 ||
      !form.name.trim() ||
      !form.date
    ) {
      alert("Please fill all required fields.");
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
          category: form.category,
          image: form.base64,
          name: form.name,
          description: form.description,
          date: form.date,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Upload failed");
      }

      alert("Product saved successfully.");

      await loadProducts();

      resetForm();

    } catch (err) {

      console.error(err);

      alert(err.message);

    } finally {

      setLoading(false);

    }

  };

  // =====================================
  // Delete Product
  // =====================================

  const deleteProduct = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
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

      alert("Product deleted successfully.");

      await loadProducts();

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
      category: "",
      image: null,
      preview: "",
      base64: "",
      name: "",
      description: "",
      date: "",
    });

    setShowForm(false);

  };
    return (
    <div className="productpage">

      {/* Header */}

      <div className="header">

        <h2>Product Page</h2>

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

          <select
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
              })
            }
          >
            <option value="">Select Category</option>

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
            placeholder="Product Name"
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
            placeholder="Product Description"
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

            <button
              onClick={saveProduct}
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

      {/* Product Table */}

      {products.length > 0 && (

        <div className="table-container">

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
                            {products.map((item, index) => (

                <tr key={item.id}>

                  <td>{index + 1}</td>

                  <td>
                    <img
                      src={item.image || item.preview}
                      alt={item.name}
                      className="preview-image"
                    />
                  </td>

                  <td>{item.category}</td>

                  <td>Image</td>

                  <td>{item.name}</td>

                  <td>{item.description}</td>

                  <td>{item.date}</td>

                  <td>

                    <button
                      className="delete-btn"
                      onClick={() => deleteProduct(item.id)}
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

      {!loading && products.length === 0 && (

        <div
          style={{
            textAlign: "center",
            marginTop: "40px",
            color: "#777",
            fontSize: "16px",
          }}
        >
          No Products uploaded yet.
        </div>

      )}

    </div>

  );

};

export default ProductPage;