import React, { useState } from "react";
import "./Lead.css";

const Leads = () => {

  const [leads, setLeads] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedLead, setSelectedLead] = useState(null);

  const [showPopup, setShowPopup] = useState(false);

  const filteredLeads = leads.filter((lead) => {

    const matchesSearch =
      lead.name?.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone?.includes(search) ||
      lead.email?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      lead.status === statusFilter;

    return matchesSearch && matchesStatus;

  });

  const openLead = (lead) => {
    setSelectedLead(lead);
    setShowPopup(true);
  };

  const closePopup = () => {
    setSelectedLead(null);
    setShowPopup(false);
  };

  const deleteLead = (id) => {
    setLeads(leads.filter((lead) => lead.id !== id));
  };

  return (
    <div className="leads-page">

  <div className="header">
    <h2>Customer Leads</h2>
  </div>

  <div className="top-bar">

    <input
      type="text"
      placeholder="Search by Name, Phone or Email..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="search-box"
    />

    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="filter-select"
    >
      <option value="All">All Status</option>
      <option value="New">New</option>
      <option value="Contacted">Contacted</option>
      <option value="Closed">Closed</option>
    </select>

  </div>

  <div className="table-container">

    <table>

      <thead>

        <tr>
          <th>No</th>
          <th>Full Name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>City</th>
          <th>Service</th>
          <th>Budget</th>
          <th>Date</th>
          <th>Status</th>
          <th>Action</th>
        </tr>

      </thead>

      <tbody>

        {filteredLeads.length > 0 ? (

          filteredLeads.map((lead, index) => (

            <tr key={lead.id}>

              <td>{index + 1}</td>

              <td>{lead.name}</td>

              <td>{lead.phone}</td>

              <td>{lead.email}</td>

              <td>{lead.city}</td>

              <td>{lead.service}</td>

              <td>{lead.budget}</td>

              <td>{lead.date}</td>

              <td>
                <span className={`status ${lead.status.toLowerCase()}`}>
                  {lead.status}
                </span>
              </td>

              <td>

                <button
                  className="view-btn"
                  onClick={() => openLead(lead)}
                >
                  View
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteLead(lead.id)}
                >
                  Delete
                </button>

              </td>

            </tr>

          ))

        ) : (

          <tr>

            <td
              colSpan="10"
              style={{
                textAlign: "center",
                padding: "50px",
                color: "#777",
                fontSize: "16px",
              }}
            >
              <strong>No leads found.</strong>

              <br />
              <br />

              Customer enquiries submitted from your website
              will appear here automatically.

            </td>

          </tr>

        )}

      </tbody>

    </table>

  </div>

        {showPopup && selectedLead && (

        <div className="popup-overlay">

          <div className="popup">

            <h2>Customer Lead Details</h2>

            <div className="popup-content">

              <div className="popup-row">
                <strong>Full Name</strong>
                <span>{selectedLead.name}</span>
              </div>

              <div className="popup-row">
                <strong>Phone Number</strong>
                <span>{selectedLead.phone}</span>
              </div>

              <div className="popup-row">
                <strong>Email Address</strong>
                <span>{selectedLead.email}</span>
              </div>

              <div className="popup-row">
                <strong>City</strong>
                <span>{selectedLead.city}</span>
              </div>

              <div className="popup-row">
                <strong>Service</strong>
                <span>{selectedLead.service}</span>
              </div>

              <div className="popup-row">
                <strong>Budget</strong>
                <span>{selectedLead.budget}</span>
              </div>

              <div className="popup-row">
                <strong>Project Details</strong>
                <span>{selectedLead.project}</span>
              </div>

              <div className="popup-row">
                <strong>Date</strong>
                <span>{selectedLead.date}</span>
              </div>

              <div className="popup-row">
                <strong>Status</strong>

                <select
                  value={selectedLead.status}
                  onChange={(e) =>
                    setSelectedLead({
                      ...selectedLead,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Closed">Closed</option>
                </select>

              </div>

            </div>

            <div className="popup-buttons">

              <button
                className="save-btn"
                onClick={() => {

                  setLeads(
                    leads.map((lead) =>
                      lead.id === selectedLead.id
                        ? selectedLead
                        : lead
                    )
                  );

                  closePopup();

                }}
              >
                Save
              </button>

              <button
                className="close-btn"
                onClick={closePopup}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

export default Leads;