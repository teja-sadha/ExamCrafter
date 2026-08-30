const express = require("express");

const router = express.Router();

const {
    createExam,
    getAdminExams,
    updateExam,
    deleteExam,
    getPublishedExams
} = require("../controllers/examController");

const protect = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

// Admin: Create exam
router.post(
    "/",
    protect,
    requireRole("admin"),
    createExam
);

// Admin: Get own exams
router.get(
    "/",
    protect,
    requireRole("admin"),
    getAdminExams
);

// Student: Get published exams
router.get(
    "/published",
    protect,
    requireRole("student"),
    getPublishedExams
);

router.put(
    "/:examId",
    protect,
    requireRole("admin"),
    updateExam
);
// ==========================================
// ADMIN - DELETE EXAM
// ==========================================

router.delete(
    "/:examId",
    protect,
    requireRole("admin"),
    deleteExam
);

module.exports = router;