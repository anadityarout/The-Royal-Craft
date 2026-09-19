import React, { useEffect, useState } from "react";
import "./About.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/about-page";

const About = () => {
  const [showForm, setShowForm] = useState(false);

  // about | banner
  const [selectedType, setSelectedType] = useState(null);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const [abouts, setAbouts] = useState([]);
  const [banner, setBanner] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // ==========================================
  // ABOUT FORM
  // ==========================================

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

  // ==========================================
  // BANNER FORM
  // ==========================================

  const [bannerForm, setBannerForm] = useState({
    image: null,
    preview: "",
    name: "",
    description: "",
  });

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // ======================================
      // LOAD ABOUT PAGE
      // ======================================

      const aboutResponse = await fetch(API_URL);

      if (!aboutResponse.ok) {
        throw new Error("Failed to load About data.");
      }

      const aboutData = await aboutResponse.json();

      console.log("ABOUT DATA:", aboutData);

      setAbouts(Array.isArray(aboutData) ? aboutData : []);


      // ======================================
      // LOAD ABOUT BANNER
      // ======================================

      const bannerResponse = await fetch(
        `${API_URL}?type=banner`
      );

      if (bannerResponse.ok) {
        const bannerData = await bannerResponse.json();

        console.log("BANNER DATA:", bannerData);

        if (
          bannerData &&
          typeof bannerData === "object" &&
          bannerData.image
        ) {
          setBanner(bannerData);
        } else {
          setBanner(null);
        }
      }

    } catch (err) {
      console.error(err);

      setAbouts([]);
      setBanner(null);

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // IMAGE UPLOAD
  // ==========================================

  const uploadImage = async (file, type = "about") => {

    if (!file) {
      throw new Error("Please select an image.");
    }

    const response = await fetch(
      `${API_URL}?upload=true&fileName=${encodeURIComponent(
        file.name
      )}&fileType=${encodeURIComponent(
        file.type
      )}&type=${encodeURIComponent(type)}`
    );

    if (!response.ok) {
      throw new Error("Unable to get upload URL.");
    }

    const uploadData = await response.json();

    console.log("UPLOAD DATA:", uploadData);

    const upload = await fetch(
      uploadData.uploadUrl,
      {
        method: "PUT",

        headers: {
          "Content-Type": file.type,
        },

        body: file,
      }
    );

    if (!upload.ok) {
      throw new Error("Image upload failed.");
    }

    return uploadData.fileUrl;
  };


  // ==========================================
  // ABOUT IMAGE HANDLERS
  // ==========================================

  const handleSlideImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setForm((prev) => ({
      ...prev,

      slideImage: file,

      slidePreview:
        URL.createObjectURL(file),
    }));
  };


  const handleStoryImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setForm((prev) => ({
      ...prev,

      storyImage: file,

      storyPreview:
        URL.createObjectURL(file),
    }));
  };


  const handleFounderImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setForm((prev) => ({
      ...prev,

      founderImage: file,

      founderPreview:
        URL.createObjectURL(file),
    }));
  };


  const handleLifeImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setForm((prev) => ({
      ...prev,

      lifeImage: file,

      lifePreview:
        URL.createObjectURL(file),
    }));
  };


  // ==========================================
  // BANNER IMAGE HANDLER
  // ==========================================

  const handleBannerImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setBannerForm((prev) => ({
      ...prev,

      image: file,

      preview:
        URL.createObjectURL(file),
    }));
  };


  // ==========================================
  // RESET ABOUT FORM
  // ==========================================

  const resetAboutForm = () => {

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

    setIsEditing(false);
    setEditId(null);

    setShowForm(false);
    setSelectedType(null);
  };


  // ==========================================
  // RESET BANNER FORM
  // ==========================================

  const resetBannerForm = () => {

    setBannerForm({
      image: null,
      preview: "",

      name: "",
      description: "",
    });

    setIsEditing(false);
    setEditId(null);

    setShowForm(false);
    setSelectedType(null);
  };


  // ==========================================
  // OPEN ADD DROPDOWN
  // ==========================================

  const handleAddClick = () => {

    setShowTypeDropdown((prev) => !prev);

  };


  // ==========================================
  // SELECT BANNER
  // ==========================================

  const openBannerForm = () => {

    setSelectedType("banner");

    setShowTypeDropdown(false);

    setIsEditing(false);

    setEditId(null);

    if (banner) {

      setBannerForm({
        image: null,

        preview: banner.image || "",

        name: banner.name || "",

        description:
          banner.description || "",
      });

    } else {

      setBannerForm({
        image: null,
        preview: "",
        name: "",
        description: "",
      });

    }

    setShowForm(true);
  };


  // ==========================================
  // SELECT ABOUT PAGE
  // ==========================================

  const openAboutForm = () => {

    setSelectedType("about");

    setShowTypeDropdown(false);

    setIsEditing(false);

    setEditId(null);

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

    setShowForm(true);
  };


  // ==========================================
  // SAVE BANNER
  // ==========================================

  const saveBanner = async () => {

    try {

      setSaving(true);

      let image =
        bannerForm.preview || "";

      // Upload new image
      if (bannerForm.image) {

        image = await uploadImage(
          bannerForm.image,
          "banner"
        );
      }

      if (!image) {

        alert("Please select a banner image.");

        setSaving(false);

        return;
      }

      if (!bannerForm.name.trim()) {

        alert("Please enter banner name.");

        setSaving(false);

        return;
      }

      const payload = {

        id: "about-banner",

        image,

        name:
          bannerForm.name.trim(),

        description:
          bannerForm.description.trim(),
      };

      console.log(
        "SAVING BANNER:",
        payload
      );

      const response = await fetch(
        `${API_URL}?type=banner`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(payload),
        }
      );

      if (!response.ok) {

        throw new Error(
          "Failed to save banner."
        );
      }

      await loadData();

      resetBannerForm();

      alert(
        "Banner saved successfully."
      );

    } catch (err) {

      console.error(err);

      alert(err.message);

    } finally {

      setSaving(false);
    }
  };


  // ==========================================
  // EDIT BANNER
  // ==========================================

  const editBanner = () => {

    if (!banner) return;

    setSelectedType("banner");

    setIsEditing(true);

    setEditId(
      banner.id || "about-banner"
    );

    setBannerForm({

      image: null,

      preview:
        banner.image || "",

      name:
        banner.name || "",

      description:
        banner.description || "",
    });

    setShowForm(true);
  };


  // ==========================================
  // DELETE BANNER
  // ==========================================

  const deleteBanner = async () => {

    if (
      !window.confirm(
        "Delete this About Banner?"
      )
    ) {
      return;
    }

    try {

      setSaving(true);

      const response = await fetch(
        `${API_URL}?type=banner`,
        {
          method: "DELETE",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            id:
              banner?.id ||
              "about-banner",
          }),
        }
      );

      if (!response.ok) {

        throw new Error(
          "Failed to delete banner."
        );
      }

      await loadData();

      alert(
        "Banner deleted successfully."
      );

    } catch (err) {

      console.error(err);

      alert(
        "Failed to delete banner."
      );

    } finally {

      setSaving(false);
    }
  };


  // ==========================================
  // SAVE ABOUT
  // ==========================================

  const saveAbout = async () => {

    try {

      setSaving(true);

      let slideImage =
        form.slidePreview;

      let storyImage =
        form.storyPreview;

      let founderImage =
        form.founderPreview;

      let lifeImage =
        form.lifePreview;


      // Upload Slide Image

      if (form.slideImage) {

        slideImage =
          await uploadImage(
            form.slideImage,
            "about"
          );
      }


      // Upload Story Image

      if (form.storyImage) {

        storyImage =
          await uploadImage(
            form.storyImage,
            "about"
          );
      }


      // Upload Founder Image

      if (form.founderImage) {

        founderImage =
          await uploadImage(
            form.founderImage,
            "about"
          );
      }


      // Upload Life Image

      if (form.lifeImage) {

        lifeImage =
          await uploadImage(
            form.lifeImage,
            "about"
          );
      }


      // Slide image required when adding

      if (
        !isEditing &&
        !slideImage
      ) {

        alert(
          "Please select a slide image."
        );

        setSaving(false);

        return;
      }


      const payload = {

        id: editId,

        slideImage,

        storyImage,

        founderImage,

        lifeImage,

        name:
          form.name.trim(),

        description:
          form.description.trim(),
      };


      console.log(
        "SAVING ABOUT:",
        payload
      );


      const response =
        await fetch(API_URL, {

          method:
            isEditing
              ? "PUT"
              : "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(payload),
        });


      if (!response.ok) {

        throw new Error(
          isEditing
            ? "Failed to update About."
            : "Failed to save About."
        );
      }


      await loadData();

      resetAboutForm();


      alert(
        isEditing
          ? "About updated successfully."
          : "About saved successfully."
      );

    } catch (err) {

      console.error(err);

      alert(err.message);

    } finally {

      setSaving(false);
    }
  };


  // ==========================================
  // EDIT ABOUT
  // ==========================================

  const editAbout = (item) => {

    setSelectedType("about");

    setIsEditing(true);

    setEditId(item.id);

    setForm({

      slideImage: null,

      slidePreview:
        item.slideImage || "",

      storyImage: null,

      storyPreview:
        item.storyImage || "",

      founderImage: null,

      founderPreview:
        item.founderImage || "",

      lifeImage: null,

      lifePreview:
        item.lifeImage || "",

      name:
        item.name || "",

      description:
        item.description || "",
    });

    setShowForm(true);
  };


  // ==========================================
  // DELETE ABOUT
  // ==========================================

  const deleteAbout = async (id) => {

    if (
      !window.confirm(
        "Delete this About section?"
      )
    ) {
      return;
    }

    try {

      setSaving(true);

      const response =
        await fetch(API_URL, {

          method: "DELETE",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({ id }),
        });


      if (!response.ok) {

        throw new Error(
          "Delete failed"
        );
      }


      await loadData();

      alert(
        "Deleted successfully."
      );

    } catch (err) {

      console.error(err);

      alert(
        "Delete failed."
      );

    } finally {

      setSaving(false);
    }
  };


  // ==========================================
  // CANCEL
  // ==========================================

  const handleCancel = () => {

    if (
      selectedType === "banner"
    ) {

      resetBannerForm();

    } else {

      resetAboutForm();
    }
  };


  // ==========================================
  // RETURN
  // ==========================================

  return (

    <div className="about-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="header">

        <h2>
          About Page
        </h2>


        <div className="add-image-wrapper">

          <button
            className="add-image-btn"
            onClick={handleAddClick}
          >
            + Add Image
          </button>


          {showTypeDropdown && (

            <div className="add-image-dropdown">

              <button
                onClick={openBannerForm}
              >
                Banner
              </button>


              <button
                onClick={openAboutForm}
              >
                About Page
              </button>

            </div>

          )}

        </div>

      </div>


      {/* =====================================
          BANNER FORM
      ===================================== */}

      {showForm &&
        selectedType === "banner" && (

        <div className="upload-box">

          <h3>
            About Page Banner
          </h3>


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


          {bannerForm.preview && (

            <img
              src={
                bannerForm.preview
              }
              alt="Banner Preview"
              className="preview-image"
            />

          )}


          <label className="upload-title">
            Banner Name
          </label>


          <input
            type="text"
            placeholder="Enter Banner Name"
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


          <label className="upload-title">
            Banner Description
          </label>


          <textarea
            rows="5"
            placeholder="Enter Banner Description"
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


          <div className="btns">

            <button
              onClick={saveBanner}
              disabled={saving}
            >

              {saving
                ? "Saving..."
                : isEditing
                ? "Update"
                : "Save"}

            </button>


            <button
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>

          </div>

        </div>

      )}


      {/* =====================================
          ABOUT PAGE FORM
      ===================================== */}

      {showForm &&
        selectedType === "about" && (

        <div className="upload-box">

          <h3>
            About Page Content
          </h3>


          {/* Slide Image */}

          <label className="upload-title">
            Slide Image
          </label>


          <input
            type="file"
            accept="image/*"
            onChange={
              handleSlideImage
            }
          />


          {form.slidePreview && (

            <img
              src={
                form.slidePreview
              }
              alt="Slide Preview"
              className="preview-image"
            />

          )}


          {/* About Name */}

          <label className="upload-title">
            About Name
          </label>


          <input
            type="text"
            placeholder="Enter About Name"
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


          {/* About Description */}

          <label className="upload-title">
            About Description
          </label>


          <textarea
            rows="5"
            placeholder="Enter About Description"
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


          {/* Our Story */}

          <label className="upload-title">
            Our Story Image
          </label>


          <input
            type="file"
            accept="image/*"
            onChange={
              handleStoryImage
            }
          />


          {form.storyPreview && (

            <img
              src={
                form.storyPreview
              }
              alt="Story"
              className="preview-image"
            />

          )}


          {/* Founder */}

          <label className="upload-title">
            Founder's Vision Image
          </label>


          <input
            type="file"
            accept="image/*"
            onChange={
              handleFounderImage
            }
          />


          {form.founderPreview && (

            <img
              src={
                form.founderPreview
              }
              alt="Founder"
              className="preview-image"
            />

          )}


          {/* Life */}

          <label className="upload-title">
            Life at Royal Kraft Image
          </label>


          <input
            type="file"
            accept="image/*"
            onChange={
              handleLifeImage
            }
          />


          {form.lifePreview && (

            <img
              src={
                form.lifePreview
              }
              alt="Life"
              className="preview-image"
            />

          )}


          {/* Buttons */}

          <div className="btns">

            <button
              onClick={saveAbout}
              disabled={saving}
            >

              {saving
                ? isEditing
                  ? "Updating..."
                  : "Saving..."
                : isEditing
                ? "Update"
                : "Save"}

            </button>


            <button
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>

          </div>

        </div>

      )}


      {/* =====================================
          BANNER TABLE
      ===================================== */}

      {banner && (

        <div className="banner-table-section">

          <h3>
            About Page Banner
          </h3>


          <div className="table-container">

            <table>

              <thead>

                <tr>

                  <th>
                    Image
                  </th>

                  <th>
                    Banner Name
                  </th>

                  <th>
                    Description
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                <tr>

                  <td>

                    {banner.image ? (

                      <img
                        src={
                          banner.image
                        }
                        alt="Banner"
                        className="preview-image"
                      />

                    ) : (
                      "-"
                    )}

                  </td>


                  <td>

                    {banner.name ||
                      "-"}

                  </td>


                  <td
                    style={{
                      maxWidth:
                        "350px",

                      whiteSpace:
                        "pre-wrap",

                      wordBreak:
                        "break-word",
                    }}
                  >

                    {banner.description ||
                      "-"}

                  </td>


                  <td>

                    <button
                      className="edit-btn"
                      onClick={
                        editBanner
                      }
                      disabled={saving}
                    >
                      Edit
                    </button>


                    <button
                      className="delete-btn"
                      onClick={
                        deleteBanner
                      }
                      disabled={saving}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>

      )}


      {/* =====================================
          ABOUT TABLE
      ===================================== */}

      <div className="table-container">

        {loading ? (

          <div
            style={{
              textAlign:
                "center",

              padding:
                "40px",

              fontSize:
                "18px",
            }}
          >
            Loading About Data...
          </div>

        ) : (

          <table>

            <thead>

              <tr>

                <th>
                  No
                </th>

                <th>
                  Slide Image
                </th>

                <th>
                  About Name
                </th>

                <th>
                  Description
                </th>

                <th>
                  Our Story
                </th>

                <th>
                  Founder Vision
                </th>

                <th>
                  Life at Royal Kraft
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {abouts.length > 0 ? (

                abouts.map(
                  (item, index) => (

                    <tr
                      key={item.id}
                    >

                      <td>
                        {index + 1}
                      </td>


                      {/* Slide */}

                      <td>

                        {item.slideImage ? (

                          <img
                            src={
                              item.slideImage
                            }
                            alt="Slide"
                            className="preview-image"
                          />

                        ) : (
                          "-"
                        )}

                      </td>


                      {/* Name */}

                      <td>

                        {item.name ||
                          "-"}

                      </td>


                      {/* Description */}

                      <td
                        style={{
                          maxWidth:
                            "350px",

                          whiteSpace:
                            "pre-wrap",

                          wordBreak:
                            "break-word",
                        }}
                      >

                        {item.description ||
                          "-"}

                      </td>


                      {/* Story */}

                      <td>

                        {item.storyImage ? (

                          <img
                            src={
                              item.storyImage
                            }
                            alt="Story"
                            className="preview-image"
                          />

                        ) : (
                          "-"
                        )}

                      </td>


                      {/* Founder */}

                      <td>

                        {item.founderImage ? (

                          <img
                            src={
                              item.founderImage
                            }
                            alt="Founder"
                            className="preview-image"
                          />

                        ) : (
                          "-"
                        )}

                      </td>


                      {/* Life */}

                      <td>

                        {item.lifeImage ? (

                          <img
                            src={
                              item.lifeImage
                            }
                            alt="Life"
                            className="preview-image"
                          />

                        ) : (
                          "-"
                        )}

                      </td>


                      {/* Action */}

                      <td>

                        <button
                          className="edit-btn"
                          onClick={() =>
                            editAbout(
                              item
                            )
                          }
                          disabled={
                            saving
                          }
                        >
                          Edit
                        </button>


                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteAbout(
                              item.id
                            )
                          }
                          disabled={
                            saving
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
                    colSpan="8"
                    style={{
                      textAlign:
                        "center",

                      padding:
                        "40px",

                      color:
                        "#777",
                    }}
                  >

                    No About data
                    found.

                    <br />

                    Click
                    <strong>
                      {" "}
                      + Add Image
                    </strong>
                    {" "}
                    to upload your
                    first About
                    section.

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