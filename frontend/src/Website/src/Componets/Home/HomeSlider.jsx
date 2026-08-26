import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Pause, Play, ArrowRight } from "lucide-react";
import "./HomeSlider.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/home";

const SLIDE_DURATION = 10000;

const HomeSlider = () => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(0);

  const wasManuallyPausedRef = useRef(false);

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setSlides(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, [slides, isPaused, currentSlide]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const togglePause = () => {
    setIsPaused((prev) => {
      const next = !prev;
      wasManuallyPausedRef.current = next;
      return next;
    });
  };

  // ---- Scrub preview: mouse ----
  const handleTrackMouseMove = (e) => {
    if (slides.length === 0) return;

    const track = e.currentTarget;
    const rect = track.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const percent = Math.min(Math.max((relativeX / rect.width) * 100, 0), 100);
    const index = Math.min(
      Math.floor((relativeX / rect.width) * slides.length),
      slides.length - 1
    );

    setHoverPosition(percent);
    setHoverIndex(index);
  };

  const handleTrackMouseLeave = () => {
    setHoverIndex(null);
  };

  // ---- Scrub preview: touch (fires on start AND move) ----
  const handleTrackTouch = (e) => {
    if (slides.length === 0) return;

    const track = e.currentTarget;
    const rect = track.getBoundingClientRect();
    const touch = e.touches[0];
    if (!touch) return;

    const relativeX = touch.clientX - rect.left;
    const percent = Math.min(Math.max((relativeX / rect.width) * 100, 0), 100);
    const index = Math.min(
      Math.floor((relativeX / rect.width) * slides.length),
      slides.length - 1
    );

    setHoverPosition(percent);
    setHoverIndex(index);

    if (index !== currentSlide) {
      setCurrentSlide(index);
    }

    if (!isPaused) {
      setIsPaused(true);
    }
  };

  const handleTrackTouchEnd = () => {
    setHoverIndex(null);

    if (!wasManuallyPausedRef.current) {
      setIsPaused(false);
    }
  };

  if (slides.length === 0) {
    return (
      <section className="home-slider">
        <div className="slider-empty">
          <h2>No Slider Uploaded</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="home-slider">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide ${index === currentSlide ? "active" : ""}`}
        >
          <img
            src={slide.image}
            alt={slide.name}
            className="slider-media"
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
          />

          <div className="slider-overlay"></div>

          <div className="slider-content">
            <span className="slider-kicker">
              {slide.category || "The Royal Kraft"}
            </span>

            <h1>{slide.name}</h1>
            <p>{slide.description}</p>

            <button
              className="slider-cta"
              onClick={() => navigate("/contact")}
            >
              Explore Collection <ArrowRight size={18} />
            </button>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <div className="slider-progress-bar">
          <button
            className="progress-pause-btn"
            onClick={togglePause}
            aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
          >
            {isPaused ? <Play size={14} /> : <Pause size={14} />}
          </button>

          <div
            className="progress-track-group"
            onMouseMove={handleTrackMouseMove}
            onMouseLeave={handleTrackMouseLeave}
            onTouchStart={handleTrackTouch}
            onTouchMove={handleTrackTouch}
            onTouchEnd={handleTrackTouchEnd}
          >
            {slides.map((_, index) => (
              <button
                key={index}
                className="progress-track"
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              >
                {index === currentSlide ? (
                  <span
                    key={`fill-${currentSlide}-${isPaused}`}
                    className="progress-fill active"
                    style={{
                      animationDuration: `${SLIDE_DURATION}ms`,
                      animationPlayState: isPaused ? "paused" : "running",
                    }}
                  />
                ) : (
                  <span
                    className={`progress-fill ${index < currentSlide ? "filled" : ""}`}
                  />
                )}
              </button>
            ))}

            {hoverIndex !== null && slides[hoverIndex] && (
              <div
                className="segment-preview"
                style={{ left: `${hoverPosition}%` }}
              >
                <img
                  src={slides[hoverIndex]?.image}
                  alt={slides[hoverIndex]?.name || "Preview"}
                  className="segment-preview-img"
                />
                <span className="segment-preview-title">
                  {slides[hoverIndex]?.name}
                </span>
              </div>
            )}
          </div>

          <span className="progress-counter">
            {String(currentSlide + 1).padStart(2, "0")} /{" "}
            {String(slides.length).padStart(2, "0")}
          </span>
        </div>
      )}
    </section>
  );
};

export default HomeSlider;
