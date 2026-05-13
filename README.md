# Food Rating App

A full-stack web application built with vanilla HTML/CSS/JS on the frontend and Node.js/Express + SQLite on the backend. It includes a Telegram Bot integration to send notifications upon form submission.

## Directory Structure

- `/frontend` - HTML, CSS, JavaScript (Static files)
- `/backend` - Node.js Express server, SQLite database, and `.env`

## Local Setup Instructions

### 1. Backend Setup

1. Open your terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure you have your Telegram credentials in a `.env` file inside the `backend` directory:
   ```
   PORT=3000
   BOT_TOKEN=your_bot_token
   CHAT_ID=your_chat_id
   ```

4. Start the server:
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:3000`. It will automatically create an SQLite database file `ratings.db` upon starting.

### 2. Frontend Setup

1. You can simply open `frontend/index.html` directly in your browser.
2. Or you can serve it via a simple HTTP server (e.g., using `Live Server` in VS Code, or Python: `python -m http.server 8000` inside the `frontend` folder).

## Deployment

### Frontend (Netlify / Vercel)
1. Push your repository to GitHub.
2. Go to Vercel or Netlify and import your repository.
3. Set the Root Directory to `frontend`.
4. Deploy! No build commands are necessary.
*(Note: Be sure to update the `fetch` URL in `script.js` to point to your live backend URL instead of localhost).*

### Backend (Render / Railway)
1. Push your repository to GitHub.
2. Create a new Web Service on Render or Railway.
3. Set the Root Directory to `backend`.
4. Build command: `npm install`
5. Start command: `npm start`
6. Important: Add the Environment Variables (`BOT_TOKEN` and `CHAT_ID`) in your Render/Railway dashboard.
