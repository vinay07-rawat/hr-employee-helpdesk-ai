const leaves = require("../data/leaves.json");

function getLeaveBalance(empId) {
  const employeeLeaves = leaves.filter(
    (leave) => leave.empId.toUpperCase() === empId.toUpperCase()
  );

  if (employeeLeaves.length === 0) {
    return {
      success: false,
      message: `No leave records found for employee ${empId}.`
    };
  }

  const balance = {};

  employeeLeaves.forEach((leave) => {
    balance[leave.type] = {
      total: leave.total,
      used: leave.used,
      remaining: leave.total - leave.used
    };
  });

  return {
    success: true,
    empId: empId.toUpperCase(),
    balance
  };
}

module.exports = {
  getLeaveBalance
};