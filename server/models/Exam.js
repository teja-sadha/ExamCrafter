const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        duration: {
            type: Number,
            required: true,
            min: 1
        },

        totalMarks: {
            type: Number,
            required: true,
            min: 1
        },

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: ["draft", "published", "completed"],
            default: "draft"
        },

        allowedStudents: {
            type: [String],
            default: []
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

examSchema.pre("save", function () {
    if (Array.isArray(this.allowedStudents)) {
        this.allowedStudents = this.allowedStudents
            .map((email) => String(email).trim().toLowerCase())
            .filter(Boolean);
    }
});

module.exports = mongoose.model("Exam", examSchema);