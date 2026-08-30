const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        exam: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam",
            required: true
        },

        score: {
            type: Number,
            required: true,
            default: 0
        },

        totalMarks: {
            type: Number,
            required: true,
            default: 0
        },

        percentage: {
            type: Number,
            required: true,
            default: 0
        },

        correctAnswers: {
            type: Number,
            required: true,
            default: 0
        },

        wrongAnswers: {
            type: Number,
            required: true,
            default: 0
        },

        unanswered: {
            type: Number,
            required: true,
            default: 0
        },

        answers: {
            type: Map,
            of: String,
            default: {}
        },

        submittedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

resultSchema.index(
    {
        student: 1,
        exam: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model(
    "Result",
    resultSchema
);