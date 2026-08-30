import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function AdminExams() {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================
    // Edit State
    // =========================

    const [editingExamId, setEditingExamId] =
        useState(null);

    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        duration: "",
        startDate: "",
        endDate: "",
        status: "draft"
    });

    const [editLoading, setEditLoading] =
        useState(false);

    // =========================
    // Delete State
    // =========================

    const [deleteLoading, setDeleteLoading] =
        useState(false);

    // =========================
    // Fetch Exams
    // =========================

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await api.get(
                    "/exams"
                );

                const examList =
                    response.data.exams;

                const examsWithQuestions =
                    await Promise.all(
                        examList.map(
                            async (exam) => {
                                try {
                                    const questionResponse =
                                        await api.get(
                                            `/questions/exam/${exam._id}`
                                        );

                                    const questions =
                                        questionResponse
                                            .data
                                            .questions ||
                                        [];

                                    const calculatedMarks =
                                        questions.reduce(
                                            (
                                                total,
                                                question
                                            ) =>
                                                total +
                                                Number(
                                                    question.marks ||
                                                        0
                                                ),
                                            0
                                        );

                                    return {
                                        ...exam,
                                        questionCount:
                                            questions.length,
                                        calculatedMarks
                                    };

                                } catch (
                                    questionError
                                ) {
                                    console.error(
                                        `Failed to load questions for exam ${exam._id}:`,
                                        questionError
                                    );

                                    return {
                                        ...exam,
                                        questionCount: 0,
                                        calculatedMarks: 0
                                    };
                                }
                            }
                        )
                    );

                setExams(
                    examsWithQuestions
                );

            } catch (error) {
                console.error(
                    "Fetch exams error:",
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
    // Handle Edit Input
    // =========================

    const handleEditChange = (e) => {
        const { name, value } = e.target;

        setEditForm((previousForm) => ({
            ...previousForm,
            [name]: value
        }));
    };

    // =========================
    // Start Editing
    // =========================

    const handleEdit = (exam) => {
        setError("");

        setEditingExamId(exam._id);

        setEditForm({
            title: exam.title || "",
            description:
                exam.description || "",
            duration:
                exam.duration || "",
            startDate:
                formatDateForInput(
                    exam.startDate
                ),
            endDate:
                formatDateForInput(
                    exam.endDate
                ),
            status:
                exam.status || "draft"
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =========================
    // Format Date
    // =========================

    const formatDateForInput = (
        date
    ) => {
        if (!date) {
            return "";
        }

        const parsedDate =
            new Date(date);

        const year =
            parsedDate.getFullYear();

        const month = String(
            parsedDate.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            parsedDate.getDate()
        ).padStart(2, "0");

        const hours = String(
            parsedDate.getHours()
        ).padStart(2, "0");

        const minutes = String(
            parsedDate.getMinutes()
        ).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // =========================
    // Cancel Edit
    // =========================

    const handleCancelEdit = () => {
        setEditingExamId(null);

        setEditForm({
            title: "",
            description: "",
            duration: "",
            startDate: "",
            endDate: "",
            status: "draft"
        });
    };

    // =========================
    // Update Exam
    // =========================

    const handleUpdateExam = async (
        e
    ) => {
        e.preventDefault();

        setError("");

        try {
            setEditLoading(true);

            const response =
                await api.put(
                    `/exams/${editingExamId}`,
                    {
                        title:
                            editForm.title,

                        description:
                            editForm.description,

                        duration:
                            Number(
                                editForm.duration
                            ),

                        startDate:
                            editForm.startDate,

                        endDate:
                            editForm.endDate,

                        status:
                            editForm.status
                    }
                );

            console.log(
                "Exam updated:",
                response.data
            );

            const updatedExam =
                response.data.exam;

            setExams(
                (previousExams) =>
                    previousExams.map(
                        (exam) =>
                            exam._id ===
                            editingExamId
                                ? {
                                      ...exam,
                                      ...updatedExam
                                  }
                                : exam
                    )
            );

            handleCancelEdit();

        } catch (error) {
            console.error(
                "Update exam error:",
                error
            );

            if (error.response) {
                setError(
                    error.response.data.message ||
                    "Failed to update exam"
                );
            } else {
                setError(
                    "Unable to connect to server"
                );
            }

        } finally {
            setEditLoading(false);
        }
    };

    // =========================
    // Delete Exam
    // =========================

    const handleDeleteExam = async (
        exam
    ) => {
        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${exam.title}"?\n\nThis will also delete all questions belonging to this exam.`
            );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setDeleteLoading(true);

            await api.delete(
                `/exams/${exam._id}`
            );

            // Remove exam from UI
            setExams(
                (previousExams) =>
                    previousExams.filter(
                        (item) =>
                            item._id !==
                            exam._id
                    )
            );

            // If deleted exam was being edited
            if (
                editingExamId ===
                exam._id
            ) {
                handleCancelEdit();
            }

        } catch (error) {
            console.error(
                "Delete exam error:",
                error
            );

            if (error.response) {
                setError(
                    error.response.data.message ||
                    "Failed to delete exam"
                );
            } else {
                setError(
                    "Unable to connect to server"
                );
            }

        } finally {
            setDeleteLoading(false);
        }
    };

    // =========================
    // Loading
    // =========================

    if (loading) {
        return (
            <div>
                <h1>
                    Manage Exams
                </h1>

                <p>
                    Loading exams...
                </p>
            </div>
        );
    }

    // =========================
    // Error
    // =========================

    if (error && !editingExamId) {
        return (
            <div>
                <h1>
                    Manage Exams
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
    // UI
    // =========================

    return (
        <div>

            <h1>
                Manage Exams
            </h1>

            {error && (
                <p
                    style={{
                        color: "red"
                    }}
                >
                    {error}
                </p>
            )}

            <Link to="/admin/exams/create">
                Create New Exam
            </Link>

            <br />
            <br />

            {/* =========================
                Edit Exam Form
            ========================= */}

            {editingExamId && (
                <div
                    style={{
                        border:
                            "2px solid #333",
                        padding: "20px",
                        marginBottom:
                            "25px",
                        borderRadius:
                            "8px"
                    }}
                >

                    <h2>
                        Edit Exam
                    </h2>

                    <form
                        onSubmit={
                            handleUpdateExam
                        }
                    >

                        <div>
                            <label>
                                Exam Title
                            </label>

                            <br />

                            <input
                                type="text"
                                name="title"
                                value={
                                    editForm.title
                                }
                                onChange={
                                    handleEditChange
                                }
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>
                                Description
                            </label>

                            <br />

                            <textarea
                                name="description"
                                value={
                                    editForm.description
                                }
                                onChange={
                                    handleEditChange
                                }
                                rows="4"
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>
                                Duration
                                (minutes)
                            </label>

                            <br />

                            <input
                                type="number"
                                name="duration"
                                value={
                                    editForm.duration
                                }
                                onChange={
                                    handleEditChange
                                }
                                min="1"
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>
                                Start Date
                            </label>

                            <br />

                            <input
                                type="datetime-local"
                                name="startDate"
                                value={
                                    editForm.startDate
                                }
                                onChange={
                                    handleEditChange
                                }
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>
                                End Date
                            </label>

                            <br />

                            <input
                                type="datetime-local"
                                name="endDate"
                                value={
                                    editForm.endDate
                                }
                                onChange={
                                    handleEditChange
                                }
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>
                                Status
                            </label>

                            <br />

                            <select
                                name="status"
                                value={
                                    editForm.status
                                }
                                onChange={
                                    handleEditChange
                                }
                            >
                                <option value="draft">
                                    Draft
                                </option>

                                <option value="published">
                                    Published
                                </option>
                            </select>
                        </div>

                        <br />

                        <button
                            type="submit"
                            disabled={
                                editLoading
                            }
                        >
                            {editLoading
                                ? "Updating..."
                                : "Update Exam"}
                        </button>

                        {" "}

                        <button
                            type="button"
                            onClick={
                                handleCancelEdit
                            }
                        >
                            Cancel
                        </button>

                    </form>
                </div>
            )}

            {/* =========================
                Exam List
            ========================= */}

            {exams.length === 0 ? (

                <p>
                    No exams created yet.
                </p>

            ) : (

                exams.map((exam) => (

                    <div
                        key={exam._id}
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
                            {exam.title}
                        </h2>

                        <p>
                            {exam.description}
                        </p>

                        <hr />

                        <p>
                            <strong>
                                Questions:
                            </strong>{" "}
                            {exam.questionCount}
                        </p>

                        <p>
                            <strong>
                                Calculated Total Marks:
                            </strong>{" "}
                            {exam.calculatedMarks}
                        </p>

                        <p>
                            <strong>
                                Exam Total Marks:
                            </strong>{" "}
                            {exam.totalMarks}
                        </p>

                        <p>
                            <strong>
                                Duration:
                            </strong>{" "}
                            {exam.duration} minutes
                        </p>

                        <p>
                            <strong>
                                Status:
                            </strong>{" "}
                            {exam.status}
                        </p>

                        <p>
                            <strong>
                                Start:
                            </strong>{" "}
                            {new Date(
                                exam.startDate
                            ).toLocaleString()}
                        </p>

                        <p>
                            <strong>
                                End:
                            </strong>{" "}
                            {new Date(
                                exam.endDate
                            ).toLocaleString()}
                        </p>

                        <p>
                            <strong>
                                Exam ID:
                            </strong>{" "}
                            {exam._id}
                        </p>

                        <br />

                        {/* Edit Exam */}

                        <button
                            type="button"
                            onClick={() =>
                                handleEdit(
                                    exam
                                )
                            }
                        >
                            Edit Exam
                        </button>

                        {" "}

                        {/* Manage Questions */}

                        <Link
                            to={`/admin/exams/${exam._id}/questions`}
                        >
                            Add / Manage Questions
                        </Link>

                        {" "}

                        {/* Delete Exam */}

                        <button
                            type="button"
                            onClick={() =>
                                handleDeleteExam(
                                    exam
                                )
                            }
                            disabled={
                                deleteLoading
                            }
                            style={{
                                marginLeft:
                                    "10px"
                            }}
                        >
                            {deleteLoading
                                ? "Deleting..."
                                : "Delete Exam"}
                        </button>

                    </div>
                ))
            )}

        </div>
    );
}

export default AdminExams;