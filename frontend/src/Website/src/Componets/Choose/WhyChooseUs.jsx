import React, { useState, useEffect, useRef } from "react";
import {
  Factory,
  Palette,
  HardHat,
  ShieldCheck,
  Clock3,
} from "lucide-react";
import "./WhyChooseUs.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/choose";

// ================= Why Choose List =================

const whyChooseUs = [
  "In-house manufacturing with advanced technology",
  "Premium quality raw materials",
  "Skilled artisans & expert craftsmen",
  "Custom designs for unique requirements",
  "Timely delivery & professional installation",
  "Pan-India presence & reliable support",
];

// ================= Stats =================

const stats = [
  {
    icon: Factory,
    value: "20,000+",
    label: "SQ. FT. FACTORY",
  },
  {
    icon: Palette,
    value: "1000+",
    label: "MOLD DESIGNS",
  },
  {
    icon: HardHat,
    value: "150+",
    label: "SKILLED ARTISANS",
  },
  {
    icon: ShieldCheck,
    value: "QUALITY",
    label: "ASSURED",
  },
  {
    icon: Clock3,
    value: "ON-TIME",
    label: "DELIVERY",
  },
];

const WhyChooseUs = () => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState(null);

  // Store references to videos
  const videoRefs = useRef({});

  // ================= Load Media =================

  const loadMedia = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);
      const data = await response.json();

      // Show only first 3 items
      setMediaList(data.slice(0, 3));

    } catch (error) {
      console.error("Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  // ================= Play Video =================

  const playVideo = (id) => {
    const video = videoRefs.current[id];

    if (video) {
      video.play();
      setPlayingVideo(id);
    }
  };
    return (
    <section className="rk-why-section">
      <div className="rk-why-container">

        {/* ================= Left ================= */}

        <div className="rk-why-left">

          <span className="rk-why-tag">
            WHY CHOOSE
          </span>

          <h2 className="rk-why-title">
            THE ROYAL KRAFT?
          </h2>

          <ul className="rk-why-list">
            {whyChooseUs.map((item, index) => (
              <li key={index}>
                <span className="rk-why-check">✓</span>
                {item}
              </li>
            ))}
          </ul>

        </div>

        {/* ================= Right ================= */}

        <div className="rk-why-right">

          <div className="rk-why-images">

            {loading ? (

              <div className="rk-why-loading">
                Loading...
              </div>

            ) : mediaList.length === 0 ? (

              <div className="rk-why-loading">
                No Media Found
              </div>

            ) : (

              mediaList.map((item) => (

                <div
                  key={item.id}
                  className={`rk-why-image ${
                    item.type === "Video"
                      ? "rk-why-video"
                      : ""
                  }`}
                >

                  {item.type === "Image" ? (

                    <img
                      src={item.url}
                      alt="Why Choose Us"
                    />

                  ) : (

                    <div className="rk-why-video-wrapper">

                      <video
                        ref={(el) => {
                          if (el) {
                            videoRefs.current[item.id] = el;
                          }
                        }}
                        className="rk-why-video-player"
                        src={item.url}
                        playsInline
                        controls={playingVideo === item.id}
                        onPlay={() => setPlayingVideo(item.id)}
                        onPause={() => setPlayingVideo(null)}
                      />

                      {playingVideo !== item.id && (

                        <button
                          className="rk-why-play-btn"
                          onClick={() => playVideo(item.id)}
                        >
                          ▶
                        </button>

                      )}

                    </div>

                  )}

                </div>

              ))

            )}

          </div>

          {/* ================= Stats ================= */}

          <div className="rk-why-stats">

            {stats.map((stat, index) => {

              const Icon = stat.icon;

              return (

                <React.Fragment key={index}>

                  <div className="rk-why-stat">

                    <Icon
                      className="rk-why-stat-icon"
                      size={30}
                      strokeWidth={1.5}
                    />

                    <div>

                      <strong>{stat.value}</strong>

                      <span>{stat.label}</span>

                    </div>

                  </div>

                  {index < stats.length - 1 && (
                    <div className="rk-why-stat-divider"></div>
                  )}

                </React.Fragment>

              );

            })}

          </div>

        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;