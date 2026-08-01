import React, { useState } from "react";
import "./BlogPage.css";

const BlogPage = () => {

  const [showForm, setShowForm] = useState(false);

  const [blogs, setBlogs] = useState([]);

  const [form, setForm] = useState({
    primaryImage: null,
    primaryPreview: "",
    secondaryImages: [],
    imageName: "",
    description: "",
    link: "",
  });

  // ==========================
  // Primary Image
  // ==========================

  const handlePrimaryImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setForm({
      ...form,
      primaryImage: file,
      primaryPreview: URL.createObjectURL(file),
    });

  };

  // ==========================
  // Add Secondary Image
  // ==========================

  const addSecondaryImage = () => {

    setForm({
      ...form,
      secondaryImages: [
        ...form.secondaryImages,
        {
          image: null,
          preview: "",
        },
      ],
    });

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

    setForm({
      ...form,
      secondaryImages: updated,
    });

  };

  // ==========================
  // Remove Secondary Image
  // ==========================

  const removeSecondaryImage = (index) => {

    const updated = [...form.secondaryImages];

    updated.splice(index, 1);

    setForm({
      ...form,
      secondaryImages: updated,
    });

  };

  return (
<div className="blog-page">

  <div className="header">

    <h2>Blog Page</h2>

    <button onClick={() => setShowForm(true)}>
      + Add Blog
    </button>

  </div>

  {showForm && (

    <div className="upload-box">

      {/* Primary Image */}

      <label className="upload-title">
        Primary Image
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handlePrimaryImage}
      />

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

      {/* Image Name */}

      <label className="upload-title">
        Image Name
      </label>

      <input
        type="text"
        placeholder="Enter Image Name"
        value={form.imageName}
        onChange={(e) =>
          setForm({
            ...form,
            imageName: e.target.value,
          })
        }
      />

      {/* Description */}

      <label className="upload-title">
        Description
      </label>

      <textarea
        rows="6"
        placeholder="Enter Blog Description"
        value={form.description}
        onChange={(e) =>
          setForm({
            ...form,
            description: e.target.value,
          })
        }
      />

      {/* Blog Link */}

      <label className="upload-title">
        Blog Link
      </label>

      <input
        type="text"
        placeholder="https://example.com/blog"
        value={form.link}
        onChange={(e) =>
          setForm({
            ...form,
            link: e.target.value,
          })
        }
      />

      {/* Buttons */}

      <div className="btns">

        <button
          onClick={() => {

            if (
              !form.primaryImage ||
              !form.imageName
            ) {
              alert(
                "Primary Image and Image Name are required."
              );
              return;
            }

            const newBlog = {
              id: Date.now(),
              primaryPreview: form.primaryPreview,
              secondaryImages: form.secondaryImages,
              imageName: form.imageName,
              description: form.description,
              link: form.link,
              type: "Image",
            };

            setBlogs([
              ...blogs,
              newBlog,
            ]);

            setForm({
              primaryImage: null,
              primaryPreview: "",
              secondaryImages: [],
              imageName: "",
              description: "",
              link: "",
            });

            setShowForm(false);

          }}
        >
          Save
        </button>

        <button
          onClick={() => {

            setShowForm(false);

            setForm({
              primaryImage: null,
              primaryPreview: "",
              secondaryImages: [],
              imageName: "",
              description: "",
              link: "",
            });

          }}
        >
          Cancel
        </button>

      </div>

    </div>

  )}

        <div className="table-container">

        <table>

          <thead>

            <tr>
              <th>No</th>
              <th>Preview</th>
              <th>Image Name</th>
              <th>Description</th>
              <th>Secondary Images</th>
              <th>Blog Link</th>
              <th>Type</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {blogs.length > 0 ? (

              blogs.map((item, index) => (

                <tr key={item.id}>

                  <td>{index + 1}</td>

                  <td>

                    <img
                      src={item.primaryPreview}
                      alt={item.imageName}
                      className="preview-image"
                    />

                  </td>

                  <td>{item.imageName}</td>

                  <td>

                    {item.description
                      ? item.description
                      : "-"}

                  </td>

                  <td>

                    {item.secondaryImages.length} Images

                  </td>

                  <td>

                    {item.link ? (

                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Link
                      </a>

                    ) : (

                      "-"

                    )}

                  </td>

                  <td>{item.type}</td>

                  <td>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        setBlogs(
                          blogs.filter(
                            (blog) =>
                              blog.id !== item.id
                          )
                        )
                      }
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
                  No blogs found.
                  <br />
                  Click <strong>+ Add Blog</strong> to create your first blog.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

};

export default BlogPage;