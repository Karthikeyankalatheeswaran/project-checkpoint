import { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form);
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      localStorage.setItem("username", form.username);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response || err);
      alert("Login failed. Check username and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-5">
            <div className="auth-card">
              {/* Auth Header */}
              <div className="auth-header text-center mb-4">
                <h2 className="auth-title">Welcome Back</h2>
                <p className="auth-subtitle text-muted">
                  Sign in to continue your gaming journey
                </p>
              </div>

              {/* Auth Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label">Username</label>
                  <input
                    name="username"
                    type="text"
                    className="form-control custom-input"
                    placeholder="Enter your username"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input
                    name="password"
                    type="password"
                    className="form-control custom-input"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-save w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>

                <p className="text-center text-muted mb-0">
                  Don't have an account?{" "}
                  <a href="/register" className="auth-link">
                    Sign up
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
