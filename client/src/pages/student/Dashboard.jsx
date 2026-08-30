import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "../../styles/dashboard.css";

function StudentDashboard() {
    const { user } = useAuth();

    const [exams, setExams] = useState([]);
    const [results, setResults] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================
    // Fetch Dashboard Data
    // =========================

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [
                    examsResponse,
                    resultsResponse
                ] = await Promise.all([
                    api.get("/exams/published"),
                    api.get("/results")
                ]);

                setExams(
                    examsResponse.data.exams || []
                );

                setResults(
                    resultsResponse.data.results || []
                );

            } catch (error) {
                console.error(
                    "Dashboard error:",
                    error
                );

                if (error.response) {
                    setError(
                        error.response.data.message ||
                        "Failed to load dashboard"
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

        fetchDashboardData();
    }, []);

    // =========================
    // Statistics
    // =========================

    const completedExams =
        results.length;

    const availableExams =
        exams.filter(
            (exam) => !exam.hasSubmitted
        ).length;

    const averagePercentage =
        completedExams > 0
            ? (
                  results.reduce(
                      (total, result) =>
                          total +
                          Number(
                              result.percentage || 0
                          ),
                      0
                  ) / completedExams
              ).toFixed(2)
            : "0.00";

    // =========================
    // Loading
    // =========================

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-container">
                    <div className="dashboard-loading">
                        <div className="loading-spinner"></div>
                        <p>
                            Loading your dashboard...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // =========================
    // Error
    // =========================

    if (error) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-container">
                    <div className="dashboard-error">
                        <h2>
                            Something went wrong
                        </h2>

                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    // =========================
    // Dashboard
    // =========================

    return (
        <div className="dashboard-page">

            <div className="dashboard-container">

                {/* =========================
                    Welcome
                ========================= */}

                <section className="welcome-section">

                    <div>
                        <p className="welcome-label">
                            Student Dashboard
                        </p>

                        <h1>
                            Welcome back,{" "}
                            <span>
                                {user?.name}
                            </span>
                            👋
                        </h1>

                        <p className="welcome-text">
                            Keep learning, take
                            exams and track your
                            progress.
                        </p>
                    </div>

                    <div className="welcome-badge">
                        <span>●</span>
                        Student
                    </div>

                </section>

                {/* =========================
                    Statistics
                ========================= */}

                <section className="stats-grid">

                    <div className="stat-card">

                        <div className="stat-icon">
                            📝
                        </div>

                        <div>
                            <p>
                                Available Exams
                            </p>

                            <h2>
                                {availableExams}
                            </h2>
                        </div>

                    </div>

                    <div className="stat-card">

                        <div className="stat-icon">
                            ✓
                        </div>

                        <div>
                            <p>
                                Completed Exams
                            </p>

                            <h2>
                                {completedExams}
                            </h2>
                        </div>

                    </div>

                    <div className="stat-card">

                        <div className="stat-icon">
                            %
                        </div>

                        <div>
                            <p>
                                Average Score
                            </p>

                            <h2>
                                {averagePercentage}%
                            </h2>
                        </div>

                    </div>

                </section>

                {/* =========================
                    Quick Actions
                ========================= */}

                <section className="quick-actions">

                    <div className="section-heading">
                        <div>
                            <h2>
                                Quick Actions
                            </h2>

                            <p>
                                Continue where you
                                left off
                            </p>
                        </div>
                    </div>

                    <div className="action-grid">

                        <Link
                            to="/student/exams"
                            className="action-card"
                        >
                            <div className="action-icon">
                                🚀
                            </div>

                            <div>
                                <h3>
                                    Browse Exams
                                </h3>

                                <p>
                                    Find available
                                    exams and start
                                    testing your
                                    skills.
                                </p>
                            </div>

                            <span className="action-arrow">
                                →
                            </span>
                        </Link>

                        <Link
                            to="/student/results"
                            className="action-card"
                        >
                            <div className="action-icon">
                                📊
                            </div>

                            <div>
                                <h3>
                                    My Results
                                </h3>

                                <p>
                                    Review your exam
                                    scores and
                                    performance.
                                </p>
                            </div>

                            <span className="action-arrow">
                                →
                            </span>
                        </Link>

                    </div>

                </section>

                {/* =========================
                    Recent Results
                ========================= */}

                <section className="recent-section">

                    <div className="section-heading">

                        <div>
                            <h2>
                                Recent Results
                            </h2>

                            <p>
                                Your latest exam
                                performance
                            </p>
                        </div>

                        {results.length > 0 && (
                            <Link
                                to="/student/results"
                                className="view-all-link"
                            >
                                View all →
                            </Link>
                        )}

                    </div>

                    {results.length === 0 ? (
                        <div className="empty-card">

                            <div className="empty-icon">
                                📚
                            </div>

                            <h3>
                                No exams completed yet
                            </h3>

                            <p>
                                Take your first exam
                                to see your results
                                here.
                            </p>

                            <Link
                                to="/student/exams"
                                className="primary-link"
                            >
                                Explore Exams
                            </Link>

                        </div>
                    ) : (
                        <div className="results-list">

                            {results
                                .slice(0, 5)
                                .map((result) => (
                                    <div
                                        key={
                                            result._id
                                        }
                                        className="result-card"
                                    >

                                        <div className="result-main">

                                            <div className="result-icon">
                                                ✓
                                            </div>

                                            <div>
                                                <h3>
                                                    {result.exam
                                                        ?.title ||
                                                        "Exam"}
                                                </h3>

                                                <p>
                                                    {new Date(
                                                        result.submittedAt
                                                    ).toLocaleDateString(
                                                        undefined,
                                                        {
                                                            year:
                                                                "numeric",
                                                            month:
                                                                "short",
                                                            day:
                                                                "numeric"
                                                        }
                                                    )}
                                                </p>
                                            </div>

                                        </div>

                                        <div className="result-score">

                                            <strong>
                                                {Number(
                                                    result.percentage
                                                ).toFixed(
                                                    2
                                                )}
                                                %
                                            </strong>

                                            <span>
                                                {result.score}{" "}
                                                /{" "}
                                                {
                                                    result.totalMarks
                                                }
                                            </span>

                                        </div>

                                        <Link
                                            to={`/student/results/${result.exam?._id}`}
                                            className="result-link"
                                        >
                                            View →
                                        </Link>

                                    </div>
                                ))}

                        </div>
                    )}

                </section>

            </div>

        </div>
    );
}

export default StudentDashboard;