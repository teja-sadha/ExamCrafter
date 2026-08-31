import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

function AddQuestions() {
    const { examId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        type: "mcq",
        section: "",
        question: "",

        // MCQ
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correctAnswer: "",

        // Coding
        inputDescription: "",
        outputDescription: "",
        constraints: "",
        sampleInput: "",
        sampleOutput: "",

        // Common
        marks: 1,
        timeLimit: 2,
        memoryLimit: 128,

        allowedLanguages: [
            "python",
            "java",
            "cpp"
        ]
    });

    const [questions, setQuestions] = useState([]);
    const [questionsLoading, setQuestionsLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [editingQuestionId, setEditingQuestionId] = useState(null);

    // =========================
    // Fetch Questions
    // =========================

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await api.get(
                    `/questions/exam/${examId}`
                );

                setQuestions(
                    response.data.questions || []
                );
            } catch (error) {
                console.error(
                    "Fetch questions error:",
                    error
                );

                if (error.response) {
                    setError(
                        error.response.data.message ||
                        "Failed to load questions"
                    );
                } else {
                    setError(
                        "Unable to connect to server"
                    );
                }
            } finally {
                setQuestionsLoading(false);
            }
        };

        fetchQuestions();
    }, [examId]);

    // =========================
    // Handle Input
    // =========================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));
    };

    // =========================
    // Language Selection
    // =========================

    const handleLanguageChange = (language) => {
        setFormData((previousData) => {
            const languages =
                previousData.allowedLanguages;

            if (languages.includes(language)) {
                return {
                    ...previousData,
                    allowedLanguages:
                        languages.filter(
                            (item) =>
                                item !== language
                        )
                };
            }

            return {
                ...previousData,
                allowedLanguages: [
                    ...languages,
                    language
                ]
            };
        });
    };

    // =========================
    // Reset Form
    // =========================

    const resetForm = () => {
        setFormData({
            type: "mcq",
            section: "",
            question: "",

            option1: "",
            option2: "",
            option3: "",
            option4: "",
            correctAnswer: "",

            inputDescription: "",
            outputDescription: "",
            constraints: "",
            sampleInput: "",
            sampleOutput: "",

            marks: 1,
            timeLimit: 2,
            memoryLimit: 128,

            allowedLanguages: [
                "python",
                "java",
                "cpp"
            ]
        });

        setEditingQuestionId(null);
    };

    // =========================
    // Edit Question
    // =========================

    const handleEdit = (question) => {
        setError("");
        setSuccess("");

        setEditingQuestionId(question._id);

        const questionType =
            question.type || "mcq";

        setFormData({
            type: questionType,

            section:
                question.section || "",

            question:
                question.question || "",

            option1:
                question.options?.[0] || "",

            option2:
                question.options?.[1] || "",

            option3:
                question.options?.[2] || "",

            option4:
                question.options?.[3] || "",

            correctAnswer:
                question.correctAnswer || "",

            inputDescription:
                question.inputDescription || "",

            outputDescription:
                question.outputDescription || "",

            constraints:
                question.constraints || "",

            sampleInput:
                question.sampleInput || "",

            sampleOutput:
                question.sampleOutput || "",

            marks:
                question.marks || 1,

            timeLimit:
                question.timeLimit || 2,

            memoryLimit:
                question.memoryLimit || 128,

            allowedLanguages:
                question.allowedLanguages || [
                    "python",
                    "java",
                    "cpp"
                ]
        });

        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        });
    };

    // =========================
    // Submit
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // Section validation
        if (!formData.section.trim()) {
            setError(
                "Please enter a section name"
            );
            return;
        }

        // Question validation
        if (!formData.question.trim()) {
            setError(
                "Please enter the question"
            );
            return;
        }

        // Marks validation
        if (Number(formData.marks) <= 0) {
            setError(
                "Marks must be greater than 0"
            );
            return;
        }

        // =========================
        // MCQ Validation
        // =========================

        if (formData.type === "mcq") {
            const options = [
                formData.option1.trim(),
                formData.option2.trim(),
                formData.option3.trim(),
                formData.option4.trim()
            ];

            if (
                options.some(
                    (option) => !option
                )
            ) {
                setError(
                    "All four options are required"
                );
                return;
            }

            if (!formData.correctAnswer) {
                setError(
                    "Please select the correct answer"
                );
                return;
            }
        }

        // =========================
        // Coding Validation
        // =========================

        if (formData.type === "coding") {
            if (
                !formData.inputDescription.trim()
            ) {
                setError(
                    "Input description is required"
                );
                return;
            }

            if (
                !formData.outputDescription.trim()
            ) {
                setError(
                    "Output description is required"
                );
                return;
            }

            if (
                !formData.sampleInput.trim()
            ) {
                setError(
                    "Sample input is required"
                );
                return;
            }

            if (
                !formData.sampleOutput.trim()
            ) {
                setError(
                    "Sample output is required"
                );
                return;
            }

            if (
                formData.allowedLanguages.length === 0
            ) {
                setError(
                    "Select at least one programming language"
                );
                return;
            }

            if (
                Number(formData.timeLimit) <= 0
            ) {
                setError(
                    "Time limit must be greater than 0"
                );
                return;
            }

            if (
                Number(formData.memoryLimit) <= 0
            ) {
                setError(
                    "Memory limit must be greater than 0"
                );
                return;
            }
        }

        try {
            setLoading(true);

            const questionData = {
                type: formData.type,

                section:
                    formData.section.trim(),

                question:
                    formData.question.trim(),

                marks:
                    Number(formData.marks)
            };

            // =========================
            // MCQ Data
            // =========================

            if (formData.type === "mcq") {
                questionData.options = [
                    formData.option1.trim(),
                    formData.option2.trim(),
                    formData.option3.trim(),
                    formData.option4.trim()
                ];

                questionData.correctAnswer =
                    formData.correctAnswer;
            }

            // =========================
            // Coding Data
            // =========================

            if (formData.type === "coding") {
                questionData.inputDescription =
                    formData.inputDescription.trim();

                questionData.outputDescription =
                    formData.outputDescription.trim();

                questionData.constraints =
                    formData.constraints.trim();

                questionData.sampleInput =
                    formData.sampleInput.trim();

                questionData.sampleOutput =
                    formData.sampleOutput.trim();

                questionData.timeLimit =
                    Number(formData.timeLimit);

                questionData.memoryLimit =
                    Number(formData.memoryLimit);

                questionData.allowedLanguages =
                    formData.allowedLanguages;
            }

            // =========================
            // UPDATE
            // =========================

            if (editingQuestionId) {
                const response = await api.put(
                    `/questions/${editingQuestionId}`,
                    questionData
                );

                setQuestions(
                    (previousQuestions) =>
                        previousQuestions.map(
                            (question) =>
                                question._id ===
                                editingQuestionId
                                    ? response.data.question
                                    : question
                        )
                );

                setSuccess(
                    "Question updated successfully!"
                );

                resetForm();
            }

            // =========================
            // CREATE
            // =========================

            else {
                const response = await api.post(
                    "/questions",
                    {
                        examId,
                        ...questionData
                    }
                );

                setQuestions(
                    (previousQuestions) => [
                        ...previousQuestions,
                        response.data.question
                    ]
                );

                setSuccess(
                    "Question added successfully!"
                );

                resetForm();
            }
        } catch (error) {
            console.error(
                "Save question error:",
                error
            );

            if (error.response) {
                setError(
                    error.response.data.message ||
                    "Failed to save question"
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

    // =========================
    // Delete Question
    // =========================

    const handleDelete = async (questionId) => {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this question?"
            );

        if (!confirmDelete) {
            return;
        }

        try {
            setError("");
            setSuccess("");

            await api.delete(
                `/questions/${questionId}`
            );

            setQuestions(
                (previousQuestions) =>
                    previousQuestions.filter(
                        (question) =>
                            question._id !==
                            questionId
                    )
            );

            if (
                editingQuestionId ===
                questionId
            ) {
                resetForm();
            }

            setSuccess(
                "Question deleted successfully!"
            );
        } catch (error) {
            console.error(
                "Delete question error:",
                error
            );

            if (error.response) {
                setError(
                    error.response.data.message ||
                    "Failed to delete question"
                );
            } else {
                setError(
                    "Unable to connect to server"
                );
            }
        }
    };

    // =========================
    // Existing Sections
    // =========================

    const sections = [
        ...new Set(
            questions
                .map(
                    (question) =>
                        question.section
                )
                .filter(Boolean)
        )
    ];

    // =========================
    // UI
    // =========================

    return (
        <div>
            <h1>
                Manage Questions
            </h1>

            <p>
                Create MCQ and coding
                questions for this exam.
            </p>

            {/* Messages */}

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            {success && (
                <p style={{ color: "green" }}>
                    {success}
                </p>
            )}

            {/* Existing Questions */}

            <h2>
                Questions in this Exam
            </h2>

            {questionsLoading ? (
                <p>
                    Loading questions...
                </p>
            ) : questions.length === 0 ? (
                <p>
                    No questions added yet.
                </p>
            ) : (
                questions.map(
                    (question, index) => {
                        const questionType =
                            question.type || "mcq";

                        return (
                            <div
                                key={question._id}
                                style={{
                                    border:
                                        "1px solid #ccc",
                                    padding: "15px",
                                    marginBottom:
                                        "15px",
                                    borderRadius:
                                        "8px"
                                }}
                            >
                                <p>
                                    <strong>
                                        Type:
                                    </strong>{" "}
                                    {questionType ===
                                    "coding"
                                        ? "Coding"
                                        : "MCQ"}
                                </p>

                                <p>
                                    <strong>
                                        Section:
                                    </strong>{" "}
                                    {question.section ||
                                        "General"}
                                </p>

                                <h3>
                                    Q{index + 1}.{" "}
                                    {question.question}
                                </h3>

                                {/* MCQ */}

                                {questionType ===
                                    "mcq" && (
                                    <>
                                        <ol type="A">
                                            {(
                                                question.options ||
                                                []
                                            ).map(
                                                (
                                                    option,
                                                    optionIndex
                                                ) => (
                                                    <li
                                                        key={
                                                            optionIndex
                                                        }
                                                    >
                                                        {
                                                            option
                                                        }
                                                    </li>
                                                )
                                            )}
                                        </ol>

                                        <p>
                                            <strong>
                                                Correct Answer:
                                            </strong>{" "}
                                            {
                                                question.correctAnswer
                                            }
                                        </p>
                                    </>
                                )}

                                {/* Coding */}

                                {questionType ===
                                    "coding" && (
                                    <>
                                        <p>
                                            <strong>
                                                Input:
                                            </strong>{" "}
                                            {
                                                question.inputDescription
                                            }
                                        </p>

                                        <p>
                                            <strong>
                                                Output:
                                            </strong>{" "}
                                            {
                                                question.outputDescription
                                            }
                                        </p>

                                        <p>
                                            <strong>
                                                Constraints:
                                            </strong>{" "}
                                            {
                                                question.constraints ||
                                                "Not specified"
                                            }
                                        </p>

                                        <p>
                                            <strong>
                                                Sample Input:
                                            </strong>
                                        </p>

                                        <pre>
                                            {
                                                question.sampleInput
                                            }
                                        </pre>

                                        <p>
                                            <strong>
                                                Sample Output:
                                            </strong>
                                        </p>

                                        <pre>
                                            {
                                                question.sampleOutput
                                            }
                                        </pre>

                                        <p>
                                            <strong>
                                                Time Limit:
                                            </strong>{" "}
                                            {
                                                question.timeLimit
                                            }{" "}
                                            seconds
                                        </p>

                                        <p>
                                            <strong>
                                                Memory Limit:
                                            </strong>{" "}
                                            {
                                                question.memoryLimit
                                            }{" "}
                                            MB
                                        </p>

                                        <p>
                                            <strong>
                                                Allowed Languages:
                                            </strong>{" "}
                                            {(
                                                question.allowedLanguages ||
                                                []
                                            ).join(", ")}
                                        </p>
                                    </>
                                )}

                                <p>
                                    <strong>
                                        Marks:
                                    </strong>{" "}
                                    {question.marks}
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleEdit(
                                            question
                                        )
                                    }
                                >
                                    Edit
                                </button>

                                {" "}

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDelete(
                                            question._id
                                        )
                                    }
                                >
                                    Delete
                                </button>
                            </div>
                        );
                    }
                )
            )}

            {/* Sections */}

            {sections.length > 0 && (
                <div>
                    <h3>
                        Sections
                    </h3>

                    {sections.map(
                        (section) => (
                            <span
                                key={section}
                                style={{
                                    display:
                                        "inline-block",
                                    padding:
                                        "6px 12px",
                                    margin: "4px",
                                    borderRadius:
                                        "20px",
                                    background:
                                        "#eef2ff",
                                    color:
                                        "#4f46e5",
                                    fontSize:
                                        "13px",
                                    fontWeight:
                                        "600"
                                }}
                            >
                                {section}
                            </span>
                        )
                    )}
                </div>
            )}

            <hr />

            {/* Question Form */}

            <h2>
                {editingQuestionId
                    ? "Edit Question"
                    : "Add New Question"}
            </h2>

            <form
                onSubmit={handleSubmit}
            >
                {/* Question Type */}

                <div>
                    <label>
                        Question Type
                    </label>

                    <br />

                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        disabled={
                            Boolean(
                                editingQuestionId
                            )
                        }
                    >
                        <option value="mcq">
                            Multiple Choice (MCQ)
                        </option>

                        <option value="coding">
                            Coding Problem
                        </option>
                    </select>

                    {editingQuestionId && (
                        <p
                            style={{
                                color:
                                    "#64748b",
                                fontSize:
                                    "12px"
                            }}
                        >
                            Question type cannot
                            be changed while
                            editing.
                        </p>
                    )}
                </div>

                <br />

                {/* Section */}

                <div>
                    <label>
                        Section
                    </label>

                    <br />

                    <input
                        type="text"
                        name="section"
                        value={
                            formData.section
                        }
                        onChange={
                            handleChange
                        }
                        placeholder="Example: Aptitude"
                        list="section-options"
                        required
                    />

                    <datalist
                        id="section-options"
                    >
                        {sections.map(
                            (section) => (
                                <option
                                    key={section}
                                    value={section}
                                />
                            )
                        )}
                    </datalist>

                    <p
                        style={{
                            color:
                                "#64748b",
                            fontSize:
                                "13px"
                        }}
                    >
                        Example: Aptitude,
                        Technical,
                        Programming
                    </p>
                </div>

                <br />

                {/* Question / Problem Statement */}

                <div>
                    <label>
                        {formData.type ===
                        "coding"
                            ? "Problem Statement"
                            : "Question"}
                    </label>

                    <br />

                    <textarea
                        name="question"
                        value={
                            formData.question
                        }
                        onChange={
                            handleChange
                        }
                        placeholder={
                            formData.type ===
                            "coding"
                                ? "Describe the coding problem"
                                : "Enter question"
                        }
                        rows="5"
                        required
                    />
                </div>

                <br />

                {/* MCQ */}

                {formData.type === "mcq" && (
                    <>
                        <div>
                            <label>
                                Option 1
                            </label>

                            <br />

                            <input
                                type="text"
                                name="option1"
                                value={
                                    formData.option1
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter option 1"
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>
                                Option 2
                            </label>

                            <br />

                            <input
                                type="text"
                                name="option2"
                                value={
                                    formData.option2
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter option 2"
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>
                                Option 3
                            </label>

                            <br />

                            <input
                                type="text"
                                name="option3"
                                value={
                                    formData.option3
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter option 3"
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>
                                Option 4
                            </label>

                            <br />

                            <input
                                type="text"
                                name="option4"
                                value={
                                    formData.option4
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter option 4"
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>
                                Correct Answer
                            </label>

                            <br />

                            <select
                                name="correctAnswer"
                                value={
                                    formData.correctAnswer
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            >
                                <option value="">
                                    Select correct answer
                                </option>

                                <option
                                    value={
                                        formData.option1
                                    }
                                >
                                    {formData.option1 ||
                                        "Option 1"}
                                </option>

                                <option
                                    value={
                                        formData.option2
                                    }
                                >
                                    {formData.option2 ||
                                        "Option 2"}
                                </option>

                                <option
                                    value={
                                        formData.option3
                                    }
                                >
                                    {formData.option3 ||
                                        "Option 3"}
                                </option>

                                <option
                                    value={
                                        formData.option4
                                    }
                                >
                                    {formData.option4 ||
                                        "Option 4"}
                                </option>
                            </select>
                        </div>

                        <br />
                    </>
                )}

                {/* Coding */}

                {formData.type === "coding" && (
                    <>
                        <div>
                            <label>
                                Input Description
                            </label>

                            <br />

                            <textarea
                                name="inputDescription"
                                value={
                                    formData.inputDescription
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Describe the input format"
                                rows="4"
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>
                                Output Description
                            </label>

                            <br />

                            <textarea
                                name="outputDescription"
                                value={
                                    formData.outputDescription
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Describe the expected output"
                                rows="4"
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>
                                Constraints
                            </label>

                            <br />

                            <textarea
                                name="constraints"
                                value={
                                    formData.constraints
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Example: 1 <= n <= 100000"
                                rows="4"
                            />
                        </div>

                        <br />

                        <div>
                            <label>
                                Sample Input
                            </label>

                            <br />

                            <textarea
                                name="sampleInput"
                                value={
                                    formData.sampleInput
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder={"Example: 5\n10 20 30 40 50"}
                                rows="5"
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>
                                Sample Output
                            </label>

                            <br />

                            <textarea
                                name="sampleOutput"
                                value={
                                    formData.sampleOutput
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Example: 50"
                                rows="4"
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>
                                Time Limit (seconds)
                            </label>

                            <br />

                            <input
                                type="number"
                                name="timeLimit"
                                value={
                                    formData.timeLimit
                                }
                                onChange={
                                    handleChange
                                }
                                min="1"
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>
                                Memory Limit (MB)
                            </label>

                            <br />

                            <input
                                type="number"
                                name="memoryLimit"
                                value={
                                    formData.memoryLimit
                                }
                                onChange={
                                    handleChange
                                }
                                min="1"
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>
                                Allowed Languages
                            </label>

                            <br />

                            <label>
                                <input
                                    type="checkbox"
                                    checked={formData.allowedLanguages.includes(
                                        "python"
                                    )}
                                    onChange={() =>
                                        handleLanguageChange(
                                            "python"
                                        )
                                    }
                                />
                                {" "}
                                Python
                            </label>

                            <br />

                            <label>
                                <input
                                    type="checkbox"
                                    checked={formData.allowedLanguages.includes(
                                        "java"
                                    )}
                                    onChange={() =>
                                        handleLanguageChange(
                                            "java"
                                        )
                                    }
                                />
                                {" "}
                                Java
                            </label>

                            <br />

                            <label>
                                <input
                                    type="checkbox"
                                    checked={formData.allowedLanguages.includes(
                                        "cpp"
                                    )}
                                    onChange={() =>
                                        handleLanguageChange(
                                            "cpp"
                                        )
                                    }
                                />
                                {" "}
                                C++
                            </label>
                        </div>

                        <br />
                    </>
                )}

                {/* Marks */}

                <div>
                    <label>
                        Marks
                    </label>

                    <br />

                    <input
                        type="number"
                        name="marks"
                        value={
                            formData.marks
                        }
                        onChange={
                            handleChange
                        }
                        min="1"
                        required
                    />
                </div>

                <br />

                {/* Buttons */}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Saving..."
                        : editingQuestionId
                        ? "Update Question"
                        : "Add Question"}
                </button>

                {" "}

                {editingQuestionId && (
                    <button
                        type="button"
                        onClick={resetForm}
                    >
                        Cancel Edit
                    </button>
                )}

                {" "}

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/admin/exams"
                        )
                    }
                >
                    Back to Exams
                </button>
            </form>
        </div>
    );
}

export default AddQuestions;