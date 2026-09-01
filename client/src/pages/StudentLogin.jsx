import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

function StudentLogin() {
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
                role: "student"
            });

            const { token, user } = response.data;
            login(token, user);
            navigate("/student/dashboard");
        } catch (error) {
            console.error("Student login error:", error);

            if (error.response) {
                setError(error.response.data.message || "Student login failed");
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
                    <p>Access your assigned exams and track your results in one secure platform.</p>
                    <div className="auth-features">
                        <div><span>✓</span> Assigned exam access</div>
                        <div><span>✓</span> Timed online assessments</div>
                        <div><span>✓</span> View performance and results</div>
                    </div>
                </div>
            </div>

            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h2>Student Login</h2>
                        <p>Access your assigned exams and track your results</p>
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
                            {loading ? "Logging in..." : "Login as Student"}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <span>Need an account?</span>
                        <button type="button" className="auth-link-button" onClick={() => navigate("/register")}>
                            Student Registration
                        </button>
                    </div>

                    <div className="auth-footer">
                        <span>Admin access?</span>
                        <Link to="/admin/login" className="auth-link-button">
                            Admin Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentLogin;
