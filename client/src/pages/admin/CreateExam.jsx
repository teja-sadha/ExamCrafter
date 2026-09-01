import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

// Convert datetime-local value to UTC ISO string
const toISOString = (value) => {
    if (!value) return "";

    return new Date(value).toISOString();
};

function CreateExam() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        duration: "",
        totalMarks: "",
        startDate: "",
        endDate: "",
        allowedStudents: []
    });

    const [studentEmailInput, setStudentEmailInput] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));
    };

    const addStudentEmail = () => {
        const trimmed = studentEmailInput.trim();

        if (!trimmed) {
            setError("Please enter a student email");
            return;
        }

        const email = trimmed.toLowerCase();

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError("Please provide a valid email address");
            return;
        }

        if (formData.allowedStudents.some((item) => item.toLowerCase() === email)) {
            setError("This student email is already added");
            return;
        }

        setFormData((previousData) => ({
            ...previousData,
            allowedStudents: [...previousData.allowedStudents, email]
        }));
        setStudentEmailInput("");
        setError("");
    };

    const removeStudentEmail = (emailToRemove) => {
        setFormData((previousData) => ({
            ...previousData,
            allowedStudents: previousData.allowedStudents.filter(
                (email) => email !== emailToRemove
            )
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.startDate ||
            !formData.endDate
        ) {
            setError(
                "Please select start and end date/time"
            );
            return;
        }

        if (
            new Date(formData.endDate) <=
            new Date(formData.startDate)
        ) {
            setError(
                "End date must be after start date"
            );
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                "/exams",
                {
                    title: formData.title,
                    description:
                        formData.description,

                    duration:
                        Number(formData.duration),

                    totalMarks:
                        Number(formData.totalMarks),

                    startDate:
                        toISOString(
                            formData.startDate
                        ),

                    endDate:
                        toISOString(
                            formData.endDate
                        ),

                    allowedStudents:
                        formData.allowedStudents
                }
            );

            console.log(
                "Exam created:",
                response.data
            );

            setSuccess(
                "Exam created successfully!"
            );

            setTimeout(() => {
                navigate(
                    "/admin/dashboard"
                );
            }, 1000);

        } catch (error) {
            console.error(
                "Create exam error:",
                error
            );

            if (error.response) {
                setError(
                    error.response.data.message ||
                    "Failed to create exam"
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

    return (
        <div>
            <h1>Create Exam</h1>

            <p>
                Create a new exam for
                ExamCrafter students.
            </p>

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

            <form
                onSubmit={handleSubmit}
            >

                {/* Title */}

                <div>
                    <label>
                        Exam Title
                    </label>

                    <br />

                    <input
                        type="text"
                        name="title"
                        value={
                            formData.title
                        }
                        onChange={
                            handleChange
                        }
                        placeholder="Enter exam title"
                        required
                    />
                </div>

                <br />

                {/* Description */}

                <div>
                    <label>
                        Description
                    </label>

                    <br />

                    <textarea
                        name="description"
                        value={
                            formData.description
                        }
                        onChange={
                            handleChange
                        }
                        placeholder="Enter exam description"
                        rows="4"
                        required
                    />
                </div>

                <br />

                {/* Duration */}

                <div>
                    <label>
                        Duration (minutes)
                    </label>

                    <br />

                    <input
                        type="number"
                        name="duration"
                        value={
                            formData.duration
                        }
                        onChange={
                            handleChange
                        }
                        placeholder="Example: 30"
                        min="1"
                        required
                    />
                </div>

                <br />

                {/* Total Marks */}

                <div>
                    <label>
                        Total Marks
                    </label>

                    <br />

                    <input
                        type="number"
                        name="totalMarks"
                        value={
                            formData.totalMarks
                        }
                        onChange={
                            handleChange
                        }
                        placeholder="Example: 20"
                        min="1"
                        required
                    />
                </div>

                <br />

                <div>
                    <label>
                        Student Email Access
                    </label>
                    <br />
                    <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                        <input
                            type="email"
                            value={studentEmailInput}
                            onChange={(e) => setStudentEmailInput(e.target.value)}
                            placeholder="student@gmail.com"
                            style={{ flex: 1 }}
                        />
                        <button type="button" onClick={addStudentEmail}>Add</button>
                    </div>
                    <div style={{ marginTop: "12px" }}>
                        {formData.allowedStudents.length === 0 ? (
                            <p>No students assigned.</p>
                        ) : (
                            <ul>
                                {formData.allowedStudents.map((email) => (
                                    <li key={email} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                        <span>{email}</span>
                                        <button type="button" onClick={() => removeStudentEmail(email)}>Remove</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <br />

                {/* Start Date */}

                <div>
                    <label>
                        Start Date & Time
                    </label>

                    <br />

                    <input
                        type="datetime-local"
                        name="startDate"
                        value={
                            formData.startDate
                        }
                        onChange={
                            handleChange
                        }
                        required
                    />
                </div>

                <br />

                {/* End Date */}

                <div>
                    <label>
                        End Date & Time
                    </label>

                    <br />

                    <input
                        type="datetime-local"
                        name="endDate"
                        value={
                            formData.endDate
                        }
                        onChange={
                            handleChange
                        }
                        required
                    />
                </div>

                <br />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating..."
                        : "Create Exam"}
                </button>

                {" "}

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/admin/dashboard"
                        )
                    }
                >
                    Cancel
                </button>

            </form>
        </div>
    );
}

export default CreateExam;