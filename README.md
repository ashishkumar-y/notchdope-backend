# Notchdop Backend

This is the backend for the Notchdop project. Built with Node.js and Express, it provides endpoints to fetch video details and download videos using [yt-dlp](https://github.com/yt-dlp/yt-dlp).

---

## 🚀 Features

- Fetch YouTube video info
- Download MP4 video with audio
- Filter formats by compatibility (QuickTime-safe)
- Auto-delete files after sending
- CORS and compression enabled
- Rate limiting for safety

---

## 🛠 Tech Stack

- Node.js
- Express.js
- yt-dlp (external tool)
- CORS, Helmet, Morgan, Rate Limiter

---

## 🧪 API Endpoints

### GET `/api/get-video-info/:videoUrl`
Returns info about the video including formats.

**Example:**  
`/api/get-video-info/https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DdQw4w9WgXcQ`

---

### GET `/api/download/:videoUrl/:quality`
Downloads a video at the selected quality.

**Example:**  
`/api/download/https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DdQw4w9WgXcQ/720`

---

## ⚙️ Setup

```bash
git clone https://github.com/ashishkumar-y/notchdope-backend.git
cd notchdope-backend
npm install
cp .env.example .env
node index.js
