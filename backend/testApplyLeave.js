const { applyLeave } = require("./tools/leaveRequestTools");

console.log("===== TEST 1: VALID LEAVE REQUEST =====");

const result1 = applyLeave(
    "EMP102",
    "2026-10-12",
    "2026-10-14",
    "Personal work"
);

console.log(result1);


console.log("\n===== TEST 2: INSUFFICIENT LEAVE BALANCE =====");

const result2 = applyLeave(
    "EMP102",
    "2026-10-15",
    "2026-10-30",
    "Long vacation"
);

console.log(result2);