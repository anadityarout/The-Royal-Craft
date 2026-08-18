import React, { useState, useEffect } from "react";
import BlogDetails from "./BlogDetails";
import "./BlogPage.css";
import blogBanner from "../../assets/Blog.jpg";
import mandapImage from "../../assets/mandap.jpg";
import PageSeo from "../SeoPage/PageSeo";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    "Wedding Decor",
    "Fiber Mandap",
    "Exterior Solutions",
    "Interior Solutions",
    "Custom Design",
  ];

  useEffect(() => {
    // Fetch blogs from Admin Dashboard API
    // setBlogs(response.data);
  }, []);

  // Featured blog - will come from API, fallback for now
  const featuredBlog = {
  image: mandapImage,
  tag: "FIBER MANDAP",
  title: "The Grand Maharaja Mandap: Where Heritage Meets Modern Craftsmanship",
  excerpt:
    "Our latest fiber mandap creation brings together centuries of Indian architectural tradition with precision fiber-glass fabrication — built to last generations, yet radiant enough to crown your most sacred moment.",
  date: "July 28, 2026",
  readTime: "8 min read",
};
  if (selectedBlog) {
    return (
      <BlogDetails
        blog={selectedBlog}
        onBack={() => setSelectedBlog(null)}
      />
    );
  }

  return (
    <>
      <PageSeo page="Blog" />
      <div className="blog-page">

        {/* Banner */}
        <section
  className="blog-banner"
  style={{ backgroundImage: `url(${blogBanner})` }}
></section>

        {/* Featured Blog */}
        <section className="rk-featured-blog-wrapper">
          <div className="rk-featured-blog">
            <div className="rk-featured-blog-image">
              <img src={featuredBlog.image} alt={featuredBlog.title} />
            </div>
            <div className="rk-featured-blog-content">
              <span className="rk-featured-tag">
                <span className="rk-featured-tag-line"></span>
                {featuredBlog.tag}
              </span>
              <h2>{featuredBlog.title}</h2>
              <p>{featuredBlog.excerpt}</p>
              <div className="rk-featured-meta">
                <span>{featuredBlog.date}</span>
                <span className="rk-meta-dot">•</span>
                <span>{featuredBlog.readTime}</span>
              </div>
              <button
                className="rk-featured-btn"
                onClick={() => setSelectedBlog(featuredBlog)}
              >
                READ ARTICLE <span className="rk-btn-arrow">›</span>
              </button>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="rk-category-wrapper">
          <div className="rk-category-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`rk-category-btn ${
                  activeCategory === cat ? "active" : ""
                }`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

      </div>
    </>
  );
};

export default BlogPage;