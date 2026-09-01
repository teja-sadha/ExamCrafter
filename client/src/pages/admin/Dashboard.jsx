import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "../../styles/dashboard.css";

function AdminDashboard() {
    const { user } = useAuth();

    const [exams, setExams] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [examsResponse, resultsResponse] = await Promise.all([
                    api.get("/exams"),
                    api.get("/results/admin")
                ]);

                setExams(examsResponse.data.exams || []);
                setResults(resultsResponse.data.results || []);
            } catch (error) {
                console.error("Admin dashboard error:", error);

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

    const totalExams = exams.length;
    const publishedExams = exams.filter((exam) => exam.status === "published").length;
    const draftExams = exams.filter((exam) => exam.status === "draft").length;
    const totalQuestions = exams.reduce((sum, exam) => sum + Number(exam.questionCount || 0), 0);
    const totalSubmissions = results.length;

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-container">
                    <div className="dashboard-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading dashboard...</p>
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
                        <h2>Admin Dashboard</h2>
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
                        <p className="welcome-label">Admin Dashboard</p>
                        <h1>
                            Manage your exams, <span>{user?.name}</span>
                        </h1>
                        <p className="welcome-text">
                            Create assessments, manage question banks, assign student access, and review performance.
                        </p>
                    </div>

                    <div className="welcome-badge">
                        <span>●</span>
                        Admin
                    </div>
                </section>

                <section className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📘</div>
                        <div>
                            <p>Total Exams</p>
                            <h2>{totalExams}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div>
                            <p>Published Exams</p>
                            <h2>{publishedExams}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">📝</div>
                        <div>
                            <p>Draft Exams</p>
                            <h2>{draftExams}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">❓</div>
                        <div>
                            <p>Total Questions</p>
                            <h2>{totalQuestions}</h2>
                        </div>
                    </div>
                </section>

                <section className="quick-actions">
                    <div className="section-heading">
                        <div>
                            <h2>Quick Actions</h2>
                            <p>Manage evaluation workflow</p>
                        </div>
                    </div>

                    <div className="action-grid">
                        <Link to="/admin/exams/create" className="action-card">
                            <div className="action-icon">＋</div>
                            <div>
                                <h3>Create Exam</h3>
                                <p>Design new exam schedules, duration, and assigned students</p>
                            </div>
                        </Link>

                        <Link to="/admin/exams" className="action-card">
                            <div className="action-icon">📚</div>
                            <div>
                                <h3>Manage Exams</h3>
                                <p>Update exam details, statuses, and question banks</p>
                            </div>
                        </Link>

                        <Link to="/admin/results" className="action-card">
                            <div className="action-icon">📊</div>
                            <div>
                                <h3>View Results</h3>
                                <p>Track exam submissions and overall student performance</p>
                            </div>
                        </Link>

                        <Link to="/admin/create-admin" className="action-card">
                            <div className="action-icon">👥</div>
                            <div>
                                <h3>Create Admin</h3>
                                <p>Manage additional admin and teacher accounts</p>
                            </div>
                        </Link>
                    </div>
                </section>

                <section className="results-panel">
                    <div className="section-heading">
                        <div>
                            <h2>Submission Summary</h2>
                            <p>Live activity across your assessments</p>
                        </div>
                    </div>

                    <div className="result-list">
                        <div className="result-row">
                            <div>
                                <strong>Total submissions</strong>
                                <small>Student attempts received</small>
                            </div>
                            <span className="score-pill">{totalSubmissions}</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AdminDashboard;