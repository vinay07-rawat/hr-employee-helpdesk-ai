const express = require("express");
const cors = require("cors");
const path = require("path");

const { hrAgent } = require("./agent/hrAgent");
const { aiHrAgent } = require("./agent/aiHrAgent");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "HR Employee Helpdesk API is running."
    });
});

// HR Agent endpoint
app.post("/api/hr", async (req, res) => {
    try {
        const { query } = req.body;

        if (!query || typeof query !== "string") {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid HR query."
            });
        }

        const result = await aiHrAgent(query);

        res.json(result);

    } catch (error) {
        console.error("AI HR Agent Error:", error);

        // Fallback to old rule-based agent
        try {
            const fallbackResult = hrAgent(query);
            res.json(fallbackResult);
        } catch (fallbackError) {
            res.status(500).json({
                success: false,
                message: "Internal server error."
            });
        }
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`HR Employee Helpdesk API running on http://localhost:${PORT}`);
});