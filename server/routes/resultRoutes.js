const express = require("express");

const {
    submitExam,
    getMyResult,
    getMyResults,
    getAllResults,
    getResultsByExam,
    getAdminResultById
} = require("../controllers/resultController");

const protect = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// STUDENT - SUBMIT EXAM
// ==========================================

router.post(
    "/exam/:examId",
    protect,
    requireRole("student"),
    submitExam
);

// ==========================================
// STUDENT - GET RESULT FOR ONE EXAM
// ==========================================

router.get(
    "/exam/:examId",
    protect,
    requireRole("student"),
    getMyResult
);

// ==========================================
// STUDENT - GET ALL RESULTS
// ==========================================

router.get(
    "/",
    protect,
    requireRole("student"),
    getMyResults
);

router.get(
    "/admin",
    protect,
    requireRole("admin"),
    getAllResults
);

router.get(
    "/admin/exam/:examId",
    protect,
    requireRole("admin"),
    getResultsByExam
);

// ==========================================
// ADMIN - GET ONE RESULT
// ==========================================

router.get(
    "/admin/:resultId",
    protect,
    requireRole("admin"),
    getAdminResultById
);

module.exports = router;