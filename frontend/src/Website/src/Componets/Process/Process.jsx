import React, { useEffect, useState } from "react";
import "./Process.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/process";

// Fixed display order — edit this list if your category names differ
const CATEGORY_ORDER = [
  "Design",
  "Mould Making",
  "Fiber Crafting",
  "Finishing",
  "Quality Check",
  "Delivery & Installation",
];

const normalize = (str) => (str || "").trim().toLowerCase();

const sortByFixedOrder = (list) => {
  const normalizedOrder = CATEGORY_ORDER.map(normalize);

  return [...list].sort((a, b) => {
    const indexA = normalizedOrder.indexOf(normalize(a.category));
    const indexB = normalizedOrder.indexOf(normalize(b.category));

    // Unknown categories (not in the list) go to the end, in original order
    const safeA = indexA === -1 ? CATEGORY_ORDER.length : indexA;
    const safeB = indexB === -1 ? CATEGORY_ORDER.length : indexB;

    return safeA - safeB;
  });
};

const Process = () => {

  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProcesses();
  }, []);

  const loadProcesses = async () => {

    try {

      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load processes.");
      }

      const data = await response.json();

      const list = Array.isArray(data) ? data : [];

      setProcesses(sortByFixedOrder(list));

    } catch (error) {

      console.error("Error loading processes:", error);

      setProcesses([]);

    } finally {

      setLoading(false);

    }

  };

  const getNumber = (index) => {
    return String(index + 1).padStart(2, "0");
  };

  return (

    <section className="rk-process-section">

      <div className="rk-process-container">

        {/* ================= Left Content ================= */}

        <div className="rk-process-content">

          <span className="rk-process-tag">
            MANUFACTURED WITH PRECISION
          </span>

          <h2 className="rk-process-title">
            Precision Manufacturing,
            <br />
            Crafted to Perfection.
          </h2>

          <p className="rk-process-desc">
            Every masterpiece begins with a vision and is transformed through expert craftsmanship. At The Royal Kraft, our manufacturing process combines innovative technology with traditional artistry to create premium FRP architectural décor that exceeds expectations in durability, elegance, and detail.
          </p>

          <button className="rk-process-btn">
            EXPLORE MANUFACTURING
          </button>

        </div>

        {/* ================= Right Grid ================= */}

        <div className="rk-process-grid">
                    {loading ? (

            <div className="rk-loading">
              Loading...
            </div>

          ) : processes.length === 0 ? (

            <div className="rk-loading">
              No Process Found
            </div>

          ) : (

            processes.map((process, index) => (

              <div
                className="rk-process-card"
                key={process.id || index}
              >

                {/* Image */}

                <div className="rk-process-image">

                  <img
                    src={process.image}
                    alt={process.category}
                    loading="lazy"
                  />

                </div>

                {/* Caption */}

                <div className="rk-process-caption">

                  <span className="rk-process-no">
                    {getNumber(index)}
                  </span>

                  <div className="rk-process-info">

                    {/* Category */}

                    <h4 className="rk-process-category">
                      {process.category}
                    </h4>

                    {/* Process Name */}

                    {process.processName && (

                      <p className="rk-process-name">
                        {process.processName}
                      </p>

                    )}

                    {/* Description */}

                    {process.description && (

                      <p className="rk-process-description">
                        {process.description}
                      </p>

                    )}

                  </div>

                  <span className="rk-process-arrow">
                    →
                  </span>

                </div>

              </div>

            ))

          )}
                  </div>

      </div>

    </section>

  );

};

export default Process;
