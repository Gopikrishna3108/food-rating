require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Telegram Bot settings
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// Function to send message to Telegram
function sendToTelegram(message) {
    if (!BOT_TOKEN || !CHAT_ID) {
        console.warn("Telegram BOT_TOKEN or CHAT_ID missing. Did you add them in Render Environment Variables?");
        return;
    }

    const data = JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
    });

    const options = {
        hostname: 'api.telegram.org',
        port: 443,
        path: `/bot${BOT_TOKEN}/sendMessage`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = https.request(options, (res) => {
        if (res.statusCode !== 200) {
            console.error(`Failed to send message to Telegram. Status Code: ${res.statusCode}`);
        }
    });

    req.on('error', (error) => {
        console.error("Error sending to Telegram:", error);
    });

    req.write(data);
    req.end();
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
