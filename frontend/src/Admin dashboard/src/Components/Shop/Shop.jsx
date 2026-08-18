import React, { useState, useEffect } from "react";
import "./Shop.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/shop-product";

const Shop = () => {

  // ==========================
  // Categories
  // ==========================

  const categories = [
    "Panels",
    "PVC Box",
    "PS Corner",
    "Ceiling Design",
    "Domes",
    "Spacer",
    "Decorative Elements",
    "Stage",
    "Mandap",
    "Food Court",
    "Front Elevation",
    "Main Gate",
    "Fountain",
    "Gazebo",
    "Statue",
    "Interior",
    "Exterior",
    "Railings",
    "Selfie Point",
  ];

  // ==========================
  // States
  // ==========================

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    category: "",
    primaryImage: null,
    primaryPreview: "",
    secondaryImages: [],
    name: "",
    overview: "",
    description: "",
    specifications: [],
  });

  // ==========================
  // Load Products
  // ==========================

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {

    try {

      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load products.");
      }

      const data = await response.json();

      setProducts(Array.isArray(data) ? data : []);

    } catch (err) {

      console.log(err);

      setProducts([]);

    } finally {

      setLoading(false);

    }

  };

  // ==========================
  // Upload Image To S3
  // ==========================

  const uploadImage = async (file) => {

    const response = await fetch(

      `${API_URL}?upload=true&fileName=${encodeURIComponent(
        file.name
      )}&fileType=${encodeURIComponent(
        file.type
      )}`

    );

    if (!response.ok) {

      throw new Error(
        "Unable to get upload URL."
      );

    }

    const uploadData =
      await response.json();

    const upload =
      await fetch(
        uploadData.uploadUrl,
        {

          method: "PUT",

          headers: {
            "Content-Type":
              file.type,
          },

          body: file,

        }
      );

    if (!upload.ok) {

      throw new Error(
        "Image upload failed."
      );

    }

    return uploadData.fileUrl;

  };

  // ==========================
  // Reset Form
  // ==========================
  

  const resetForm = () => {

  setForm({

    category: "",

    primaryImage: null,

    primaryPreview: "",

    secondaryImages: [],

    name: "",

      overview: "",

    description: "",

    specifications: [],

  });

  setIsEditing(false);

  setEditId(null);

  setShowForm(false);

};

// ==========================
// Primary Image
// ==========================

const handlePrimaryImage = (e) => {

  const file = e.target.files[0];

  if (!file) return;

  setForm((prev) => ({

    ...prev,

    primaryImage: file,

    primaryPreview: URL.createObjectURL(file),

  }));

};

// ==========================
// Add Secondary Image
// ==========================

const addSecondaryImage = () => {

  setForm((prev) => ({

    ...prev,

    secondaryImages: [

      ...prev.secondaryImages,

      {

        image: null,

        preview: "",

      },

    ],

  }));

};

// ==========================
// Upload Secondary Image
// ==========================

const handleSecondaryImage = (index, file) => {

  if (!file) return;

  const updated = [...form.secondaryImages];

  updated[index] = {

    image: file,

    preview: URL.createObjectURL(file),

  };

  setForm((prev) => ({

    ...prev,

    secondaryImages: updated,

  }));

};

// ==========================
// Remove Secondary Image
// ==========================

const removeSecondaryImage = (index) => {

  const updated = [...form.secondaryImages];

  updated.splice(index, 1);

  setForm((prev) => ({

    ...prev,

    secondaryImages: updated,

  }));

};

// ==========================
// Add Specification
// ==========================

const addSpecification = () => {

  setForm((prev) => ({

    ...prev,

    specifications: [

      ...prev.specifications,

      {

        title: "",

        value: "",

      },

    ],

  }));

};

// ==========================
// Update Specification
// ==========================

const updateSpecification = (
  index,
  field,
  value
) => {

  const updated = [...form.specifications];

  updated[index][field] = value;

  setForm((prev) => ({

    ...prev,

    specifications: updated,

  }));

};

// ==========================
// Remove Specification
// ==========================

const removeSpecification = (index) => {

  const updated = [...form.specifications];

  updated.splice(index, 1);

  setForm((prev) => ({

    ...prev,

    specifications: updated,

  }));

};

// ==========================
// Save Product
// ==========================
// ==========================
// Save Product
// ==========================

  const saveProduct = async () => {

  if (!form.category || !form.name.trim()) {

    alert("Category and Product Name are required.");

    return;

  }

  try {

    setLoading(true);

    // Your existing upload image code

    let primaryImage = form.primaryPreview;

    if (form.primaryImage) {

      primaryImage = await uploadImage(form.primaryImage);

    }

    if (!isEditing && !primaryImage) {

      alert("Please select a primary image.");

      setLoading(false);

      return;

    }

    const secondaryImages = [];

    for (const item of form.secondaryImages) {

      if (item.image) {

        const url = await uploadImage(item.image);

        secondaryImages.push(url);

      } else {

        secondaryImages.push(item.preview);

      }

    }

    const payload = {

      id: editId,

      category: form.category,

      primaryImage,

      secondaryImages,

      name: form.name,

       overview: form.overview,

      description: form.description,

      specifications: form.specifications,

    };

    const response = await fetch(API_URL, {

      method: isEditing ? "PUT" : "POST",

      headers: {

        "Content-Type": "application/json",

      },

      body: JSON.stringify(payload),

    });

    if (!response.ok) {

      throw new Error("Unable to save product.");

    }

    await loadProducts();

    resetForm();

    alert(

      isEditing

        ? "Product Updated Successfully"

        : "Product Saved Successfully"

    );

  } catch (err) {

    console.error(err);

    alert(err.message);

  } finally {

    setLoading(false);

  }

};
  
// ==========================
// Delete Product
// ==========================

// ==========================
// Delete Product
// ==========================

const deleteProduct = async (id) => {

  if (!window.confirm("Delete this product?")) {
    return;
  }

  try {

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

      throw new Error(
        result.message || "Delete Failed"
      );

    }

    alert("Product Deleted Successfully");

    await loadProducts();

  } catch (err) {

    console.error(err);

    alert(
      err.message ||
      "Unable to delete product."
    );

  }

};

const editProduct = (product) => {

  setIsEditing(true);

  setEditId(product.id);

   setForm({
  category: product.category,

  primaryImage: null,
  primaryPreview: product.primaryImage,

  secondaryImages:
    (product.secondaryImages || []).map((img) => ({
      image: null,
      preview:
        typeof img === "string"
          ? img
          : img.image,
    })),

  name: product.name,

  overview: product.overview || "",

  description: product.description || "",

  specifications:
    product.specifications || [],
});

  setShowForm(true);

};

// ==========================
// Return JSX
// ==========================

return (

<div className="shop-page">

  {/* Header */}

  <div className="header">

    <h2>Shop Page</h2>

    <button
      onClick={() => {

  resetForm();

  setShowForm(true);

}}
    >
      + Add Product
    </button>

  </div>

  {/* Upload Form */}

  {showForm && (

    <div className="upload-box">

      {/* Category */}

      <select
        value={form.category}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            category: e.target.value,
          }))
        }
      >

        <option value="">
          Select Category
        </option>

        {categories.map((category) => (

          <option
            key={category}
            value={category}
          >
            {category}
          </option>

        ))}

      </select>

      {/* Primary Image */}

      <label className="upload-title">

        Primary Image

      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handlePrimaryImage}
      />

      {form.primaryPreview && (

        <div
          style={{
            marginTop: "15px",
          }}
        >

          <img
            src={form.primaryPreview}
            alt="Preview"
            className="preview-image"
          />

        </div>

      )}

      {/* Secondary Images */}
      {/* Secondary Images */}

<div className="secondary-section">

  <div className="secondary-header">

    <h3>Secondary Images</h3>

    <button
      type="button"
      onClick={addSecondaryImage}
    >
      + Add Secondary Image
    </button>

  </div>

  {form.secondaryImages.map((item, index) => (

    <div
      key={index}
      className="secondary-item"
    >

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          handleSecondaryImage(
            index,
            e.target.files[0]
          )
        }
      />

      {item.preview && (

        <img
          src={item.preview}
          alt="Secondary Preview"
          className="preview-image"
        />

      )}

      <button
        type="button"
        className="remove-btn"
        onClick={() =>
          removeSecondaryImage(index)
        }
      >
        Remove
      </button>

    </div>

  ))}

</div>

 {/* Product Name */}

<input
  type="text"
  placeholder="Product Name"
  value={form.name}
  onChange={(e) =>
    setForm((prev) => ({
      ...prev,
      name: e.target.value,
    }))
  }
/>

{/* Overview */}

<textarea
  rows="4"
  placeholder="Product Overview"
  value={form.overview}
  onChange={(e) =>
    setForm((prev) => ({
      ...prev,
      overview: e.target.value,
    }))
  }
/>

{/* Description */}

<textarea
  rows="6"
  placeholder="Product Description"
  value={form.description}
  onChange={(e) =>
    setForm((prev) => ({
      ...prev,
      description: e.target.value,
    }))
  }
/>


{/* Specifications */}

<div className="specification-section">

  <div className="specification-header">

    <h3>Specifications</h3>

    <button
      type="button"
      onClick={addSpecification}
    >
      + Add Specification
    </button>

  </div>

  {form.specifications.map((spec, index) => (

    <div
      key={index}
      className="specification-row"
    >

      <input
        type="text"
        placeholder="Title"
        value={spec.title}
        onChange={(e) =>
          updateSpecification(
            index,
            "title",
            e.target.value
          )
        }
      />

      <input
        type="text"
        placeholder="Value"
        value={spec.value}
        onChange={(e) =>
          updateSpecification(
            index,
            "value",
            e.target.value
          )
        }
      />

      <button
        type="button"
        className="remove-btn"
        onClick={() =>
          removeSpecification(index)
        }
      >
        Remove
      </button>

    </div>

  ))}

</div>

{/* Buttons */}

<div className="btns">

  <button
    type="button"
    onClick={saveProduct}
  >
    {loading

  ? isEditing

    ? "Updating..."

    : "Saving..."

  : isEditing

    ? "Update Product"

    : "Save Product"}
  </button>

  <button
    type="button"
    onClick={resetForm}
  >
    Cancel
  </button>

</div>

</div>

)}
{/* ==========================
    Products Table
========================== */}

<div className="table-container">

  <table>

    <thead>

      <tr>

        <th>No</th>

        <th>Preview</th>

        <th>Category</th>

        <th>Product Name</th>

        <th>Description</th>

        <th>Secondary Images</th>

        <th>Specifications</th>

        <th>Type</th>

        <th>Action</th>

      </tr>

    </thead>

    <tbody>

      {loading ? (

        <tr>

          <td
            colSpan="9"
            style={{
              textAlign: "center",
              padding: "40px",
            }}
          >
            Loading Products...
          </td>

        </tr>

      ) : products.length > 0 ? (

        products.map((item, index) => (

          <tr key={item.id}>

            <td>{index + 1}</td>

            <td>

              {item.primaryImage ? (

                <img
                  src={item.primaryImage}
                  alt={item.name}
                  className="preview-image"
                />

              ) : (

                "-"

              )}

            </td>

            <td>

              <span className="category-badge">

                {item.category}

              </span>

            </td>

            <td>{item.name}</td>

            <td>{item.description || "-"}</td>

            <td>

              {item.secondaryImages
                ? item.secondaryImages.length
                : 0}{" "}
              Images

            </td>

            <td>

              {item.specifications
                ? item.specifications.length
                : 0}{" "}
              Specs

            </td>

            <td>Image</td>

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

        ))

      ) : (

        <tr>

          <td
            colSpan="9"
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#777",
            }}
          >

            No products found.

            <br />

            Click{" "}

            <strong>
              + Add Product
            </strong>{" "}

            to add your first product.

          </td>

        </tr>

      )}

    </tbody>

  </table>

</div>

</div>

);

};

export default Shop;