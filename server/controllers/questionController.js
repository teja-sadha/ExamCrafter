const Question = require("../models/Question");
const Exam = require("../models/Exam");

// ==========================================
// UPDATE EXAM TOTAL MARKS
// ==========================================

const updateExamTotalMarks = async (examId) => {
    const questions = await Question.find({
        exam: examId
    });

    const totalMarks = questions.reduce(
        (total, question) =>
            total + Number(question.marks || 0),
        0
    );

    await Exam.findByIdAndUpdate(
        examId,
        {
            totalMarks
        }
    );

    return totalMarks;
};


// ==========================================
// ADMIN - CREATE QUESTION
// ==========================================

const createQuestion = async (req, res) => {
    try {
        const {
            examId,
            question,
            options,
            correctAnswer,
            marks
        } = req.body;

        // Check required fields
        if (
            !examId ||
            !question ||
            !options ||
            !correctAnswer ||
            !marks
        ) {
            return res.status(400).json({
                message:
                    "All fields are required"
            });
        }

        // Check options
        if (
            !Array.isArray(options) ||
            options.length !== 4
        ) {
            return res.status(400).json({
                message:
                    "Exactly 4 options are required"
            });
        }

        // Find exam
        const exam =
            await Exam.findById(examId);

        if (!exam) {
            return res.status(404).json({
                message:
                    "Exam not found"
            });
        }

        // Check ownership
        if (
            exam.createdBy.toString() !==
            req.user.userId
        ) {
            return res.status(403).json({
                message:
                    "You cannot add questions to this exam"
            });
        }

        // Check correct answer
        if (
            !options.includes(correctAnswer)
        ) {
            return res.status(400).json({
                message:
                    "Correct answer must match one of the options"
            });
        }

        // Create question
        const newQuestion =
            await Question.create({
                exam: examId,
                question,
                options,
                correctAnswer,
                marks
            });

        // Update exam total marks
        await updateExamTotalMarks(
            examId
        );

        res.status(201).json({
            message:
                "Question created successfully",
            question: newQuestion
        });

    } catch (error) {
        console.error(
            "Create question error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// ADMIN - GET QUESTIONS FOR EXAM
// ==========================================

const getQuestionsByExam = async (
    req,
    res
) => {
    try {
        const { examId } = req.params;

        // Find exam
        const exam =
            await Exam.findById(examId);

        if (!exam) {
            return res.status(404).json({
                message:
                    "Exam not found"
            });
        }

        // Check ownership
        if (
            exam.createdBy.toString() !==
            req.user.userId
        ) {
            return res.status(403).json({
                message:
                    "You cannot access this exam"
            });
        }

        // Get questions
        const questions =
            await Question.find({
                exam: examId
            }).sort({
                createdAt: 1
            });

        res.status(200).json({
            questions
        });

    } catch (error) {
        console.error(
            "Get questions error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// ADMIN - UPDATE QUESTION
// ==========================================

const updateQuestion = async (
    req,
    res
) => {
    try {
        const { questionId } =
            req.params;

        const {
            question,
            options,
            correctAnswer,
            marks
        } = req.body;

        // Find question
        const existingQuestion =
            await Question.findById(
                questionId
            );

        if (!existingQuestion) {
            return res.status(404).json({
                message:
                    "Question not found"
            });
        }

        // Find exam
        const exam =
            await Exam.findById(
                existingQuestion.exam
            );

        if (!exam) {
            return res.status(404).json({
                message:
                    "Exam not found"
            });
        }

        // Check ownership
        if (
            exam.createdBy.toString() !==
            req.user.userId
        ) {
            return res.status(403).json({
                message:
                    "You cannot update this question"
            });
        }

        // Check required fields
        if (
            !question ||
            !options ||
            !correctAnswer ||
            !marks
        ) {
            return res.status(400).json({
                message:
                    "All fields are required"
            });
        }

        // Check options
        if (
            !Array.isArray(options) ||
            options.length !== 4
        ) {
            return res.status(400).json({
                message:
                    "Exactly 4 options are required"
            });
        }

        // Check correct answer
        if (
            !options.includes(
                correctAnswer
            )
        ) {
            return res.status(400).json({
                message:
                    "Correct answer must match one of the options"
            });
        }

        // Check marks
        if (Number(marks) <= 0) {
            return res.status(400).json({
                message:
                    "Marks must be greater than 0"
            });
        }

        // Update question
        existingQuestion.question =
            question;

        existingQuestion.options =
            options;

        existingQuestion.correctAnswer =
            correctAnswer;

        existingQuestion.marks =
            Number(marks);

        await existingQuestion.save();

        // Update exam total marks
        await updateExamTotalMarks(
            existingQuestion.exam
        );

        res.status(200).json({
            message:
                "Question updated successfully",
            question:
                existingQuestion
        });

    } catch (error) {
        console.error(
            "Update question error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// ADMIN - DELETE QUESTION
// ==========================================

const deleteQuestion = async (
    req,
    res
) => {
    try {
        const { questionId } =
            req.params;

        // Find question
        const question =
            await Question.findById(
                questionId
            );

        if (!question) {
            return res.status(404).json({
                message:
                    "Question not found"
            });
        }

        // Find exam
        const exam =
            await Exam.findById(
                question.exam
            );

        if (!exam) {
            return res.status(404).json({
                message:
                    "Exam not found"
            });
        }

        // Check ownership
        if (
            exam.createdBy.toString() !==
            req.user.userId
        ) {
            return res.status(403).json({
                message:
                    "You cannot delete this question"
            });
        }

        // Delete question
        await Question.findByIdAndDelete(
            questionId
        );

        // Update exam total marks
        await updateExamTotalMarks(
            question.exam
        );

        res.status(200).json({
            message:
                "Question deleted successfully"
        });

    } catch (error) {
        console.error(
            "Delete question error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// STUDENT - GET EXAM QUESTIONS
// ==========================================

const getStudentQuestions = async (
    req,
    res
) => {
    try {
        const { examId } = req.params;

        // Find exam
        const exam =
            await Exam.findById(examId);

        if (!exam) {
            return res.status(404).json({
                message:
                    "Exam not found"
            });
        }

        // Only published exams
        if (
            exam.status !== "published"
        ) {
            return res.status(403).json({
                message:
                    "This exam is not available"
            });
        }

        // =========================
        // Check exam time
        // =========================

        const now = new Date();

        if (
            now < new Date(
                exam.startDate
            )
        ) {
            return res.status(403).json({
                message:
                    "This exam has not started yet",
                startDate:
                    exam.startDate
            });
        }

        if (
            now > new Date(
                exam.endDate
            )
        ) {
            return res.status(403).json({
                message:
                    "This exam has ended",
                endDate:
                    exam.endDate
            });
        }

        // =========================
        // Get questions
        // =========================

        // IMPORTANT:
        // correctAnswer is NOT
        // sent to student

        const questions =
            await Question.find({
                exam: examId
            })
                .select(
                    "-correctAnswer"
                )
                .sort({
                    createdAt: 1
                });

        res.status(200).json({
            exam: {
                id: exam._id,
                title: exam.title,
                description:
                    exam.description,
                duration:
                    exam.duration,
                totalMarks:
                    exam.totalMarks,
                startDate:
                    exam.startDate,
                endDate:
                    exam.endDate
            },

            questions
        });

    } catch (error) {
        console.error(
            "Get student questions error:",
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
    createQuestion,
    getQuestionsByExam,
    updateQuestion,
    deleteQuestion,
    getStudentQuestions
};