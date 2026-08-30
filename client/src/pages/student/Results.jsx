import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "../../styles/studentResults.css";

function StudentResults() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================
    // Fetch My Results
    // =========================

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response =
                    await api.get("/results");

                console.log(
                    "My Results:",
                    response.data
                );

                setResults(
                    response.data.results || []
                );

            } catch (error) {
                console.error(
                    "Fetch results error:",
                    error
                );

                if (error.response) {
                    setError(
                        error.response.data.message ||
                        "Failed to load results"
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

        fetchResults();
    }, []);

    // =========================
    // Statistics
    // =========================

    const totalCompleted = results.length;

    const averagePercentage =
        totalCompleted > 0
            ? (
                  results.reduce(
                      (sum, result) =>
                          sum +
                          Number(
                              result.percentage || 0
                          ),
                      0
                  ) / totalCompleted
              ).toFixed(2)
            : "0.00";

    const bestPercentage =
        totalCompleted > 0
            ? Math.max(
                  ...results.map((result) =>
                      Number(
                          result.percentage || 0
                      )
                  )
              ).toFixed(2)
            : "0.00";

    const totalCorrect = results.reduce(
        (sum, result) =>
            sum +
            Number(
                result.correctAnswers || 0
            ),
        0
    );

    // =========================
    // Performance
    // =========================

    const getPerformance = (percentage) => {
        if (percentage >= 90) {
            return {
                label: "Excellent",
                icon: "🏆",
                className:
                    "performance-excellent"
            };
        }

        if (percentage >= 70) {
            return {
                label: "Good",
                icon: "👍",
                className:
                    "performance-good"
            };
        }

        if (percentage >= 50) {
            return {
                label: "Keep Practicing",
                icon: "💪",
                className:
                    "performance-average"
            };
        }

        return {
            label: "Needs Improvement",
            icon: "📚",
            className:
                "performance-low"
        };
    };

    // =========================
    // Loading
    // =========================

    if (loading) {
        return (
            <div className="student-results-page">
                <div className="results-container">

                    <div className="results-loading">
                        <div className="results-spinner"></div>

                        <p>
                            Loading your results...
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
            <div className="student-results-page">
                <div className="results-container">

                    <div className="results-error">

                        <div className="results-error-icon">
                            !
                        </div>

                        <div>
                            <h2>
                                Unable to load results
                            </h2>

                            <p>
                                {error}
                            </p>
                        </div>

                    </div>

                    <Link
                        to="/student/exams"
                        className="results-primary-button"
                    >
                        Browse Exams
                    </Link>

                </div>
            </div>
        );
    }

    // =========================
    // No Results
    // =========================

    if (results.length === 0) {
        return (
            <div className="student-results-page">
                <div className="results-container">

                    <div className="results-header">
                        <div>
                            <p className="results-label">
                                ExamCrafter
                            </p>

                            <h1>
                                My Results
                            </h1>

                            <p>
                                Track your exam
                                performance here.
                            </p>
                        </div>
                    </div>

                    <div className="results-empty">

                        <div className="empty-results-icon">
                            📊
                        </div>

                        <h2>
                            No results yet
                        </h2>

                        <p>
                            Complete your first
                            exam to see your
                            performance here.
                        </p>

                        <Link
                            to="/student/exams"
                            className="results-primary-button"
                        >
                            Browse Exams
                        </Link>

                    </div>

                </div>
            </div>
        );
    }

    // =========================
    // Results
    // =========================

    return (
        <div className="student-results-page">

            <div className="results-container">

                {/* =========================
                    Header
                ========================= */}

                <div className="results-header">

                    <div>
                        <p className="results-label">
                            ExamCrafter
                        </p>

                        <h1>
                            My Results
                        </h1>

                        <p>
                            Review your exam
                            performance and
                            progress.
                        </p>
                    </div>

                    <Link
                        to="/student/exams"
                        className="results-outline-button"
                    >
                        + Take New Exam
                    </Link>

                </div>

                {/* =========================
                    Summary
                ========================= */}

                <div className="results-summary">

                    <div className="summary-card">

                        <div className="summary-icon">
                            📝
                        </div>

                        <div>
                            <span>
                                Completed
                            </span>

                            <strong>
                                {totalCompleted}
                            </strong>

                            <small>
                                Exams
                            </small>
                        </div>

                    </div>

                    <div className="summary-card">

                        <div className="summary-icon">
                            📈
                        </div>

                        <div>
                            <span>
                                Average Score
                            </span>

                            <strong>
                                {averagePercentage}%
                            </strong>

                            <small>
                                Overall
                            </small>
                        </div>

                    </div>

                    <div className="summary-card">

                        <div className="summary-icon">
                            🏆
                        </div>

                        <div>
                            <span>
                                Best Score
                            </span>

                            <strong>
                                {bestPercentage}%
                            </strong>

                            <small>
                                Highest
                            </small>
                        </div>

                    </div>

                    <div className="summary-card">

                        <div className="summary-icon">
                            ✓
                        </div>

                        <div>
                            <span>
                                Correct Answers
                            </span>

                            <strong>
                                {totalCorrect}
                            </strong>

                            <small>
                                Total
                            </small>
                        </div>

                    </div>

                </div>

                {/* =========================
                    Results Header
                ========================= */}

                <div className="results-section-header">

                    <div>
                        <h2>
                            Exam History
                        </h2>

                        <p>
                            Your recently completed
                            exams
                        </p>
                    </div>

                </div>

                {/* =========================
                    Result Cards
                ========================= */}

                <div className="student-results-list">

                    {results.map((result) => {

                        const percentage =
                            Number(
                                result.percentage ||
                                0
                            );

                        const performance =
                            getPerformance(
                                percentage
                            );

                        return (
                            <div
                                key={result._id}
                                className="student-result-card"
                            >

                                {/* Card Header */}

                                <div className="student-result-top">

                                    <div className="result-title-area">

                                        <div className="result-exam-icon">
                                            📝
                                        </div>

                                        <div>
                                            <h3>
                                                {result.exam
                                                    ?.title ||
                                                    "Exam"}
                                            </h3>

                                            <p>
                                                Submitted{" "}
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

                                    <span
                                        className={`performance-badge ${performance.className}`}
                                    >
                                        {performance.icon}{" "}
                                        {performance.label}
                                    </span>

                                </div>

                                {/* Score */}

                                <div className="result-score-section">

                                    <div className="score-number">
                                        {percentage.toFixed(
                                            2
                                        )}
                                        <span>
                                            %
                                        </span>
                                    </div>

                                    <div className="score-info">

                                        <div className="score-row">
                                            <span>
                                                Score
                                            </span>

                                            <strong>
                                                {
                                                    result.score
                                                }{" "}
                                                /{" "}
                                                {
                                                    result.totalMarks
                                                }
                                            </strong>
                                        </div>

                                        <div className="score-bar">
                                            <div
                                                className="score-bar-fill"
                                                style={{
                                                    width: `${Math.min(
                                                        percentage,
                                                        100
                                                    )}%`
                                                }}
                                            ></div>
                                        </div>

                                    </div>

                                </div>

                                {/* Details */}

                                <div className="result-details">

                                    <div>
                                        <span>
                                            Correct
                                        </span>

                                        <strong className="correct-value">
                                            {
                                                result.correctAnswers
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Wrong
                                        </span>

                                        <strong className="wrong-value">
                                            {
                                                result.wrongAnswers
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Unanswered
                                        </span>

                                        <strong>
                                            {
                                                result.unanswered
                                            }
                                        </strong>
                                    </div>

                                    <Link
                                        to={`/student/results/${result.exam?._id}`}
                                        className="result-details-button"
                                    >
                                        View Details →
                                    </Link>

                                </div>

                            </div>
                        );
                    })}

                </div>

            </div>

        </div>
    );
}

export default StudentResults;