import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

function StudentResult() {
    const { examId } = useParams();

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
                        `/results/exam/${examId}`
                    );

                console.log(
                    "Exam result:",
                    response.data
                );

                setResult(
                    response.data.result
                );

            } catch (error) {
                console.error(
                    "Fetch result error:",
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
    }, [examId]);

    // =========================
    // Loading
    // =========================

    if (loading) {
        return (
            <div>
                <h1>Exam Result</h1>
                <p>Loading result...</p>
            </div>
        );
    }

    // =========================
    // Error
    // =========================

    if (error) {
        return (
            <div>
                <h1>Exam Result</h1>

                <p
                    style={{
                        color: "red"
                    }}
                >
                    {error}
                </p>

                <Link to="/student/results">
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
                <h1>Exam Result</h1>

                <p>
                    Result not found.
                </p>

                <Link to="/student/results">
                    Back to Results
                </Link>
            </div>
        );
    }

    // =========================
    // Performance Message
    // =========================

    const percentage =
        Number(result.percentage || 0);

    let performanceMessage = "";

    if (percentage >= 90) {
        performanceMessage =
            "Excellent! 🎉";
    } else if (percentage >= 70) {
        performanceMessage =
            "Good job! 👍";
    } else if (percentage >= 50) {
        performanceMessage =
            "Keep practicing! 💪";
    } else {
        performanceMessage =
            "More practice needed 📚";
    }

    // =========================
    // UI
    // =========================

    return (
        <div>

            <h1>
                Exam Result
            </h1>

            <h2>
                {result.exam?.title ||
                    "Exam"}
            </h2>

            <hr />

            {/* =========================
                Score
            ========================= */}

            <div
                style={{
                    border:
                        "1px solid #ccc",
                    padding: "20px",
                    marginBottom: "20px",
                    borderRadius: "8px"
                }}
            >
                <h2>
                    Score
                </h2>

                <p
                    style={{
                        fontSize: "32px",
                        fontWeight: "bold"
                    }}
                >
                    {result.score} /{" "}
                    {result.totalMarks}
                </p>

                <p
                    style={{
                        fontSize: "24px",
                        fontWeight: "bold"
                    }}
                >
                    {percentage.toFixed(2)}%
                </p>

                <p>
                    <strong>
                        {performanceMessage}
                    </strong>
                </p>
            </div>

            {/* =========================
                Statistics
            ========================= */}

            <div
                style={{
                    display: "flex",
                    gap: "15px",
                    flexWrap: "wrap"
                }}
            >

                <div
                    style={{
                        border:
                            "1px solid #ccc",
                        padding: "15px",
                        borderRadius:
                            "8px",
                        minWidth:
                            "150px"
                    }}
                >
                    <strong>
                        Correct Answers
                    </strong>

                    <p
                        style={{
                            fontSize: "24px"
                        }}
                    >
                        {result.correctAnswers}
                    </p>
                </div>

                <div
                    style={{
                        border:
                            "1px solid #ccc",
                        padding: "15px",
                        borderRadius:
                            "8px",
                        minWidth:
                            "150px"
                    }}
                >
                    <strong>
                        Wrong Answers
                    </strong>

                    <p
                        style={{
                            fontSize: "24px"
                        }}
                    >
                        {result.wrongAnswers}
                    </p>
                </div>

                <div
                    style={{
                        border:
                            "1px solid #ccc",
                        padding: "15px",
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
                            fontSize: "24px"
                        }}
                    >
                        {result.unanswered}
                    </p>
                </div>

            </div>

            <br />

            {/* =========================
                Submission Information
            ========================= */}

            <div
                style={{
                    border:
                        "1px solid #ccc",
                    padding: "15px",
                    borderRadius: "8px"
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

            <br />

            {/* =========================
                Navigation
            ========================= */}

            <Link to="/student/results">
                Back to All Results
            </Link>

            {" | "}

            <Link to="/student/exams">
                Back to Exams
            </Link>

        </div>
    );
}

export default StudentResult;