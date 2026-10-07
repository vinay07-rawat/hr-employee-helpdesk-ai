const { understandHRQuery } = require("../services/nluService");
const { generateHRResponse } = require("../services/responseService");

const { getLeaveBalance } = require("../tools/leaveTools");
const { getPayslip } = require("../tools/payrollTools");
const { searchPolicy } = require("../tools/policyTools");
const { applyLeave } = require("../tools/leaveRequestTools");
const { getCurrentDateTime } = require("../tools/dateTools");

const CURRENT_EMPLOYEE_ID = "EMP102";

async function aiHrAgent(query) {
    const dateResult = getCurrentDateTime();

    const nlu = await understandHRQuery(
        query,
        dateResult.date
    );

    console.log("AI NLU:", nlu);

    let toolResult;

    if (nlu.intent === "GET_LEAVE_BALANCE") {
        const employeeId =
            nlu.employeeId || CURRENT_EMPLOYEE_ID;

        if (employeeId !== CURRENT_EMPLOYEE_ID) {
            toolResult = {
                success: false,
                message:
                    "For privacy and security, you can only view your own leave balance."
            };
        } else {
            toolResult = getLeaveBalance(employeeId);
        }
    }

    else if (nlu.intent === "GET_PAYSLIP") {
        const employeeId =
            nlu.employeeId || CURRENT_EMPLOYEE_ID;

        if (employeeId !== CURRENT_EMPLOYEE_ID) {
            toolResult = {
                success: false,
                message:
                    "For privacy and security, I cannot disclose another employee's salary or payslip."
            };
        }

        else if (!nlu.month) {
            toolResult = {
                success: false,
                message:
                    "Please specify the payslip month, for example September 2026."
            };
        }

        else {
            toolResult = getPayslip(
                employeeId,
                nlu.month
            );
        }
    }

    else if (nlu.intent === "SEARCH_POLICY") {
        const keyword =
            nlu.keyword || query;

        toolResult = searchPolicy(keyword);
    }

    else if (nlu.intent === "APPLY_LEAVE") {
        const employeeId =
            nlu.employeeId || CURRENT_EMPLOYEE_ID;

        if (employeeId !== CURRENT_EMPLOYEE_ID) {
            toolResult = {
                success: false,
                message:
                    "For privacy and security, you can only submit leave for your own employee account."
            };
        }

        else if (!nlu.fromDate || !nlu.toDate) {
            toolResult = {
                success: false,
                message:
                    "Please provide the leave dates."
            };
        }

        else {
            toolResult = applyLeave(
                employeeId,
                nlu.fromDate,
                nlu.toDate,
                nlu.reason || "Personal work"
            );
        }
    }

    else if (nlu.intent === "GET_CURRENT_DATETIME") {
        toolResult = getCurrentDateTime();
    }

    else {
        toolResult = {
            success: false,
            message:
                "Sorry, I could not understand your HR request. Please try again."
        };
    }

    // Generate the final natural-language response
    const responseText = await generateHRResponse(
        query,
        nlu.language,
        toolResult
    );

    return {
        ...toolResult,
        responseText
    };
}

module.exports = {
    aiHrAgent
};