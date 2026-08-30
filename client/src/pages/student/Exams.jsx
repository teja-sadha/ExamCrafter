import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/exams.css";

function StudentExams() {
    const navigate = useNavigate();

    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================
    // Fetch Exams
    // =========================

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await api.get(
                    "/exams/published"
                );

                console.log(
                    "Published exams:",
                    response.data.exams
                );

                setExams(
                    response.data.exams || []
                );

            } catch (error) {
                console.error(
                    "Fetch student exams error:",
                    error
                );

                if (error.response) {
                    setError(
                        error.response.data.message ||
                        "Failed to load exams"
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

        fetchExams();
    }, []);

    // =========================
    // Start Exam + Fullscreen
    // =========================

    const handleStartExam = async (examId) => {
        try {
            // Request fullscreen directly from
            // the user's button click.
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            }
        } catch (error) {
            console.warn(
                "Fullscreen request failed:",
                error
            );

            // We still allow the student
            // to enter the exam.
        }

        navigate(
            `/student/exam/${examId}`
        );
    };

    // =========================
    // Get Exam Status
    // =========================

    const getExamStatus = (exam) => {
        if (exam.hasSubmitted) {
            return "completed";
        }

        const now = new Date();

        const startDate =
            new Date(exam.startDate);

        const endDate =
            new Date(exam.endDate);

        if (now < startDate) {
            return "not-started";
        }

        if (now > endDate) {
            return "ended";
        }

        return "available";
    };

    // =========================
    // Status Information
    // =========================

    const getStatusInfo = (status) => {
        switch (status) {
            case "completed":
                return {
                    label: "Completed",
                    icon: "✓",
                    className:
                        "exam-status-completed"
                };

            case "not-started":
                return {
                    label: "Not Started",
                    icon: "◷",
                    className:
                        "exam-status-upcoming"
                };

            case "available":
                return {
                    label: "Available",
                    icon: "●",
                    className:
                        "exam-status-available"
                };

            case "ended":
                return {
                    label: "Ended",
                    icon: "×",
                    className:
                        "exam-status-ended"
                };

            default:
                return {
                    label: "Unknown",
                    icon: "?",
                    className: ""
                };
        }
    };

    // =========================
    // Loading
    // =========================

    if (loading) {
        return (
            <div className="exams-page">

                <div className="exams-container">

                    <div className="exams-loading">

                        <div className="loading-spinner"></div>

                        <p>
                            Loading available exams...
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
            <div className="exams-page">

                <div className="exams-container">

                    <div className="exams-error">

                        <div className="error-icon">
                            !
                        </div>

                        <div>

                            <h2>
                                Unable to load exams
                            </h2>

                            <p>
                                {error}
                            </p>

                        </div>

                    </div>

                </div>

            </div>
        );
    }

    // =========================
    // No Exams
    // =========================

    if (exams.length === 0) {
        return (
            <div className="exams-page">

                <div className="exams-container">

                    <div className="exams-header">

                        <div>

                            <p className="page-label">
                                ExamCrafter
                            </p>

                            <h1>
                                Available Exams
                            </h1>

                            <p>
                                Test your knowledge
                                and improve your skills.
                            </p>

                        </div>

                    </div>

                    <div className="empty-exams">

                        <div className="empty-exams-icon">
                            📚
                        </div>

                        <h2>
                            No exams available
                        </h2>

                        <p>
                            There are currently no
                            published exams. Check
                            back later.
                        </p>

                    </div>

                </div>

            </div>
        );
    }

    // =========================
    // Exam List
    // =========================

    return (
        <div className="exams-page">

            <div className="exams-container">

                {/* =========================
                    Header
                ========================= */}

                <div className="exams-header">

                    <div>

                        <p className="page-label">
                            ExamCrafter
                        </p>

                        <h1>
                            Available Exams
                        </h1>

                        <p>
                            Choose an exam and
                            challenge yourself.
                        </p>

                    </div>

                    <div className="exam-count">

                        <strong>
                            {exams.length}
                        </strong>

                        <span>
                            {exams.length === 1
                                ? "Exam"
                                : "Exams"}
                        </span>

                    </div>

                </div>

                {/* =========================
                    Exam Cards
                ========================= */}

                <div className="exams-grid">

                    {exams.map((exam) => {

                        const status =
                            getExamStatus(exam);

                        const statusInfo =
                            getStatusInfo(status);

                        return (
                            <div
                                key={exam._id}
                                className="exam-card"
                            >

                                {/* =========================
                                    Top
                                ========================= */}

                                <div className="exam-card-top">

                                    <div className="exam-icon">
                                        📝
                                    </div>

                                    <span
                                        className={`exam-status ${statusInfo.className}`}
                                    >

                                        <span>
                                            {
                                                statusInfo.icon
                                            }
                                        </span>

                                        {
                                            statusInfo.label
                                        }

                                    </span>

                                </div>

                                {/* =========================
                                    Content
                                ========================= */}

                                <div className="exam-card-content">

                                    <h2>
                                        {exam.title}
                                    </h2>

                                    <p className="exam-description">
                                        {exam.description ||
                                            "Test your knowledge with this exam."}
                                    </p>

                                </div>

                                {/* =========================
                                    Details
                                ========================= */}

                                <div className="exam-details">

                                    <div className="exam-detail">

                                        <span className="detail-icon">
                                            ⏱
                                        </span>

                                        <div>

                                            <small>
                                                Duration
                                            </small>

                                            <strong>
                                                {exam.duration} min
                                            </strong>

                                        </div>

                                    </div>

                                    <div className="exam-detail">

                                        <span className="detail-icon">
                                            🎯
                                        </span>

                                        <div>

                                            <small>
                                                Total Marks
                                            </small>

                                            <strong>
                                                {exam.totalMarks}
                                            </strong>

                                        </div>

                                    </div>

                                </div>

                                {/* =========================
                                    Dates
                                ========================= */}

                                <div className="exam-dates">

                                    <div>

                                        <span>
                                            Starts
                                        </span>

                                        <strong>
                                            {new Date(
                                                exam.startDate
                                            ).toLocaleString(
                                                undefined,
                                                {
                                                    dateStyle:
                                                        "medium",
                                                    timeStyle:
                                                        "short"
                                                }
                                            )}
                                        </strong>

                                    </div>

                                    <div>

                                        <span>
                                            Ends
                                        </span>

                                        <strong>
                                            {new Date(
                                                exam.endDate
                                            ).toLocaleString(
                                                undefined,
                                                {
                                                    dateStyle:
                                                        "medium",
                                                    timeStyle:
                                                        "short"
                                                }
                                            )}
                                        </strong>

                                    </div>

                                </div>

                                {/* =========================
                                    Action
                                ========================= */}

                                <div className="exam-action">

                                    {status ===
                                        "completed" && (

                                        <button
                                            type="button"
                                            className="exam-button exam-button-result"
                                            onClick={() =>
                                                navigate(
                                                    `/student/results/${exam._id}`
                                                )
                                            }
                                        >
                                            View Result

                                            <span>
                                                →
                                            </span>

                                        </button>
                                    )}

                                    {status ===
                                        "available" && (

                                        <button
                                            type="button"
                                            className="exam-button exam-button-start"
                                            onClick={() =>
                                                handleStartExam(
                                                    exam._id
                                                )
                                            }
                                        >
                                            Start Exam

                                            <span>
                                                →
                                            </span>

                                        </button>
                                    )}

                                    {status ===
                                        "not-started" && (

                                        <button
                                            type="button"
                                            disabled
                                            className="exam-button exam-button-disabled"
                                        >
                                            Exam Not Started
                                        </button>
                                    )}

                                    {status ===
                                        "ended" && (

                                        <button
                                            type="button"
                                            disabled
                                            className="exam-button exam-button-disabled"
                                        >
                                            Exam Ended
                                        </button>
                                    )}

                                </div>

                            </div>
                        );
                    })}

                </div>

            </div>

        </div>
    );
}

export default StudentExams;