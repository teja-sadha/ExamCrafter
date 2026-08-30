import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

function AdminResultDetails() {
    const { resultId } = useParams();

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================
    // Fetch Result
    // =========================

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const response =
                    await api.get(
                        `/results/admin/${resultId}`
                    );

                console.log(
                    "Admin result:",
                    response.data
                );

                setResult(
                    response.data.result
                );

            } catch (error) {
                console.error(
                    "Fetch admin result error:",
                    error
                );

                if (error.response) {
                    setError(
                        error.response.data.message ||
                        "Failed to load result"
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

        fetchResult();
    }, [resultId]);

    // =========================
    // Loading
    // =========================

    if (loading) {
        return (
            <div>
                <h1>
                    Student Result
                </h1>

                <p>
                    Loading result...
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
                    Student Result
                </h1>

                <p
                    style={{
                        color: "red"
                    }}
                >
                    {error}
                </p>

                <Link to="/admin/results">
                    Back to Results
                </Link>
            </div>
        );
    }

    // =========================
    // No Result
    // =========================

    if (!result) {
        return (
            <div>
                <h1>
                    Student Result
                </h1>

                <p>
                    Result not found.
                </p>

                <Link to="/admin/results">
                    Back to Results
                </Link>
            </div>
        );
    }

    // =========================
    // Performance
    // =========================

    const percentage =
        Number(result.percentage || 0);

    let performanceMessage = "";

    if (percentage >= 90) {
        performanceMessage =
            "Excellent";
    } else if (percentage >= 70) {
        performanceMessage =
            "Good";
    } else if (percentage >= 50) {
        performanceMessage =
            "Average";
    } else {
        performanceMessage =
            "Needs Improvement";
    }

    // =========================
    // UI
    // =========================

    return (
        <div>

            <h1>
                Student Result
            </h1>

            {/* =========================
                Exam Information
            ========================= */}

            <div
                style={{
                    border:
                        "1px solid #ccc",
                    padding: "20px",
                    marginBottom:
                        "20px",
                    borderRadius:
                        "8px"
                }}
            >

                <h2>
                    {result.exam?.title ||
                        "Exam"}
                </h2>

                <p>
                    <strong>
                        Description:
                    </strong>{" "}
                    {result.exam
                        ?.description ||
                        "N/A"}
                </p>

                <p>
                    <strong>
                        Duration:
                    </strong>{" "}
                    {result.exam
                        ?.duration ||
                        0}{" "}
                    minutes
                </p>

                <p>
                    <strong>
                        Total Marks:
                    </strong>{" "}
                    {result.totalMarks}
                </p>

            </div>

            {/* =========================
                Student Information
            ========================= */}

            <div
                style={{
                    border:
                        "1px solid #ccc",
                    padding: "20px",
                    marginBottom:
                        "20px",
                    borderRadius:
                        "8px"
                }}
            >

                <h2>
                    Student Information
                </h2>

                <p>
                    <strong>
                        Name:
                    </strong>{" "}
                    {result.student?.name ||
                        "Unknown"}
                </p>

                <p>
                    <strong>
                        Email:
                    </strong>{" "}
                    {result.student?.email ||
                        "Unknown"}
                </p>

            </div>

            {/* =========================
                Result
            ========================= */}

            <div
                style={{
                    border:
                        "1px solid #ccc",
                    padding: "20px",
                    marginBottom:
                        "20px",
                    borderRadius:
                        "8px"
                }}
            >

                <h2>
                    Result
                </h2>

                <p
                    style={{
                        fontSize:
                            "30px",
                        fontWeight:
                            "bold"
                    }}
                >
                    {result.score} /{" "}
                    {result.totalMarks}
                </p>

                <p
                    style={{
                        fontSize:
                            "24px",
                        fontWeight:
                            "bold"
                    }}
                >
                    {percentage.toFixed(2)}%
                </p>

                <p>
                    <strong>
                        Performance:
                    </strong>{" "}
                    {performanceMessage}
                </p>

            </div>

            {/* =========================
                Statistics
            ========================= */}

            <div
                style={{
                    display:
                        "flex",
                    gap: "15px",
                    flexWrap:
                        "wrap",
                    marginBottom:
                        "20px"
                }}
            >

                <div
                    style={{
                        border:
                            "1px solid #ccc",
                        padding:
                            "15px",
                        borderRadius:
                            "8px",
                        minWidth:
                            "150px"
                    }}
                >
                    <strong>
                        Correct
                    </strong>

                    <p
                        style={{
                            fontSize:
                                "24px"
                        }}
                    >
                        {
                            result.correctAnswers
                        }
                    </p>
                </div>

                <div
                    style={{
                        border:
                            "1px solid #ccc",
                        padding:
                            "15px",
                        borderRadius:
                            "8px",
                        minWidth:
                            "150px"
                    }}
                >
                    <strong>
                        Wrong
                    </strong>

                    <p
                        style={{
                            fontSize:
                                "24px"
                        }}
                    >
                        {
                            result.wrongAnswers
                        }
                    </p>
                </div>

                <div
                    style={{
                        border:
                            "1px solid #ccc",
                        padding:
                            "15px",
                        borderRadius:
                            "8px",
                        minWidth:
                            "150px"
                    }}
                >
                    <strong>
                        Unanswered
                    </strong>

                    <p
                        style={{
                            fontSize:
                                "24px"
                        }}
                    >
                        {
                            result.unanswered
                        }
                    </p>
                </div>

            </div>

            {/* =========================
                Submission Information
            ========================= */}

            <div
                style={{
                    border:
                        "1px solid #ccc",
                    padding:
                        "15px",
                    marginBottom:
                        "20px",
                    borderRadius:
                        "8px"
                }}
            >

                <p>
                    <strong>
                        Submitted:
                    </strong>{" "}
                    {new Date(
                        result.submittedAt
                    ).toLocaleString()}
                </p>

            </div>

            {/* =========================
                Navigation
            ========================= */}

            <Link to="/admin/results">
                Back to Results
            </Link>

            {" | "}

            <Link to="/admin/exams">
                Manage Exams
            </Link>

        </div>
    );
}

export default AdminResultDetails;