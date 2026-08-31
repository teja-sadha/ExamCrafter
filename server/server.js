const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const examRoutes = require("./routes/examRoutes");
const questionRoutes = require("./routes/questionRoutes");
const resultRoutes = require("./routes/resultRoutes");
const codeExecutionRoutes =
    require("./routes/codeExecutionRoutes");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// =========================
// Connect to MongoDB
// =========================

connectDB();

// =========================
// Middleware
// =========================

app.use(
    cors({
        origin: true,
        credentials: true
    })
);

app.use(express.json());

// =========================
// Routes
// =========================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/results",
    resultRoutes
);

app.use(
    "/api/exams",
    examRoutes
);

app.use(
    "/api/questions",
    questionRoutes
);

// =========================
// Code Execution
// =========================

app.use(
    "/api/code",
    codeExecutionRoutes
);

// =========================
// Test Routes
// =========================

app.get("/", (req, res) => {
    res.send(
        "ExamCrafter Backend is Running"
    );
});

app.get("/api/test", (req, res) => {
    res.json({
        message:
            "Backend connection successful"
    });
});

// =========================
// Start Server
// =========================

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});