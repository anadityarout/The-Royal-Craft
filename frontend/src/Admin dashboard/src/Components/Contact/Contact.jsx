import React, { useState } from "react";
import "./Contact.css";

const Contact = () => {

  const [showForm, setShowForm] = useState(false);

  const [contacts, setContacts] = useState([]);

  const [form, setForm] = useState({
    image: null,
    preview: "",

    name: "",

    description: "",
  });

  // Upload Contact Image
  const handleImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setForm({
      ...form,
      image: file,
      preview: URL.createObjectURL(file),
    });

  };

  // Reset Form
  const resetForm = () => {

    setForm({
      image: null,
      preview: "",

      name: "",

      description: "",
    });

    setShowForm(false);

  };

  return (
    <div className="contact-page">

  <div className="header">

    <h2>Contact Page</h2>

    <button onClick={() => setShowForm(true)}>
      + Add Image
    </button>

  </div>

  {showForm && (

    <div className="upload-box">

      <label className="upload-title">
        Contact Image
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handleImage}
      />

      {form.preview && (
        <img
          src={form.preview}
          alt="Contact Preview"
          className="preview-image"
        />
      )}

      <label className="upload-title">
        Contact Name
      </label>

      <input
        type="text"
        placeholder="Enter Contact Name"
        value={form.name}
        onChange={(e) =>
          setForm({
            ...form,
            name: e.target.value,
          })
        }
      />

      <label className="upload-title">
        Contact Description
      </label>

      <textarea
        placeholder="Enter Contact Description"
        rows="5"
        value={form.description}
        onChange={(e) =>
          setForm({
            ...form,
            description: e.target.value,
          })
        }
      />

      <div className="btns">

        <button
          onClick={() => {

            const newContact = {
              id: Date.now(),
              preview: form.preview,
              name: form.name,
              description: form.description,
              type: "Image",
            };

            setContacts([...contacts, newContact]);

            resetForm();

          }}
        >
          Save
        </button>

        <button onClick={resetForm}>
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
              <th>Contact Image</th>
              <th>Contact Name</th>
              <th>Description</th>
              <th>Type</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {contacts.length > 0 ? (

              contacts.map((item, index) => (

                <tr key={item.id}>

                  <td>{index + 1}</td>

                  <td>

                    {item.preview ? (
                      <img
                        src={item.preview}
                        alt="Contact"
                        className="preview-image"
                      />
                    ) : (
                      "-"
                    )}

                  </td>

                  <td>{item.name}</td>

                  <td>

                    {item.description
                      ? item.description
                      : "-"}

                  </td>

                  <td>{item.type}</td>

                  <td>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        setContacts(
                          contacts.filter(
                            (contact) =>
                              contact.id !== item.id
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
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#777",
                  }}
                >
                  No contact data found.
                  <br />
                  Click <strong>+ Add Image</strong> to add your Contact section.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

};

export default Contact;