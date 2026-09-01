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

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [examsResponse, resultsResponse] = await Promise.all([
                    api.get("/exams/published"),
                    api.get("/results")
                ]);

                setExams(examsResponse.data.exams || []);
                setResults(resultsResponse.data.results || []);
            } catch (error) {
                console.error("Dashboard error:", error);

                if (error.response) {
                    setError(error.response.data.message || "Failed to load dashboard");
                } else {
                    setError("Unable to connect to server");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const completedExams = results.length;
    const upcomingExams = exams.filter((exam) => new Date(exam.startDate) > new Date()).length;
    const availableExams = exams.filter((exam) => !exam.hasSubmitted).length;
    const averagePercentage =
        completedExams > 0
            ? (results.reduce((total, result) => total + Number(result.percentage || 0), 0) / completedExams).toFixed(2)
            : "0.00";

    const recentResults = results.slice(0, 3);

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-container">
                    <div className="dashboard-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading your dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-container">
                    <div className="dashboard-error">
                        <h2>Something went wrong</h2>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                <section className="welcome-section">
                    <div>
                        <p className="welcome-label">Student Dashboard</p>
                        <h1>
                            Welcome back, <span>{user?.name}</span> 👋
                        </h1>
                        <p className="welcome-text">
                            Access your assigned exams, track upcoming assessments, and review your results.
                        </p>
                    </div>

                    <div className="welcome-badge">
                        <span>●</span>
                        Student
                    </div>
                </section>

                <section className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📝</div>
                        <div>
                            <p>Available Exams</p>
                            <h2>{availableExams}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">✓</div>
                        <div>
                            <p>Completed Exams</p>
                            <h2>{completedExams}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">🗓️</div>
                        <div>
                            <p>Upcoming Exams</p>
                            <h2>{upcomingExams}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">%</div>
                        <div>
                            <p>Average Score</p>
                            <h2>{averagePercentage}%</h2>
                        </div>
                    </div>
                </section>

                <section className="quick-actions">
                    <div className="section-heading">
                        <div>
                            <h2>Quick Actions</h2>
                            <p>Continue with your assessments</p>
                        </div>
                    </div>

                    <div className="action-grid">
                        <Link to="/student/exams" className="action-card">
                            <div className="action-icon">🚀</div>
                            <div>
                                <h3>Browse Exams</h3>
                                <p>See all assigned and published assessments</p>
                            </div>
                        </Link>

                        <Link to="/student/results" className="action-card">
                            <div className="action-icon">📊</div>
                            <div>
                                <h3>View Results</h3>
                                <p>Check your grades and evaluation history</p>
                            </div>
                        </Link>
                    </div>
                </section>

                <section className="results-panel">
                    <div className="section-heading">
                        <div>
                            <h2>Recent Results</h2>
                            <p>Your latest performance</p>
                        </div>
                    </div>

                    {recentResults.length === 0 ? (
                        <div className="panel-empty-state">
                            <p>No results available yet. Complete your first exam to see performance here.</p>
                        </div>
                    ) : (
                        <div className="result-list">
                            {recentResults.map((result) => (
                                <div key={result._id} className="result-row">
                                    <div>
                                        <strong>{result.exam?.title || "Exam"}</strong>
                                        <small>{new Date(result.createdAt).toLocaleString()}</small>
                                    </div>
                                    <span className="score-pill">{result.percentage || 0}%</span>
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