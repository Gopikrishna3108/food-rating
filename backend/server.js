require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Telegram Bot settings
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// Function to send message to Telegram
async function sendToTelegram(message) {
    if (!BOT_TOKEN || !CHAT_ID) {
        console.warn("Telegram BOT_TOKEN or CHAT_ID missing. Skipping Telegram notification.");
        return;
    }
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
            })
        });
        if (!response.ok) {
            console.error("Failed to send message to Telegram:", await response.text());
        }
    } catch (error) {
        console.error("Error sending to Telegram:", error);
    }
}

// API endpoint to receive ratings
app.post('/api/rate', (req, res) => {
    const { name, stars, experience } = req.body;

    // Validation
    if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Name is required' });
    }
    if (!stars || typeof stars !== 'number' || stars < 1 || stars > 5) {
        return res.status(400).json({ error: 'Stars must be a number between 1 and 5' });
    }

    const expText = experience ? experience.trim() : 'No comments provided.';

    // Insert into database
    const sql = `INSERT INTO ratings (name, stars, experience) VALUES (?, ?, ?)`;
    db.run(sql, [name.trim(), stars, expText], function (err) {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ error: 'Failed to save rating' });
        }

        // Successfully saved, now send to Telegram
        const telegramMessage = `🍔 New Food Rating Received!\n\n👤 Name: ${name.trim()}\n⭐ Stars: ${stars}/5\n💬 Experience: ${expText}`;
        sendToTelegram(telegramMessage);

        res.status(201).json({ message: 'Rating submitted successfully!', id: this.lastID });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
