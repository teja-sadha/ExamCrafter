import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/studentExam.css";

function StudentExam() {
    const { id } = useParams();
    const navigate = useNavigate();

    // =========================
    // Exam State
    // =========================

    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] =
        useState(0);

    const [answers, setAnswers] = useState({});

    // =========================
    // Coding State
    // =========================

    const [codingCode, setCodingCode] =
        useState({});

    const [codingLanguage, setCodingLanguage] =
        useState({});

    const [codingOutput, setCodingOutput] =
        useState({});

    const [codingRunning, setCodingRunning] =
        useState(false);

    // =========================
    // Page State
    // =========================

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [timeLeft, setTimeLeft] =
        useState(null);

    const [submitting, setSubmitting] =
        useState(false);

    const [timeUp, setTimeUp] =
        useState(false);

    // =========================
    // Coding Resize State
    // =========================

    const [problemWidth, setProblemWidth] =
        useState(45);

    const [editorHeight, setEditorHeight] =
        useState(65);

    const isDraggingVertical =
        useRef(false);

    const isDraggingHorizontal =
        useRef(false);

    // =========================
    // Local Storage Keys
    // =========================

    const timerKey =
        `exam_${id}_endTime`;

    const answersKey =
        `exam_${id}_answers`;

    const codingCodeKey =
        `exam_${id}_codingCode`;

    const codingLanguageKey =
        `exam_${id}_codingLanguage`;

    // =========================
    // Fetch Exam
    // =========================

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const response =
                    await api.get(
                        `/questions/student/${id}`
                    );

                const examData =
                    response.data.exam;

                setExam(examData);

                setQuestions(
                    response.data.questions || []
                );

                // =========================
                // Restore Answers
                // =========================

                const savedAnswers =
                    localStorage.getItem(
                        answersKey
                    );

                if (savedAnswers) {
                    try {
                        setAnswers(
                            JSON.parse(
                                savedAnswers
                            )
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

                // =========================
                // Restore Coding Code
                // =========================

                const savedCodingCode =
                    localStorage.getItem(
                        codingCodeKey
                    );

                if (savedCodingCode) {
                    try {
                        setCodingCode(
                            JSON.parse(
                                savedCodingCode
                            )
                        );
                    } catch (error) {
                        console.error(
                            "Invalid saved coding code:",
                            error
                        );

                        localStorage.removeItem(
                            codingCodeKey
                        );
                    }
                }

                // =========================
                // Restore Languages
                // =========================

                const savedLanguages =
                    localStorage.getItem(
                        codingLanguageKey
                    );

                if (savedLanguages) {
                    try {
                        setCodingLanguage(
                            JSON.parse(
                                savedLanguages
                            )
                        );
                    } catch (error) {
                        console.error(
                            "Invalid saved coding languages:",
                            error
                        );

                        localStorage.removeItem(
                            codingLanguageKey
                        );
                    }
                }

                // =========================
                // Restore Timer
                // =========================

                const savedEndTime =
                    localStorage.getItem(
                        timerKey
                    );

                let endTime;

                if (savedEndTime) {
                    endTime =
                        Number(
                            savedEndTime
                        );
                } else {
                    endTime =
                        Date.now() +
                        Number(
                            examData.duration
                        ) *
                            60 *
                            1000;

                    localStorage.setItem(
                        timerKey,
                        endTime.toString()
                    );
                }

                const remainingSeconds =
                    Math.max(
                        0,
                        Math.ceil(
                            (
                                endTime -
                                Date.now()
                            ) / 1000
                        )
                    );

                setTimeLeft(
                    remainingSeconds
                );

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

    }, [
        id,
        answersKey,
        timerKey,
        codingCodeKey,
        codingLanguageKey
    ]);

    // =========================
    // Save Answers
    // =========================

    useEffect(() => {
        localStorage.setItem(
            answersKey,
            JSON.stringify(answers)
        );
    }, [
        answers,
        answersKey
    ]);

    // =========================
    // Save Coding Code
    // =========================

    useEffect(() => {
        localStorage.setItem(
            codingCodeKey,
            JSON.stringify(
                codingCode
            )
        );
    }, [
        codingCode,
        codingCodeKey
    ]);

    // =========================
    // Save Coding Language
    // =========================

    useEffect(() => {
        localStorage.setItem(
            codingLanguageKey,
            JSON.stringify(
                codingLanguage
            )
        );
    }, [
        codingLanguage,
        codingLanguageKey
    ]);

    // =========================
    // Mouse Resize
    // =========================

    useEffect(() => {
        const handleMouseMove = (event) => {

            // =========================
            // Vertical Resize
            // =========================

            if (
                isDraggingVertical.current
            ) {
                const container =
                    document.querySelector(
                        ".coding-workspace"
                    );

                if (!container) {
                    return;
                }

                const rect =
                    container.getBoundingClientRect();

                const percentage =
                    (
                        (
                            event.clientX -
                            rect.left
                        ) /
                        rect.width
                    ) *
                    100;

                setProblemWidth(
                    Math.min(
                        70,
                        Math.max(
                            25,
                            percentage
                        )
                    )
                );
            }

            // =========================
            // Horizontal Resize
            // =========================

            if (
                isDraggingHorizontal.current
            ) {
                const editor =
                    document.querySelector(
                        ".coding-editor-panel"
                    );

                if (!editor) {
                    return;
                }

                const rect =
                    editor.getBoundingClientRect();

                const percentage =
                    (
                        (
                            event.clientY -
                            rect.top
                        ) /
                        rect.height
                    ) *
                    100;

                setEditorHeight(
                    Math.min(
                        85,
                        Math.max(
                            30,
                            percentage
                        )
                    )
                );
            }
        };

        const handleMouseUp = () => {
            isDraggingVertical.current =
                false;

            isDraggingHorizontal.current =
                false;

            document.body.style.cursor =
                "default";

            document.body.style.userSelect =
                "auto";
        };

        window.addEventListener(
            "mousemove",
            handleMouseMove
        );

        window.addEventListener(
            "mouseup",
            handleMouseUp
        );

        return () => {
            window.removeEventListener(
                "mousemove",
                handleMouseMove
            );

            window.removeEventListener(
                "mouseup",
                handleMouseUp
            );
        };
    }, []);

    // =========================
    // Start Vertical Resize
    // =========================

    const startVerticalResize = (
        event
    ) => {
        event.preventDefault();

        isDraggingVertical.current =
            true;

        document.body.style.cursor =
            "col-resize";

        document.body.style.userSelect =
            "none";
    };

    // =========================
    // Start Horizontal Resize
    // =========================

    const startHorizontalResize = (
        event
    ) => {
        event.preventDefault();

        isDraggingHorizontal.current =
            true;

        document.body.style.cursor =
            "row-resize";

        document.body.style.userSelect =
            "none";
    };

    // =========================
    // Submit Exam
    // =========================

    const handleSubmit = async (
        automatic = false
    ) => {
        if (submitting) {
            return;
        }

        if (!automatic) {
            const confirmed =
                window.confirm(
                    "Are you sure you want to submit the exam?"
                );

            if (!confirmed) {
                return;
            }
        }

        try {
            setSubmitting(true);
            setError("");

            // =========================
            // Combine Answers
            // =========================

            const finalAnswers = {
                ...answers,
                ...codingCode
            };

            const response =
                await api.post(
                    `/results/exam/${id}`,
                    {
                        answers:
                            finalAnswers
                    }
                );

            console.log(
                "Exam submitted:",
                response.data
            );

            // =========================
            // Clear Saved Exam Data
            // =========================

            localStorage.removeItem(
                timerKey
            );

            localStorage.removeItem(
                answersKey
            );

            localStorage.removeItem(
                codingCodeKey
            );

            localStorage.removeItem(
                codingLanguageKey
            );

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

        const timer =
            setInterval(() => {
                setTimeLeft(
                    (previousTime) => {

                        if (
                            previousTime ===
                                null ||
                            previousTime <= 1
                        ) {
                            clearInterval(
                                timer
                            );

                            return 0;
                        }

                        return (
                            previousTime - 1
                        );
                    }
                );
            }, 1000);

        return () =>
            clearInterval(timer);

    }, [
        timeLeft,
        submitting
    ]);

    // =========================
    // Automatic Submit
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
    }, [
        timeLeft,
        exam,
        submitting
    ]);

    // =========================
    // Format Time
    // =========================

    const formatTime = (
        seconds
    ) => {
        if (seconds === null) {
            return "--:--";
        }

        const minutes =
            Math.floor(
                seconds / 60
            );

        const remainingSeconds =
            seconds % 60;

        return `${String(
            minutes
        ).padStart(
            2,
            "0"
        )}:${String(
            remainingSeconds
        ).padStart(
            2,
            "0"
        )}`;
    };

    // =========================
    // MCQ Answer
    // =========================

    const handleAnswer = (
        answer
    ) => {
        if (submitting) {
            return;
        }

        const questionId =
            questions[
                currentQuestion
            ]._id;

        setAnswers(
            (previousAnswers) => ({
                ...previousAnswers,
                [questionId]:
                    answer
            })
        );
    };

    // =========================
    // Default Coding Language
    // =========================

    const getDefaultLanguage = (
        question
    ) => {
        if (
            question.allowedLanguages &&
            question.allowedLanguages.length >
                0
        ) {
            return (
                question
                    .allowedLanguages[0]
            );
        }

        return "python";
    };

    // =========================
    // Change Coding Language
    // =========================

    const handleLanguageChange = (
        questionId,
        language
    ) => {
        setCodingLanguage(
            (previousLanguages) => ({
                ...previousLanguages,
                [questionId]:
                    language
            })
        );
    };

    // =========================
    // Change Code
    // =========================

    const handleCodeChange = (
        questionId,
        code
    ) => {
        setCodingCode(
            (previousCode) => ({
                ...previousCode,
                [questionId]:
                    code
            })
        );
    };

    // =========================
    // Run Code
    // =========================

    const handleRunCode = async (
        questionId
    ) => {
        if (
            submitting ||
            codingRunning
        ) {
            return;
        }

        const code =
            codingCode[
                questionId
            ] || "";

        if (!code.trim()) {
            setCodingOutput(
                (previous) => ({
                    ...previous,
                    [questionId]:
                        "Please write some code before running."
                })
            );

            return;
        }

        const currentCodingQuestion =
            questions.find(
                (item) =>
                    item._id ===
                    questionId
            );

        const language =
            codingLanguage[
                questionId
            ] ||
            getDefaultLanguage(
                currentCodingQuestion
            );

        try {
            setCodingRunning(
                true
            );

            setCodingOutput(
                (previous) => ({
                    ...previous,
                    [questionId]:
                        "Running your code..."
                })
            );

            // =========================
            // Send Code To Backend
            // =========================

            const response =
                await api.post(
                    "/code/run",
                    {
                        sourceCode:
                            code,

                        language:
                            language,

                        stdin:
                            currentCodingQuestion
                                ?.sampleInput ||
                            ""
                    }
                );

            console.log(
                "Code execution result:",
                response.data
            );

            const {
                output,
                error,
                status,
                time,
                memory
            } = response.data;

            let result = "";

            // =========================
            // Program Output
            // =========================

            if (output) {
                result += output;
            }

            // =========================
            // Error
            // =========================

            if (error) {
                if (result) {
                    result += "\n\n";
                }

                result += error;
            }

            // =========================
            // Status
            // =========================

            if (status) {
                if (result) {
                    result += "\n\n";
                }

                result +=
                    `Status: ${status}`;
            }

            // =========================
            // Time
            // =========================

            if (time) {
                result +=
                    `\nTime: ${time}s`;
            }

            // =========================
            // Memory
            // =========================

            if (memory) {
                result +=
                    `\nMemory: ${memory} KB`;
            }

            if (!result.trim()) {
                result =
                    "Code executed successfully, but produced no output.";
            }

            setCodingOutput(
                (previous) => ({
                    ...previous,
                    [questionId]:
                        result.trim()
                })
            );

        } catch (error) {
            console.error(
                "Run code error:",
                error
            );

            let message =
                "Unable to execute code.";

            if (error.response) {
                message =
                    error.response.data.message ||
                    "Code execution failed";
            } else if (error.message) {
                message =
                    error.message;
            }

            setCodingOutput(
                (previous) => ({
                    ...previous,
                    [questionId]:
                        message
                })
            );

        } finally {
            setCodingRunning(
                false
            );
        }
    };

    // =========================
    // Submit Coding Code
    // =========================

    const handleSubmitCode = (
        questionId
    ) => {
        if (submitting) {
            return;
        }

        const code =
            codingCode[
                questionId
            ] || "";

        if (!code.trim()) {
            setCodingOutput(
                (previous) => ({
                    ...previous,
                    [questionId]:
                        "Please write your code before submitting."
                })
            );

            return;
        }

        setAnswers(
            (previousAnswers) => ({
                ...previousAnswers,
                [questionId]:
                    code
            })
        );

        setCodingOutput(
            (previous) => ({
                ...previous,
                [questionId]:
                    "Code saved. You can continue to the next question."
            })
        );
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
                (previous) =>
                    previous + 1
            );
        }
    };

    const handlePrevious = () => {
        if (
            currentQuestion > 0 &&
            !submitting
        ) {
            setCurrentQuestion(
                (previous) =>
                    previous - 1
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

                    <p>
                        {error}
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

    // =========================
    // Current Question
    // =========================

    const question =
        questions[currentQuestion];

    const questionType =
        question.type || "mcq";

    const selectedAnswer =
        answers[
            question._id
        ];

    const currentCode =
        codingCode[
            question._id
        ] || "";

    const currentLanguage =
        codingLanguage[
            question._id
        ] ||
        getDefaultLanguage(
            question
        );

    const currentOutput =
        codingOutput[
            question._id
        ] || "";

    const answeredCount =
        Object.keys(
            answers
        ).length;

    const progress =
        (
            (
                currentQuestion + 1
            ) /
            questions.length
        ) * 100;

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
                                width:
                                    `${progress}%`
                            }}
                        ></div>

                    </div>

                </div>

                {/* =========================
                    Question Navigation
                ========================= */}

                <div className="question-numbers">

                    {questions.map(
                        (
                            item,
                            index
                        ) => {

                            const answered =
                                answers[
                                    item._id
                                ];

                            return (
                                <button
                                    key={
                                        item._id
                                    }
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

                {/* =================================================
                    CODING QUESTION
                ================================================= */}

                {questionType ===
                    "coding" ? (

                    <main className="coding-question-card">

                        {/* =========================
                            Coding Header
                        ========================= */}

                        <div className="coding-question-header">

                            <div>

                                <span className="question-label">
                                    Coding Question{" "}
                                    {currentQuestion + 1}
                                </span>

                                <h2>
                                    {question.question}
                                </h2>

                            </div>

                            <span className="marks-badge">
                                {question.marks}{" "}
                                {question.marks ===
                                1
                                    ? "Mark"
                                    : "Marks"}
                            </span>

                        </div>

                        {/* =========================
                            Coding Workspace
                        ========================= */}

                        <div
                            className="coding-workspace"
                        >

                            {/* =========================
                                Problem Panel
                            ========================= */}

                            <div
                                className="coding-problem-panel"
                                style={{
                                    width:
                                        `${problemWidth}%`
                                }}
                            >

                                <div className="coding-problem-scroll">

                                    <div className="coding-section-block">

                                        <h3>
                                            Problem
                                        </h3>

                                        <p>
                                            {
                                                question.question
                                            }
                                        </p>

                                    </div>

                                    <div className="coding-section-block">

                                        <h3>
                                            Input
                                        </h3>

                                        <p>
                                            {
                                                question.inputDescription ||
                                                "Input description not provided."
                                            }
                                        </p>

                                    </div>

                                    <div className="coding-section-block">

                                        <h3>
                                            Output
                                        </h3>

                                        <p>
                                            {
                                                question.outputDescription ||
                                                "Output description not provided."
                                            }
                                        </p>

                                    </div>

                                    {question.constraints && (
                                        <div className="coding-section-block">

                                            <h3>
                                                Constraints
                                            </h3>

                                            <pre>
                                                {
                                                    question.constraints
                                                }
                                            </pre>

                                        </div>
                                    )}

                                    <div className="coding-section-block">

                                        <h3>
                                            Sample Input
                                        </h3>

                                        <pre>
                                            {
                                                question.sampleInput ||
                                                "-"
                                            }
                                        </pre>

                                    </div>

                                    <div className="coding-section-block">

                                        <h3>
                                            Sample Output
                                        </h3>

                                        <pre>
                                            {
                                                question.sampleOutput ||
                                                "-"
                                            }
                                        </pre>

                                    </div>

                                </div>

                            </div>

                            {/* =========================
                                Vertical Resizer
                            ========================= */}

                            <div
                                className="coding-vertical-resizer"
                                onMouseDown={
                                    startVerticalResize
                                }
                                title="Drag to resize"
                            >
                                <span>
                                    ⋮
                                </span>
                            </div>

                            {/* =========================
                                Editor Panel
                            ========================= */}

                            <div
                                className="coding-editor-panel"
                                style={{
                                    width:
                                        `${100 - problemWidth}%`
                                }}
                            >

                                {/* =========================
                                    Toolbar
                                ========================= */}

                                <div className="coding-editor-toolbar">

                                    <div className="language-area">

                                        <label>
                                            Language
                                        </label>

                                        <select
                                            value={
                                                currentLanguage
                                            }
                                            onChange={(e) =>
                                                handleLanguageChange(
                                                    question._id,
                                                    e.target.value
                                                )
                                            }
                                            disabled={
                                                submitting
                                            }
                                        >

                                            {(
                                                question.allowedLanguages ||
                                                [
                                                    "python",
                                                    "java",
                                                    "cpp"
                                                ]
                                            ).map(
                                                (
                                                    language
                                                ) => (
                                                    <option
                                                        key={
                                                            language
                                                        }
                                                        value={
                                                            language
                                                        }
                                                    >
                                                        {language ===
                                                        "python"
                                                            ? "Python"
                                                            : language ===
                                                              "java"
                                                            ? "Java"
                                                            : language ===
                                                              "cpp"
                                                            ? "C++"
                                                            : language}
                                                    </option>
                                                )
                                            )}

                                        </select>

                                    </div>

                                    <div className="coding-limits">

                                        <span>
                                            ⏱{" "}
                                            {question.timeLimit ||
                                                2}
                                            s
                                        </span>

                                        <span>
                                            💾{" "}
                                            {question.memoryLimit ||
                                                128}
                                            MB
                                        </span>

                                    </div>

                                </div>

                                {/* =========================
                                    Code Editor
                                ========================= */}

                                <div
                                    className="coding-editor-area"
                                    style={{
                                        height:
                                            `${editorHeight}%`
                                    }}
                                >

                                    <textarea
                                        className="coding-code-editor"
                                        value={
                                            currentCode
                                        }
                                        onChange={(e) =>
                                            handleCodeChange(
                                                question._id,
                                                e.target.value
                                            )
                                        }
                                        disabled={
                                            submitting
                                        }
                                        spellCheck="false"
                                        placeholder={
                                            currentLanguage ===
                                            "python"
                                                ? "Write your Python code here..."
                                                : currentLanguage ===
                                                  "java"
                                                ? "Write your Java code here..."
                                                : "Write your C++ code here..."
                                        }
                                    />

                                </div>

                                {/* =========================
                                    Horizontal Resizer
                                ========================= */}

                                <div
                                    className="coding-horizontal-resizer"
                                    onMouseDown={
                                        startHorizontalResize
                                    }
                                    title="Drag to resize"
                                >
                                    <span>
                                        ⋯
                                    </span>
                                </div>

                                {/* =========================
                                    Console
                                ========================= */}

                                <div className="coding-console">

                                    <div className="coding-console-header">

                                        <span>
                                            Output
                                        </span>

                                        {currentOutput && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setCodingOutput(
                                                        (
                                                            previous
                                                        ) => ({
                                                            ...previous,
                                                            [question._id]:
                                                                ""
                                                        })
                                                    )
                                                }
                                            >
                                                Clear
                                            </button>
                                        )}

                                    </div>

                                    <pre className="coding-console-output">

                                        {currentOutput ||
                                            "Run your code to see the output here."}

                                    </pre>

                                </div>

                                {/* =========================
                                    Coding Actions
                                ========================= */}

                                <div className="coding-actions">

                                    <button
                                        type="button"
                                        className="coding-run-button"
                                        onClick={() =>
                                            handleRunCode(
                                                question._id
                                            )
                                        }
                                        disabled={
                                            submitting ||
                                            codingRunning
                                        }
                                    >
                                        {codingRunning
                                            ? "Running..."
                                            : "▶ Run Code"}
                                    </button>

                                    <button
                                        type="button"
                                        className="coding-submit-button"
                                        onClick={() =>
                                            handleSubmitCode(
                                                question._id
                                            )
                                        }
                                        disabled={
                                            submitting
                                        }
                                    >
                                        Submit Code
                                    </button>

                                </div>

                            </div>

                        </div>

                    </main>

                ) : (

                    /* =================================================
                        MCQ QUESTION
                    ================================================= */

                    <main className="question-card">

                        <div className="question-card-header">

                            <span className="question-label">
                                Question{" "}
                                {currentQuestion + 1}
                            </span>

                            <span className="marks-badge">
                                {question.marks}{" "}
                                {question.marks ===
                                1
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

                            {(
                                question.options ||
                                []
                            ).map(
                                (
                                    option,
                                    index
                                ) => {

                                    const isSelected =
                                        selectedAnswer ===
                                        option;

                                    return (
                                        <label
                                            key={
                                                index
                                            }
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
                                                value={
                                                    option
                                                }
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
                                                    65 +
                                                        index
                                                )}
                                            </span>

                                            <span className="option-text">
                                                {
                                                    option
                                                }
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
                )}

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