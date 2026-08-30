import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/studentExam.css";

function StudentExam() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [timeLeft, setTimeLeft] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [timeUp, setTimeUp] = useState(false);

    const timerKey = `exam_${id}_endTime`;
    const answersKey = `exam_${id}_answers`;

    // =========================
    // Fetch Exam
    // =========================

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const response = await api.get(
                    `/questions/student/${id}`
                );

                const examData = response.data.exam;

                setExam(examData);
                setQuestions(
                    response.data.questions || []
                );

                // Restore answers
                const savedAnswers =
                    localStorage.getItem(answersKey);

                if (savedAnswers) {
                    try {
                        setAnswers(
                            JSON.parse(savedAnswers)
                        );
                    } catch (error) {
                        console.error(
                            "Invalid saved answers:",
                            error
                        );

                        localStorage.removeItem(
                            answersKey
                        );
                    }
                }

                // Restore timer
                const savedEndTime =
                    localStorage.getItem(timerKey);

                let endTime;

                if (savedEndTime) {
                    endTime = Number(savedEndTime);
                } else {
                    endTime =
                        Date.now() +
                        Number(examData.duration) *
                            60 *
                            1000;

                    localStorage.setItem(
                        timerKey,
                        endTime.toString()
                    );
                }

                const remainingSeconds = Math.max(
                    0,
                    Math.ceil(
                        (endTime - Date.now()) / 1000
                    )
                );

                setTimeLeft(remainingSeconds);

            } catch (error) {
                console.error(
                    "Fetch exam error:",
                    error
                );

                if (error.response) {
                    setError(
                        error.response.data.message ||
                        "Failed to load exam"
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

        fetchExam();
    }, [id, answersKey, timerKey]);

    // =========================
    // Save Answers
    // =========================

    useEffect(() => {
        localStorage.setItem(
            answersKey,
            JSON.stringify(answers)
        );
    }, [answers, answersKey]);

    // =========================
    // Submit Exam
    // =========================

    const handleSubmit = async (automatic = false) => {
        if (submitting) {
            return;
        }

        if (!automatic) {
            const confirmed = window.confirm(
                "Are you sure you want to submit the exam?"
            );

            if (!confirmed) {
                return;
            }
        }

        try {
            setSubmitting(true);
            setError("");

            const response = await api.post(
                `/results/exam/${id}`,
                {
                    answers
                }
            );

            console.log(
                "Exam submitted:",
                response.data
            );

            localStorage.removeItem(timerKey);
            localStorage.removeItem(answersKey);

            navigate(
                `/student/results/${id}`
            );

        } catch (error) {
            console.error(
                "Submit exam error:",
                error
            );

            if (error.response) {
                setError(
                    error.response.data.message ||
                    "Failed to submit exam"
                );
            } else {
                setError(
                    "Unable to connect to server"
                );
            }

            setSubmitting(false);
        }
    };

    // =========================
    // Countdown
    // =========================

    useEffect(() => {
        if (
            timeLeft === null ||
            submitting ||
            timeLeft <= 0
        ) {
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((previousTime) => {
                if (
                    previousTime === null ||
                    previousTime <= 1
                ) {
                    clearInterval(timer);
                    return 0;
                }

                return previousTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, submitting]);

    // =========================
    // Automatic Submission
    // =========================

    useEffect(() => {
        if (
            timeLeft === 0 &&
            exam &&
            !submitting
        ) {
            setTimeUp(true);
            handleSubmit(true);
        }
    }, [timeLeft, exam, submitting]);

    // =========================
    // Format Time
    // =========================

    const formatTime = (seconds) => {
        if (seconds === null) {
            return "--:--";
        }

        const minutes = Math.floor(
            seconds / 60
        );

        const remainingSeconds =
            seconds % 60;

        return `${String(minutes).padStart(
            2,
            "0"
        )}:${String(
            remainingSeconds
        ).padStart(2, "0")}`;
    };

    // =========================
    // Select Answer
    // =========================

    const handleAnswer = (answer) => {
        if (submitting) {
            return;
        }

        const questionId =
            questions[currentQuestion]._id;

        setAnswers((previousAnswers) => ({
            ...previousAnswers,
            [questionId]: answer
        }));
    };

    // =========================
    // Navigation
    // =========================

    const handleNext = () => {
        if (
            currentQuestion <
                questions.length - 1 &&
            !submitting
        ) {
            setCurrentQuestion(
                (previous) => previous + 1
            );
        }
    };

    const handlePrevious = () => {
        if (
            currentQuestion > 0 &&
            !submitting
        ) {
            setCurrentQuestion(
                (previous) => previous - 1
            );
        }
    };

    // =========================
    // Loading
    // =========================

    if (loading) {
        return (
            <div className="student-exam-page">
                <div className="exam-loading">
                    <div className="exam-spinner"></div>
                    <p>
                        Preparing your exam...
                    </p>
                </div>
            </div>
        );
    }

    // =========================
    // Error
    // =========================

    if (error && !exam) {
        return (
            <div className="student-exam-page">
                <div className="exam-message-card">
                    <div className="message-icon">
                        !
                    </div>

                    <h2>
                        Unable to load exam
                    </h2>

                    <p>{error}</p>

                    <button
                        onClick={() =>
                            navigate(
                                "/student/exams"
                            )
                        }
                    >
                        Back to Exams
                    </button>
                </div>
            </div>
        );
    }

    // =========================
    // No Questions
    // =========================

    if (
        !exam ||
        questions.length === 0
    ) {
        return (
            <div className="student-exam-page">
                <div className="exam-message-card">

                    <div className="message-icon">
                        📚
                    </div>

                    <h2>
                        No questions available
                    </h2>

                    <p>
                        This exam does not
                        have any questions yet.
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                "/student/exams"
                            )
                        }
                    >
                        Back to Exams
                    </button>

                </div>
            </div>
        );
    }

    const question =
        questions[currentQuestion];

    const selectedAnswer =
        answers[question._id];

    const answeredCount =
        Object.keys(answers).length;

    const progress =
        ((currentQuestion + 1) /
            questions.length) *
        100;

    const isLastQuestion =
        currentQuestion ===
        questions.length - 1;

    const isWarningTime =
        timeLeft !== null &&
        timeLeft <= 60;

    return (
        <div className="student-exam-page">

            <div className="student-exam-container">

                {/* =========================
                    Top Header
                ========================= */}

                <header className="exam-topbar">

                    <div className="exam-title-area">

                        <div className="exam-small-label">
                            ExamCrafter EXAM
                        </div>

                        <h1>
                            {exam.title}
                        </h1>

                    </div>

                    <div
                        className={`exam-timer ${
                            isWarningTime
                                ? "timer-warning"
                                : ""
                        }`}
                    >
                        <span className="timer-icon">
                            ⏱
                        </span>

                        <div>
                            <small>
                                Time Remaining
                            </small>

                            <strong>
                                {formatTime(
                                    timeLeft
                                )}
                            </strong>
                        </div>
                    </div>

                </header>

                {/* =========================
                    Time Warning
                ========================= */}

                {timeUp && (
                    <div className="exam-alert">
                        Time is up! Submitting
                        your exam...
                    </div>
                )}

                {!timeUp &&
                    isWarningTime &&
                    timeLeft > 0 && (
                        <div className="exam-alert warning">
                            Less than one minute
                            remaining!
                        </div>
                    )}

                {/* =========================
                    Progress
                ========================= */}

                <div className="exam-progress-card">

                    <div className="progress-top">

                        <span>
                            Question{" "}
                            <strong>
                                {currentQuestion + 1}
                            </strong>{" "}
                            of{" "}
                            {questions.length}
                        </span>

                        <span>
                            {answeredCount} answered
                        </span>

                    </div>

                    <div className="progress-track">
                        <div
                            className="progress-fill"
                            style={{
                                width: `${progress}%`
                            }}
                        ></div>
                    </div>

                </div>

                {/* =========================
                    Question Navigation
                ========================= */}

                <div className="question-numbers">

                    {questions.map(
                        (item, index) => {

                            const answered =
                                answers[item._id];

                            return (
                                <button
                                    key={item._id}
                                    className={`question-number ${
                                        currentQuestion ===
                                        index
                                            ? "active"
                                            : ""
                                    } ${
                                        answered
                                            ? "answered"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        !submitting &&
                                        setCurrentQuestion(
                                            index
                                        )
                                    }
                                    disabled={
                                        submitting
                                    }
                                >
                                    {index + 1}
                                </button>
                            );
                        }
                    )}

                </div>

                {/* =========================
                    Question Card
                ========================= */}

                <main className="question-card">

                    <div className="question-card-header">

                        <span className="question-label">
                            Question{" "}
                            {currentQuestion + 1}
                        </span>

                        <span className="marks-badge">
                            {question.marks}{" "}
                            {question.marks === 1
                                ? "Mark"
                                : "Marks"}
                        </span>

                    </div>

                    <h2 className="question-text">
                        {question.question}
                    </h2>

                    <p className="question-hint">
                        Select the best answer
                    </p>

                    <div className="options-list">

                        {question.options.map(
                            (option, index) => {

                                const isSelected =
                                    selectedAnswer ===
                                    option;

                                return (
                                    <label
                                        key={index}
                                        className={`option-card ${
                                            isSelected
                                                ? "selected"
                                                : ""
                                        }`}
                                    >

                                        <input
                                            type="radio"
                                            name={
                                                question._id
                                            }
                                            value={option}
                                            checked={
                                                isSelected
                                            }
                                            onChange={() =>
                                                handleAnswer(
                                                    option
                                                )
                                            }
                                            disabled={
                                                submitting
                                            }
                                        />

                                        <span className="option-letter">
                                            {String.fromCharCode(
                                                65 + index
                                            )}
                                        </span>

                                        <span className="option-text">
                                            {option}
                                        </span>

                                        <span className="option-check">
                                            ✓
                                        </span>

                                    </label>
                                );
                            }
                        )}

                    </div>

                </main>

                {/* =========================
                    Bottom Navigation
                ========================= */}

                <div className="exam-navigation">

                    <button
                        className="exam-nav-button previous"
                        onClick={
                            handlePrevious
                        }
                        disabled={
                            currentQuestion ===
                                0 ||
                            submitting
                        }
                    >
                        ← Previous
                    </button>

                    <div className="answer-count">
                        <strong>
                            {answeredCount}
                        </strong>
                        /
                        {questions.length}
                        <span>
                            Answered
                        </span>
                    </div>

                    {!isLastQuestion ? (
                        <button
                            className="exam-nav-button next"
                            onClick={
                                handleNext
                            }
                            disabled={
                                submitting
                            }
                        >
                            Next →
                        </button>
                    ) : (
                        <button
                            className="exam-submit-button"
                            onClick={() =>
                                handleSubmit(
                                    false
                                )
                            }
                            disabled={
                                submitting
                            }
                        >
                            {submitting
                                ? "Submitting..."
                                : "Submit Exam ✓"}
                        </button>
                    )}

                </div>

                {/* =========================
                    Submit Error
                ========================= */}

                {error && (
                    <div className="exam-submit-error">
                        {error}
                    </div>
                )}

            </div>

        </div>
    );
}

export default StudentExam;