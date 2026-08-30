import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function CreateExam() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        duration: "",
        totalMarks: "",
        startDate: "",
        endDate: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        try {
            setLoading(true);

            const response = await api.post("/exams", {
                title: formData.title,
                description: formData.description,
                duration: Number(formData.duration),
                totalMarks: Number(formData.totalMarks),
                startDate: formData.startDate,
                endDate: formData.endDate
            });

            console.log("Exam created:", response.data);

            setSuccess("Exam created successfully!");

            setTimeout(() => {
                navigate("/admin/dashboard");
            }, 1000);

        } catch (error) {
            console.error("Create exam error:", error);

            if (error.response) {
                setError(
                    error.response.data.message ||
                    "Failed to create exam"
                );
            } else {
                setError("Unable to connect to server");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Create Exam</h1>

            <p>
                Create a new exam for ExamCrafter students.
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

            <form onSubmit={handleSubmit}>

                {/* Title */}

                <div>
                    <label>Exam Title</label>

                    <br />

                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter exam title"
                        required
                    />
                </div>

                <br />


                {/* Description */}

                <div>
                    <label>Description</label>

                    <br />

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter exam description"
                        rows="4"
                        required
                    />
                </div>

                <br />


                {/* Duration */}

                <div>
                    <label>Duration (minutes)</label>

                    <br />

                    <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="Example: 30"
                        min="1"
                        required
                    />
                </div>

                <br />


                {/* Total Marks */}

                <div>
                    <label>Total Marks</label>

                    <br />

                    <input
                        type="number"
                        name="totalMarks"
                        value={formData.totalMarks}
                        onChange={handleChange}
                        placeholder="Example: 20"
                        min="1"
                        required
                    />
                </div>

                <br />


                {/* Start Date */}

                <div>
                    <label>Start Date & Time</label>

                    <br />

                    <input
                        type="datetime-local"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <br />


                {/* End Date */}

                <div>
                    <label>End Date & Time</label>

                    <br />

                    <input
                        type="datetime-local"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <br />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Exam"}
                </button>

                {" "}

                <button
                    type="button"
                    onClick={() => navigate("/admin/dashboard")}
                >
                    Cancel
                </button>

            </form>
        </div>
    );
}

export default CreateExam;