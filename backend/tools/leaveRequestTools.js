const fs = require("fs");
const path = require("path");

const leaves = require("../data/leaves.json");
const leaveRequestsPath = path.join(
    __dirname,
    "../data/leaveRequests.json"
);

function applyLeave(empId, fromDate, toDate, reason) {
    const employeeId = empId.toUpperCase();

    // Check employee leave records
    const employeeLeaves = leaves.filter(
        (leave) => leave.empId.toUpperCase() === employeeId
    );

    if (employeeLeaves.length === 0) {
        return {
            success: false,
            message: `Employee ${employeeId} was not found.`
        };
    }

    // Validate dates
    const start = new Date(fromDate);
    const end = new Date(toDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return {
            success: false,
            message: "Invalid date format. Please use YYYY-MM-DD."
        };
    }

    if (end < start) {
        return {
            success: false,
            message: "To date cannot be earlier than from date."
        };
    }

    // Calculate number of calendar days
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const daysRequested =
        Math.floor((end - start) / millisecondsPerDay) + 1;

    // For this demo, use earned leave for the request
    const earnedLeave = employeeLeaves.find(
        (leave) => leave.type === "earned"
    );

    if (!earnedLeave) {
        return {
            success: false,
            message: "Earned leave balance was not found."
        };
    }

    const remaining = earnedLeave.total - earnedLeave.used;

    // Balance check
    if (daysRequested > remaining) {
        return {
            success: false,
            message: `Leave request refused. You requested ${daysRequested} days, but only ${remaining} earned leaves are available.`
        };
    }

    // Read existing requests
    const leaveRequests = JSON.parse(
        fs.readFileSync(leaveRequestsPath, "utf8")
    );

    // Generate request ID
    const requestId = `LR${String(leaveRequests.length + 1).padStart(3, "0")}`;

    const newRequest = {
        requestId,
        empId: employeeId,
        fromDate,
        toDate,
        reason,
        daysRequested,
        leaveType: "earned",
        status: "pending",
        appliedAt: new Date().toISOString()
    };

    leaveRequests.push(newRequest);

    // Save new request
    fs.writeFileSync(
        leaveRequestsPath,
        JSON.stringify(leaveRequests, null, 2)
    );

    return {
        success: true,
        message: "Leave request submitted successfully.",
        request: newRequest
    };
}

module.exports = {
    applyLeave
};