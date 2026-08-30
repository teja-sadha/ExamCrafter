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

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const {
            name,
            email,
            password,
            confirmPassword
        } = formData;

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                "/auth/register",
                {
                    name,
                    email,
                    password
                }
            );

            setSuccess(response.data.message);

            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: ""
            });

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            console.error(
                "Registration error:",
                error
            );

            if (error.response) {
                setError(
                    error.response.data.message ||
                    "Registration failed"
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
                Branding
            ========================= */}

            <div className="auth-brand">

                <div className="auth-brand-content">

                    <img
    src="/images/examcrafter-logo.png.jpeg"
    alt="ExamCrafter"
    className="auth-logo-image"
/>

                    <p>
                        Build skills.
                        Take exams.
                        Track your progress.
                    </p>

                    <div className="auth-features">

                        <div>
                            <span>✓</span>
                            Practice with online exams
                        </div>

                        <div>
                            <span>✓</span>
                            Get instant results
                        </div>

                        <div>
                            <span>✓</span>
                            Track your performance
                        </div>

                    </div>

                </div>

            </div>

            {/* =========================
                Register Form
            ========================= */}

            <div className="auth-container">

                <div className="auth-card">

                    <div className="auth-header">

                        <h2>
                            Create your account
                        </h2>

                        <p>
                            Join ExamCrafter and
                            start learning
                        </p>

                    </div>

                    {/* Error */}

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    {/* Success */}

                    {success && (
                        <div className="auth-success">
                            {success}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="auth-form"
                    >

                        {/* Name */}

                        <div className="form-group">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={
                                    formData.name
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter your name"
                                autoComplete="name"
                                required
                            />

                        </div>

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
                                placeholder="Create a password"
                                autoComplete="new-password"
                                required
                            />

                        </div>

                        {/* Confirm Password */}

                        <div className="form-group">

                            <label>
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                name="confirmPassword"
                                value={
                                    formData.confirmPassword
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Confirm your password"
                                autoComplete="new-password"
                                required
                            />

                        </div>

                        {/* Submit */}

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating Account..."
                                : "Create Account"}
                        </button>

                    </form>

                    {/* Footer */}

                    <div className="auth-footer">

                        <span>
                            Already have an
                            account?
                        </span>

                        <button
                            type="button"
                            className="auth-link-button"
                            onClick={() =>
                                navigate("/login")
                            }
                        >
                            Login
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;