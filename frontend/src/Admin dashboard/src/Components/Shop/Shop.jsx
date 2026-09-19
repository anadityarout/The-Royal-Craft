import React, { useState, useEffect } from "react";
import "./Shop.css";

// =====================================================
// API
// =====================================================

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/shop-product";

// =====================================================
// SHOP
// =====================================================

const Shop = () => {

  // =====================================================
  // CATEGORIES
  // =====================================================

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
    "Royal Fiber Lamp",
  ];

  // =====================================================
  // GENERAL STATES
  // =====================================================

  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState([]);

  // =====================================================
  // PRODUCT FORM STATES
  // =====================================================

  const [showForm, setShowForm] = useState(false);

  const [isEditing, setIsEditing] =
    useState(false);

  const [editId, setEditId] =
    useState(null);

  // =====================================================
  // ADD PRODUCT MENU
  // =====================================================

  const [showAddMenu, setShowAddMenu] =
    useState(false);

  // =====================================================
  // FORM TYPE
  // =====================================================

  // "banner"
  // "shop"
  // null

  const [formType, setFormType] =
    useState(null);

  // =====================================================
  // BANNER STATES
  // =====================================================

  const [banner, setBanner] =
    useState(null);

  const [bannerForm, setBannerForm] =
    useState({
      image: null,
      imagePreview: "",
      name: "",
      description: "",
    });

  const [bannerLoading, setBannerLoading] =
    useState(false);

  // =====================================================
  // PAGINATION
  // =====================================================

  const [currentPage, setCurrentPage] =
    useState(1);

  const productsPerPage = 5;

  const totalPages =
    Math.ceil(
      products.length /
        productsPerPage
    );

  const startIndex =
    (currentPage - 1) *
    productsPerPage;

  const endIndex =
    startIndex +
    productsPerPage;

  const currentProducts =
    products.slice(
      startIndex,
      endIndex
    );

  // =====================================================
  // PRODUCT FORM
  // =====================================================

  const [form, setForm] =
    useState({
      category: "",
      primaryImage: null,
      primaryPreview: "",
      secondaryImages: [],
      name: "",
      overview: "",
      description: "",
      specifications: [],
    });

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    loadProducts();
    loadBanner();
  }, []);

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  const loadProducts = async () => {

    try {

      setLoading(true);

      const response =
        await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          "Unable to load products."
        );
      }

      const data =
        await response.json();

      setProducts(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Product loading error:",
        err
      );

      setProducts([]);

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // LOAD BANNER
  // =====================================================

  const loadBanner = async () => {

    try {

      const response =
        await fetch(
          `${API_URL}?type=banner`
        );

      if (!response.ok) {
        throw new Error(
          "Unable to load banner."
        );
      }

      const data =
        await response.json();

      if (
        data &&
        data.image
      ) {

        setBanner(data);

      } else {

        setBanner(null);

      }

    } catch (err) {

      console.error(
        "Banner loading error:",
        err
      );

      setBanner(null);

    }
  };

  // =====================================================
  // UPLOAD IMAGE TO S3
  // =====================================================
  //
  // type = "product"
  // type = "banner"
  //
  // Product:
  // images/shop-product/
  //
  // Banner:
  // images/shop-banner/
  //
  // =====================================================

  const uploadImage = async (
    file,
    type = "product"
  ) => {

    if (!file) {
      throw new Error(
        "No image selected."
      );
    }

    // -----------------------------------------------
    // Get presigned URL
    // -----------------------------------------------

    const uploadUrlRequest =
      `${API_URL}?upload=true` +
      `&type=${encodeURIComponent(type)}` +
      `&fileName=${encodeURIComponent(file.name)}` +
      `&fileType=${encodeURIComponent(file.type)}`;

    const response =
      await fetch(
        uploadUrlRequest
      );

    if (!response.ok) {

      throw new Error(
        "Unable to get upload URL."
      );

    }

    const uploadData =
      await response.json();

    // -----------------------------------------------
    // Upload directly to S3
    // -----------------------------------------------

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

    // -----------------------------------------------
    // Return S3 image URL
    // -----------------------------------------------

    return uploadData.fileUrl;
  };

  // =====================================================
  // RESET PRODUCT FORM
  // =====================================================

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

    setFormType(null);
  };

  // =====================================================
  // RESET BANNER FORM
  // =====================================================

  const resetBannerForm = () => {

    setBannerForm({
      image: null,
      imagePreview: "",
      name: "",
      description: "",
    });

    setFormType(null);

    setShowAddMenu(false);
  };

  // =====================================================
  // OPEN BANNER FORM
  // =====================================================

  const openBannerForm = () => {

    setShowAddMenu(false);

    setShowForm(false);

    setFormType("banner");

    // Existing banner
    if (banner) {

      setBannerForm({
        image: null,

        imagePreview:
          banner.image || "",

        name:
          banner.name || "",

        description:
          banner.description || "",
      });

    }

    // New banner
    else {

      setBannerForm({
        image: null,
        imagePreview: "",
        name: "",
        description: "",
      });

    }
  };

  // =====================================================
  // OPEN SHOP PRODUCT FORM
  // =====================================================

  const openShopForm = () => {

    setShowAddMenu(false);

    setFormType("shop");

    setShowForm(true);
  };

  // =====================================================
  // PRIMARY IMAGE
  // =====================================================

  const handlePrimaryImage = (e) => {

    const file =
      e.target.files[0];

    if (!file) return;

    setForm((prev) => ({
      ...prev,

      primaryImage: file,

      primaryPreview:
        URL.createObjectURL(file),
    }));
  };

  // =====================================================
  // ADD SECONDARY IMAGE
  // =====================================================

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

  // =====================================================
  // SECONDARY IMAGE
  // =====================================================

  const handleSecondaryImage = (
    index,
    file
  ) => {

    if (!file) return;

    const updated =
      [
        ...form.secondaryImages,
      ];

    updated[index] = {
      image: file,

      preview:
        URL.createObjectURL(file),
    };

    setForm((prev) => ({
      ...prev,

      secondaryImages:
        updated,
    }));
  };

  // =====================================================
  // REMOVE SECONDARY IMAGE
  // =====================================================

  const removeSecondaryImage = (
    index
  ) => {

    const updated =
      [
        ...form.secondaryImages,
      ];

    updated.splice(index, 1);

    setForm((prev) => ({
      ...prev,

      secondaryImages:
        updated,
    }));
  };

  // =====================================================
  // ADD SPECIFICATION
  // =====================================================

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

  // =====================================================
  // UPDATE SPECIFICATION
  // =====================================================

  const updateSpecification = (
    index,
    field,
    value
  ) => {

    const updated =
      [
        ...form.specifications,
      ];

    updated[index] = {
      ...updated[index],

      [field]: value,
    };

    setForm((prev) => ({
      ...prev,

      specifications:
        updated,
    }));
  };

  // =====================================================
  // REMOVE SPECIFICATION
  // =====================================================

  const removeSpecification = (
    index
  ) => {

    const updated =
      [
        ...form.specifications,
      ];

    updated.splice(index, 1);

    setForm((prev) => ({
      ...prev,

      specifications:
        updated,
    }));
  };

  // =====================================================
  // BANNER IMAGE
  // =====================================================

  const handleBannerImage = (
    e
  ) => {

    const file =
      e.target.files[0];

    if (!file) return;

    setBannerForm((prev) => ({
      ...prev,

      image: file,

      imagePreview:
        URL.createObjectURL(file),
    }));
  };

  // =====================================================
  // SAVE BANNER
  // =====================================================

  const saveBanner = async () => {

    // -----------------------------------------------
    // Validation
    // -----------------------------------------------

    if (
      !bannerForm.image &&
      !bannerForm.imagePreview
    ) {

      alert(
        "Please select a banner image."
      );

      return;
    }

    if (
      !bannerForm.name.trim()
    ) {

      alert(
        "Please enter banner name."
      );

      return;
    }

    if (
      !bannerForm.description.trim()
    ) {

      alert(
        "Please enter banner description."
      );

      return;
    }

    try {

      setBannerLoading(true);

      // -----------------------------------------------
      // Existing image
      // -----------------------------------------------

      let imageUrl =
        bannerForm.imagePreview;

      // -----------------------------------------------
      // Upload NEW banner image
      //
      // IMPORTANT:
      // type = banner
      //
      // This sends image to:
      // images/shop-banner/
      // -----------------------------------------------

      if (
        bannerForm.image
      ) {

        imageUrl =
          await uploadImage(
            bannerForm.image,
            "banner"
          );
      }

      // -----------------------------------------------
      // Banner data
      // -----------------------------------------------

      const bannerData = {

        image:
          imageUrl,

        name:
          bannerForm.name.trim(),

        description:
          bannerForm.description.trim(),
      };

      // -----------------------------------------------
      // POST = new banner
      // PUT = update existing banner
      // -----------------------------------------------

      const method =
        banner
          ? "PUT"
          : "POST";

      const response =
        await fetch(
          `${API_URL}?type=banner`,
          {
            method,

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                bannerData
              ),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {

        throw new Error(
          result.message ||
            "Unable to save banner."
        );
      }

      // -----------------------------------------------
      // Update screen
      // -----------------------------------------------

      setBanner(
        result.data ||
          bannerData
      );

      // -----------------------------------------------
      // Clear form
      // -----------------------------------------------

      setBannerForm({
        image: null,

        imagePreview:
          result.data?.image ||
          imageUrl,

        name:
          result.data?.name ||
          bannerData.name,

        description:
          result.data?.description ||
          bannerData.description,
      });

      setFormType(null);

      alert(
        banner
          ? "Banner updated successfully."
          : "Banner saved successfully."
      );

    } catch (err) {

      console.error(
        "Save banner error:",
        err
      );

      alert(
        err.message ||
          "Unable to save banner."
      );

    } finally {

      setBannerLoading(false);

    }
  };

  // =====================================================
  // DELETE BANNER
  // =====================================================

  const deleteBanner = async () => {

    const confirmed =
      window.confirm(
        "Delete this banner?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setBannerLoading(true);

      const response =
        await fetch(
          `${API_URL}?type=banner`,
          {
            method: "DELETE",

            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

      const result =
        await response.json();

      if (!response.ok) {

        throw new Error(
          result.message ||
            "Unable to delete banner."
        );
      }

      setBanner(null);

      setFormType(null);

      alert(
        "Banner deleted successfully."
      );

    } catch (err) {

      console.error(
        "Delete banner error:",
        err
      );

      alert(
        err.message ||
          "Unable to delete banner."
      );

    } finally {

      setBannerLoading(false);

    }
  };

  // =====================================================
  // SAVE PRODUCT
  // =====================================================

  const saveProduct = async () => {

    // -----------------------------------------------
    // Validation
    // -----------------------------------------------

    if (
      !form.category ||
      !form.name.trim()
    ) {

      alert(
        "Category and Product Name are required."
      );

      return;
    }

    try {

      setLoading(true);

      // =================================================
      // PRIMARY IMAGE
      // =================================================

      let primaryImage =
        form.primaryPreview;

      if (
        form.primaryImage
      ) {

        // IMPORTANT:
        // Product upload
        await uploadImage(
          form.primaryImage,
          "product"
        ).then((url) => {
          primaryImage = url;
        });
      }

      // New product requires image
      if (
        !isEditing &&
        !primaryImage
      ) {

        alert(
          "Please select a primary image."
        );

        setLoading(false);

        return;
      }

      // =================================================
      // SECONDARY IMAGES
      // =================================================

      const secondaryImages =
        [];

      for (
        const item of
          form.secondaryImages
      ) {

        // New image
        if (
          item.image
        ) {

          const url =
            await uploadImage(
              item.image,
              "product"
            );

          secondaryImages.push(
            url
          );

        }

        // Existing image
        else if (
          item.preview
        ) {

          secondaryImages.push(
            item.preview
          );
        }
      }

      // =================================================
      // PRODUCT PAYLOAD
      // =================================================

      const payload = {

        id:
          editId,

        category:
          form.category,

        primaryImage:
          primaryImage,

        secondaryImages:
          secondaryImages,

        name:
          form.name,

        overview:
          form.overview,

        description:
          form.description,

        specifications:
          form.specifications,
      };

      // =================================================
      // API REQUEST
      // =================================================

      const response =
        await fetch(
          API_URL,
          {
            method:
              isEditing
                ? "PUT"
                : "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                payload
              ),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {

        throw new Error(
          result.message ||
            "Unable to save product."
        );
      }

      // -----------------------------------------------
      // Reload products
      // -----------------------------------------------

      await loadProducts();

      // -----------------------------------------------
      // Reset
      // -----------------------------------------------

      resetForm();

      alert(
        isEditing
          ? "Product Updated Successfully"
          : "Product Saved Successfully"
      );

    } catch (err) {

      console.error(
        "Save product error:",
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

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const deleteProduct = async (
    id
  ) => {

    const confirmed =
      window.confirm(
        "Delete this product?"
      );

    if (!confirmed) {
      return;
    }

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

            body:
              JSON.stringify({
                id,
              }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {

        throw new Error(
          result.message ||
            "Delete Failed"
        );
      }

      alert(
        "Product Deleted Successfully"
      );

      await loadProducts();

    } catch (err) {

      console.error(
        "Delete product error:",
        err
      );

      alert(
        err.message ||
          "Unable to delete product."
      );

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // EDIT PRODUCT
  // =====================================================

  const editProduct = (
    product
  ) => {

    setIsEditing(true);

    setEditId(
      product.id
    );

    setForm({

      category:
        product.category ||
        "",

      primaryImage:
        null,

      primaryPreview:
        product.primaryImage ||
        "",

      secondaryImages:
        (
          product.secondaryImages ||
          []
        ).map(
          (img) => ({
            image: null,

            preview:
              typeof img ===
              "string"
                ? img
                : img.image,
          })
        ),

      name:
        product.name ||
        "",

      overview:
        product.overview ||
        "",

      description:
        product.description ||
        "",

      specifications:
        product.specifications ||
        [],
    });

    setFormType(
      "shop"
    );

    setShowForm(true);

    setShowAddMenu(false);
  };

  // =====================================================
  // PAGINATION
  // =====================================================

  const goToPage = (
    page
  ) => {

    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(
      page
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="shop-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="header">

        <h2>
          Shop Page
        </h2>

        <div className="add-product-wrapper">

          <button
            type="button"
            className="add-product-btn"
            onClick={() =>
              setShowAddMenu(
                (prev) => !prev
              )
            }
          >
            + Add Product
          </button>

          {/* =================================================
              DROPDOWN
          ================================================= */}

          {showAddMenu && (
            <div className="add-product-menu">

              <button
                type="button"
                onClick={
                  openBannerForm
                }
              >
                Banner
              </button>

              <button
                type="button"
                onClick={() => {

                  resetForm();

                  openShopForm();

                }}
              >
                Shop Page
              </button>

            </div>
          )}

        </div>

      </div>

      {/* =================================================
          CURRENT SHOP BANNER
      ================================================= */}

      {banner &&
        formType !== "banner" && (

          <div className="current-banner-box">

            <div className="current-banner-header">

              <div>

                <h3>
                  Current Shop Banner
                </h3>

                <p>
                  Your active Shop Page
                  banner
                </p>

              </div>

              <div className="banner-actions">

                <button
                  type="button"
                  className="banner-edit-btn"
                  onClick={
                    openBannerForm
                  }
                >
                  Edit Banner
                </button>

                <button
                  type="button"
                  className="banner-delete-btn"
                  onClick={
                    deleteBanner
                  }
                  disabled={
                    bannerLoading
                  }
                >
                  Delete
                </button>

              </div>

            </div>

            <div className="current-banner-content">

              {/* Banner Image */}

              <div className="current-banner-image">

                <img
                  src={
                    banner.image
                  }
                  alt={
                    banner.name ||
                    "Shop Banner"
                  }
                />

              </div>

              {/* Banner Text */}

              <div className="current-banner-details">

                <h4>
                  {banner.name}
                </h4>

                <p>
                  {banner.description}
                </p>

              </div>

            </div>

          </div>
        )}

      {/* =================================================
          BANNER FORM
      ================================================= */}

      {formType === "banner" && (

        <div className="banner-upload-box">

          <div className="banner-form-header">

            <div>

              <h3>
                Shop Banner
              </h3>

              <p>
                Add or update your
                Shop Page banner
              </p>

            </div>

          </div>

          {/* =================================================
              BANNER IMAGE
          ================================================= */}

          <label className="upload-title">
            Banner Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={
              handleBannerImage
            }
          />

          {/* Banner Preview */}

          {bannerForm.imagePreview && (

            <div className="banner-preview">

              <img
                src={
                  bannerForm.imagePreview
                }
                alt="Banner Preview"
              />

            </div>

          )}

          {/* =================================================
              BANNER NAME
          ================================================= */}

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

          {/* =================================================
              BANNER DESCRIPTION
          ================================================= */}

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

          {/* =================================================
              BANNER BUTTONS
          ================================================= */}

          <div className="banner-btns">

            <button
              type="button"
              className="banner-save-btn"
              onClick={
                saveBanner
              }
              disabled={
                bannerLoading
              }
            >
              {bannerLoading
                ? "Saving..."
                : banner
                ? "Update Banner"
                : "Save Banner"}
            </button>

            <button
              type="button"
              className="banner-cancel-btn"
              onClick={() => {

                setFormType(null);

                setShowAddMenu(false);

              }}
            >
              Cancel
            </button>

          </div>

        </div>

      )}

      {/* =================================================
          SHOP PRODUCT FORM
      ================================================= */}

      {showForm &&
        formType === "shop" && (

          <div className="upload-box">

            {/* =================================================
                CATEGORY
            ================================================= */}

            <select
              value={
                form.category
              }
              onChange={(e) =>
                setForm(
                  (prev) => ({
                    ...prev,

                    category:
                      e.target.value,
                  })
                )
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

            {/* =================================================
                PRIMARY IMAGE
            ================================================= */}

            <label className="upload-title">
              Primary Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={
                handlePrimaryImage
              }
            />

            {form.primaryPreview && (

              <div className="primary-preview">

                <img
                  src={
                    form.primaryPreview
                  }
                  alt="Preview"
                  className="preview-image"
                />

              </div>

            )}

            {/* =================================================
                SECONDARY IMAGES
            ================================================= */}

            <div className="secondary-section">

              <div className="secondary-header">

                <h3>
                  Secondary Images
                </h3>

                <button
                  type="button"
                  onClick={
                    addSecondaryImage
                  }
                >
                  + Add Secondary Image
                </button>

              </div>

              {form.secondaryImages.map(
                (
                  item,
                  index
                ) => (

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
                        src={
                          item.preview
                        }
                        alt="Secondary Preview"
                        className="preview-image"
                      />

                    )}

                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() =>
                        removeSecondaryImage(
                          index
                        )
                      }
                    >
                      Remove
                    </button>

                  </div>

                )
              )}

            </div>

            {/* =================================================
                PRODUCT NAME
            ================================================= */}

            <input
              type="text"
              placeholder="Product Name"
              value={
                form.name
              }
              onChange={(e) =>
                setForm(
                  (prev) => ({
                    ...prev,

                    name:
                      e.target.value,
                  })
                )
              }
            />

            {/* =================================================
                PRODUCT OVERVIEW
            ================================================= */}

            <textarea
              rows="4"
              placeholder="Product Overview"
              value={
                form.overview
              }
              onChange={(e) =>
                setForm(
                  (prev) => ({
                    ...prev,

                    overview:
                      e.target.value,
                  })
                )
              }
            />

            {/* =================================================
                PRODUCT DESCRIPTION
            ================================================= */}

            <textarea
              rows="6"
              placeholder="Product Description"
              value={
                form.description
              }
              onChange={(e) =>
                setForm(
                  (prev) => ({
                    ...prev,

                    description:
                      e.target.value,
                  })
                )
              }
            />

            {/* =================================================
                SPECIFICATIONS
            ================================================= */}

            <div className="specification-section">

              <div className="specification-header">

                <h3>
                  Specifications
                </h3>

                <button
                  type="button"
                  onClick={
                    addSpecification
                  }
                >
                  + Add Specification
                </button>

              </div>

              {form.specifications.map(
                (
                  spec,
                  index
                ) => (

                  <div
                    key={index}
                    className="specification-row"
                  >

                    <input
                      type="text"
                      placeholder="Title"
                      value={
                        spec.title
                      }
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
                      value={
                        spec.value
                      }
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
                        removeSpecification(
                          index
                        )
                      }
                    >
                      Remove
                    </button>

                  </div>

                )
              )}

            </div>

            {/* =================================================
                SAVE / CANCEL
            ================================================= */}

            <div className="btns">

              <button
                type="button"
                onClick={
                  saveProduct
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
                  ? "Update Product"
                  : "Save Product"}
              </button>

              <button
                type="button"
                onClick={
                  resetForm
                }
              >
                Cancel
              </button>

            </div>

          </div>

        )}

      {/* =================================================
          PRODUCTS TABLE
      ================================================= */}

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
                Category
              </th>

              <th>
                Product Name
              </th>

              <th>
                Description
              </th>

              <th>
                Secondary Images
              </th>

              <th>
                Specifications
              </th>

              <th>
                Type
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan="9"
                  className="table-message"
                >
                  Loading Products...
                </td>

              </tr>

            ) : products.length > 0 ? (

              currentProducts.map(
                (
                  item,
                  index
                ) => (

                  <tr
                    key={
                      item.id
                    }
                  >

                    {/* Number */}

                    <td>
                      {startIndex +
                        index +
                        1}
                    </td>

                    {/* Preview */}

                    <td>

                      {item.primaryImage ? (

                        <img
                          src={
                            item.primaryImage
                          }
                          alt={
                            item.name
                          }
                          className="preview-image"
                        />

                      ) : (
                        "-"
                      )}

                    </td>

                    {/* Category */}

                    <td>

                      <span className="category-badge">
                        {
                          item.category
                        }
                      </span>

                    </td>

                    {/* Product Name */}

                    <td>
                      {
                        item.name
                      }
                    </td>

                    {/* Description */}

                    <td>
                      {
                        item.description ||
                        "-"
                      }
                    </td>

                    {/* Secondary Images */}

                    <td>

                      {
                        item.secondaryImages
                          ? item
                              .secondaryImages
                              .length
                          : 0
                      }{" "}
                      Images

                    </td>

                    {/* Specifications */}

                    <td>

                      {
                        item.specifications
                          ? item
                              .specifications
                              .length
                          : 0
                      }{" "}
                      Specs

                    </td>

                    {/* Type */}

                    <td>
                      Image
                    </td>

                    {/* Action */}

                    <td className="action-buttons">

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

                    </td>

                  </tr>

                )
              )

            ) : (

              <tr>

                <td
                  colSpan="9"
                  className="table-message no-products"
                >

                  No products found.

                  <br />

                  Click{" "}

                  <strong>
                    + Add Product
                  </strong>{" "}

                  to add your first
                  product.

                </td>

              </tr>

            )}

          </tbody>

        </table>

        {/* =================================================
            PAGINATION
        ================================================= */}

        {totalPages > 1 && (

          <div className="pagination">

            {/* Previous */}

            <button
              type="button"
              className="pagination-btn previous-next"
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

            {Array.from(
              {
                length:
                  totalPages,
              },
              (_, index) =>
                index + 1
            ).map(
              (page) => (

                <button
                  type="button"
                  key={page}
                  className={
                    currentPage ===
                    page
                      ? "pagination-btn active"
                      : "pagination-btn"
                  }
                  onClick={() =>
                    goToPage(
                      page
                    )
                  }
                >
                  {page}
                </button>

              )
            )}

            {/* Next */}

            <button
              type="button"
              className="pagination-btn previous-next"
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
            PAGINATION INFO
        ================================================= */}

        {products.length > 0 && (

          <div className="pagination-info">

            Showing{" "}

            <strong>
              {startIndex + 1}
            </strong>{" "}

            -{" "}

            <strong>
              {Math.min(
                endIndex,
                products.length
              )}
            </strong>{" "}

            of{" "}

            <strong>
              {products.length}
            </strong>{" "}

            products

          </div>

        )}

      </div>

    </div>
  );
};

export default Shop;