function getCurrentDateTime() {
    const now = new Date();

    return {
        success: true,
        currentDateTime: now.toISOString(),
        date: now.toISOString().split("T")[0],
        day: now.toLocaleDateString("en-US", {
            weekday: "long",
            timeZone: "Asia/Kolkata"
        }),
        timezone: "Asia/Kolkata"
    };
}

module.exports = {
    getCurrentDateTime
};