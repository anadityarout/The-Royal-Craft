import React, { useEffect, useMemo, useState } from "react";
import "./ServicePage.css";
import PageSeo from "../SeoPage/PageSeo";
import serviceBanner from "../../assets/service.jpg";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/service";

const categories = [
  "All",
  "Air Conditioning",
  "Architectural Layout",
  "Electrical Lighting",
  "Fire Fighting",
  "MEP (Mechanical & Electrical & Plumbing)",
  "STP (Sewage Treatment Plants)",
];

const ServicePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load services");
      }

      const data = await response.json();
      setServices(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = useMemo(() => {
    if (selectedCategory === "All") {
      return services;
    }

    return services.filter(
      (item) => item.category === selectedCategory
    );
  }, [services, selectedCategory]);

  return (
    <div className="service-page">
          <PageSeo page="Service" />

      {/* Banner */}
      <section className="service-page-banner">
        <img
          src={serviceBanner}
          alt="Our Services"
          className="service-page-banner-image"
        />
      </section>

      {/* Categories */}
      <section className="service-page-filter">
        <div className="service-page-filter-wrapper">
          {categories.map((category) => (
            <button
              key={category}
              className={`service-page-filter-btn ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="service-page-list">

        {loading ? (

          <div className="service-page-empty">
            Loading...
          </div>

        ) : filteredServices.length > 0 ? (

          <div className="service-page-grid">

            {filteredServices.map((service) => (

              <div
                className="service-page-card"
                key={service.id}
              >

                <img
                  src={service.image}
                  alt={service.name}
                  className="service-page-image"
                />

                <div className="service-page-content">

                  <h3>{service.name}</h3>

                  <p>{service.description}</p>

                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="service-page-empty">
            No Services Available
          </div>

        )}

      </section>

    </div>
  );
};

export default ServicePage;