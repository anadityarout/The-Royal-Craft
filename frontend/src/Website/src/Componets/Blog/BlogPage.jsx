import React, { useState, useEffect } from "react";
import BlogDetails from "./BlogDetails";
import "./BlogPage.css";
import PageSeo from "../SeoPage/PageSeo";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    // Fetch blogs from Admin Dashboard API
    // setBlogs(response.data);
  }, []);

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
      <section className="blog-banner">
        {/* Banner Image from Admin Dashboard */}
      </section>

      {/* Blog List */}
      <section className="blog-grid">

        {blogs.map((blog) => (

          <div className="blog-item" key={blog.id}>

            <div className="blog-image">
              <img src={blog.image} alt={blog.title} />
            </div>

            <div className="blog-content">

              <div className="blog-header">
                <span>{blog.category}</span>
                <span>{blog.date}</span>
              </div>

              <h2>{blog.title}</h2>

              <p>{blog.shortDescription}</p>

              <button
                className="read-more"
                onClick={() => setSelectedBlog(blog)}
              >
                Read More →
              </button>

            </div>

          </div>

        ))}

      </section>

    </div>
      </>
  );
};

export default BlogPage;