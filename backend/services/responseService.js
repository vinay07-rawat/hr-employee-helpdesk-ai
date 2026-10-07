const { askGroq } = require("./groqService");

async function generateHRResponse(query, language, toolResult) {
    const prompt = `
You are the final response generator for an HR Employee Helpdesk.

The employee's original request:
${query}

Detected language:
${language || "English"}

HR tool result:
${JSON.stringify(toolResult, null, 2)}

Your job is to convert the HR tool result into a clear, professional and helpful response.

Rules:
1. Use ONLY the information present in the HR tool result.
2. Never invent salary, leave balance, dates, policies, employee IDs, or other facts.
3. Exact numbers from the tool result must remain exactly the same.
4. If the detected language is Hindi, respond in natural Hindi/Hinglish.
5. If the detected language is Marathi, respond in Marathi.
6. If the detected language is Kannada, respond in Kannada.
7. Otherwise respond in professional English.
8. Keep the response concise and easy to read.
9. For salary information, never reveal another employee's private salary.
10. If the tool result contains a privacy/security refusal, preserve that refusal clearly.
11. If a leave request was successfully submitted, clearly show the request ID, dates, number of days and status.
12. If a policy was found, explain the relevant policy clearly without changing its meaning.
13. Do not mention AI, Groq, NLU, tools, JSON, backend, or internal systems.
14. Return ONLY the final response text. No markdown code block.

Generate the final HR response now.
`;

    try {
        return await askGroq(prompt);
    } catch (error) {
        console.error("Response generation error:", error);

        if (toolResult.success === false) {
            return toolResult.message;
        }

        return "Your request was processed successfully.";
    }
}

module.exports = {
    generateHRResponse
};