const Result = require("../models/Result");
const Exam = require("../models/Exam");
const Question = require("../models/Question");

// ==========================================
// STUDENT - SUBMIT EXAM
// ==========================================

const submitExam = async (req, res) => {
    try {
        const { examId } = req.params;
        const { answers } = req.body;

        // =========================
        // Check answers
        // =========================

        if (
            !answers ||
            typeof answers !== "object"
        ) {
            return res.status(400).json({
                message: "Answers are required"
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
        // Only published exams
        // =========================

        if (exam.status !== "published") {
            return res.status(403).json({
                message:
                    "This exam is not available"
            });
        }

        // =========================
        // Check exam time
        // =========================

        const currentTime = new Date();

        if (
            currentTime <
            new Date(exam.startDate)
        ) {
            return res.status(403).json({
                message:
                    "This exam has not started yet"
            });
        }

        if (
            currentTime >
            new Date(exam.endDate)
        ) {
            return res.status(403).json({
                message:
                    "This exam has already ended"
            });
        }

        // =========================
        // Check existing result
        // =========================

        const existingResult =
            await Result.findOne({
                student: req.user.userId,
                exam: examId
            });

        if (existingResult) {
            return res.status(409).json({
                message:
                    "You have already submitted this exam"
            });
        }

        // =========================
        // Get questions
        // =========================

        const questions =
            await Question.find({
                exam: examId
            });

        if (questions.length === 0) {
            return res.status(400).json({
                message:
                    "This exam has no questions"
            });
        }

        // =========================
        // Calculate result
        // =========================

        let score = 0;
        let correctAnswers = 0;
        let wrongAnswers = 0;
        let unanswered = 0;

        for (const question of questions) {
            const studentAnswer =
                answers[
                    question._id.toString()
                ];

            // No answer
            if (
                studentAnswer === undefined ||
                studentAnswer === null ||
                studentAnswer === ""
            ) {
                unanswered++;
                continue;
            }

            // Correct answer
            if (
                studentAnswer ===
                question.correctAnswer
            ) {
                score += Number(
                    question.marks
                );

                correctAnswers++;
            }

            // Wrong answer
            else {
                wrongAnswers++;
            }
        }

        // =========================
        // Calculate total marks
        // =========================

        const totalMarks =
            questions.reduce(
                (total, question) =>
                    total +
                    Number(
                        question.marks || 0
                    ),
                0
            );

        // =========================
        // Calculate percentage
        // =========================

        const percentage =
            totalMarks > 0
                ? Number(
                      (
                          (score /
                              totalMarks) *
                          100
                      ).toFixed(2)
                  )
                : 0;

        // =========================
        // Save result
        // =========================

        const result = await Result.create({
            student:
                req.user.userId,

            exam: examId,

            score,

            totalMarks,

            percentage,

            correctAnswers,

            wrongAnswers,

            unanswered,

            answers
        });

        // =========================
        // Response
        // =========================

        res.status(201).json({
            message:
                "Exam submitted successfully",

            result: {
                id: result._id,
                exam: examId,
                score,
                totalMarks,
                percentage,
                correctAnswers,
                wrongAnswers,
                unanswered,
                submittedAt:
                    result.submittedAt
            }
        });

    } catch (error) {
        console.error(
            "Submit exam error:",
            error
        );

        // Duplicate result
        if (error.code === 11000) {
            return res.status(409).json({
                message:
                    "You have already submitted this exam"
            });
        }

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// STUDENT - GET OWN RESULT
// ==========================================

const getMyResult = async (req, res) => {
    try {
        const { examId } = req.params;

        const result =
            await Result.findOne({
                student:
                    req.user.userId,
                exam: examId
            }).populate(
                "exam",
                "title duration totalMarks"
            );

        if (!result) {
            return res.status(404).json({
                message:
                    "Result not found"
            });
        }

        res.status(200).json({
            result
        });

    } catch (error) {
        console.error(
            "Get result error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// STUDENT - GET ALL OWN RESULTS
// ==========================================

const getMyResults = async (req, res) => {
    try {
        const results =
            await Result.find({
                student:
                    req.user.userId
            })
                .populate(
                    "exam",
                    "title duration totalMarks"
                )
                .sort({
                    submittedAt: -1
                });

        res.status(200).json({
            results
        });

    } catch (error) {
        console.error(
            "Get my results error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// ADMIN - GET ALL RESULTS
// ==========================================

const getAllResults = async (req, res) => {
    try {
        const results =
            await Result.find()
                .populate(
                    "student",
                    "name email"
                )
                .populate(
                    "exam",
                    "title duration totalMarks createdBy"
                )
                .sort({
                    submittedAt: -1
                });

        // =========================
        // Only results for exams
        // created by this admin
        // =========================

        const adminResults =
            results.filter(
                (result) =>
                    result.exam &&
                    result.exam.createdBy &&
                    result.exam.createdBy
                        .toString() ===
                        req.user.userId
            );

        // =========================
        // Get admin's exams
        // =========================

        const exams = await Exam.find({
            createdBy: req.user.userId
        })
            .select(
                "_id title totalMarks duration"
            )
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            results: adminResults,
            exams
        });

    } catch (error) {
        console.error(
            "Get all results error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// ADMIN - GET RESULTS FOR ONE EXAM
// ==========================================

const getResultsByExam = async (
    req,
    res
) => {
    try {
        const { examId } = req.params;

        // =========================
        // Find exam
        // =========================

        const exam =
            await Exam.findById(examId);

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
                    "You cannot access results for this exam"
            });
        }

        // =========================
        // Get results
        // =========================

        const results =
            await Result.find({
                exam: examId
            })
                .populate(
                    "student",
                    "name email"
                )
                .populate(
                    "exam",
                    "title duration totalMarks"
                )
                .sort({
                    submittedAt: -1
                });

        res.status(200).json({
            exam: {
                id: exam._id,
                title: exam.title,
                totalMarks:
                    exam.totalMarks,
                duration:
                    exam.duration
            },
            results
        });

    } catch (error) {
        console.error(
            "Get results by exam error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// ADMIN - GET ONE RESULT
// ==========================================

const getAdminResultById = async (
    req,
    res
) => {
    try {
        const { resultId } = req.params;

        // =========================
        // Find result
        // =========================

        const result =
            await Result.findById(
                resultId
            )
                .populate(
                    "student",
                    "name email"
                )
                .populate(
                    "exam",
                    "title description duration totalMarks createdBy startDate endDate"
                );

        if (!result) {
            return res.status(404).json({
                message:
                    "Result not found"
            });
        }

        // =========================
        // Check exam exists
        // =========================

        if (!result.exam) {
            return res.status(404).json({
                message:
                    "Exam associated with this result was not found"
            });
        }

        // =========================
        // Check ownership
        // =========================

        if (
            result.exam.createdBy.toString() !==
            req.user.userId
        ) {
            return res.status(403).json({
                message:
                    "You cannot access this result"
            });
        }

        // =========================
        // Response
        // =========================

        res.status(200).json({
            result
        });

    } catch (error) {
        console.error(
            "Get admin result error:",
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
    submitExam,
    getMyResult,
    getMyResults,
    getAllResults,
    getResultsByExam,
    getAdminResultById
};