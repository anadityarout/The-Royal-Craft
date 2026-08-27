// Leads.jsx

import React, { useEffect, useState } from "react";
import "./Lead.css";

// =====================================================
// AWS CUSTOMER API
// =====================================================

const CUSTOMER_API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/customer";

// =====================================================
// AWS CONSULTANT API
// =====================================================

const CONSULTANT_API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/consultant";

// =====================================================
// AWS SHOP ENQUIRY API
// =====================================================

const ENQUIRY_API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/enquiry";

// =====================================================
// LEADS COMPONENT
// =====================================================

const Leads = () => {
  // =====================================================
  // ACTIVE SECTION
  // =====================================================

  const [activeSection, setActiveSection] =
    useState("shop");

  // =====================================================
  // SHOP DATA
  // =====================================================

  const [shopData, setShopData] = useState([]);
  const [shopLoading, setShopLoading] =
    useState(false);
  const [shopError, setShopError] =
    useState("");

  // =====================================================
  // CUSTOMER DATA
  // =====================================================

  const [customers, setCustomers] =
    useState([]);

  const [customersLoading, setCustomersLoading] =
    useState(false);

  const [customersError, setCustomersError] =
    useState("");

  // =====================================================
  // CUSTOMER POPUP
  // =====================================================

  const [selectedCustomer, setSelectedCustomer] =
    useState(null);

  const [showCustomerPopup, setShowCustomerPopup] =
    useState(false);

  // =====================================================
  // CONSULTANT DATA
  // =====================================================

  const [consultants, setConsultants] =
    useState([]);

  const [consultantsLoading, setConsultantsLoading] =
    useState(false);

  const [consultantsError, setConsultantsError] =
    useState("");

  // =====================================================
  // CONSULTANT POPUP
  // =====================================================

  const [selectedConsultant, setSelectedConsultant] =
    useState(null);

  const [showConsultantPopup, setShowConsultantPopup] =
    useState(false);

  // =====================================================
  // SHOP POPUP
  // =====================================================

  const [selectedShop, setSelectedShop] =
    useState(null);

  const [showShopPopup, setShowShopPopup] =
    useState(false);

  // =====================================================
  // DELETE SHOP LOADING
  // =====================================================

  const [deletingShopId, setDeletingShopId] =
    useState(null);

  // =====================================================
  // LOAD SHOP ENQUIRIES
  // =====================================================

  const loadShopData = async () => {
    setShopLoading(true);
    setShopError("");

    try {
      const response = await fetch(
        ENQUIRY_API_URL,
        {
          method: "GET",
        }
      );

      const result =
        await response.json();

      console.log(
        "Shop enquiry API response:",
        result
      );

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to load shop enquiries."
        );
      }

      setShopData(
        Array.isArray(result.enquiries)
          ? result.enquiries
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load shop enquiries:",
        error
      );

      setShopError(
        error.message ||
          "Unable to load shop enquiries."
      );

      setShopData([]);
    } finally {
      setShopLoading(false);
    }
  };

  // =====================================================
  // LOAD CUSTOMERS
  // =====================================================

  const loadCustomers = async () => {
    setCustomersLoading(true);
    setCustomersError("");

    try {
      const response = await fetch(
        CUSTOMER_API_URL,
        {
          method: "GET",
        }
      );

      const result =
        await response.json();

      console.log(
        "Customer API response:",
        result
      );

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to load customers."
        );
      }

      setCustomers(
        Array.isArray(result.customers)
          ? result.customers
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load customers:",
        error
      );

      setCustomersError(
        error.message ||
          "Unable to load customers."
      );

      setCustomers([]);
    } finally {
      setCustomersLoading(false);
    }
  };

  // =====================================================
  // LOAD CONSULTANTS
  // =====================================================

  const loadConsultants = async () => {
    setConsultantsLoading(true);
    setConsultantsError("");

    try {
      const response = await fetch(
        CONSULTANT_API_URL,
        {
          method: "GET",
        }
      );

      const result =
        await response.json();

      console.log(
        "Consultant API response:",
        result
      );

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to load consultants."
        );
      }

      setConsultants(
        Array.isArray(
          result.consultants
        )
          ? result.consultants
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load consultants:",
        error
      );

      setConsultantsError(
        error.message ||
          "Unable to load consultants."
      );

      setConsultants([]);
    } finally {
      setConsultantsLoading(false);
    }
  };

  // =====================================================
  // LOAD DATA WHEN SECTION CHANGES
  // =====================================================

  useEffect(() => {
    if (activeSection === "all") {
      loadShopData();
      loadCustomers();
      loadConsultants();
    }

    if (activeSection === "shop") {
      loadShopData();
    }

    if (activeSection === "customers") {
      loadCustomers();
    }

    if (
      activeSection === "consultants"
    ) {
      loadConsultants();
    }
  }, [activeSection]);

  // =====================================================
  // OPEN SHOP
  // =====================================================

  const openShop = (shop) => {
    setSelectedShop(shop);
    setShowShopPopup(true);
  };

  // =====================================================
  // CLOSE SHOP POPUP
  // =====================================================

  const closeShopPopup = () => {
    if (deletingShopId) {
      return;
    }

    setSelectedShop(null);
    setShowShopPopup(false);
  };

  // =====================================================
  // DELETE SHOP ENQUIRY
  // =====================================================

  const deleteShop = async (shop) => {
    if (!shop?.id) {
      alert(
        "Enquiry ID not found."
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete the enquiry from ${
          shop.fullName ||
          "this customer"
        }?`
      );

    if (!confirmed) {
      return;
    }

    setDeletingShopId(shop.id);

    try {
      const response =
        await fetch(
          ENQUIRY_API_URL,
          {
            method: "DELETE",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id: shop.id,
            }),
          }
        );

      let result;

      try {
        result =
          await response.json();
      } catch (error) {
        throw new Error(
          "Invalid response from server."
        );
      }

      console.log(
        "Delete shop enquiry response:",
        result
      );

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to delete shop enquiry."
        );
      }

      // =================================================
      // REMOVE FROM DASHBOARD
      // =================================================

      setShopData(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !== shop.id
          )
      );

      // =================================================
      // CLOSE POPUP
      // =================================================

      if (
        selectedShop?.id === shop.id
      ) {
        setSelectedShop(null);
        setShowShopPopup(false);
      }

      alert(
        "Shop enquiry deleted successfully."
      );
    } catch (error) {
      console.error(
        "Failed to delete shop enquiry:",
        error
      );

      alert(
        error.message ||
          "Unable to delete shop enquiry."
      );
    } finally {
      setDeletingShopId(null);
    }
  };

  // =====================================================
  // OPEN CUSTOMER
  // =====================================================

  const openCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerPopup(true);
  };

  // =====================================================
  // CLOSE CUSTOMER POPUP
  // =====================================================

  const closeCustomerPopup = () => {
    setSelectedCustomer(null);
    setShowCustomerPopup(false);
  };

  // =====================================================
  // OPEN CONSULTANT
  // =====================================================

  const openConsultant = (
    consultant
  ) => {
    setSelectedConsultant(
      consultant
    );

    setShowConsultantPopup(true);
  };

  // =====================================================
  // CLOSE CONSULTANT POPUP
  // =====================================================

  const closeConsultantPopup = () => {
    setSelectedConsultant(null);
    setShowConsultantPopup(false);
  };

  // =====================================================
  // DELETE CUSTOMER
  // =====================================================

  const deleteCustomer = async (
    customer
  ) => {
    if (!customer?.id) {
      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${
          customer.fullName ||
          "this customer"
        }?`
      );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await fetch(
          CUSTOMER_API_URL,
          {
            method: "DELETE",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id: customer.id,
            }),
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to delete customer."
        );
      }

      setCustomers(
        (prevCustomers) =>
          prevCustomers.filter(
            (item) =>
              item.id !== customer.id
          )
      );

      if (
        selectedCustomer?.id ===
        customer.id
      ) {
        closeCustomerPopup();
      }

      alert(
        "Customer deleted successfully."
      );
    } catch (error) {
      console.error(
        "Failed to delete customer:",
        error
      );

      alert(
        error.message ||
          "Unable to delete customer."
      );
    }
  };

  // =====================================================
  // DELETE CONSULTANT
  // =====================================================

  const deleteConsultant = async (
    consultant
  ) => {
    if (!consultant?.id) {
      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${
          consultant.fullName ||
          "this consultant"
        }?`
      );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await fetch(
          CONSULTANT_API_URL,
          {
            method: "DELETE",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id: consultant.id,
            }),
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to delete consultant."
        );
      }

      setConsultants(
        (prevConsultants) =>
          prevConsultants.filter(
            (item) =>
              item.id !== consultant.id
          )
      );

      if (
        selectedConsultant?.id ===
        consultant.id
      ) {
        closeConsultantPopup();
      }

      alert(
        "Consultant deleted successfully."
      );
    } catch (error) {
      console.error(
        "Failed to delete consultant:",
        error
      );

      alert(
        error.message ||
          "Unable to delete consultant."
      );
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (
    dateValue
  ) => {
    if (!dateValue) {
      return "-";
    }

    const date =
      new Date(dateValue);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return dateValue;
    }

    return date.toLocaleString();
  };

  // =====================================================
  // HEADER TITLE
  // =====================================================

  const getHeaderTitle = () => {
    if (activeSection === "all") {
      return "All Leads";
    }

    if (activeSection === "shop") {
      return "Shop";
    }

    if (
      activeSection === "customers"
    ) {
      return "Customers";
    }

    if (
      activeSection === "consultants"
    ) {
      return "Consultants";
    }

    return "Shop";
  };

  // =====================================================
  // REFRESH ALL DATA
  // =====================================================

  const refreshAllData = () => {
    loadShopData();
    loadCustomers();
    loadConsultants();
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="leads-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="header">
        <h2>
          {getHeaderTitle()}
        </h2>
      </div>

      {/* =================================================
          DROPDOWN
      ================================================= */}

      <div className="section-dropdown">

        <select
          value={activeSection}
          onChange={(e) =>
            setActiveSection(
              e.target.value
            )
          }
          className="section-select"
        >
          <option value="all">
            All
          </option>

          <option value="shop">
            Shop
          </option>

          <option value="customers">
            Customers / popup
          </option>

          <option value="consultants">
            Consultants
          </option>
        </select>

      </div>

      {/* =====================================================
          ALL SECTION
      ===================================================== */}

      {activeSection === "all" && (
        <div className="customers-section">

          {/* HEADER */}

          <div className="shop-header">

            <div>

              <h2>
                All Leads
              </h2>

              <p>
                Shop enquiries, customers
                and consultation requests
              </p>

            </div>

            <button
              className="view-btn"
              onClick={refreshAllData}
              disabled={
                shopLoading ||
                customersLoading ||
                consultantsLoading
              }
            >
              {shopLoading ||
              customersLoading ||
              consultantsLoading
                ? "Loading..."
                : "Refresh"}
            </button>

          </div>

          {/* SUMMARY CARDS */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3, 1fr)",
              gap: "20px",
              marginBottom: "25px",
            }}
          >

            {/* SHOP COUNT */}

            <div
              style={{
                padding: "20px",
                background: "#fff",
                borderRadius: "10px",
                border:
                  "1px solid #e5e7eb",
              }}
            >

              <h3
                style={{
                  margin: 0,
                  fontSize: "15px",
                  color: "#666",
                }}
              >
                Shop Enquiries
              </h3>

              <strong
                style={{
                  display: "block",
                  marginTop: "8px",
                  fontSize: "28px",
                }}
              >
                {shopData.length}
              </strong>

            </div>

            {/* CUSTOMER COUNT */}

            <div
              style={{
                padding: "20px",
                background: "#fff",
                borderRadius: "10px",
                border:
                  "1px solid #e5e7eb",
              }}
            >

              <h3
                style={{
                  margin: 0,
                  fontSize: "15px",
                  color: "#666",
                }}
              >
                Customers
              </h3>

              <strong
                style={{
                  display: "block",
                  marginTop: "8px",
                  fontSize: "28px",
                }}
              >
                {customers.length}
              </strong>

            </div>

            {/* CONSULTANT COUNT */}

            <div
              style={{
                padding: "20px",
                background: "#fff",
                borderRadius: "10px",
                border:
                  "1px solid #e5e7eb",
              }}
            >

              <h3
                style={{
                  margin: 0,
                  fontSize: "15px",
                  color: "#666",
                }}
              >
                Consultants
              </h3>

              <strong
                style={{
                  display: "block",
                  marginTop: "8px",
                  fontSize: "28px",
                }}
              >
                {consultants.length}
              </strong>

            </div>

          </div>

          {/* TOTAL COUNT */}

          <div
            style={{
              marginBottom: "25px",
              padding: "20px",
              background: "#fff",
              borderRadius: "10px",
              border:
                "1px solid #e5e7eb",
            }}
          >

            <h3
              style={{
                margin: 0,
                fontSize: "15px",
                color: "#666",
              }}
            >
              Total Leads
            </h3>

            <strong
              style={{
                display: "block",
                marginTop: "8px",
                fontSize: "32px",
              }}
            >
              {shopData.length +
                customers.length +
                consultants.length}
            </strong>

          </div>

          {/* ALL DATA TABLE */}

          <div className="shop-table-container">

            <table>

              <thead>

                <tr>
                  <th>No</th>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>
                    Product / Service
                  </th>
                  <th>Category</th>
                  <th>Requirements</th>
                  <th>Budget</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {/* SHOP DATA */}

                {shopData.map(
                  (item, index) => (
                    <tr
                      key={`shop-${
                        item.id ||
                        index
                      }`}
                    >

                      <td>
                        {index + 1}
                      </td>

                      <td>
                        <span className="status new">
                          Shop
                        </span>
                      </td>

                      <td>
                        {item.fullName ||
                          "-"}
                      </td>

                      <td>
                        {item.email ||
                          "-"}
                      </td>

                      <td>
                        {item.phone ||
                          "-"}
                      </td>

                      <td>
                        {item.city ||
                          "-"}
                      </td>

                      <td>
                        {item.productName ||
                          "-"}
                      </td>

                      <td>
                        {item.category ||
                          "-"}
                      </td>

                      <td
                        className="requirements-cell"
                        title={
                          item.requirements ||
                          "No requirements provided"
                        }
                      >
                        {item.requirements ||
                          "-"}
                      </td>

                      <td>
                        -
                      </td>

                      <td>
                        <span
                          className={`status ${
                            (
                              item.status ||
                              "New"
                            ).toLowerCase()
                          }`}
                        >
                          {item.status ||
                            "New"}
                        </span>
                      </td>

                      <td>
                        {formatDate(
                          item.created
                        )}
                      </td>

                      <td>

                        <button
                          className="view-btn"
                          onClick={() =>
                            openShop(item)
                          }
                        >
                          View
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteShop(item)
                          }
                          disabled={
                            deletingShopId ===
                            item.id
                          }
                        >
                          {deletingShopId ===
                          item.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </td>

                    </tr>
                  )
                )}

                {/* CUSTOMER DATA */}

                {customers.map(
                  (customer, index) => (
                    <tr
                      key={`customer-${
                        customer.id ||
                        index
                      }`}
                    >

                      <td>
                        {shopData.length +
                          index +
                          1}
                      </td>

                      <td>
                        <span className="status new">
                          Customer
                        </span>
                      </td>

                      <td>
                        {customer.fullName ||
                          "-"}
                      </td>

                      <td>
                        {customer.email ||
                          "-"}
                      </td>

                      <td>
                        {customer.phone ||
                          "-"}
                      </td>

                      <td>
                        -
                      </td>

                      <td>
                        Customer Popup
                      </td>

                      <td>
                        -
                      </td>

                      <td>
                        -
                      </td>

                      <td>
                        -
                      </td>

                      <td>
                        <span
                          className={`status ${
                            (
                              customer.status ||
                              "New"
                            ).toLowerCase()
                          }`}
                        >
                          {customer.status ||
                            "New"}
                        </span>
                      </td>

                      <td>
                        {formatDate(
                          customer.created
                        )}
                      </td>

                      <td>

                        <button
                          className="view-btn"
                          onClick={() =>
                            openCustomer(
                              customer
                            )
                          }
                        >
                          View
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteCustomer(
                              customer
                            )
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>
                  )
                )}

                {/* CONSULTANT DATA */}

                {consultants.map(
                  (
                    consultant,
                    index
                  ) => (
                    <tr
                      key={`consultant-${
                        consultant.id ||
                        index
                      }`}
                    >

                      <td>
                        {shopData.length +
                          customers.length +
                          index +
                          1}
                      </td>

                      <td>
                        <span className="status new">
                          Consultant
                        </span>
                      </td>

                      <td>
                        {consultant.fullName ||
                          "-"}
                      </td>

                      <td>
                        {consultant.email ||
                          "-"}
                      </td>

                      <td>
                        {consultant.phone ||
                          "-"}
                      </td>

                      <td>
                        {consultant.city ||
                          "-"}
                      </td>

                      <td>
                        {consultant.service ||
                          "-"}
                      </td>

                      <td>
                        -
                      </td>

                      <td>
                        -
                      </td>

                      <td>
                        {consultant.budget ||
                          "Not Provided"}
                      </td>

                      <td>
                        <span
                          className={`status ${
                            (
                              consultant.status ||
                              "New"
                            ).toLowerCase()
                          }`}
                        >
                          {consultant.status ||
                            "New"}
                        </span>
                      </td>

                      <td>
                        {formatDate(
                          consultant.created
                        )}
                      </td>

                      <td>

                        <button
                          className="view-btn"
                          onClick={() =>
                            openConsultant(
                              consultant
                            )
                          }
                        >
                          View
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteConsultant(
                              consultant
                            )
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>
                  )
                )}

                {/* LOADING */}

                {(shopLoading ||
                  customersLoading ||
                  consultantsLoading) &&
                  shopData.length === 0 &&
                  customers.length === 0 &&
                  consultants.length === 0 && (
                    <tr>

                      <td
                        colSpan="13"
                        style={{
                          textAlign:
                            "center",
                          padding:
                            "50px",
                          color:
                            "#777",
                        }}
                      >
                        Loading all data...
                      </td>

                    </tr>
                  )}

                {/* EMPTY */}

                {!shopLoading &&
                  !customersLoading &&
                  !consultantsLoading &&
                  shopData.length === 0 &&
                  customers.length === 0 &&
                  consultants.length === 0 && (
                    <tr>

                      <td
                        colSpan="13"
                        style={{
                          textAlign:
                            "center",
                          padding:
                            "50px",
                          color:
                            "#777",
                        }}
                      >

                        <strong>
                          No data found.
                        </strong>

                      </td>

                    </tr>
                  )}

              </tbody>

            </table>

          </div>

        </div>
      )}

      {/* =====================================================
          SHOP SECTION
      ===================================================== */}

      {activeSection === "shop" && (
        <div className="shop-section">

          <div className="shop-header">

            <div>

              <h2>
                Shop Enquiries
              </h2>

              <p>
                Product enquiries submitted
                from your website
              </p>

            </div>

            <button
              className="view-btn"
              onClick={loadShopData}
              disabled={shopLoading}
            >
              {shopLoading
                ? "Loading..."
                : "Refresh"}
            </button>

          </div>

          <div className="shop-table-container">

            <table>

              {/* =================================================
                  SHOP TABLE HEADER
              ================================================= */}

              <thead>

                <tr>

                  <th>No</th>

                  <th>
                    Full Name
                  </th>

                  <th>
                    Email ID
                  </th>

                  <th>
                    Phone Number
                  </th>

                  <th>
                    City
                  </th>

                  <th>
                    Product
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Requirements
                  </th>

                  <th>
                    Status
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

                {/* =================================================
                    LOADING
                ================================================= */}

                {shopLoading && (
                  <tr>

                    <td
                      colSpan="11"
                      style={{
                        textAlign:
                          "center",
                        padding:
                          "50px",
                        color:
                          "#777",
                      }}
                    >
                      Loading shop enquiries...
                    </td>

                  </tr>
                )}

                {/* =================================================
                    ERROR
                ================================================= */}

                {!shopLoading &&
                  shopError && (
                    <tr>

                      <td
                        colSpan="11"
                        style={{
                          textAlign:
                            "center",
                          padding:
                            "50px",
                          color:
                            "#d9534f",
                        }}
                      >

                        <strong>
                          {shopError}
                        </strong>

                      </td>

                    </tr>
                  )}

                {/* =================================================
                    SHOP DATA
                ================================================= */}

                {!shopLoading &&
                  !shopError &&
                  shopData.length > 0 &&
                  shopData.map(
                    (
                      item,
                      index
                    ) => (

                      <tr
                        key={
                          item.id ||
                          index
                        }
                      >

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          {item.fullName ||
                            "-"}
                        </td>

                        <td>
                          {item.email ||
                            "-"}
                        </td>

                        <td>
                          {item.phone ||
                            "-"}
                        </td>

                        <td>
                          {item.city ||
                            "-"}
                        </td>

                        <td>
                          {item.productName ||
                            "-"}
                        </td>

                        <td>
                          {item.category ||
                            "-"}
                        </td>

                        {/* =================================================
                            REQUIREMENTS
                        ================================================= */}

                        <td
                          className="requirements-cell"
                          title={
                            item.requirements ||
                            "No requirements provided"
                          }
                        >
                          {item.requirements ||
                            "-"}
                        </td>

                        {/* STATUS */}

                        <td>

                          <span
                            className={`status ${
                              (
                                item.status ||
                                "New"
                              ).toLowerCase()
                            }`}
                          >
                            {item.status ||
                              "New"}
                          </span>

                        </td>

                        {/* DATE */}

                        <td>
                          {formatDate(
                            item.created
                          )}
                        </td>

                        {/* ACTION */}

                        <td>

                          <button
                            className="view-btn"
                            onClick={() =>
                              openShop(
                                item
                              )
                            }
                          >
                            View
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              deleteShop(
                                item
                              )
                            }
                            disabled={
                              deletingShopId ===
                              item.id
                            }
                          >
                            {deletingShopId ===
                            item.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </td>

                      </tr>

                    )
                  )}

                {/* =================================================
                    EMPTY
                ================================================= */}

                {!shopLoading &&
                  !shopError &&
                  shopData.length === 0 && (
                    <tr>

                      <td
                        colSpan="11"
                        style={{
                          textAlign:
                            "center",
                          padding:
                            "50px",
                          color:
                            "#777",
                        }}
                      >

                        <strong>
                          No shop enquiries found.
                        </strong>

                        <br />
                        <br />

                        Enquiries submitted through{" "}

                        <strong>
                          Enquiry Now
                        </strong>{" "}

                        on your website will appear
                        here.

                      </td>

                    </tr>
                  )}

              </tbody>

            </table>

          </div>

        </div>
      )}

      {/* =====================================================
          CUSTOMERS SECTION
      ===================================================== */}

      {activeSection ===
        "customers" && (
        <div className="customers-section">

          <div className="shop-header">

            <div>

              <h2>
                Customers / popup
              </h2>

              <p>
                Customer contact information
              </p>

            </div>

            <button
              className="view-btn"
              onClick={loadCustomers}
              disabled={
                customersLoading
              }
            >
              {customersLoading
                ? "Loading..."
                : "Refresh"}
            </button>

          </div>

          <div className="shop-table-container">

            <table>

              <thead>

                <tr>

                  <th>No</th>
                  <th>Name</th>
                  <th>Email ID</th>
                  <th>Phone Number</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>

                </tr>

              </thead>

              <tbody>

                {/* LOADING */}

                {customersLoading && (
                  <tr>

                    <td
                      colSpan="7"
                      style={{
                        textAlign:
                          "center",
                        padding:
                          "50px",
                        color:
                          "#777",
                      }}
                    >
                      Loading customers...
                    </td>

                  </tr>
                )}

                {/* ERROR */}

                {!customersLoading &&
                  customersError && (
                    <tr>

                      <td
                        colSpan="7"
                        style={{
                          textAlign:
                            "center",
                          padding:
                            "50px",
                          color:
                            "#d9534f",
                        }}
                      >

                        <strong>
                          {customersError}
                        </strong>

                      </td>

                    </tr>
                  )}

                {/* DATA */}

                {!customersLoading &&
                  !customersError &&
                  customers.length > 0 &&
                  customers.map(
                    (
                      customer,
                      index
                    ) => (

                      <tr
                        key={
                          customer.id ||
                          index
                        }
                      >

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          {customer.fullName ||
                            "-"}
                        </td>

                        <td>
                          {customer.email ||
                            "-"}
                        </td>

                        <td>
                          {customer.phone ||
                            "-"}
                        </td>

                        <td>

                          <span
                            className={`status ${
                              (
                                customer.status ||
                                "New"
                              ).toLowerCase()
                            }`}
                          >
                            {customer.status ||
                              "New"}
                          </span>

                        </td>

                        <td>
                          {formatDate(
                            customer.created
                          )}
                        </td>

                        <td>

                          <button
                            className="view-btn"
                            onClick={() =>
                              openCustomer(
                                customer
                              )
                            }
                          >
                            View
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              deleteCustomer(
                                customer
                              )
                            }
                          >
                            Delete
                          </button>

                        </td>

                      </tr>

                    )
                  )}

                {/* EMPTY */}

                {!customersLoading &&
                  !customersError &&
                  customers.length === 0 && (
                    <tr>

                      <td
                        colSpan="7"
                        style={{
                          textAlign:
                            "center",
                          padding:
                            "50px",
                          color:
                            "#777",
                        }}
                      >

                        <strong>
                          No customers found.
                        </strong>

                        <br />
                        <br />

                        Customers submitted
                        from your website
                        will appear here.

                      </td>

                    </tr>
                  )}

              </tbody>

            </table>

          </div>

        </div>
      )}

      {/* =====================================================
          CONSULTANTS SECTION
      ===================================================== */}

      {activeSection ===
        "consultants" && (
        <div className="customers-section">

          <div className="shop-header">

            <div>

              <h2>
                Consultants
              </h2>

              <p>
                Consultation requests
                submitted from your website
              </p>

            </div>

            <button
              className="view-btn"
              onClick={
                loadConsultants
              }
              disabled={
                consultantsLoading
              }
            >
              {consultantsLoading
                ? "Loading..."
                : "Refresh"}
            </button>

          </div>

          <div className="shop-table-container">

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

                {/* LOADING */}

                {consultantsLoading && (
                  <tr>

                    <td
                      colSpan="10"
                      style={{
                        textAlign:
                          "center",
                        padding:
                          "50px",
                        color:
                          "#777",
                      }}
                    >
                      Loading consultants...
                    </td>

                  </tr>
                )}

                {/* ERROR */}

                {!consultantsLoading &&
                  consultantsError && (
                    <tr>

                      <td
                        colSpan="10"
                        style={{
                          textAlign:
                            "center",
                          padding:
                            "50px",
                          color:
                            "#d9534f",
                        }}
                      >

                        <strong>
                          {consultantsError}
                        </strong>

                      </td>

                    </tr>
                  )}

                {/* DATA */}

                {!consultantsLoading &&
                  !consultantsError &&
                  consultants.length > 0 &&
                  consultants.map(
                    (
                      consultant,
                      index
                    ) => (

                      <tr
                        key={
                          consultant.id ||
                          index
                        }
                      >

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          {consultant.fullName ||
                            "-"}
                        </td>

                        <td>
                          {consultant.phone ||
                            "-"}
                        </td>

                        <td>
                          {consultant.email ||
                            "-"}
                        </td>

                        <td>
                          {consultant.city ||
                            "-"}
                        </td>

                        <td>
                          {consultant.service ||
                            "-"}
                        </td>

                        <td>
                          {consultant.budget ||
                            "Not Provided"}
                        </td>

                        <td>
                          {formatDate(
                            consultant.created
                          )}
                        </td>

                        <td>

                          <span
                            className={`status ${
                              (
                                consultant.status ||
                                "New"
                              ).toLowerCase()
                            }`}
                          >
                            {consultant.status ||
                              "New"}
                          </span>

                        </td>

                        <td>

                          <button
                            className="view-btn"
                            onClick={() =>
                              openConsultant(
                                consultant
                              )
                            }
                          >
                            View
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              deleteConsultant(
                                consultant
                              )
                            }
                          >
                            Delete
                          </button>

                        </td>

                      </tr>

                    )
                  )}

                {/* EMPTY */}

                {!consultantsLoading &&
                  !consultantsError &&
                  consultants.length === 0 && (
                    <tr>

                      <td
                        colSpan="10"
                        style={{
                          textAlign:
                            "center",
                          padding:
                            "50px",
                          color:
                            "#777",
                        }}
                      >

                        <strong>
                          No consultants found.
                        </strong>

                        <br />
                        <br />

                        Consultation requests
                        submitted from your
                        website will appear here.

                      </td>

                    </tr>
                  )}

              </tbody>

            </table>

          </div>

        </div>
      )}

      {/* =====================================================
          SHOP POPUP
      ===================================================== */}

      {showShopPopup &&
        selectedShop && (
          <div
            className="popup-overlay"
            onClick={closeShopPopup}
          >

            <div
              className="popup customer-popup"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <h2>
                Shop Enquiry Details
              </h2>

              <div className="popup-content">

                {/* ENQUIRY ID */}

                <div className="popup-row">

                  <strong>
                    Enquiry ID
                  </strong>

                  <span>
                    {selectedShop.id ||
                      "-"}
                  </span>

                </div>

                {/* FULL NAME */}

                <div className="popup-row">

                  <strong>
                    Full Name
                  </strong>

                  <span>
                    {selectedShop.fullName ||
                      "-"}
                  </span>

                </div>

                {/* EMAIL */}

                <div className="popup-row">

                  <strong>
                    Email
                  </strong>

                  <span>
                    {selectedShop.email ||
                      "-"}
                  </span>

                </div>

                {/* PHONE */}

                <div className="popup-row">

                  <strong>
                    Phone Number
                  </strong>

                  <span>
                    {selectedShop.phone ||
                      "-"}
                  </span>

                </div>

                {/* CITY */}

                <div className="popup-row">

                  <strong>
                    City
                  </strong>

                  <span>
                    {selectedShop.city ||
                      "-"}
                  </span>

                </div>

                {/* PRODUCT */}

                <div className="popup-row">

                  <strong>
                    Product
                  </strong>

                  <span>
                    {selectedShop.productName ||
                      "-"}
                  </span>

                </div>

                {/* CATEGORY */}

                <div className="popup-row">

                  <strong>
                    Category
                  </strong>

                  <span>
                    {selectedShop.category ||
                      "-"}
                  </span>

                </div>

                {/* =================================================
                    REQUIREMENTS
                ================================================= */}

                <div className="popup-row requirements-popup-row">

                  <strong>
                    Requirements
                  </strong>

                  <span>
                    {selectedShop.requirements ||
                      "No requirements provided"}
                  </span>

                </div>

                {/* STATUS */}

                <div className="popup-row">

                  <strong>
                    Status
                  </strong>

                  <span
                    className={`status ${
                      (
                        selectedShop.status ||
                        "New"
                      ).toLowerCase()
                    }`}
                  >
                    {selectedShop.status ||
                      "New"}
                  </span>

                </div>

                {/* SUBMITTED */}

                <div className="popup-row">

                  <strong>
                    Submitted
                  </strong>

                  <span>
                    {formatDate(
                      selectedShop.created
                    )}
                  </span>

                </div>

              </div>

              {/* =================================================
                  SHOP POPUP BUTTONS
              ================================================= */}

              <div className="popup-buttons">

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteShop(
                      selectedShop
                    )
                  }
                  disabled={
                    deletingShopId ===
                    selectedShop.id
                  }
                >
                  {deletingShopId ===
                  selectedShop.id
                    ? "Deleting..."
                    : "Delete"}
                </button>

                <button
                  className="close-btn"
                  onClick={
                    closeShopPopup
                  }
                  disabled={
                    deletingShopId ===
                    selectedShop.id
                  }
                >
                  Close
                </button>

              </div>

            </div>

          </div>
        )}

      {/* =====================================================
          CUSTOMER POPUP
      ===================================================== */}

      {showCustomerPopup &&
        selectedCustomer && (
          <div
            className="popup-overlay"
            onClick={
              closeCustomerPopup
            }
          >

            <div
              className="popup customer-popup"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <h2>
                Customer Details
              </h2>

              <div className="popup-content">

                <div className="popup-row">

                  <strong>
                    Customer ID
                  </strong>

                  <span>
                    {selectedCustomer.id ||
                      "-"}
                  </span>

                </div>

                <div className="popup-row">

                  <strong>
                    Full Name
                  </strong>

                  <span>
                    {selectedCustomer.fullName ||
                      "-"}
                  </span>

                </div>

                <div className="popup-row">

                  <strong>
                    Email
                  </strong>

                  <span>
                    {selectedCustomer.email ||
                      "-"}
                  </span>

                </div>

                <div className="popup-row">

                  <strong>
                    Phone Number
                  </strong>

                  <span>
                    {selectedCustomer.phone ||
                      "-"}
                  </span>

                </div>

                <div className="popup-row">

                  <strong>
                    Status
                  </strong>

                  <span
                    className={`status ${
                      (
                        selectedCustomer.status ||
                        "New"
                      ).toLowerCase()
                    }`}
                  >
                    {selectedCustomer.status ||
                      "New"}
                  </span>

                </div>

                <div className="popup-row">

                  <strong>
                    Submitted
                  </strong>

                  <span>
                    {formatDate(
                      selectedCustomer.created
                    )}
                  </span>

                </div>

              </div>

              <div className="popup-buttons">

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteCustomer(
                      selectedCustomer
                    )
                  }
                >
                  Delete
                </button>

                <button
                  className="close-btn"
                  onClick={
                    closeCustomerPopup
                  }
                >
                  Close
                </button>

              </div>

            </div>

          </div>
        )}

      {/* =====================================================
          CONSULTANT POPUP
      ===================================================== */}

      {showConsultantPopup &&
        selectedConsultant && (
          <div
            className="popup-overlay"
            onClick={
              closeConsultantPopup
            }
          >

            <div
              className="popup customer-popup"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <h2>
                Consultation Details
              </h2>

              <div className="popup-content">

                <div className="popup-row">

                  <strong>
                    Consultant ID
                  </strong>

                  <span>
                    {selectedConsultant.id ||
                      "-"}
                  </span>

                </div>

                <div className="popup-row">

                  <strong>
                    Full Name
                  </strong>

                  <span>
                    {selectedConsultant.fullName ||
                      "-"}
                  </span>

                </div>

                <div className="popup-row">

                  <strong>
                    Phone Number
                  </strong>

                  <span>
                    {selectedConsultant.phone ||
                      "-"}
                  </span>

                </div>

                <div className="popup-row">

                  <strong>
                    Email Address
                  </strong>

                  <span>
                    {selectedConsultant.email ||
                      "-"}
                  </span>

                </div>

                <div className="popup-row">

                  <strong>
                    City
                  </strong>

                  <span>
                    {selectedConsultant.city ||
                      "-"}
                  </span>

                </div>

                <div className="popup-row">

                  <strong>
                    Service
                  </strong>

                  <span>
                    {selectedConsultant.service ||
                      "-"}
                  </span>

                </div>

                <div className="popup-row">

                  <strong>
                    Budget
                  </strong>

                  <span>
                    {selectedConsultant.budget ||
                      "Not Provided"}
                  </span>

                </div>

                <div className="popup-row">

                  <strong>
                    Project Details
                  </strong>

                  <span>
                    {selectedConsultant.details ||
                      "-"}
                  </span>

                </div>

                <div className="popup-row">

                  <strong>
                    Status
                  </strong>

                  <span
                    className={`status ${
                      (
                        selectedConsultant.status ||
                        "New"
                      ).toLowerCase()
                    }`}
                  >
                    {selectedConsultant.status ||
                      "New"}
                  </span>

                </div>

                <div className="popup-row">

                  <strong>
                    Submitted
                  </strong>

                  <span>
                    {formatDate(
                      selectedConsultant.created
                    )}
                  </span>

                </div>

              </div>

              <div className="popup-buttons">

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteConsultant(
                      selectedConsultant
                    )
                  }
                >
                  Delete
                </button>

                <button
                  className="close-btn"
                  onClick={
                    closeConsultantPopup
                  }
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