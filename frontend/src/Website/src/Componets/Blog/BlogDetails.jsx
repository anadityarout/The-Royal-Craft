import React from "react";
import "./BlogPage.css";

const BlogDetails = ({ blog, onBack }) => {

  return (

    <div className="blog-details">

      <button
        className="back-btn"
        onClick={onBack}
      >
        ← Back
      </button>

      <div className="blog-details-banner">

        {blog.video ? (

          <video
            controls
            autoPlay
            muted
            playsInline
          >
            <source
              src={blog.video}
              type="video/mp4"
            />
          </video>

        ) : (

          <img
            src={blog.image}
            alt={blog.title}
          />

        )}

      </div>

      <div className="blog-details-content">

        <span>{blog.category}</span>

        <h1>{blog.title}</h1>

        <p>{blog.date}</p>

        <div>

          {blog.description}

        </div>

      </div>

    </div>

  );
};

export default BlogDetails;