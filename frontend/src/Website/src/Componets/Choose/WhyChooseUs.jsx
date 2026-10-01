import React, { useState, useEffect, useRef } from "react";
import {
  Factory,
  Palette,
  HardHat,
  ShieldCheck,
  Clock3,
  Gem,
  Truck,
  Building2,
  CloudSun,
  BadgeDollarSign,
  CheckCircle2,
} from "lucide-react";

import "./WhyChooseUs.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/choose";

/* =========================================================
   WHY CHOOSE FEATURES
========================================================= */

const whyChooseUs = [
  {
    icon: Gem,
    title: "Premium Quality",
    description: "Materials",
  },
  {
    icon: Palette,
    title: "Custom Design",
    description: "Solutions",
  },
  {
    icon: HardHat,
    title: "Skilled Master",
    description: "Craftsmen",
  },
  {
    icon: Truck,
    title: "Pan India",
    description: "Delivery & Installation",
  },
  {
    icon: Factory,
    title: "Modern Manufacturing",
    description: "Facility",
  },
  {
    icon: CloudSun,
    title: "Durable Weather",
    description: "Resistant Products",
  },
  {
    icon: BadgeDollarSign,
    title: "Competitive",
    description: "Pricing",
  },
  {
    icon: Clock3,
    title: "Timely Project",
    description: "Completion",
  },
];

/* =========================================================
   STATS
========================================================= */

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

/* =========================================================
   COMPONENT
========================================================= */

const WhyChooseUs = () => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState(null);

  const videoRefs = useRef({});

  /* =======================================================
     LOAD MEDIA
  ======================================================= */

  const loadMedia = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load Why Choose Us media");
      }

      const data = await response.json();

      /*
        Only display first 3 media items.
        Admin Dashboard can control these.
      */
      setMediaList(Array.isArray(data) ? data.slice(0, 3) : []);
    } catch (error) {
      console.error("Why Choose Us Load Error:", error);
      setMediaList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  /* =======================================================
     PLAY VIDEO
  ======================================================= */

  const playVideo = (id) => {
    const video = videoRefs.current[id];

    if (!video) return;

    /*
      Pause all other videos first
    */
    Object.entries(videoRefs.current).forEach(([videoId, videoElement]) => {
      if (videoId !== String(id) && videoElement) {
        videoElement.pause();
      }
    });

    video
      .play()
      .then(() => {
        setPlayingVideo(id);
      })
      .catch((error) => {
        console.error("Video Play Error:", error);
      });
  };

  /* =======================================================
     STOP VIDEO
  ======================================================= */

  const handleVideoPause = (id) => {
    if (playingVideo === id) {
      setPlayingVideo(null);
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="rk-why-section">
      <div className="rk-why-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="rk-why-header">

          <div className="rk-why-eyebrow">
            <span className="rk-why-line"></span>

            <span>WHY THE ROYAL KRAFT?</span>

            <span className="rk-why-line"></span>
          </div>

          <h2 className="rk-why-title">
            Crafted for Grandeur.
            <br />
            Built to <span>Last.</span>
          </h2>

          <p className="rk-why-description">
            From concept to creation, The Royal Kraft delivers exceptional
            architectural decor with unmatched craftsmanship, modern
            facilities, and pan India delivery.
          </p>

        </div>

        {/* =================================================
            MEDIA SECTION
        ================================================= */}

        <div className="rk-why-media-section">

          {loading ? (

            <div className="rk-why-loading">
              Loading...
            </div>

          ) : mediaList.length === 0 ? (

            <div className="rk-why-loading">
              No Media Found
            </div>

          ) : (

            <div className="rk-why-media-grid">

              {mediaList.map((item, index) => {

                const isVideo =
                  item.type?.toLowerCase() === "video";

                return (
                  <div
                    key={item.id || index}
                    className={`rk-why-media-card ${
                      isVideo ? "rk-why-media-video" : ""
                    }`}
                  >

                    {/* ================= IMAGE ================= */}

                    {!isVideo && (
                      <img
                        src={item.url}
                        alt="The Royal Kraft craftsmanship"
                        className="rk-why-media-image"
                        loading="lazy"
                      />
                    )}

                    {/* ================= VIDEO ================= */}

                    {isVideo && (
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
                          preload="metadata"
                          controls={playingVideo === item.id}
                          onPlay={() =>
                            setPlayingVideo(item.id)
                          }
                          onPause={() =>
                            handleVideoPause(item.id)
                          }
                        />

                        {/* Video Overlay */}

                        {playingVideo !== item.id && (
                          <button
                            type="button"
                            className="rk-why-play-button"
                            onClick={() =>
                              playVideo(item.id)
                            }
                            aria-label="Play video"
                          >
                            <span className="rk-why-play-icon">
                              ▶
                            </span>
                          </button>
                        )}

                        {/* Watch Our Story */}

                        {playingVideo !== item.id && (
                          <div className="rk-why-watch-story">
                            <span>WATCH OUR STORY</span>
                            <i></i>
                          </div>
                        )}

                      </div>
                    )}

                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* =================================================
            FEATURES
        ================================================= */}

        <div className="rk-why-features">

          {whyChooseUs.map((item, index) => {

            const Icon = item.icon;

            return (
              <React.Fragment key={index}>

                <div className="rk-why-feature">

                  <div className="rk-why-feature-icon">
                    <Icon
                      size={25}
                      strokeWidth={1.5}
                    />
                  </div>

                  <div className="rk-why-feature-content">

                    <strong>
                      {item.title}
                    </strong>

                    <span>
                      {item.description}
                    </span>

                  </div>

                </div>

                {index < whyChooseUs.length - 1 && (
                  <div className="rk-why-feature-divider"></div>
                )}

              </React.Fragment>
            );
          })}

        </div>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="rk-why-stats">

          {stats.map((stat, index) => {

            const Icon = stat.icon;

            return (
              <React.Fragment key={index}>

                <div className="rk-why-stat">

                  <div className="rk-why-stat-icon">
                    <Icon
                      size={28}
                      strokeWidth={1.5}
                    />
                  </div>

                  <div className="rk-why-stat-content">

                    <strong>
                      {stat.value}
                    </strong>

                    <span>
                      {stat.label}
                    </span>

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
    </section>
  );
};

export default WhyChooseUs;