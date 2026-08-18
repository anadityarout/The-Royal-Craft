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
  name: "",
  description: "",
  date: "",
});

  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  // =====================================
  // Convert Image To remove Base64
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
    // =====================================
  // Save Product
  // =====================================

  const saveProduct = async () => {

  if (

    !form.category ||

    !form.name.trim() ||

    !form.date ||

    (!isEditing && !form.image)

  ) {

    alert("Please fill all required fields.");

    return;

  }

  try {

    setLoading(true);

    let imageUrl = form.preview;

    if (form.image) {

      imageUrl = await uploadImage(form.image);

    }

    const response = await fetch(API_URL, {

      method: isEditing ? "PUT" : "POST",

      headers: {

        "Content-Type": "application/json",

      },

      body: JSON.stringify({

        id: editId,

        category: form.category,

        image: imageUrl,

        name: form.name,

        description: form.description,

        date: form.date,

      }),

    });

    const result = await response.json();

    if (!response.ok) {

      throw new Error(result.message);

    }

    await loadProducts();

    resetForm();

    alert(

      isEditing

        ? "Product updated successfully."

        : "Product saved successfully."

    );

  } catch (err) {

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

    name: "",

    description: "",

    date: "",

  });

  setIsEditing(false);

  setEditId(null);

  setShowForm(false);

};

const editProduct = (item) => {

  setIsEditing(true);

  setEditId(item.id);

  setForm({

    category: item.category,

    image: null,

    preview: item.image,

    name: item.name,

    description: item.description,

    date: item.date,

  });

  setShowForm(true);

};
    return (
    <div className="productpage">

      {/* Header */}

      <div className="header">

        <h2>Product Page</h2>

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
  className="edit-btn"
  onClick={() => editProduct(item)}
  disabled={loading}
>
  Edit
</button>

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