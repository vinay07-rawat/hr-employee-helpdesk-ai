const { getLeaveBalance } = require("../tools/leaveTools");
const { getPayslip } = require("../tools/payrollTools");
const { searchPolicy } = require("../tools/policyTools");
const { applyLeave } = require("../tools/leaveRequestTools");
const { getCurrentDateTime } = require("../tools/dateTools");

// Demo current employee
// Later this will come from login/authentication.
const CURRENT_EMPLOYEE_ID = "EMP102";

function hrAgent(query) {
    const text = query.toLowerCase();

    // ==========================================
    // 1. APPLY LEAVE
    // ==========================================
    if (
        text.includes("apply leave") ||
        text.includes("apply for leave") ||
        text.includes("leave request") ||
        text.includes("chhutti chahiye") ||
        text.includes("leave lena") ||
        text.includes("leave apply")
    ) {
        const empMatch = query.match(/EMP\d+/i);

        if (!empMatch) {
            return {
                success: false,
                message: "Please provide your employee ID, for example EMP102."
            };
        }

        const requestedEmployee = empMatch[0].toUpperCase();

        // Privacy check
        if (requestedEmployee !== CURRENT_EMPLOYEE_ID) {
            return {
                success: false,
                message: "For privacy and security, you can only submit leave requests for your own employee account."
            };
        }

        const dates = query.match(/\d{4}-\d{2}-\d{2}/g);

        if (!dates || dates.length < 2) {
            return {
                success: false,
                message:
                    "Please provide from date and to date in YYYY-MM-DD format."
            };
        }

        const fromDate = dates[0];
        const toDate = dates[1];

        let reason = "Personal work";

        const reasonMatch = query.match(
            /(?:reason|because|for)\s*[:\-]?\s*(.+)$/i
        );

        if (reasonMatch) {
            reason = reasonMatch[1].trim();
        }

        return applyLeave(
            requestedEmployee,
            fromDate,
            toDate,
            reason
        );
    }

    // ==========================================
    // 2. LEAVE BALANCE
    // ==========================================
    if (
        text.includes("leave balance") ||
        (text.includes("leave") && text.includes("balance")) ||
        text.includes("chhutti") ||
        text.includes("छुट्टी")
    ) {
        const empMatch = query.match(/EMP\d+/i);

        if (!empMatch) {
            return {
                success: false,
                message: "Please provide your employee ID, for example EMP102."
            };
        }

        const requestedEmployee = empMatch[0].toUpperCase();

        if (requestedEmployee !== CURRENT_EMPLOYEE_ID) {
            return {
                success: false,
                message: "For privacy and security, you can only view your own leave balance."
            };
        }

        return getLeaveBalance(requestedEmployee);
    }

    // ==========================================
    // 3. PAYSLIP
    // ==========================================
    if (
        text.includes("payslip") ||
        text.includes("pay slip") ||
        text.includes("salary breakup") ||
        text.includes("salary details") ||
        text.includes("salary")
    ) {
        const empMatch = query.match(/EMP\d+/i);

        if (!empMatch) {
            return {
                success: false,
                message: "Please provide your employee ID."
            };
        }

        const requestedEmployee = empMatch[0].toUpperCase();

        // IMPORTANT PRIVACY GUARDRAIL
        if (requestedEmployee !== CURRENT_EMPLOYEE_ID) {
            return {
                success: false,
                message: "For privacy and security, I cannot disclose another employee's salary or payslip."
            };
        }

        let month = null;

        const monthMatch = query.match(/20\d{2}-\d{2}/);

        if (monthMatch) {
            month = monthMatch[0];
        }

        if (!month) {
            if (text.includes("september")) {
                month = "2026-09";
            } else if (text.includes("august")) {
                month = "2026-08";
            }
        }

        if (!month) {
            return {
                success: false,
                message:
                    "Please provide the month, for example September 2026 or 2026-09."
            };
        }

        return getPayslip(requestedEmployee, month);
    }

    // ==========================================
    // 4. POLICY SEARCH
    // ==========================================
    if (
        text.includes("policy") ||
        text.includes("notice period") ||
        text.includes("work from home") ||
        text.includes("wfh") ||
        text.includes("carry forward") ||
        text.includes("leave application") ||
        text.includes("salary policy")
    ) {
        let keyword = query;

        if (text.includes("notice period")) {
            keyword = "notice period";
        } else if (
            text.includes("work from home") ||
            text.includes("wfh")
        ) {
            keyword = "work from home";
        } else if (text.includes("carry forward")) {
            keyword = "carry forward";
        } else if (text.includes("leave application")) {
            keyword = "leave application";
        } else if (text.includes("salary policy")) {
            keyword = "salary";
        }

        return searchPolicy(keyword);
    }

    // ==========================================
    // 5. CURRENT DATE / TIME
    // ==========================================
    if (
        text.includes("today") ||
        text.includes("aaj") ||
        text.includes("current date") ||
        text.includes("current time") ||
        text.includes("date and time") ||
        text.includes("what date") ||
        text.includes("what time") ||
        text.includes("date")
    ) {
        return getCurrentDateTime();
    }

    // ==========================================
    // 6. UNKNOWN QUERY
    // ==========================================
    return {
        success: false,
        message: "Sorry, I could not understand your HR request."
    };
}

module.exports = {
    hrAgent
};