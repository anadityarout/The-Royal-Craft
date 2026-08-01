import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const users = [
  {
    username: "admin",
    password: "admin123",
    role: "Admin",
  },
  {
    username: "manager",
    password: "manager123",
    role: "Manager",
  },
];

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const login = (e) => {
    e.preventDefault();

    const user = users.find(
      (u) =>
        u.username === form.username &&
        u.password === form.password
    );

    if (!user) {
      setError("Invalid Username or Password");
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));

    navigate("/admin");
  };

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={login}>

        <div className="login-brand">
          <h1>The Royal Kraft</h1>
          <p className="login-brand-sub">ADMIN PANEL</p>
          <div className="login-divider" />
        </div>

        <h2 className="login-title">Sign In</h2>
        <p className="login-subtitle">
          Enter your credentials to access the admin panel.
        </p>

        <label htmlFor="username">USERNAME</label>
        <input
          id="username"
          type="text"
          placeholder="admin"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <label htmlFor="password">PASSWORD</label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">SIGN IN →</button>

        <a href="/" className="login-back">← Back to Website</a>
      </form>
    </div>
  );
}
