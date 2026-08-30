const axios = require("axios");

const JUDGE0_URL =
    process.env.JUDGE0_URL ||
    "https://ce.judge0.com";

const LANGUAGE_IDS = {
    c: 50,
    cpp: 54,
    java: 62,
    python: 71
};

const runCode = async ({
    sourceCode,
    language,
    stdin = "",
    expectedOutput = null
}) => {
    const languageId =
        LANGUAGE_IDS[language];

    if (!languageId) {
        throw new Error(
            `Unsupported language: ${language}`
        );
    }

    const submission = {
        source_code: sourceCode,
        language_id: languageId,
        stdin,

        cpu_time_limit: 2,
        wall_time_limit: 5,
        memory_limit: 128000
    };

    if (expectedOutput !== null) {
        submission.expected_output =
            expectedOutput;
    }

    const response =
        await axios.post(
            `${JUDGE0_URL}/submissions`,
            submission,
            {
                params: {
                    base64_encoded: false,
                    wait: true
                },
                headers: {
                    "Content-Type":
                        "application/json"
                },
                timeout: 15000
            }
        );

    return response.data;
};

module.exports = {
    runCode
};