const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
    {
        exam: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam",
            required: true
        },

        // =========================
        // Question Type
        // =========================

        type: {
            type: String,
            enum: ["mcq", "coding"],
            default: "mcq",
            required: true
        },

        // =========================
        // Section
        // =========================

        section: {
            type: String,
            required: true,
            trim: true
        },

        // =========================
        // Question
        // =========================

        question: {
            type: String,
            required: true,
            trim: true
        },

        // =========================
        // MCQ Options
        // =========================

        options: {
            type: [String],
            default: []
        },

        // =========================
        // MCQ Correct Answer
        // =========================

        correctAnswer: {
            type: String,
            default: null
        },

        // =========================
        // Coding Question
        // =========================

        inputDescription: {
            type: String,
            default: ""
        },

        outputDescription: {
            type: String,
            default: ""
        },

        constraints: {
            type: String,
            default: ""
        },

        sampleInput: {
            type: String,
            default: ""
        },

        sampleOutput: {
            type: String,
            default: ""
        },

        // =========================
        // Marks
        // =========================

        marks: {
            type: Number,
            required: true,
            min: 1
        },

        // =========================
        // Coding Limits
        // =========================

        timeLimit: {
            type: Number,
            default: 2,
            min: 1
        },

        memoryLimit: {
            type: Number,
            default: 128,
            min: 1
        },

        // =========================
        // Allowed Languages
        // =========================

        allowedLanguages: {
            type: [String],
            default: [
                "python",
                "java",
                "cpp"
            ]
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.model(
        "Question",
        questionSchema
    );