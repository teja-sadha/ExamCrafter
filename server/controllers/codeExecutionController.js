const {
    runCode
} = require(
    "../services/codeExecutionService"
);

const executeCode = async (
    req,
    res
) => {
    try {
        const {
            sourceCode,
            language,
            stdin
        } = req.body;

        if (
            !sourceCode ||
            !language
        ) {
            return res.status(400).json({
                message:
                    "Source code and language are required"
            });
        }

        const result =
            await runCode({
                sourceCode,
                language,
                stdin: stdin || ""
            });

        res.status(200).json({
            success: true,

            output:
                result.stdout || "",

            error:
                result.stderr ||
                result.compile_output ||
                result.message ||
                "",

            status:
                result.status?.description ||
                "Unknown",

            time:
                result.time || null,

            memory:
                result.memory || null
        });

    } catch (error) {
        console.error(
            "Code execution error:",
            error.response?.data ||
            error.message
        );

        res.status(500).json({
            success: false,
            message:
                "Code execution failed"
        });
    }
};

module.exports = {
    executeCode
};