import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

function AdminLogin() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            setLoading(true);
            const response = await api.post("/auth/login", {
                email: formData.email,
                password: formData.password,
                role: "admin"
            });

            const { token, user } = response.data;
            login(token, user);
            navigate("/admin/dashboard");
        } catch (error) {
            console.error("Admin login error:", error);

            if (error.response) {
                setError(error.response.data.message || "Admin login failed");
            } else {
                setError("Unable to connect to server");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-brand">
                <div className="auth-brand-content">
                    <img
                        src="/images/examcrafter-logo.png.jpeg"
                        alt="ExamCrafter"
                        className="auth-logo-image"
                    />
                    <p>Manage exams, questions, student assignment, and evaluation from one secure admin portal.</p>
                    <div className="auth-features">
                        <div><span>✓</span> Create and publish exams</div>
                        <div><span>✓</span> Assign student access</div>
                        <div><span>✓</span> View results and submissions</div>
                    </div>
                </div>
            </div>

            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h2>Admin Login</h2>
                        <p>Manage exams, questions and student access</p>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        <button type="submit" className="auth-button" disabled={loading}>
                            {loading ? "Logging in..." : "Login as Admin"}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <span>New admin?</span>
                        <Link to="/admin/register" className="auth-link-button">
                            Admin Registration
                        </Link>
                    </div>

                    <div className="auth-footer">
                        <span>Student access?</span>
                        <Link to="/student/login" className="auth-link-button">
                            Student Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
