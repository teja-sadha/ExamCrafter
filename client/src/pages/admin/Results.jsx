import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function AdminResults() {
    const [results, setResults] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================
    // Filters
    // =========================

    const [selectedExam, setSelectedExam] =
        useState("");

    const [searchTerm, setSearchTerm] =
        useState("");

    // =========================
    // Fetch Results
    // =========================

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response =
                    await api.get(
                        "/results/admin"
                    );

                console.log(
                    "Admin results:",
                    response.data
                );

                setResults(
                    response.data.results || []
                );

            } catch (error) {
                console.error(
                    "Fetch admin results error:",
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
    // Get Unique Exams
    // =========================

    const exams = useMemo(() => {
        const examMap = new Map();

        results.forEach((result) => {
            if (
                result.exam &&
                result.exam._id
            ) {
                examMap.set(
                    result.exam._id,
                    result.exam
                );
            }
        });

        return Array.from(
            examMap.values()
        );
    }, [results]);

    // =========================
    // Filter Results
    // =========================

    const filteredResults = useMemo(() => {
        const search =
            searchTerm
                .trim()
                .toLowerCase();

        return results.filter(
            (result) => {

                // Exam filter
                if (
                    selectedExam &&
                    result.exam?._id !==
                        selectedExam
                ) {
                    return false;
                }

                // Student search
                if (search) {
                    const studentName =
                        result.student?.name
                            ?.toLowerCase() ||
                        "";

                    const studentEmail =
                        result.student?.email
                            ?.toLowerCase() ||
                        "";

                    if (
                        !studentName.includes(
                            search
                        ) &&
                        !studentEmail.includes(
                            search
                        )
                    ) {
                        return false;
                    }
                }

                return true;
            }
        );
    }, [
        results,
        selectedExam,
        searchTerm
    ]);

    // =========================
    // Statistics
    // =========================

    const averagePercentage =
        filteredResults.length > 0
            ? (
                  filteredResults.reduce(
                      (total, result) =>
                          total +
                          Number(
                              result.percentage ||
                                  0
                          ),
                      0
                  ) /
                  filteredResults.length
              ).toFixed(2)
            : "0.00";

    // =========================
    // Clear Filters
    // =========================

    const clearFilters = () => {
        setSelectedExam("");
        setSearchTerm("");
    };

    // =========================
    // Loading
    // =========================

    if (loading) {
        return (
            <div>
                <h1>
                    Student Results
                </h1>

                <p>
                    Loading results...
                </p>
            </div>
        );
    }

    // =========================
    // Error
    // =========================

    if (error) {
        return (
            <div>
                <h1>
                    Student Results
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
                Student Results
            </h1>

            {/* =========================
                Summary
            ========================= */}

            <div
                style={{
                    border:
                        "1px solid #ccc",
                    padding: "15px",
                    marginBottom:
                        "20px",
                    borderRadius:
                        "8px"
                }}
            >

                <p>
                    <strong>
                        Total Results:
                    </strong>{" "}
                    {filteredResults.length}
                </p>

                <p>
                    <strong>
                        Average Percentage:
                    </strong>{" "}
                    {averagePercentage}%
                </p>

            </div>

            {/* =========================
                Filters
            ========================= */}

            <div
                style={{
                    border:
                        "1px solid #ccc",
                    padding: "15px",
                    marginBottom:
                        "20px",
                    borderRadius:
                        "8px"
                }}
            >

                <h2>
                    Filters
                </h2>

                {/* Exam Filter */}

                <div>
                    <label>
                        <strong>
                            Exam:
                        </strong>
                    </label>

                    <br />

                    <select
                        value={
                            selectedExam
                        }
                        onChange={(e) =>
                            setSelectedExam(
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            All Exams
                        </option>

                        {exams.map(
                            (exam) => (
                                <option
                                    key={
                                        exam._id
                                    }
                                    value={
                                        exam._id
                                    }
                                >
                                    {
                                        exam.title
                                    }
                                </option>
                            )
                        )}

                    </select>
                </div>

                <br />

                {/* Student Search */}

                <div>
                    <label>
                        <strong>
                            Search Student:
                        </strong>
                    </label>

                    <br />

                    <input
                        type="text"
                        value={
                            searchTerm
                        }
                        onChange={(e) =>
                            setSearchTerm(
                                e.target.value
                            )
                        }
                        placeholder="Search by name or email"
                    />
                </div>

                <br />

                <button
                    type="button"
                    onClick={
                        clearFilters
                    }
                >
                    Clear Filters
                </button>

            </div>

            {/* =========================
                No Results
            ========================= */}

            {results.length === 0 ? (

                <div>
                    <p>
                        No students have
                        submitted any exams
                        yet.
                    </p>

                    <Link to="/admin/exams">
                        Manage Exams
                    </Link>
                </div>

            ) : filteredResults.length ===
              0 ? (

                <div>
                    <p>
                        No results match the
                        selected filters.
                    </p>

                    <button
                        type="button"
                        onClick={
                            clearFilters
                        }
                    >
                        Clear Filters
                    </button>
                </div>

            ) : (

                <div>

                    {filteredResults.map(
                        (result) => (
                            <div
                                key={
                                    result._id
                                }
                                style={{
                                    border:
                                        "1px solid #ccc",
                                    padding:
                                        "20px",
                                    marginBottom:
                                        "20px",
                                    borderRadius:
                                        "8px"
                                }}
                            >

                                <h2>
                                    {
                                        result
                                            .exam
                                            ?.title ||
                                        "Exam"
                                    }
                                </h2>

                                <hr />

                                <p>
                                    <strong>
                                        Student:
                                    </strong>{" "}
                                    {
                                        result
                                            .student
                                            ?.name ||
                                        "Unknown"
                                    }
                                </p>

                                <p>
                                    <strong>
                                        Email:
                                    </strong>{" "}
                                    {
                                        result
                                            .student
                                            ?.email ||
                                        "Unknown"
                                    }
                                </p>

                                <p>
                                    <strong>
                                        Score:
                                    </strong>{" "}
                                    {
                                        result.score
                                    }{" "}
                                    /{" "}
                                    {
                                        result.totalMarks
                                    }
                                </p>

                                <p>
                                    <strong>
                                        Percentage:
                                    </strong>{" "}
                                    {Number(
                                        result.percentage
                                    ).toFixed(2)}
                                    %
                                </p>

                                <p>
                                    <strong>
                                        Correct:
                                    </strong>{" "}
                                    {
                                        result.correctAnswers
                                    }
                                </p>

                                <p>
                                    <strong>
                                        Wrong:
                                    </strong>{" "}
                                    {
                                        result.wrongAnswers
                                    }
                                </p>

                                <p>
                                    <strong>
                                        Unanswered:
                                    </strong>{" "}
                                    {
                                        result.unanswered
                                    }
                                </p>

                                <p>
                                    <strong>
                                        Submitted:
                                    </strong>{" "}
                                    {new Date(
                                        result.submittedAt
                                    ).toLocaleString()}
                                </p>
                                <br />

<Link
    to={`/admin/results/${result.exam?._id}/${result.student?._id}`}
>
    View Result
</Link>

                            </div>
                        )
                    )}

                </div>
            )}

        </div>
    );
}

export default AdminResults;