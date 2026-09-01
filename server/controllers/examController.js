const validator = require("validator");
const Exam = require("../models/Exam");
const Question = require("../models/Question");
const Result = require("../models/Result");
const User = require("../models/User");

const normalizeEmail = (email) =>
    String(email || "").trim().toLowerCase();

const normalizeAllowedStudents = (emails) => {
    if (!Array.isArray(emails)) {
        return [];
    }

    const seen = new Set();
    const normalized = [];

    for (const entry of emails) {
        const value = normalizeEmail(entry);

        if (!value) {
            continue;
        }

        if (!validator.isEmail(value)) {
            throw new Error(`Invalid email address: ${entry}`);
        }

        if (seen.has(value)) {
            throw new Error(`Duplicate email address: ${value}`);
        }

        seen.add(value);
        normalized.push(value);
    }

    return normalized;
};

const isStudentAllowedForExam = (exam, studentEmail) => {
    if (!exam || !studentEmail) {
        return false;
    }

    const normalizedStudentEmail = normalizeEmail(studentEmail);
    const allowedEmails = (exam.allowedStudents || []).map(normalizeEmail);

    return allowedEmails.includes(normalizedStudentEmail);
};

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
            endDate,
            allowedStudents
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

        let normalizedAllowedStudents = [];

        try {
            normalizedAllowedStudents = normalizeAllowedStudents(
                allowedStudents || []
            );
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }

        const exam = await Exam.create({
            title,
            description,
            duration,
            totalMarks,
            startDate,
            endDate,
            allowedStudents: normalizedAllowedStudents,
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

const updateExam = async (req, res) => {
    try {
        const { examId } = req.params;

        const {
            title,
            description,
            duration,
            startDate,
            endDate,
            status,
            allowedStudents
        } = req.body;

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

        if (Number(duration) <= 0) {
            return res.status(400).json({
                message:
                    "Duration must be greater than 0"
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

        let normalizedAllowedStudents = [];

        try {
            normalizedAllowedStudents = normalizeAllowedStudents(
                allowedStudents || []
            );
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }

        const exam = await Exam.findById(
            examId
        );

        if (!exam) {
            return res.status(404).json({
                message: "Exam not found"
            });
        }

        if (
            exam.createdBy.toString() !==
            req.user.userId
        ) {
            return res.status(403).json({
                message:
                    "You cannot edit this exam"
            });
        }

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

        exam.title = title;
        exam.description = description;
        exam.duration = Number(duration);
        exam.startDate = startDate;
        exam.endDate = endDate;
        exam.status = status;
        exam.allowedStudents = normalizedAllowedStudents;

        await exam.save();

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
// ADMIN - DELETE EXAM
// ==========================================

const deleteExam = async (req, res) => {
    try {
        const { examId } = req.params;

        const exam = await Exam.findById(
            examId
        );

        if (!exam) {
            return res.status(404).json({
                message: "Exam not found"
            });
        }

        if (
            exam.createdBy.toString() !==
            req.user.userId
        ) {
            return res.status(403).json({
                message:
                    "You cannot delete this exam"
            });
        }

        await Question.deleteMany({
            exam: examId
        });

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
        let studentEmail = normalizeEmail(req.user.email);

        if (!studentEmail) {
            const user = await User.findById(req.user.userId).select("email");
            studentEmail = normalizeEmail(user?.email);
        }

        const now = new Date();

        const exams = await Exam.find({
            status: "published",
            startDate: { $lte: now },
            endDate: { $gte: now },
            allowedStudents: {
                $in: [studentEmail]
            }
        })
            .select("-createdBy")
            .sort({
                startDate: 1
            });

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

module.exports = {
    createExam,
    getAdminExams,
    updateExam,
    deleteExam,
    getPublishedExams,
    normalizeAllowedStudents,
    isStudentAllowedForExam
};



