const API_URL = "/api/hr";

const queryInput = document.getElementById("queryInput");
const sendBtn = document.getElementById("sendBtn");
const chatArea = document.getElementById("chatArea");

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


// Quick action buttons
function quickQuery(query) {
    queryInput.value = query;
    sendQuery();
}


// Add message to chat
function addMessage(message, type) {
    const messageDiv = document.createElement("div");

    messageDiv.className = `message ${type}`;

    const bubble = document.createElement("div");

    bubble.className = "message-bubble";

    bubble.textContent = message;

    messageDiv.appendChild(bubble);

    chatArea.appendChild(messageDiv);

    scrollToBottom();
}


// Display AI response
function displayResponse(data) {

    if (!data) {
        addMessage(
            "Sorry, I didn't receive a response.",
            "bot"
        );
        return;
    }


    // ⭐ NEW AI RESPONSE
    // If AI generated a natural-language response,
    // show that instead of formatting raw tool data.
    if (data.responseText) {
        addMessage(
            data.responseText,
            "bot"
        );

        return;
    }


    // Error response
    if (data.success === false) {
        addMessage(
            "⚠️ " + data.message,
            "bot"
        );

        return;
    }


    // Leave Balance
    if (data.balance) {

        let message = "📊 Leave Balance\n\n";

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


    // Payslip
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


    // Company Policies
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


    // Leave Request
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


    // Current Date & Time
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


    // Generic message
    if (data.message) {

        addMessage(
            data.message,
            "bot"
        );

        return;
    }


    // Fallback
    addMessage(
        JSON.stringify(data, null, 2),
        "bot"
    );
}


// Typing indicator
function showTyping() {

    const typing =
        document.createElement("div");

    typing.id = "typing";

    typing.className =
        "message bot";

    typing.innerHTML =
        `<div class="message-bubble">
            🤖 Thinking...
        </div>`;

    chatArea.appendChild(typing);

    scrollToBottom();
}


// Remove typing indicator
function removeTyping() {

    const typing =
        document.getElementById("typing");

    if (typing) {
        typing.remove();
    }
}


// Scroll chat to bottom
function scrollToBottom() {

    chatArea.scrollTop =
        chatArea.scrollHeight;
}


// Enter key support
queryInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            sendQuery();
        }
    }
);