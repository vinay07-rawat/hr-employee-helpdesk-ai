const { hrAgent } = require("./agent/hrAgent");

console.log("===== TEST 1: LEAVE BALANCE =====");
console.log(
    hrAgent("EMP102 ka leave balance batao")
);

console.log("\n===== TEST 2: PAYSLIP =====");
console.log(
    hrAgent("EMP102 ki September 2026 payslip dikhao")
);

console.log("\n===== TEST 3: POLICY =====");
console.log(
    hrAgent("notice period policy kya hai?")
);

console.log("\n===== TEST 4: DATE =====");
console.log(
    hrAgent("aaj ki date kya hai?")
);