const { getLeaveBalance } = require("./tools/leaveTools");
const { getPayslip } = require("./tools/payrollTools");
const { searchPolicy } = require("./tools/policyTools");
const { applyLeave } = require("./tools/leaveRequestTools");
const { getCurrentDateTime } = require("./tools/dateTools");

console.log("===== LEAVE BALANCE =====");
console.log(getLeaveBalance("EMP102"));

console.log("\n===== PAYSLIP =====");
console.log(getPayslip("EMP102", "2026-09"));

console.log("\n===== POLICY SEARCH =====");
console.log(searchPolicy("notice period"));

console.log("\n===== CURRENT DATE/TIME =====");
console.log(getCurrentDateTime());