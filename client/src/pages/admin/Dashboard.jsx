import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function AdminDashboard() {
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
                    api.get("/exams"),
                    api.get("/results/admin")
                ]);

                setExams(
                    examsResponse.data.exams || []
                );

                setResults(
                    resultsResponse.data.results || []
                );

            } catch (error) {
                console.error(
                    "Admin dashboard error:",
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

    const totalExams = exams.length;

    const publishedExams =
        exams.filter(
            (exam) =>
                exam.status === "published"
        ).length;

    const draftExams =
        exams.filter(
            (exam) =>
                exam.status === "draft"
        ).length;

    const totalSubmissions =
        results.length;

    // =========================
    // Loading
    // =========================

    if (loading) {
        return (
            <div>
                <h1>
                    Admin Dashboard
                </h1>

                <p>
                    Loading dashboard...
                </p>
            </div>
        );
    }

    // =========================
    // Error
    // =========================

    if (error) {
        return (
            <div>
                <h1>
                    Admin Dashboard
                </h1>

                <p
                    style={{
                        color: "red"
                    }}
                >
                    {error}
                </p>
            </div>
        );
    }

    // =========================
    // Dashboard
    // =========================

    return (
        <div>

            <h1>
                Admin Dashboard
            </h1>

            <h2>
                Welcome, {user?.name}
            </h2>

            <p>
                Email: {user?.email}
            </p>

            <p>
                Role: {user?.role}
            </p>

            <hr />

            {/* =========================
                Statistics
            ========================= */}

            <h2>
                Exam Statistics
            </h2>

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    flexWrap: "wrap"
                }}
            >

                {/* Total Exams */}

                <div
                    style={{
                        border:
                            "1px solid #ccc",
                        padding: "20px",
                        borderRadius:
                            "8px",
                        minWidth:
                            "180px"
                    }}
                >
                    <h3>
                        Total Exams
                    </h3>

                    <p
                        style={{
                            fontSize:
                                "30px",
                            fontWeight:
                                "bold"
                        }}
                    >
                        {totalExams}
                    </p>
                </div>

                {/* Published Exams */}

                <div
                    style={{
                        border:
                            "1px solid #ccc",
                        padding: "20px",
                        borderRadius:
                            "8px",
                        minWidth:
                            "180px"
                    }}
                >
                    <h3>
                        Published Exams
                    </h3>

                    <p
                        style={{
                            fontSize:
                                "30px",
                            fontWeight:
                                "bold"
                        }}
                    >
                        {publishedExams}
                    </p>
                </div>

                {/* Draft Exams */}

                <div
                    style={{
                        border:
                            "1px solid #ccc",
                        padding: "20px",
                        borderRadius:
                            "8px",
                        minWidth:
                            "180px"
                    }}
                >
                    <h3>
                        Draft Exams
                    </h3>

                    <p
                        style={{
                            fontSize:
                                "30px",
                            fontWeight:
                                "bold"
                        }}
                    >
                        {draftExams}
                    </p>
                </div>

                {/* Submissions */}

                <div
                    style={{
                        border:
                            "1px solid #ccc",
                        padding: "20px",
                        borderRadius:
                            "8px",
                        minWidth:
                            "180px"
                    }}
                >
                    <h3>
                        Total Submissions
                    </h3>

                    <p
                        style={{
                            fontSize:
                                "30px",
                            fontWeight:
                                "bold"
                        }}
                    >
                        {totalSubmissions}
                    </p>
                </div>

            </div>

            <br />

            {/* =========================
                Quick Links
            ========================= */}

            <h2>
                Quick Actions
            </h2>

            <p>
                <Link to="/admin/exams">
                    Manage Exams
                </Link>
            </p>

            <p>
                <Link to="/admin/exams/create">
                    Create New Exam
                </Link>
            </p>

            <p>
                <Link to="/admin/create-admin">
                    Create Admin Account
                </Link>
            </p>

            <p>
                <Link to="/admin/results">
                    View Results
                </Link>
            </p>

        </div>
    );
}

export default AdminDashboard;