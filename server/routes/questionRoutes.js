const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const questionController =
    require("../controllers/questionController");

// ==========================================
// ADMIN - CREATE QUESTION
// ==========================================

router.post(
    "/",
    protect,
    requireRole("admin"),
    questionController.createQuestion
);

// ==========================================
// ADMIN - GET QUESTIONS FOR EXAM
// ==========================================

router.get(
    "/exam/:examId",
    protect,
    requireRole("admin"),
    questionController.getQuestionsByExam
);

// ==========================================
// ADMIN - UPDATE QUESTION
// ==========================================

router.put(
    "/:questionId",
    protect,
    requireRole("admin"),
    questionController.updateQuestion
);

// ==========================================
// ADMIN - DELETE QUESTION
// ==========================================

router.delete(
    "/:questionId",
    protect,
    requireRole("admin"),
    questionController.deleteQuestion
);

// ==========================================
// STUDENT - GET EXAM QUESTIONS
// ==========================================

router.get(
    "/student/:examId",
    protect,
    requireRole("student"),
    questionController.getStudentQuestions
);

module.exports = router;