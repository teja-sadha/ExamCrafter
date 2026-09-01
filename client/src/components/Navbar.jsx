import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.css";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate(user?.role === "admin" ? "/admin/login" : "/student/login");
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    // Student is currently writing an exam
    const isStudentExamPage =
        user?.role === "student" &&
        location.pathname.startsWith("/student/exam/");

    // =========================
    // Exam Mode Navbar
    // =========================

    if (isStudentExamPage) {
        return (
            <nav className="navbar exam-mode-navbar">

                <div className="navbar-container">

                    <Link
                        to="/student/exams"
                        className="navbar-logo"
                    >
                        <img
                            src="/images/examcrafter-logo.png.jpeg"
                            alt="ExamCrafter"
                            className="navbar-logo-image"
                        />
                    </Link>

                    <div className="exam-mode-title">
                        <span>Exam in Progress</span>
                    </div>

                </div>

            </nav>
        );
    }

    return (
        <nav className="navbar">

            <div className="navbar-container">

                {/* =========================
                    Logo
                ========================= */}

                <Link
                    to="/"
                    className="navbar-logo"
                >
                    <img
                        src="/images/examcrafter-logo.png.jpeg"
                        alt="ExamCrafter"
                        className="navbar-logo-image"
                    />
                </Link>

                {/* =========================
                    Navigation
                ========================= */}

                <div className="navbar-links">

                    {/* Guest */}

                    {!user && (
                        <>
                            <Link
                                to="/"
                                className={
                                    isActive("/")
                                        ? "active"
                                        : ""
                                }
                            >
                                Home
                            </Link>

                            <Link
                                to="/student/login"
                                className={
                                    isActive("/student/login")
                                        ? "active"
                                        : ""
                                }
                            >
                                Student Login
                            </Link>

                            <Link
                                to="/admin/login"
                                className={
                                    isActive("/admin/login")
                                        ? "active"
                                        : ""
                                }
                            >
                                Admin Login
                            </Link>

                            <Link
                                to="/register"
                                className={`navbar-register ${
                                    isActive("/register")
                                        ? "active"
                                        : ""
                                }`}
                            >
                                Register
                            </Link>
                        </>
                    )}

                    {/* Student */}

                    {user?.role === "student" && (
                        <>
                            <Link
                                to="/student/dashboard"
                                className={
                                    isActive(
                                        "/student/dashboard"
                                    )
                                        ? "active"
                                        : ""
                                }
                            >
                                Dashboard
                            </Link>

                            <Link
                                to="/student/exams"
                                className={
                                    isActive(
                                        "/student/exams"
                                    )
                                        ? "active"
                                        : ""
                                }
                            >
                                Exams
                            </Link>

                            <Link
                                to="/student/results"
                                className={
                                    isActive(
                                        "/student/results"
                                    )
                                        ? "active"
                                        : ""
                                }
                            >
                                Results
                            </Link>

                            <div className="navbar-user">

                                <span className="user-avatar">
                                    {user?.name
                                        ?.charAt(0)
                                        ?.toUpperCase()}
                                </span>

                                <span className="user-name">
                                    {user?.name}
                                </span>

                            </div>

                            <button
                                className="navbar-logout"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    )}

                    {/* Admin */}

                    {user?.role === "admin" && (
                        <>
                            <Link
                                to="/admin/dashboard"
                                className={
                                    isActive(
                                        "/admin/dashboard"
                                    )
                                        ? "active"
                                        : ""
                                }
                            >
                                Dashboard
                            </Link>

                            <Link
                                to="/admin/exams"
                                className={
                                    isActive(
                                        "/admin/exams"
                                    )
                                        ? "active"
                                        : ""
                                }
                            >
                                Exams
                            </Link>

                            <Link
                                to="/admin/create-admin"
                                className={
                                    isActive(
                                        "/admin/create-admin"
                                    )
                                        ? "active"
                                        : ""
                                }
                            >
                                Create Admin
                            </Link>

                            <Link
                                to="/admin/results"
                                className={
                                    isActive(
                                        "/admin/results"
                                    )
                                        ? "active"
                                        : ""
                                }
                            >
                                Results
                            </Link>

                            <div className="navbar-user">

                                <span className="user-avatar">
                                    {user?.name
                                        ?.charAt(0)
                                        ?.toUpperCase()}
                                </span>

                                <span className="user-name">
                                    {user?.name}
                                </span>

                            </div>

                            <button
                                className="navbar-logout"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    )}

                </div>

            </div>

        </nav>
    );
}

export default Navbar;