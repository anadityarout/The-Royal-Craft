import React, { useState } from "react";
import "./ShopPage.css";
import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiMessageCircle,
} from "react-icons/fi";

const ShopPage = ({ product, onBack }) => {

  const [selectedImage, setSelectedImage] = useState(
    product?.primaryImage || ""
  );

  if (!product) return null;

  return (

    <div className="shop-details-page">

      {/* ================= Header ================= */}

      <div className="shop-details-header">

        <button
          className="back-btn"
          onClick={onBack}
        >
          <FiArrowLeft />
          Back To Shop
        </button>

      </div>

      {/* ================= Main Section ================= */}

      <div className="shop-details-container">

        {/* ================= Left ================= */}

        <div className="shop-left">

          {/* Main Image */}

          <div className="main-image-box">

            <img
              src={selectedImage}
              alt={product.name}
            />

          </div>

          {/* Image Gallery */}

          <div className="thumbnail-wrapper">

            {/* Primary */}

            <div
              className={
                selectedImage === product.primaryImage
                  ? "thumbnail active"
                  : "thumbnail"
              }
              onClick={() =>
                setSelectedImage(product.primaryImage)
              }
            >

              <img
                src={product.primaryImage}
                alt="Primary"
              />

            </div>

            {/* Secondary */}

            {product.secondaryImages?.map((item, index) => (

  <div
    key={index}
    className={
      selectedImage === item.image
        ? "thumbnail active"
        : "thumbnail"
    }
    onClick={() =>
      setSelectedImage(item.image)
    }
  >

    <img
      src={item.image}
      alt={`Secondary ${index + 1}`}
    />

  </div>

))}

          </div>

        </div>

        {/* ================= Right ================= */}

        <div className="shop-right">

          <span className="product-category">

            {product.category}

          </span>

          <h1>

            {product.name}

          </h1>

          <p className="product-description">

            {product.description}

          </p>

          {/* Specifications Count */}

          {product.specifications &&
            product.specifications.length > 0 && (

              <div className="spec-count-box">

                <strong>

                  {product.specifications.length}

                </strong>

                Specifications Available

              </div>

          )}

          {/* Enquiry */}

          <button className="enquiry-btn">

            <FiMessageCircle />

            Enquiry Now

          </button>

        </div>

      </div>

      {/* ================= Tabs ================= */}

      <div className="product-tabs">

        <button className="tab active">

          Description

        </button>

        <button className="tab">

          Specifications

        </button>

      </div>
            {/* ================= Description ================= */}

      <div className="tab-content">

        <h2>Description</h2>

        <p>

          {product.description
            ? product.description
            : "No description available."}

        </p>

      </div>

      {/* ================= Specifications ================= */}

      <div className="tab-content">

        <h2>Specifications</h2>

        {product.specifications &&
        product.specifications.length > 0 ? (

          <table className="spec-table">

            <tbody>

              {product.specifications.map(
                (item, index) => (

                  <tr key={index}>

                    <td className="spec-title">

                      {item.title}

                    </td>

                    <td className="spec-value">

                      {item.value}

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        ) : (

          <div className="no-specification">

            No specifications available.

          </div>

        )}

      </div>

    </div>

  );

};

export default ShopPage;