const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const questionController =
    require("../controllers/questionController");

console.log(
    "Question controller:",
    questionController
);

console.log(
    "Protect middleware type:",
    typeof protect
);

// ==========================================
// ADMIN - CREATE QUESTION
// ==========================================

router.post(
    "/",
    protect,
    questionController.createQuestion
);

// ==========================================
// ADMIN - GET QUESTIONS FOR EXAM
// ==========================================

router.get(
    "/exam/:examId",
    protect,
    questionController.getQuestionsByExam
);

// ==========================================
// ADMIN - UPDATE QUESTION
// ==========================================

router.put(
    "/:questionId",
    protect,
    questionController.updateQuestion
);

// ==========================================
// ADMIN - DELETE QUESTION
// ==========================================

router.delete(
    "/:questionId",
    protect,
    questionController.deleteQuestion
);

// ==========================================
// STUDENT - GET EXAM QUESTIONS
// ==========================================

router.get(
    "/student/:examId",
    protect,
    questionController.getStudentQuestions
);

module.exports = router;