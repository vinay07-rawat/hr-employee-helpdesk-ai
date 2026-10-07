const { askGroq } = require("./groqService");

async function understandHRQuery(query, currentDate) {
    const prompt = `
You are the Natural Language Understanding engine for an HR Employee Helpdesk.

Today's date is ${currentDate}.

Understand the employee's request. The employee may speak English, Hindi, Hinglish, Marathi, Kannada, or mixed languages.

Return ONLY valid JSON. No markdown. No explanation.

Allowed intents:
- GET_LEAVE_BALANCE
- GET_PAYSLIP
- SEARCH_POLICY
- APPLY_LEAVE
- GET_CURRENT_DATETIME
- UNKNOWN

JSON format:
{
  "intent": "",
  "employeeId": null,
  "leaveType": null,
  "fromDate": null,
  "toDate": null,
  "month": null,
  "reason": null,
  "keyword": null,
  "language": ""
}

Rules:
1. If the user says "my", "meri", "mere", "mujhe", etc., employeeId should be null.
2. If an employee ID such as EMP103 is explicitly mentioned, extract it.
3. Leave types can be casual, sick, or earned.
4. Convert relative dates such as "next Monday", "kal", "tomorrow" into YYYY-MM-DD using today's date.
5. Convert months such as "September 2026" into YYYY-MM.
6. For policy questions, put the main search topic in keyword.
7. Never invent an employee ID.
8. If the request is unclear, use UNKNOWN.
9. language should contain the main language used by the employee.

Employee request:
${query}
`;

    const result = await askGroq(prompt);

    try {
        const cleaned = result
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleaned);
    } catch (error) {
        return {
            intent: "UNKNOWN",
            employeeId: null,
            leaveType: null,
            fromDate: null,
            toDate: null,
            month: null,
            reason: null,
            keyword: null,
            language: "unknown",
            parseError: true,
            rawResponse: result
        };
    }
}

module.exports = {
    understandHRQuery
};