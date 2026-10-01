import React, { useEffect, useState } from "react";
import {
  Lightbulb,
  Settings,
  Layers,
  Brush,
  ShieldCheck,
  Truck,
} from "lucide-react";
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

// Icons in the same order as CATEGORY_ORDER
const CATEGORY_ICONS = [Lightbulb, Settings, Layers, Brush, ShieldCheck, Truck];

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

const getIcon = (category, index) => {
  const found = CATEGORY_ORDER.map(normalize).indexOf(normalize(category));
  return found !== -1
    ? CATEGORY_ICONS[found]
    : CATEGORY_ICONS[index % CATEGORY_ICONS.length];
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

  const getNumber = (index) => String(index + 1).padStart(2, "0");

  return (
    <section className="rk-process-section">
      <div className="rk-process-container">
        {/* ================= Header (centered) ================= */}

        <div className="rk-process-head">
          <span className="rk-process-tag">MANUFACTURED WITH PRECISION</span>

          <h2 className="rk-process-title">
            Precision Manufacturing,{" "}
            <span className="rk-process-title-gold">
              Crafted to Perfection.
            </span>
          </h2>

          <p className="rk-process-desc">
            Every masterpiece begins with a vision and is transformed through
            expert craftsmanship. At The Royal Kraft, our manufacturing process
            combines innovative technology with traditional artistry to create
            premium FRP architectural décor that exceeds expectations in
            durability, elegance, and detail.
          </p>
        </div>

        {/* ================= Steps ================= */}

        {loading ? (
          <div className="rk-loading">Loading...</div>
        ) : processes.length === 0 ? (
          <div className="rk-loading">No Process Found</div>
        ) : (
          <div className="rk-process-grid">
            {processes.map((process, index) => {
              const Icon = getIcon(process.category, index);

              return (
                <div className="rk-process-card" key={process.id || index}>
                  {/* Arch image + badge + icon */}

                  <div className="rk-process-media">
                    <div className="rk-process-arch">
                      <img
                        src={process.image}
                        alt={process.category}
                        loading="lazy"
                      />
                    </div>

                    <span className="rk-process-no">{getNumber(index)}</span>

                    <span className="rk-process-icon">
                      <Icon size={22} strokeWidth={1.6} />
                    </span>
                  </div>

                  {/* Text */}

                  <h4 className="rk-process-category">{process.category}</h4>

                  <span className="rk-process-divider" />

                  {process.description && (
                    <p className="rk-process-description">
                      {process.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Process;