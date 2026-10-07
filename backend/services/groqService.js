const Groq = require("groq-sdk");
const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, "../.env")
});

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function askGroq(message) {
    const response = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [
            {
                role: "user",
                content: message
            }
        ],
        temperature: 0.2
    });

    return response.choices[0].message.content;
}

module.exports = {
    askGroq
};