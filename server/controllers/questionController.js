const Question = require("../models/Question");
const Exam = require("../models/Exam");
const User = require("../models/User");
const { isStudentAllowedForExam, normalizeAllowedStudents } = require("./examController");

// ==========================================
// UPDATE EXAM TOTAL MARKS
// ==========================================

const updateExamTotalMarks = async (examId) => {
    const questions = await Question.find({
        exam: examId
    });

    const totalMarks = questions.reduce(
        (total, question) =>
            total +
            Number(question.marks || 0),
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
            type,
            section,
            question,
            options,
            correctAnswer,
            inputDescription,
            outputDescription,
            constraints,
            sampleInput,
            sampleOutput,
            marks,
            timeLimit,
            memoryLimit,
            allowedLanguages
        } = req.body;

        // =========================
        // Required fields
        // =========================

        if (
            !examId ||
            !section ||
            !question ||
            !marks
        ) {
            return res.status(400).json({
                message:
                    "Exam, section, question and marks are required"
            });
        }

        // =========================
        // Question Type
        // =========================

        const questionType =
            type || "mcq";

        if (
            !["mcq", "coding"].includes(
                questionType
            )
        ) {
            return res.status(400).json({
                message:
                    "Invalid question type"
            });
        }

        // =========================
        // Section validation
        // =========================

        if (
            typeof section !== "string" ||
            section.trim().length === 0
        ) {
            return res.status(400).json({
                message:
                    "Section name is required"
            });
        }

        // =========================
        // Marks validation
        // =========================

        if (Number(marks) <= 0) {
            return res.status(400).json({
                message:
                    "Marks must be greater than 0"
            });
        }

        // =========================
        // Find exam
        // =========================

        const exam =
            await Exam.findById(examId);

        if (!exam) {
            return res.status(404).json({
                message:
                    "Exam not found"
            });
        }

        // =========================
        // Ownership
        // =========================

        if (
            exam.createdBy.toString() !==
            req.user.userId
        ) {
            return res.status(403).json({
                message:
                    "You cannot add questions to this exam"
            });
        }

        // ==========================================
        // MCQ VALIDATION
        // ==========================================

        if (
            questionType === "mcq"
        ) {
            if (
                !Array.isArray(options) ||
                options.length !== 4
            ) {
                return res.status(400).json({
                    message:
                        "Exactly 4 options are required for MCQ"
                });
            }

            if (
                options.some(
                    (option) =>
                        !String(option).trim()
                )
            ) {
                return res.status(400).json({
                    message:
                        "All options are required"
                });
            }

            if (!correctAnswer) {
                return res.status(400).json({
                    message:
                        "Correct answer is required for MCQ"
                });
            }

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
        }

        // ==========================================
        // CODING VALIDATION
        // ==========================================

        if (
            questionType === "coding"
        ) {
            if (
                !inputDescription ||
                !outputDescription ||
                !sampleInput ||
                !sampleOutput
            ) {
                return res.status(400).json({
                    message:
                        "Input, output, sample input and sample output are required for coding questions"
                });
            }
        }

        // =========================
        // Create Question
        // =========================

        const newQuestion =
            await Question.create({
                exam: examId,

                type: questionType,

                section:
                    section.trim(),

                question:
                    question.trim(),

                options:
                    questionType === "mcq"
                        ? options
                        : [],

                correctAnswer:
                    questionType === "mcq"
                        ? correctAnswer
                        : null,

                inputDescription:
                    questionType === "coding"
                        ? inputDescription.trim()
                        : "",

                outputDescription:
                    questionType === "coding"
                        ? outputDescription.trim()
                        : "",

                constraints:
                    questionType === "coding"
                        ? constraints || ""
                        : "",

                sampleInput:
                    questionType === "coding"
                        ? sampleInput
                        : "",

                sampleOutput:
                    questionType === "coding"
                        ? sampleOutput
                        : "",

                marks:
                    Number(marks),

                timeLimit:
                    questionType === "coding"
                        ? Number(
                              timeLimit || 2
                          )
                        : 2,

                memoryLimit:
                    questionType === "coding"
                        ? Number(
                              memoryLimit || 128
                          )
                        : 128,

                allowedLanguages:
                    questionType === "coding"
                        ? (
                              Array.isArray(
                                  allowedLanguages
                              ) &&
                              allowedLanguages.length >
                                  0
                                  ? allowedLanguages
                                  : [
                                        "python",
                                        "java",
                                        "cpp"
                                    ]
                          )
                        : []
            });

        // =========================
        // Update Total Marks
        // =========================

        const totalMarks =
            await updateExamTotalMarks(
                examId
            );

        res.status(201).json({
            message:
                "Question created successfully",

            question:
                newQuestion,

            totalMarks
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
// ADMIN - GET QUESTIONS BY EXAM
// ==========================================

const getQuestionsByExam = async (
    req,
    res
) => {
    try {
        const { examId } =
            req.params;

        // =========================
        // Find exam
        // =========================

        const exam =
            await Exam.findById(examId);

        if (!exam) {
            return res.status(404).json({
                message:
                    "Exam not found"
            });
        }

        // =========================
        // Ownership
        // =========================

        if (
            exam.createdBy.toString() !==
            req.user.userId
        ) {
            return res.status(403).json({
                message:
                    "You cannot access this exam"
            });
        }

        // =========================
        // Get questions
        // =========================

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
            type,
            section,
            question,
            options,
            correctAnswer,
            inputDescription,
            outputDescription,
            constraints,
            sampleInput,
            sampleOutput,
            marks,
            timeLimit,
            memoryLimit,
            allowedLanguages
        } = req.body;

        // =========================
        // Find question
        // =========================

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

        // =========================
        // Find exam
        // =========================

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

        // =========================
        // Ownership
        // =========================

        if (
            exam.createdBy.toString() !==
            req.user.userId
        ) {
            return res.status(403).json({
                message:
                    "You cannot update this question"
            });
        }

        // =========================
        // Question Type
        // =========================

        const questionType =
            type ||
            existingQuestion.type ||
            "mcq";

        if (
            !["mcq", "coding"].includes(
                questionType
            )
        ) {
            return res.status(400).json({
                message:
                    "Invalid question type"
            });
        }

        // =========================
        // Basic Validation
        // =========================

        if (
            !section ||
            !question ||
            !marks
        ) {
            return res.status(400).json({
                message:
                    "Section, question and marks are required"
            });
        }

        if (Number(marks) <= 0) {
            return res.status(400).json({
                message:
                    "Marks must be greater than 0"
            });
        }

        // ==========================================
        // MCQ VALIDATION
        // ==========================================

        if (
            questionType === "mcq"
        ) {
            if (
                !Array.isArray(options) ||
                options.length !== 4
            ) {
                return res.status(400).json({
                    message:
                        "Exactly 4 options are required for MCQ"
                });
            }

            if (
                options.some(
                    (option) =>
                        !String(option).trim()
                )
            ) {
                return res.status(400).json({
                    message:
                        "All options are required"
                });
            }

            if (!correctAnswer) {
                return res.status(400).json({
                    message:
                        "Correct answer is required for MCQ"
                });
            }

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
        }

        // ==========================================
        // CODING VALIDATION
        // ==========================================

        if (
            questionType === "coding"
        ) {
            if (
                !inputDescription ||
                !outputDescription ||
                !sampleInput ||
                !sampleOutput
            ) {
                return res.status(400).json({
                    message:
                        "Input, output, sample input and sample output are required for coding questions"
                });
            }
        }

        // =========================
        // Update Common Fields
        // =========================

        existingQuestion.type =
            questionType;

        existingQuestion.section =
            section.trim();

        existingQuestion.question =
            question.trim();

        existingQuestion.marks =
            Number(marks);

        // =========================
        // Update MCQ
        // =========================

        if (
            questionType === "mcq"
        ) {
            existingQuestion.options =
                options;

            existingQuestion.correctAnswer =
                correctAnswer;

            existingQuestion.inputDescription =
                "";

            existingQuestion.outputDescription =
                "";

            existingQuestion.constraints =
                "";

            existingQuestion.sampleInput =
                "";

            existingQuestion.sampleOutput =
                "";

            existingQuestion.timeLimit =
                2;

            existingQuestion.memoryLimit =
                128;

            existingQuestion.allowedLanguages =
                [];
        }

        // =========================
        // Update Coding
        // =========================

        else {
            existingQuestion.options =
                [];

            existingQuestion.correctAnswer =
                null;

            existingQuestion.inputDescription =
                inputDescription.trim();

            existingQuestion.outputDescription =
                outputDescription.trim();

            existingQuestion.constraints =
                constraints || "";

            existingQuestion.sampleInput =
                sampleInput;

            existingQuestion.sampleOutput =
                sampleOutput;

            existingQuestion.timeLimit =
                Number(
                    timeLimit || 2
                );

            existingQuestion.memoryLimit =
                Number(
                    memoryLimit || 128
                );

            existingQuestion.allowedLanguages =
                (
                    Array.isArray(
                        allowedLanguages
                    ) &&
                    allowedLanguages.length >
                        0
                )
                    ? allowedLanguages
                    : [
                          "python",
                          "java",
                          "cpp"
                      ];
        }

        await existingQuestion.save();

        // =========================
        // Update Total Marks
        // =========================

        const totalMarks =
            await updateExamTotalMarks(
                existingQuestion.exam
            );

        res.status(200).json({
            message:
                "Question updated successfully",

            question:
                existingQuestion,

            totalMarks
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

        // =========================
        // Find question
        // =========================

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

        // =========================
        // Find exam
        // =========================

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

        // =========================
        // Ownership
        // =========================

        if (
            exam.createdBy.toString() !==
            req.user.userId
        ) {
            return res.status(403).json({
                message:
                    "You cannot delete this question"
            });
        }

        // =========================
        // Delete
        // =========================

        await Question.findByIdAndDelete(
            questionId
        );

        // =========================
        // Update total marks
        // =========================

        const totalMarks =
            await updateExamTotalMarks(
                question.exam
            );

        res.status(200).json({
            message:
                "Question deleted successfully",

            totalMarks
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
        const { examId } =
            req.params;

        // =========================
        // Find exam
        // =========================

        const exam =
            await Exam.findById(examId);

        if (!exam) {
            return res.status(404).json({
                message:
                    "Exam not found"
            });
        }

        // =========================
        // Published only
        // =========================

        if (
            exam.status !== "published"
        ) {
            return res.status(403).json({
                message:
                    "This exam is not available"
            });
        }

        const now = new Date();

        if (
            now <
            new Date(exam.startDate)
        ) {
            return res.status(403).json({
                message:
                    "This exam has not started yet",

                startDate:
                    exam.startDate
            });
        }

        if (
            now >
            new Date(exam.endDate)
        ) {
            return res.status(403).json({
                message:
                    "This exam has ended",

                endDate:
                    exam.endDate
            });
        }

        let studentEmail = req.user.email;

        if (!studentEmail) {
            const user = await User.findById(req.user.userId).select("email");
            studentEmail = user?.email;
        }

        if (
            !isStudentAllowedForExam(
                exam,
                studentEmail
            )
        ) {
            return res.status(403).json({
                message:
                    "You are not authorized to access this exam."
            });
        }

        // =========================
        // Don't send correctAnswer
        // to students
        // =========================

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

                title:
                    exam.title,

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