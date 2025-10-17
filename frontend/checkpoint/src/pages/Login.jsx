import { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      localStorage.setItem("username", form.username);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response || err);
      alert("Login failed. Check username and password.");
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div
        className="custom-card p-5"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="text-center mb-4">
          <i
            className="bi bi-joystick display-4"
            style={{ color: "#3498db" }}
          ></i>
          <h3 className="fw-bold mt-3" style={{ color: "#2c3e50" }}>
            Welcome Back
          </h3>
          <p style={{ color: "#7f8c8d" }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label fw-bold" style={{ color: "#2c3e50" }}>
              Username
            </label>
            <input
              name="username"
              className="form-control form-control-custom"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold" style={{ color: "#2c3e50" }}>
              Password
            </label>
            <input
              name="password"
              type="password"
              className="form-control form-control-custom"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary-custom btn-custom w-100 py-3 fw-bold"
          >
            Sign In
          </button>
        </form>

        <div className="text-center mt-4">
          <p style={{ color: "#7f8c8d" }}>
            Don't have an account?{" "}
            <a
              href="/register"
              className="fw-bold text-decoration-none"
              style={{ color: "#3498db" }}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
