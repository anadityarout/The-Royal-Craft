import React, { useState, useEffect } from "react";
import "./ProductPage.css";

/* =====================================================
   API
===================================================== */

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/product";

/* =====================================================
   PRODUCT PAGE
===================================================== */

const ProductPage = () => {
  /* =====================================================
     PRODUCT CATEGORIES
  ===================================================== */

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

  /* =====================================================
     STATES
  ===================================================== */

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(false);

  /* =====================================================
     IMAGE TYPE
     Banner / Product
  ===================================================== */

  const [imageType, setImageType] = useState("Product");

  /* =====================================================
     PRODUCT FORM
  ===================================================== */

  const [form, setForm] = useState({
    category: "",
    image: null,
    preview: "",
    name: "",
    description: "",
    date: "",
  });

  /* =====================================================
     BANNER FORM
  ===================================================== */

  const [bannerForm, setBannerForm] = useState({
    image: null,
    preview: "",
    name: "",
    description: "",
  });

  /* =====================================================
     SAVED ITEMS
  ===================================================== */

  const [products, setProducts] = useState([]);

  /* =====================================================
     EDIT
  ===================================================== */

  const [isEditing, setIsEditing] = useState(false);

  const [editId, setEditId] = useState(null);

  /* =====================================================
     PAGINATION
  ===================================================== */

  const PRODUCTS_PER_PAGE = 5;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(
    products.length / PRODUCTS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * PRODUCTS_PER_PAGE;

  const currentProducts = products.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  /* =====================================================
     LOAD DATA
  ===================================================== */

  useEffect(() => {
    loadProducts();
  }, []);

  /* =====================================================
     LOAD DATA FROM API
  ===================================================== */

  const loadProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          "Failed to load product data."
        );
      }

      const data = await response.json();

      setProducts(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Load error:",
        err
      );

      setProducts([]);

      alert(
        "Unable to load Product data."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     RESET FORM
  ===================================================== */

  const resetForm = () => {
    setShowForm(false);

    setImageType("Product");

    setForm({
      category: "",
      image: null,
      preview: "",
      name: "",
      description: "",
      date: "",
    });

    setBannerForm({
      image: null,
      preview: "",
      name: "",
      description: "",
    });

    setIsEditing(false);

    setEditId(null);
  };

  /* =====================================================
     ADD IMAGE
  ===================================================== */

  const handleAddImage = () => {
    resetForm();

    setShowForm(true);

    setImageType("Product");
  };

  /* =====================================================
     CHANGE IMAGE TYPE
  ===================================================== */

  const handleImageTypeChange = (e) => {
    const type = e.target.value;

    setImageType(type);

    /*
      When changing type while creating a new item,
      clear the corresponding form.
    */

    if (!isEditing) {
      setForm({
        category: "",
        image: null,
        preview: "",
        name: "",
        description: "",
        date: "",
      });

      setBannerForm({
        image: null,
        preview: "",
        name: "",
        description: "",
      });
    }
  };

  /* =====================================================
     PRODUCT IMAGE HANDLER
  ===================================================== */

  const handleImage = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert(
        "Please select an image."
      );
      return;
    }

    setForm((prev) => ({
      ...prev,
      image: file,
      preview:
        URL.createObjectURL(file),
    }));
  };

  /* =====================================================
     BANNER IMAGE HANDLER
  ===================================================== */

  const handleBannerImage = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert(
        "Please select an image."
      );
      return;
    }

    setBannerForm((prev) => ({
      ...prev,
      image: file,
      preview:
        URL.createObjectURL(file),
    }));
  };

  /* =====================================================
     UPLOAD IMAGE TO S3
  ===================================================== */

  const uploadImage = async (file) => {
    if (!file) {
      throw new Error(
        "Please select an image."
      );
    }

    const response = await fetch(
      `${API_URL}?upload=true&fileName=${encodeURIComponent(
        file.name
      )}&fileType=${encodeURIComponent(
        file.type
      )}`
    );

    if (!response.ok) {
      throw new Error(
        "Unable to generate upload URL."
      );
    }

    const uploadData =
      await response.json();

    if (!uploadData.uploadUrl) {
      throw new Error(
        "Upload URL was not generated."
      );
    }

    const uploadResponse =
      await fetch(
        uploadData.uploadUrl,
        {
          method: "PUT",

          headers: {
            "Content-Type": file.type,
          },

          body: file,
        }
      );

    if (!uploadResponse.ok) {
      throw new Error(
        "Image upload failed."
      );
    }

    return uploadData.fileUrl;
  };

  /* =====================================================
     SAVE BANNER
  ===================================================== */

  const saveBanner = async () => {
    /* ---------------------------------------------
       VALIDATION
    --------------------------------------------- */

    if (
      !isEditing &&
      !bannerForm.image
    ) {
      alert(
        "Please select Banner Image."
      );
      return;
    }

    if (
      !bannerForm.name.trim()
    ) {
      alert(
        "Please enter Banner Name."
      );
      return;
    }

    try {
      setLoading(true);

      /* ---------------------------------------------
         IMAGE URL
      --------------------------------------------- */

      let imageUrl =
        bannerForm.preview;

      if (bannerForm.image) {
        imageUrl =
          await uploadImage(
            bannerForm.image
          );
      }

      /* ---------------------------------------------
         SAVE BANNER
      --------------------------------------------- */

      const response =
        await fetch(
          API_URL,
          {
            method: isEditing
              ? "PUT"
              : "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id: editId,

              type: "Banner",

              category: "banner",

              bannerImage:
                imageUrl,

              bannerName:
                bannerForm.name.trim(),

              bannerDescription:
                bannerForm.description.trim(),
            }),
          }
        );

      const result =
        await response
          .json()
          .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.error ||
            "Unable to save banner."
        );
      }

      await loadProducts();

      const wasEditing =
        isEditing;

      resetForm();

      alert(
        wasEditing
          ? "Banner updated successfully."
          : "Banner saved successfully."
      );
    } catch (err) {
      console.error(
        "Banner save error:",
        err
      );

      alert(
        err.message ||
          "Unable to save banner."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     SAVE / UPDATE PRODUCT
     EXISTING PRODUCT LOGIC
  ===================================================== */

  const saveProduct = async () => {
    /* ---------------------------------------------
       VALIDATION
    --------------------------------------------- */

    if (
      !form.category ||
      !form.name.trim() ||
      !form.date ||
      (!isEditing && !form.image)
    ) {
      alert(
        "Please fill all required fields."
      );
      return;
    }

    try {
      setLoading(true);

      /* ---------------------------------------------
         IMAGE
      --------------------------------------------- */

      let imageUrl =
        form.preview;

      if (form.image) {
        imageUrl =
          await uploadImage(
            form.image
          );
      }

      /* ---------------------------------------------
         SAVE PRODUCT
      --------------------------------------------- */

      const response =
        await fetch(
          API_URL,
          {
            method: isEditing
              ? "PUT"
              : "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id: editId,

              type: "Product",

              category:
                form.category,

              image:
                imageUrl,

              name:
                form.name,

              description:
                form.description,

              date:
                form.date,
            }),
          }
        );

      const result =
        await response
          .json()
          .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.error ||
            "Unable to save product."
        );
      }

      await loadProducts();

      const wasEditing =
        isEditing;

      resetForm();

      if (!wasEditing) {
        setCurrentPage(1);
      }

      alert(
        wasEditing
          ? "Product updated successfully."
          : "Product saved successfully."
      );
    } catch (err) {
      console.error(
        "Product save error:",
        err
      );

      alert(
        err.message ||
          "Unable to save product."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     SAVE
  ===================================================== */

  const handleSave = () => {
    if (imageType === "Banner") {
      saveBanner();
    } else {
      saveProduct();
    }
  };

  /* =====================================================
     DELETE ITEM
  ===================================================== */

  const deleteProduct = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this item?"
      );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      const response =
        await fetch(
          API_URL,
          {
            method: "DELETE",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id,
            }),
          }
        );

      const result =
        await response
          .json()
          .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.error ||
            "Delete failed."
        );
      }

      alert(
        "Item deleted successfully."
      );

      await loadProducts();

      setCurrentPage((page) => {
        const remainingProducts =
          products.length - 1;

        const remainingPages =
          Math.ceil(
            remainingProducts /
              PRODUCTS_PER_PAGE
          );

        return Math.min(
          page,
          Math.max(
            1,
            remainingPages
          )
        );
      });
    } catch (err) {
      console.error(
        "Delete error:",
        err
      );

      alert(
        err.message ||
          "Unable to delete item."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     EDIT ITEM
  ===================================================== */

  const editProduct = (item) => {
    setShowForm(true);

    setIsEditing(true);

    setEditId(item.id);

    /* ---------------------------------------------
       BANNER
    --------------------------------------------- */

    const isBanner =
      String(
        item.type ||
          item.category ||
          ""
      ).toLowerCase() ===
        "banner" ||
      item.bannerImage;

    if (isBanner) {
      setImageType("Banner");

      setBannerForm({
        image: null,

        preview:
          item.bannerImage ||
          item.image ||
          "",

        name:
          item.bannerName ||
          item.name ||
          "",

        description:
          item.bannerDescription ||
          item.description ||
          "",
      });

      return;
    }

    /* ---------------------------------------------
       PRODUCT
    --------------------------------------------- */

    setImageType("Product");

    setForm({
      category:
        item.category || "",

      image: null,

      preview:
        item.image ||
        "",

      name:
        item.name ||
        "",

      description:
        item.description ||
        "",

      date:
        item.date ||
        "",
    });

    setBannerForm({
      image: null,
      preview: "",
      name: "",
      description: "",
    });
  };

  /* =====================================================
     PAGE CHANGE
  ===================================================== */

  const goToPage = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <div className="productpage">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="product-header">

        <h2>
          Product Page
        </h2>

        <button
          type="button"
          onClick={
            handleAddImage
          }
          disabled={loading}
        >
          + Add Image
        </button>

      </div>


      {/* =================================================
          FORM
      ================================================= */}

      {showForm && (

        <div className="upload-box">

          {/* =================================================
              IMAGE TYPE
          ================================================= */}

          <select
            value={imageType}
            onChange={
              handleImageTypeChange
            }
            disabled={
              isEditing
            }
          >

            <option value="Product">
              Product
            </option>

            <option value="Banner">
              Banner
            </option>

          </select>


          {/* =================================================
              BANNER FORM
          ================================================= */}

          {imageType === "Banner" && (

            <div className="banner-form">

              <h3>
                Banner
              </h3>


              {/* Banner Image */}

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleBannerImage
                }
              />


              {/* Banner Preview */}

              {bannerForm.preview && (

                <div className="image-preview">

                  <img
                    src={
                      bannerForm.preview
                    }
                    alt="Banner Preview"
                    className="preview-image"
                  />

                </div>

              )}


              {/* Banner Name */}

              <input
                type="text"
                placeholder="Banner Name"
                value={
                  bannerForm.name
                }
                onChange={(e) =>
                  setBannerForm(
                    (prev) => ({
                      ...prev,
                      name:
                        e.target.value,
                    })
                  )
                }
              />


              {/* Banner Description */}

              <textarea
                rows="5"
                placeholder="Banner Description"
                value={
                  bannerForm.description
                }
                onChange={(e) =>
                  setBannerForm(
                    (prev) => ({
                      ...prev,
                      description:
                        e.target.value,
                    })
                  )
                }
              />


              {/* Banner Buttons */}

              <div className="btns">

                <button
                  type="button"
                  onClick={
                    handleSave
                  }
                  disabled={
                    loading
                  }
                >
                  {loading
                    ? isEditing
                      ? "Updating..."
                      : "Saving..."
                    : isEditing
                    ? "Update Banner"
                    : "Save Banner"}
                </button>


                <button
                  type="button"
                  onClick={
                    resetForm
                  }
                  disabled={
                    loading
                  }
                >
                  Cancel
                </button>

              </div>

            </div>

          )}


          {/* =================================================
              PRODUCT FORM
          ================================================= */}

          {imageType === "Product" && (

            <div className="product-form">

              {/* Product Category */}

              <select
                value={
                  form.category
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    category:
                      e.target.value,
                  })
                }
              >

                <option value="">
                  Select Category
                </option>

                {categories.map(
                  (category) => (

                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>

                  )
                )}

              </select>


              {/* Product Image */}

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleImage
                }
              />


              {/* Product Preview */}

              {form.preview && (

                <div className="image-preview">

                  <img
                    src={
                      form.preview
                    }
                    alt="Product Preview"
                    className="preview-image"
                  />

                </div>

              )}


              {/* Product Name */}

              <input
                type="text"
                placeholder="Product Name"
                value={
                  form.name
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    name:
                      e.target.value,
                  })
                }
              />


              {/* Product Description */}

              <textarea
                rows="4"
                placeholder="Product Description"
                value={
                  form.description
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    description:
                      e.target.value,
                  })
                }
              />


              {/* Product Date */}

              <input
                type="date"
                value={
                  form.date
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    date:
                      e.target.value,
                  })
                }
              />


              {/* Product Buttons */}

              <div className="btns">

                <button
                  type="button"
                  onClick={
                    handleSave
                  }
                  disabled={
                    loading
                  }
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
                  type="button"
                  onClick={
                    resetForm
                  }
                  disabled={
                    loading
                  }
                >
                  Cancel
                </button>

              </div>

            </div>

          )}

        </div>

      )}


      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (

        <div className="loading">
          Loading...
        </div>

      )}


      {/* =================================================
          SAVED ITEMS TABLE
      ================================================= */}

      {products.length > 0 && (

        <div className="table-container">

          <table>

            <thead>

              <tr>

                <th>
                  No
                </th>

                <th>
                  Preview
                </th>

                <th>
                  Type
                </th>

                <th>
                  Category
                </th>

                <th>
                  Name
                </th>

                <th>
                  Description
                </th>

                <th>
                  Date
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {currentProducts.map(
                (item, index) => {

                  const isBanner =
                    String(
                      item.type ||
                        item.category ||
                        ""
                    ).toLowerCase() ===
                      "banner" ||
                    item.bannerImage;

                  return (

                    <tr
                      key={item.id}
                    >

                      {/* Number */}

                      <td>
                        {
                          startIndex +
                          index +
                          1
                        }
                      </td>


                      {/* Preview */}

                      <td>

                        <img
                          src={
                            isBanner
                              ? item.bannerImage ||
                                item.image
                              : item.image
                          }
                          alt={
                            isBanner
                              ? item.bannerName ||
                                "Banner"
                              : item.name ||
                                "Product"
                          }
                          className="preview-image"
                        />

                      </td>


                      {/* Type */}

                      <td>
                        {isBanner
                          ? "Banner"
                          : "Product"}
                      </td>


                      {/* Category */}

                      <td>

                        {isBanner
                          ? "-"
                          : (
                              <span className="category-badge">
                                {
                                  item.category
                                }
                              </span>
                            )}

                      </td>


                      {/* Name */}

                      <td>

                        {isBanner
                          ? item.bannerName ||
                            item.name ||
                            "-"
                          : item.name ||
                            "-"}

                      </td>


                      {/* Description */}

                      <td>

                        {isBanner
                          ? item.bannerDescription ||
                            item.description ||
                            "-"
                          : item.description ||
                            "-"}

                      </td>


                      {/* Date */}

                      <td>

                        {isBanner
                          ? "-"
                          : item.date ||
                            "-"}

                      </td>


                      {/* Actions */}

                      <td>

                        <div className="action-buttons">

                          <button
                            type="button"
                            className="edit-btn"
                            onClick={() =>
                              editProduct(
                                item
                              )
                            }
                            disabled={
                              loading
                            }
                          >
                            Edit
                          </button>


                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() =>
                              deleteProduct(
                                item.id
                              )
                            }
                            disabled={
                              loading
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  );
                }
              )}

            </tbody>

          </table>

        </div>

      )}


      {/* =================================================
          PAGINATION
      ================================================= */}

      {products.length >
        PRODUCTS_PER_PAGE && (

        <div className="pagination">

          {/* Previous */}

          <button
            type="button"
            className="page-btn prev-next"
            onClick={() =>
              goToPage(
                currentPage - 1
              )
            }
            disabled={
              currentPage === 1
            }
          >
            ‹
          </button>


          {/* Page Numbers */}

          <div className="page-numbers">

            {Array.from(
              {
                length:
                  totalPages,
              },
              (_, index) =>
                index + 1
            ).map((page) => (

              <button
                type="button"
                key={page}
                className={`page-btn ${
                  currentPage ===
                  page
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  goToPage(
                    page
                  )
                }
              >
                {page}
              </button>

            ))}

          </div>


          {/* Next */}

          <button
            type="button"
            className="page-btn prev-next"
            onClick={() =>
              goToPage(
                currentPage + 1
              )
            }
            disabled={
              currentPage ===
              totalPages
            }
          >
            ›
          </button>

        </div>

      )}


      {/* =================================================
          NO ITEMS
      ================================================= */}

      {!loading &&
        products.length === 0 && (

          <div className="no-products">
            No Products uploaded yet.
          </div>

        )}

    </div>
  );
};

export default ProductPage;