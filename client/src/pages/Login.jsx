import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

function Login() {
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

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        try {
            setLoading(true);

            const response = await api.post(
                "/auth/login",
                {
                    email: formData.email,
                    password: formData.password
                }
            );

            const { token, user } =
                response.data;

            console.log(
                "Login successful:",
                user
            );

            login(token, user);

            if (user.role === "admin") {
                navigate(
                    "/admin/dashboard"
                );
            } else {
                navigate(
                    "/student/dashboard"
                );
            }

        } catch (error) {
            console.error(
                "Login error:",
                error
            );

            if (error.response) {
                setError(
                    error.response.data.message ||
                    "Login failed"
                );
            } else {
                setError(
                    "Unable to connect to server"
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            {/* =========================
                Left Branding Section
            ========================= */}

            <div className="auth-brand">

                <div className="auth-brand-content">

                    <img
    src="/images/examcrafter-logo.png.jpeg"
    alt="ExamCrafter"
    className="auth-logo-image"
/>

                    <p>
                        Smart online exams,
                        simplified.
                    </p>

                    <div className="auth-features">

                        <div>
                            <span>✓</span>
                            Secure online exams
                        </div>

                        <div>
                            <span>✓</span>
                            Instant results
                        </div>

                        <div>
                            <span>✓</span>
                            Smart exam management
                        </div>

                    </div>

                </div>

            </div>

            {/* =========================
                Login Section
            ========================= */}

            <div className="auth-container">

                <div className="auth-card">

                    <div className="auth-header">

                        <h2>
                            Welcome back
                        </h2>

                        <p>
                            Login to continue to
                            ExamCrafter
                        </p>

                    </div>

                    {/* Error */}

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="auth-form"
                    >

                        {/* Email */}

                        <div className="form-group">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={
                                    formData.email
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter your email"
                                autoComplete="email"
                                required
                            />

                        </div>

                        {/* Password */}

                        <div className="form-group">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={
                                    formData.password
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                            />

                        </div>

                        {/* Login */}

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Logging in..."
                                : "Login"}
                        </button>

                    </form>

                    <div className="auth-footer">

                        <span>
                            Don't have an
                            account?
                        </span>

                        <button
                            type="button"
                            className="auth-link-button"
                            onClick={() =>
                                navigate(
                                    "/register"
                                )
                            }
                        >
                            Create account
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;