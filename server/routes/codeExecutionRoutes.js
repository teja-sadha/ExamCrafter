const express = require("express");

const {
    executeCode
} = require("../controllers/codeExecutionController");

const router = express.Router();

router.post(
    "/run",
    executeCode
);

module.exports = router;