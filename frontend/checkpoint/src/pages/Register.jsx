import { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await registerUser(form);
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response.data.error || "Registration failed");
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
                <h2 className="auth-title">Create Account</h2>
                <p className="auth-subtitle text-muted">
                  Join the community and start tracking games
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
                    placeholder="Choose a username"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Email</label>
                  <input
                    name="email"
                    type="email"
                    className="form-control custom-input"
                    placeholder="Enter your email"
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
                    placeholder="Create a password"
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-save w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </button>

                <p className="text-center text-muted mb-0">
                  Already have an account?{" "}
                  <a href="/login" className="auth-link">
                    Sign in
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
