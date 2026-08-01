import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeSlider.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/home";

const HomeSlider = () => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Load data from AWS
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

  // Auto Slider
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides]);

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
          className={`slide ${
            index === currentSlide ? "active" : ""
          }`}
        >
          <img
            src={slide.image}
            alt={slide.name}
            className="slider-media"
          />

          <div className="slider-overlay"></div>

          <div className="slider-content">

            
            <h1>{slide.name}</h1>

            <p>{slide.description}</p>

            <div className="slider-buttons">

              <button className="explore-btn">
                Explore Collection
              </button>

             <button
  className="contact-btn"
  onClick={() => navigate("/contact")}
>
  Contact Us
</button>

            </div>

          </div>

        </div>
      ))}

      {slides.length > 1 && (
        <div className="slider-dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${
                currentSlide === index ? "active" : ""
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HomeSlider;