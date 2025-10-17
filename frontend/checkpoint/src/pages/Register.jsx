import { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(form);
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response.data.error || "Registration failed");
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div
        className="custom-card p-5"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        <div className="text-center mb-4">
          <i
            className="bi bi-person-plus display-4"
            style={{ color: "#9b59b6" }}
          ></i>
          <h3 className="fw-bold mt-3" style={{ color: "#2c3e50" }}>
            Create Account
          </h3>
          <p style={{ color: "#7f8c8d" }}>Join our gaming community</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold" style={{ color: "#2c3e50" }}>
              Username
            </label>
            <input
              name="username"
              className="form-control form-control-custom"
              placeholder="Choose a username"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold" style={{ color: "#2c3e50" }}>
              Email
            </label>
            <input
              name="email"
              type="email"
              className="form-control form-control-custom"
              placeholder="Enter your email"
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
              placeholder="Create a password"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary-custom btn-custom w-100 py-3 fw-bold"
          >
            Create Account
          </button>
        </form>

        <div className="text-center mt-4">
          <p style={{ color: "#7f8c8d" }}>
            Already have an account?{" "}
            <a
              href="/login"
              className="fw-bold text-decoration-none"
              style={{ color: "#3498db" }}
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
