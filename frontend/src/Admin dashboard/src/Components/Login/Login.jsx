import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_URL =
  "https://k3ura4d38k.execute-api.ap-south-1.amazonaws.com/login";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Show / hide password
  const [showPassword, setShowPassword] = useState(false);

  // ======================================
  // INPUT CHANGE
  // ======================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // ======================================
  // LOGIN
  // ======================================

  const login = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.username.trim()) {
      setError("Please enter your username.");
      return;
    }

    if (!form.password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username: form.username.trim(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Invalid username or password."
        );
        return;
      }

      if (!data.success || !data.user) {
        setError(
          data.message ||
            "Login failed."
        );
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      navigate("/admin");

    } catch (err) {
      console.error("Login error:", err);

      setError(
        "Unable to connect to the server. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <form
        className="login-box"
        onSubmit={login}
      >

        {/* ==================================
            BRAND
        ================================== */}

        <div className="login-brand">

          <h1>
            The Royal Kraft
          </h1>

          <p className="login-brand-sub">
            ADMIN PANEL
          </p>

          <div className="login-divider" />

        </div>


        {/* ==================================
            TITLE
        ================================== */}

        <h2 className="login-title">
          Sign In
        </h2>

        <p className="login-subtitle">
          Enter your credentials to access the admin panel.
        </p>


        {/* ==================================
            USERNAME
        ================================== */}

        <label htmlFor="username">
          USERNAME
        </label>

        <input
          id="username"
          name="username"
          type="text"
          placeholder="Enter username"
          value={form.username}
          onChange={handleChange}
          autoComplete="username"
        />


        {/* ==================================
            PASSWORD
        ================================== */}

        <label htmlFor="password">
          PASSWORD
        </label>

        <div className="password-wrapper">

          <input
            id="password"
            name="password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
          />

          {/* Eye Button */}

          <button
            type="button"
            className="password-eye"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
          >

            {showPassword ? (

              /* Eye Off SVG */

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3l18 18" />
                <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c5 0 8.5 4 10 8-0.6 1.5-1.5 2.8-2.7 4" />
                <path d="M6.6 6.6C4.8 7.8 3.6 9.5 2 12c1.5 4 5 8 10 8 1.5 0 2.8-.3 4-.9" />
              </svg>

            ) : (

              /* Eye SVG */

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                />
              </svg>

            )}

          </button>

        </div>


        {/* ==================================
            ERROR
        ================================== */}

        {error && (
          <p className="error">
            {error}
          </p>
        )}


        {/* ==================================
            SIGN IN BUTTON
        ================================== */}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "SIGNING IN..."
            : "SIGN IN →"}
        </button>


        {/* ==================================
            BACK TO WEBSITE
        ================================== */}

        <a
          href="/"
          className="login-back"
        >
          ← Back to Website
        </a>

      </form>

    </div>
  );
}