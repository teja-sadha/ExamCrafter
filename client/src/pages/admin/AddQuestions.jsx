import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

function AddQuestions() {
    const { examId } = useParams();
    const navigate = useNavigate();

    // =========================
    // Form State
    // =========================

    const [formData, setFormData] = useState({
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correctAnswer: "",
        marks: 1
    });

    // =========================
    // Page State
    // =========================

    const [questions, setQuestions] = useState([]);
    const [questionsLoading, setQuestionsLoading] =
        useState(true);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    // Editing question ID
    const [editingQuestionId, setEditingQuestionId] =
        useState(null);

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
                    response.data.questions
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
    // Handle Input Changes
    // =========================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));
    };

    // =========================
    // Reset Form
    // =========================

    const resetForm = () => {
        setFormData({
            question: "",
            option1: "",
            option2: "",
            option3: "",
            option4: "",
            correctAnswer: "",
            marks: 1
        });

        setEditingQuestionId(null);
    };

    // =========================
    // Edit Question
    // =========================

    const handleEdit = (question) => {
        setError("");
        setSuccess("");

        setEditingQuestionId(
            question._id
        );

        setFormData({
            question: question.question,
            option1: question.options[0] || "",
            option2: question.options[1] || "",
            option3: question.options[2] || "",
            option4: question.options[3] || "",
            correctAnswer:
                question.correctAnswer,
            marks: question.marks
        });

        // Scroll to form
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        });
    };

    // =========================
    // Add / Update Question
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        try {
            setLoading(true);

            const questionData = {
                question:
                    formData.question,

                options: [
                    formData.option1,
                    formData.option2,
                    formData.option3,
                    formData.option4
                ],

                correctAnswer:
                    formData.correctAnswer,

                marks: Number(
                    formData.marks
                )
            };

            // =========================
            // UPDATE
            // =========================

            if (editingQuestionId) {
                const response =
                    await api.put(
                        `/questions/${editingQuestionId}`,
                        questionData
                    );

                console.log(
                    "Question updated:",
                    response.data
                );

                // Update question in list
                setQuestions(
                    (previousQuestions) =>
                        previousQuestions.map(
                            (question) =>
                                question._id ===
                                editingQuestionId
                                    ? response.data
                                          .question
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
                const response =
                    await api.post(
                        "/questions",
                        {
                            examId: examId,

                            ...questionData
                        }
                    );

                console.log(
                    "Question created:",
                    response.data
                );

                // Add new question to list
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

    const handleDelete = async (
        questionId
    ) => {
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

            // Remove deleted question
            setQuestions(
                (previousQuestions) =>
                    previousQuestions.filter(
                        (question) =>
                            question._id !==
                            questionId
                    )
            );

            // If currently editing
            // this question, reset form
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
    // UI
    // =========================

    return (
        <div>

            {/* =========================
                Page Heading
            ========================= */}

            <h1>
                Manage Questions
            </h1>

            <p>
                Add, edit or delete MCQ
                questions for this exam.
            </p>

            {/* =========================
                Messages
            ========================= */}

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

            {/* =========================
                Existing Questions
            ========================= */}

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
                    (question, index) => (
                        <div
                            key={
                                question._id
                            }
                            style={{
                                border:
                                    "1px solid #ccc",
                                padding:
                                    "15px",
                                marginBottom:
                                    "15px"
                            }}
                        >

                            <h3>
                                Q{index + 1}.{" "}
                                {
                                    question.question
                                }
                            </h3>

                            <ol type="A">
                                {question.options.map(
                                    (
                                        option,
                                        optionIndex
                                    ) => (
                                        <li
                                            key={
                                                optionIndex
                                            }
                                        >
                                            {option}
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

                            <p>
                                <strong>
                                    Marks:
                                </strong>{" "}
                                {
                                    question.marks
                                }
                            </p>

                            {/* Edit */}

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

                            {/* Delete */}

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
                    )
                )
            )}

            {/* =========================
                Add / Edit Form
            ========================= */}

            <h2>
                {editingQuestionId
                    ? "Edit Question"
                    : "Add New Question"}
            </h2>

            <form
                onSubmit={
                    handleSubmit
                }
            >

                {/* Question */}

                <div>
                    <label>
                        Question
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
                        placeholder="Enter question"
                        rows="4"
                        required
                    />
                </div>

                <br />

                {/* Option 1 */}

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

                {/* Option 2 */}

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

                {/* Option 3 */}

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

                {/* Option 4 */}

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

                {/* Correct Answer */}

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

                {/* Submit */}

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

                {/* Cancel Edit */}

                {editingQuestionId && (
                    <>
                        <button
                            type="button"
                            onClick={
                                resetForm
                            }
                        >
                            Cancel Edit
                        </button>

                        {" "}
                    </>
                )}

                {/* Back */}

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