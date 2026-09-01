import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/auth.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const { name, email, password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/auth/register", {
                name,
                email,
                password
            });

            setSuccess(response.data.message);
            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: ""
            });

            setTimeout(() => {
                navigate("/student/login");
            }, 1500);
        } catch (error) {
            console.error("Registration error:", error);

            if (error.response) {
                setError(error.response.data.message || "Registration failed");
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
                    <p>Create your student account and access assigned exams, scheduled evaluations, and results.</p>
                    <div className="auth-features">
                        <div><span>✓</span> View assigned assessments</div>
                        <div><span>✓</span> Take timed MCQ and coding exams</div>
                        <div><span>✓</span> Review score and performance</div>
                    </div>
                </div>
            </div>

            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h2>Student Registration</h2>
                        <p>Join ExamCrafter to access your assigned exams</p>
                    </div>

                    {error && <div className="auth-error">{error}</div>}
                    {success && <div className="auth-success">{success}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                autoComplete="name"
                                required
                            />
                        </div>

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
                                placeholder="Create a password"
                                autoComplete="new-password"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                autoComplete="new-password"
                                required
                            />
                        </div>

                        <button type="submit" className="auth-button" disabled={loading}>
                            {loading ? "Creating account..." : "Register as Student"}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <span>Already have an account?</span>
                        <button type="button" className="auth-link-button" onClick={() => navigate("/student/login")}>
                            Student Login
                        </button>
                    </div>

                    <div className="auth-footer">
                        <span>Admin access?</span>
                        <button type="button" className="auth-link-button" onClick={() => navigate("/admin/register")}>
                            Admin Registration
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;