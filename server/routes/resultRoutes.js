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

const router = express.Router();

// ==========================================
// STUDENT - SUBMIT EXAM
// ==========================================

router.post(
    "/exam/:examId",
    protect,
    submitExam
);

// ==========================================
// STUDENT - GET RESULT FOR ONE EXAM
// ==========================================

router.get(
    "/exam/:examId",
    protect,
    getMyResult
);

// ==========================================
// STUDENT - GET ALL RESULTS
// ==========================================

router.get(
    "/",
    protect,
    getMyResults
);
router.get(
    "/admin",
    protect,
    getAllResults
);

router.get(
    "/admin/exam/:examId",
    protect,
    getResultsByExam
);
// ==========================================
// ADMIN - GET ONE RESULT
// ==========================================

router.get(
    "/admin/:resultId",
    protect,
    getAdminResultById
);
module.exports = router;