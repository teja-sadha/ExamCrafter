const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
    {
        exam: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam",
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
            required: true,
            validate: {
                validator: function (value) {
                    return value.length === 4;
                },
                message:
                    "A question must have exactly 4 options"
            }
        },

        // =========================
        // Correct Answer
        // =========================

        correctAnswer: {
            type: String,
            required: true
        },

        // =========================
        // Marks
        // =========================

        marks: {
            type: Number,
            required: true,
            min: 1
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