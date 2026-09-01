const express = require("express");

const {
    registerUser,
    loginUser,
    getMe,
    createAdminUser,
    registerAdmin,
    adminTest,
    studentTest
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/admin/register", registerAdmin);

router.post("/login", loginUser);

router.post(
    "/admin/create",
    protect,
    requireRole("admin"),
    createAdminUser
);

router.get("/me", protect, getMe);

router.get(
    "/admin-test",
    protect,
    requireRole("admin"),
    adminTest
);

router.get(
    "/student-test",
    protect,
    requireRole("student"),
    studentTest
);

module.exports = router;