import React, { useEffect, useState } from "react";
import "./AboutPage.css";
import PageSeo from "../SeoPage/PageSeo";

import {
  PiUsersThreeLight,
  PiLightningLight,
  PiEyeLight,
  PiCheckCircleLight,
  PiLightbulbLight,
  PiSparkleLight,
  PiTrendUpLight,
  PiShieldCheckLight,
  PiCurrencyCircleDollarLight,
  PiShieldCheckeredLight,
  PiRocketLight,
  PiCalendarCheckLight,
  PiPlayCircleLight,
  PiFileTextLight,
  PiInfoLight,
} from "react-icons/pi";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/about-page";

const AboutPage = () => {

  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  const [years, setYears] = useState(0);
  const [projects, setProjects] = useState(0);
  const [clients, setClients] = useState(0);
  const [experts, setExperts] = useState(0);

  // ===========================
  // Load About Data
  // ===========================

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    try {

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load About.");
      }

      const data = await response.json();

      if (data.length > 0) {
        setAbout(data[0]);
      }

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // Counter Animation
  // ===========================

  useEffect(() => {

    const duration = 10000;
    const interval = 50;

    const targetYears = 15;
    const targetProjects = 250;
    const targetClients = 120;
    const targetExperts = 50;

    const steps = duration / interval;

    const yearStep = targetYears / steps;
    const projectStep = targetProjects / steps;
    const clientStep = targetClients / steps;
    const expertStep = targetExperts / steps;

    let y = 0;
    let p = 0;
    let c = 0;
    let e = 0;

    const timer = setInterval(() => {

      y += yearStep;
      p += projectStep;
      c += clientStep;
      e += expertStep;

      setYears(Math.min(Math.round(y), targetYears));
      setProjects(Math.min(Math.round(p), targetProjects));
      setClients(Math.min(Math.round(c), targetClients));
      setExperts(Math.min(Math.round(e), targetExperts));

      if (
        y >= targetYears &&
        p >= targetProjects &&
        c >= targetClients &&
        e >= targetExperts
      ) {
        clearInterval(timer);
      }

    }, interval);

    return () => clearInterval(timer);

  }, []);

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "100px",
          fontSize: "22px",
          fontWeight: "600",
        }}
      >
        Loading About Page...
      </div>
    );
  }

  return (
     <>
    <PageSeo page="About" />

    <div className="about-page">

      {/* ===========================
          Banner
      =========================== */}

      <section className="about-banner">

        <img
          src={about?.slideImage || ""}
          alt="About Banner"
          className="about-banner-image"
        />

      </section>

      {/* ===========================
          Our Story
      =========================== */}

      <section className="our-story">

        <div className="our-story-heading">

          <h2>Our Story</h2>

          <div className="our-story-underline"></div>

        </div>

        <div className="our-story-content">

          {/* Left */}

          <div className="our-story-left">

            <span className="our-story-badge">

              <span className="badge-dot"></span>

              Transforming Businesses Since 2014

            </span>

            <h3>

              Building Tomorrow's Solutions Today

            </h3>

            <p>
              Founded with a vision to revolutionize the technology landscape,
              we've been at the forefront of digital innovation since our
              inception.
            </p>

            <p>
              Our journey has been marked by continuous learning, adaptation,
              and an unwavering commitment to excellence.
            </p>

            <p>
              Today, we stand as a trusted partner for businesses seeking to
              leverage technology for growth and innovation.
            </p>

            <div className="our-story-highlights">

              <span className="highlight-item">

                <svg viewBox="0 0 24 24" className="check-icon">

                  <path
                    d="M4 12.5L9 17.5L20 6.5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                </svg>

                Proven Track Record

              </span>

              <span className="highlight-item">

                <svg viewBox="0 0 24 24" className="check-icon">

                  <path
                    d="M4 12.5L9 17.5L20 6.5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                </svg>

                Global Reach

              </span>

              <span className="highlight-item">

                <svg viewBox="0 0 24 24" className="check-icon">

                  <path
                    d="M4 12.5L9 17.5L20 6.5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                </svg>

                Innovation Driven

              </span>

            </div>

          </div>

          {/* Right */}

          <div className="our-story-right">

            <div className="story-image-wrap">

              <img
                src={about?.storyImage || ""}
                alt="Our Story"
                className="story-image"
              />

            </div>

          </div>

        </div>

      </section>

      {/* ===========================
          Our Mission & Vision
      =========================== */}

      <section className="mission-vision">

        <div className="mv-heading">

          <h2>Our Mission &amp; Vision</h2>

          <div className="mv-underline"></div>

        </div>

        <div className="mv-grid">
                    {/* ===========================
              Mission Card
          =========================== */}

          <div className="mv-card mission-card">

            <div className="mv-icon">
              <PiLightningLight />
            </div>

            <h3>Our Mission</h3>

            <div className="mv-line"></div>

            <p>
              To empower businesses with innovative technology solutions that
              drive growth, efficiency, and competitive advantage. We strive to
              be a catalyst for digital transformation, enabling our clients to
              thrive in the modern business landscape through cutting-edge
              software, strategic consulting, and exceptional service.
            </p>

          </div>

          {/* ===========================
              Vision Card
          =========================== */}

          <div className="mv-card vision-card">

            <div className="mv-icon">
              <PiEyeLight />
            </div>

            <h3>Our Vision</h3>

            <div className="mv-line"></div>

            <p>
              To be a global leader in technology solutions, recognized for our
              innovation, reliability, and customer-centric approach. We
              envision a future where every business can harness the power of
              technology to achieve sustainable growth.
            </p>

          </div>

        </div>

      </section>

      {/* ===========================
          Core Values
      =========================== */}

      <section className="core-values">

        <div className="cv-heading">

          <h2>Core Values</h2>

          <div className="cv-underline"></div>

        </div>

        <div className="cv-grid">

          <div className="cv-item">

            <div className="cv-icon">
              <PiCheckCircleLight />
            </div>

            <h3>Integrity</h3>

            <p>
              We operate with transparency, honesty and ethical principles in
              everything we do.
            </p>

          </div>

          <div className="cv-item">

            <div className="cv-icon">
              <PiLightbulbLight />
            </div>

            <h3>Innovation</h3>

            <p>
              We continuously explore new technologies and creative solutions
              to solve complex business challenges.
            </p>

          </div>

          <div className="cv-item">

            <div className="cv-icon">
              <PiUsersThreeLight />
            </div>

            <h3>Collaboration</h3>

            <p>
              We believe in teamwork and building long-term partnerships with
              our clients.
            </p>

          </div>

          <div className="cv-item">

            <div className="cv-icon">
              <PiLightningLight />
            </div>

            <h3>Excellence</h3>

            <p>
              We are committed to delivering the highest quality services with
              complete customer satisfaction.
            </p>

          </div>

        </div>

      </section>

      {/* ===========================
          Founder's Vision
      =========================== */}

      <section className="founder-vision">

        <div className="fv-heading">

          <h2>Founder's Vision</h2>

        </div>

        <div className="fv-content">

          {/* Left */}

          <div className="fv-left">

            <div className="fv-image-wrap">

              <img
                src={about?.founderImage || ""}
                alt="Founder"
                className="fv-image"
              />

              <div className="fv-badge">

                <span className="fv-badge-name">
                  Vinay Gupta
                </span>

                <span className="fv-badge-role">
                  Founder & CEO
                </span>

              </div>

            </div>

          </div>

          {/* Right */}

          <div className="fv-right">

            <span className="fv-tag">
              15+ Years of Innovation Leadership
            </span>

            <h3>
              Pioneering Digital Transformation Through Visionary Leadership
            </h3>

            <p>
              Vinay Gupta is the visionary founder and CEO of Royal Craft,
              bringing years of expertise in technology innovation and digital
              transformation. His journey began with a mission to bridge the
              gap between advanced technology and practical business solutions.
            </p>

            <p>
              Under his leadership, Royal Craft has grown into a trusted
              technology partner serving businesses across multiple industries
              with innovative and reliable digital solutions.
            </p>

            <p>
              His passion for innovation, customer success and continuous
              improvement inspires the entire team to deliver exceptional
              results and build long-term client relationships.
            </p>

            <div className="fv-cards">

              <div className="fv-card">

                <h4>Leadership Philosophy</h4>

                <p>
                  Innovation, Integrity & Impact
                </p>

              </div>

              <div className="fv-card">

                <h4>Core Focus</h4>

                <p>
                  Client Success & Technology Excellence
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ===========================
          Life at Royal Craft
      =========================== */}

      <section className="life-oscorm">

        <div className="lo-heading">

          <h2>Life at Royal Craft</h2>

        </div>

        <div className="lo-content">
                    {/* Left */}

          <div className="lo-left">

            <h3>
              Where Innovation Meets Passion
            </h3>

            <p>
              At Royal Craft, we foster a dynamic and inclusive workplace where
              creativity, collaboration and innovation thrive. Every team member
              is encouraged to contribute ideas, embrace challenges and grow
              both personally and professionally.
            </p>

            <p>
              Our culture is built on trust, continuous learning and mutual
              respect. We believe that when talented people work together with a
              shared purpose, extraordinary results become possible.
            </p>

            <p>
              Whether delivering exceptional projects or celebrating milestones,
              we are committed to creating an environment where everyone can
              succeed and enjoy the journey together.
            </p>

          </div>

          {/* Right */}

          <div className="lo-right">

            <img
              src={about?.lifeImage || ""}
              alt="Life at Royal Craft"
              className="lo-image"
            />

          </div>

        </div>

      </section>

      {/* ===========================
          Our Achievements
      =========================== */}

      <section className="achievements">

        <div className="ach-heading">

          <h2>Our Achievements</h2>

        </div>

        <div className="ach-grid">

          <div className="ach-card">

            <div className="ach-icon">
              <PiCheckCircleLight />
            </div>

            <h3>ISO 9001 Certified</h3>

            <p>
              Recognized for maintaining world-class quality management
              standards and delivering consistent excellence.
            </p>

          </div>

          <div className="ach-card">

            <div className="ach-icon">
              <PiSparkleLight />
            </div>

            <h3>Innovation Award</h3>

            <p>
              Honoured for delivering innovative technology solutions that
              transformed business operations for our clients.
            </p>

          </div>

          <div className="ach-card">

            <div className="ach-icon">
              <PiUsersThreeLight />
            </div>

            <h3>Best Workplace</h3>

            <p>
              Recognized for building a collaborative workplace that values
              creativity, growth and employee well-being.
            </p>

          </div>

          <div className="ach-card">

            <div className="ach-icon">
              <PiTrendUpLight />
            </div>

            <h3>500+ Projects Delivered</h3>

            <p>
              Successfully completed hundreds of residential, commercial and
              custom interior projects with outstanding client satisfaction.
            </p>

          </div>

          <div className="ach-card">

            <div className="ach-icon">
              <PiShieldCheckLight />
            </div>

            <h3>Trusted Quality</h3>

            <p>
              Every project is completed with strict quality standards,
              premium materials and expert craftsmanship.
            </p>

          </div>

          <div className="ach-card">

            <div className="ach-icon">
              <PiCurrencyCircleDollarLight />
            </div>

            <h3>Customer Satisfaction</h3>

            <p>
              Our long-term relationships and repeat customers reflect our
              commitment to delivering exceptional value and service.
            </p>

          </div>

        </div>

      </section>

      {/* ===========================
          Our Journey
      =========================== */}

      <section className="journey-section">

        <div className="journey-stats">
                    <div className="journey-item">

            <h3>{projects}+</h3>

            <p>Projects Completed</p>

          </div>

          <div className="journey-item">

            <h3>{clients}+</h3>

            <p>Happy Clients</p>

          </div>

          <div className="journey-item">

            <h3>{experts}+</h3>

            <p>Team Members</p>

          </div>

          <div className="journey-item">

            <h3>{years}+</h3>

            <p>Years Experience</p>

          </div>

        </div>

      </section>

      {/* ===========================
          Scale Your Team CTA
      =========================== */}

      <section className="scale-cta">

        <div className="scale-card">

          <h2>
            Build Your Dream Space with Royal Craft
          </h2>

          <p>
            Whether you're planning a modern home, elegant office,
            commercial workspace, or custom interiors, our experienced
            team is ready to bring your vision to life with exceptional
            craftsmanship and premium quality.
          </p>

          <div className="scale-pills">

            <span className="scale-pill">

              <PiShieldCheckeredLight />

              Premium Quality Materials

            </span>

            <span className="scale-pill">

              <PiRocketLight />

              On-Time Project Delivery

            </span>

          </div>

          <div className="scale-buttons">

            <button className="scale-btn dark">

              <PiCalendarCheckLight />

              Book a Free Consultation

            </button>

            <button className="scale-btn">

              <PiPlayCircleLight />

              Request a Quote

            </button>

            <button className="scale-btn">

              <PiFileTextLight />

              Contact Our Team

            </button>

          </div>

          <p className="scale-footnote">

            <PiInfoLight />

            Every project includes professional planning, dedicated
            project management, transparent communication, and complete
            customer support from start to finish.

          </p>

        </div>

      </section>

    </div>
  </>

  );

};

export default AboutPage;