const API_URL = "/api/hr";

const queryInput = document.getElementById("queryInput");
const sendBtn = document.getElementById("sendBtn");
const chatArea = document.getElementById("chatArea");


// =========================
// SEND QUERY
// =========================

async function sendQuery() {
    const query = queryInput.value.trim();

    if (!query) return;

    addMessage(query, "user");

    queryInput.value = "";

    showTyping();

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: query
            })
        });

        const data = await response.json();

        removeTyping();

        displayResponse(data);

    } catch (error) {
        removeTyping();

        addMessage(
            "Unable to connect to the HR Helpdesk server. Please make sure the backend server is running.",
            "bot"
        );

        console.error(error);
    }
}


// =========================
// QUICK ACTION BUTTONS
// =========================

function quickQuery(query) {
    queryInput.value = query;
    sendQuery();
}


// =========================
// SAFE HTML ESCAPE
// =========================

function escapeHTML(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// =========================
// FORMAT AI RESPONSE
// =========================

function formatMessage(message) {

    if (message === null || message === undefined) {
        return "";
    }

    let formatted = String(message);

    // Escape HTML first for safety
    formatted = escapeHTML(formatted);

    // Convert **bold text** into real bold formatting
    formatted = formatted.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
    );

    // Convert line breaks into HTML line breaks
    formatted = formatted.replace(/\n/g, "<br>");

    return formatted;
}


// =========================
// ADD MESSAGE TO CHAT
// =========================

function addMessage(message, type) {

    const messageDiv = document.createElement("div");

    messageDiv.className = `message ${type}`;

    const bubble = document.createElement("div");

    // IMPORTANT:
    // CSS already uses .message-content
    bubble.className = "message-content";

    // Render formatted text safely
    bubble.innerHTML = formatMessage(message);

    messageDiv.appendChild(bubble);

    chatArea.appendChild(messageDiv);

    scrollToBottom();
}


// =========================
// DISPLAY AI RESPONSE
// =========================

function displayResponse(data) {

    if (!data) {

        addMessage(
            "Sorry, I didn't receive a response.",
            "bot"
        );

        return;
    }


    // =========================
    // AI NATURAL-LANGUAGE RESPONSE
    // =========================

    if (data.responseText) {

        addMessage(
            data.responseText,
            "bot"
        );

        return;
    }


    // =========================
    // ERROR RESPONSE
    // =========================

    if (data.success === false) {

        addMessage(
            "⚠️ " + data.message,
            "bot"
        );

        return;
    }


    // =========================
    // LEAVE BALANCE
    // =========================

    if (data.balance) {

        let message =
            "📊 Leave Balance\n\n";

        Object.entries(data.balance).forEach(
            ([type, value]) => {

                const label =
                    type.charAt(0).toUpperCase() +
                    type.slice(1);

                message +=
                    `${label}: ${value.remaining} remaining ` +
                    `(Used: ${value.used}/${value.total})\n`;
            }
        );

        addMessage(
            message,
            "bot"
        );

        return;
    }


    // =========================
    // PAYSLIP
    // =========================

    if (data.payslip) {

        const p = data.payslip;

        const message =
`💰 Payslip

Employee: ${p.empId}
Month: ${p.month}

Basic Salary: ₹${p.basic.toLocaleString("en-IN")}
HRA: ₹${p.hra.toLocaleString("en-IN")}
Deductions: ₹${p.deductions.toLocaleString("en-IN")}

Net Pay: ₹${p.netPay.toLocaleString("en-IN")}`;

        addMessage(
            message,
            "bot"
        );

        return;
    }


    // =========================
    // COMPANY POLICIES
    // =========================

    if (data.results) {

        if (data.results.length === 0) {

            addMessage(
                "📋 No matching company policy found.",
                "bot"
            );

            return;
        }

        let message =
            "📋 Company Policy\n\n";

        data.results.forEach(
            (policy, index) => {

                message +=
`${index + 1}. ${policy.title}

${policy.content}

`;
            }
        );

        addMessage(
            message,
            "bot"
        );

        return;
    }


    // =========================
    // LEAVE REQUEST
    // =========================

    if (data.request) {

        const r = data.request;

        const message =
`✅ Leave request submitted successfully.

Request ID: ${r.requestId}
Employee: ${r.empId}
From: ${r.fromDate}
To: ${r.toDate}
Days: ${r.daysRequested}
Reason: ${r.reason}
Status: ${r.status}`;

        addMessage(
            message,
            "bot"
        );

        return;
    }


    // =========================
    // CURRENT DATE & TIME
    // =========================

    if (data.currentDateTime) {

        const message =
`🕐 Current Date & Time

Date: ${data.date}
Day: ${data.day}
Timezone: ${data.timezone}
Time: ${new Date(
    data.currentDateTime
).toLocaleTimeString("en-IN")}`;

        addMessage(
            message,
            "bot"
        );

        return;
    }


    // =========================
    // GENERIC MESSAGE
    // =========================

    if (data.message) {

        addMessage(
            data.message,
            "bot"
        );

        return;
    }


    // =========================
    // FALLBACK
    // =========================

    addMessage(
        JSON.stringify(data, null, 2),
        "bot"
    );
}


// =========================
// TYPING INDICATOR
// =========================

function showTyping() {

    const typing =
        document.createElement("div");

    typing.id = "typing";

    typing.className =
        "message bot";

    const bubble =
        document.createElement("div");

    bubble.className =
        "message-content";

    bubble.textContent =
        "🤖 Thinking...";

    typing.appendChild(bubble);

    chatArea.appendChild(typing);

    scrollToBottom();
}


// =========================
// REMOVE TYPING INDICATOR
// =========================

function removeTyping() {

    const typing =
        document.getElementById("typing");

    if (typing) {
        typing.remove();
    }
}


// =========================
// SCROLL CHAT
// =========================

function scrollToBottom() {

    chatArea.scrollTop =
        chatArea.scrollHeight;
}


// =========================
// ENTER KEY SUPPORT
// =========================

queryInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            sendQuery();
        }
    }
);