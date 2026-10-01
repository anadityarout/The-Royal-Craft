import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Work.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/work";

// Splits the title so the last word can be shown in gold
const splitTitle = (name) => {
  const words = (name || "").trim().split(/\s+/);
  if (words.length < 2) return { first: name || "", gold: "" };
  return {
    first: words.slice(0, -1).join(" "),
    gold: words[words.length - 1],
  };
};

const Work = () => {
  const navigate = useNavigate();
  const trackRef = useRef(null);

  const [images, setImages] = useState([]);
  const [workText, setWorkText] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [liked, setLiked] = useState({});
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    loadWork();
  }, []);

  const loadWork = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to load work data");
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        // Newest first
        const sorted = [...data].sort(
          (a, b) => new Date(b.created) - new Date(a.created)
        );
        setImages(sorted);

        // Heading text comes from the most recent item that has text
        const withText = sorted.find(
          (item) => item.name?.trim() || item.description?.trim()
        );
        setWorkText({
          name: withText?.name || "",
          description: withText?.description || "",
        });
      }
    } catch (err) {
      console.error("Work API Error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Carousel controls ---------- */

  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [images, loading]);

  const scrollByCard = (direction) => {
    const el = trackRef.current;
    if (!el || !el.firstElementChild) return;
    const card = el.firstElementChild;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: "smooth",
    });
  };

  const toggleLike = (key) => {
    setLiked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const title = splitTitle(workText.name);

  return (
    <section className="rk-work">
      <div className="rk-work-inner">
        {/* ===== Header (centered) ===== */}
        <div className="rk-work-head">
          <span className="rk-work-tag">OUR IMPRESSIVE WORK</span>

          {workText.name && (
            <h2 className="rk-work-title">
              {title.first}
              {title.gold && (
                <>
                  {" "}
                  <span className="rk-work-title-gold">{title.gold}</span>
                </>
              )}
            </h2>
          )}

          {workText.description && (
            <p className="rk-work-description">{workText.description}</p>
          )}
        </div>

        {/* ===== Carousel ===== */}
        <div className="rk-work-carousel">
          {loading && <div className="rk-work-state">Loading...</div>}

          {!loading && error && (
            <div className="rk-work-state">
              Couldn't load our work right now. Please try again later.
            </div>
          )}

          {!loading && !error && images.length > 0 && (
            <>
              <button
                type="button"
                className="rk-work-arrow rk-work-arrow-prev"
                onClick={() => scrollByCard(-1)}
                disabled={!canPrev}
                aria-label="Previous"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <div className="rk-work-track" ref={trackRef} onScroll={updateArrows}>
                {images.map((item, index) => {
                  const key = item.id ?? index;
                  const category = item.category || item.type || "";
                  return (
                    <article className="rk-work-card" key={key}>
                      <div className="rk-work-img">
                        <img
                          src={item.image}
                          alt={item.name || "Work"}
                          loading="lazy"
                        />
                        <button
                          type="button"
                          className={`rk-work-heart ${liked[key] ? "is-liked" : ""}`}
                          onClick={() => toggleLike(key)}
                          aria-label="Like"
                          aria-pressed={!!liked[key]}
                        >
                          <svg viewBox="0 0 24 24" width="18" height="18" fill={liked[key] ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                        </button>
                      </div>

                      {(item.name || category) && (
                        <div className="rk-work-info">
                          {item.name && (
                            <h3 className="rk-work-card-title">{item.name}</h3>
                          )}
                          {category && (
                            <span className="rk-work-card-cat">{category}</span>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>

              <button
                type="button"
                className="rk-work-arrow rk-work-arrow-next"
                onClick={() => scrollByCard(1)}
                disabled={!canNext}
                aria-label="Next"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* ===== Centered button ===== */}
        <div className="rk-work-cta">
          <button className="rk-work-btn" onClick={() => navigate("/project")}>
            VIEW ALL PROJECTS <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Work;