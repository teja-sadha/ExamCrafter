const Exam = require("../models/Exam");
const Question = require("../models/Question");
const Result = require("../models/Result");

// ==========================================
// ADMIN - CREATE EXAM
// ==========================================

const createExam = async (req, res) => {
    try {
        const {
            title,
            description,
            duration,
            totalMarks,
            startDate,
            endDate
        } = req.body;

        if (
            !title ||
            !description ||
            !duration ||
            !totalMarks ||
            !startDate ||
            !endDate
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (
            new Date(endDate) <=
            new Date(startDate)
        ) {
            return res.status(400).json({
                message:
                    "End date must be after start date"
            });
        }

        const exam = await Exam.create({
            title,
            description,
            duration,
            totalMarks,
            startDate,
            endDate,
            createdBy: req.user.userId
        });

        res.status(201).json({
            message:
                "Exam created successfully",
            exam
        });

    } catch (error) {
        console.error(
            "Create exam error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// ADMIN - GET OWN EXAMS
// ==========================================

const getAdminExams = async (req, res) => {
    try {
        const exams = await Exam.find({
            createdBy: req.user.userId
        }).sort({
            createdAt: -1
        });

        res.status(200).json({
            exams
        });

    } catch (error) {
        console.error(
            "Get admin exams error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// ADMIN - UPDATE EXAM
// ==========================================
// ==========================================
// ADMIN - UPDATE EXAM
// ==========================================

const updateExam = async (req, res) => {
    try {
        const { examId } = req.params;

        const {
            title,
            description,
            duration,
            startDate,
            endDate,
            status
        } = req.body;

        // =========================
        // Validate required fields
        // =========================

        if (
            !title ||
            !description ||
            !duration ||
            !startDate ||
            !endDate ||
            !status
        ) {
            return res.status(400).json({
                message:
                    "All fields are required"
            });
        }

        // =========================
        // Validate duration
        // =========================

        if (Number(duration) <= 0) {
            return res.status(400).json({
                message:
                    "Duration must be greater than 0"
            });
        }

        // =========================
        // Validate dates
        // =========================

        if (
            new Date(endDate) <=
            new Date(startDate)
        ) {
            return res.status(400).json({
                message:
                    "End date must be after start date"
            });
        }

        // =========================
        // Validate status
        // =========================

        const allowedStatuses = [
            "draft",
            "published"
        ];

        if (
            !allowedStatuses.includes(status)
        ) {
            return res.status(400).json({
                message:
                    "Invalid exam status"
            });
        }

        // =========================
        // Find exam
        // =========================

        const exam = await Exam.findById(
            examId
        );

        if (!exam) {
            return res.status(404).json({
                message: "Exam not found"
            });
        }

        // =========================
        // Check ownership
        // =========================

        if (
            exam.createdBy.toString() !==
            req.user.userId
        ) {
            return res.status(403).json({
                message:
                    "You cannot edit this exam"
            });
        }

        // =========================
        // Check questions before
        // publishing
        // =========================

        if (status === "published") {

            const questionCount =
                await Question.countDocuments({
                    exam: examId
                });

            if (questionCount === 0) {
                return res.status(400).json({
                    message:
                        "Add at least one question before publishing the exam"
                });
            }
        }

        // =========================
        // Update fields
        // =========================

        exam.title = title;
        exam.description = description;
        exam.duration = Number(duration);
        exam.startDate = startDate;
        exam.endDate = endDate;
        exam.status = status;

        await exam.save();

        // =========================
        // Response
        // =========================

        res.status(200).json({
            message:
                "Exam updated successfully",
            exam
        });

    } catch (error) {
        console.error(
            "Update exam error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

// ==========================================
// STUDENT - GET PUBLISHED EXAMS
// ==========================================
// ==========================================
// ADMIN - DELETE EXAM
// ==========================================

const deleteExam = async (req, res) => {
    try {
        const { examId } = req.params;

        // =========================
        // Find exam
        // =========================

        const exam = await Exam.findById(
            examId
        );

        if (!exam) {
            return res.status(404).json({
                message: "Exam not found"
            });
        }

        // =========================
        // Check ownership
        // =========================

        if (
            exam.createdBy.toString() !==
            req.user.userId
        ) {
            return res.status(403).json({
                message:
                    "You cannot delete this exam"
            });
        }

        // =========================
        // Delete questions
        // =========================

        await Question.deleteMany({
            exam: examId
        });

        // =========================
        // Delete exam
        // =========================

        await Exam.findByIdAndDelete(
            examId
        );

        res.status(200).json({
            message:
                "Exam and its questions deleted successfully"
        });

    } catch (error) {
        console.error(
            "Delete exam error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};
// ==========================================
// STUDENT - GET PUBLISHED EXAMS
// ==========================================

const getPublishedExams = async (req, res) => {
    try {
        const exams = await Exam.find({
            status: "published"
        })
            .select("-createdBy")
            .sort({
                startDate: 1
            });

        // Get all exams already submitted
        // by the logged-in student
        const submittedResults =
            await Result.find({
                student: req.user.userId
            }).select("exam");

        const submittedExamIds =
            new Set(
                submittedResults.map(
                    (result) =>
                        result.exam.toString()
                )
            );

        // Add submission status
        const examsWithStatus =
            exams.map((exam) => ({
                ...exam.toObject(),

                hasSubmitted:
                    submittedExamIds.has(
                        exam._id.toString()
                    )
            }));

        res.status(200).json({
            exams: examsWithStatus
        });

    } catch (error) {
        console.error(
            "Get published exams error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
    createExam,
    getAdminExams,
    updateExam,
    deleteExam,
    getPublishedExams
};