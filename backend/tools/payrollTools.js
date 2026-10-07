const payroll = require("../data/payroll.json");

function getPayslip(empId, month) {
    const employeeId = empId.toUpperCase();

    const payslip = payroll.find(
        (record) =>
            record.empId.toUpperCase() === employeeId &&
            record.month === month
    );

    if (!payslip) {
        return {
            success: false,
            message: "Payslip not found for this employee and month."
        };
    }

    return {
        success: true,
        payslip
    };
}

module.exports = {
    getPayslip
};