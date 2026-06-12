# IntellMeet — AI-Powered Meeting Platform

> An AI-powered enterprise meeting and collaboration platform that automates transcription, generates smart summaries, tracks action items, and keeps your team aligned — all in real time.

---

## ✨ Features

- 🤖 **AI Meeting Summaries** — Auto-generated bullet-point summaries after every meeting
- 📋 **Action Item Tracking** — AI detects and assigns tasks from conversation in real time
- 🎙️ **Live Transcription** — Real-time speech-to-text with speaker identification
- 📊 **Dashboard Analytics** — Meeting stats, time saved, and team activity at a glance
- 🗂️ **Kanban Task Board** — Drag-and-drop task management linked to meetings
- 🔴 **Live Meeting Room** — Full video/audio controls, live chat, and AI assist panel

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Language | TypeScript |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation & Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/IntellMeet.git
cd IntellMeet

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be running at **http://localhost:5173**

### Demo Login
```
Email:    demo@intellmeet.ai
Password: demo123
```

---

## 📁 Project Structure

```
src/
├── App.tsx                  # Router — all 5 routes
├── main.tsx                 # React entry point
├── index.css                # Global styles & animations
├── components/
│   └── Sidebar.tsx          # Shared navigation sidebar
└── pages/
    ├── LoginPage.tsx        # /login
    ├── DashboardPage.tsx    # /dashboard
    ├── MeetingPage.tsx      # /meeting/:id
    ├── PostMeetingPage.tsx  # /post-meeting/:id
    └── TasksPage.tsx        # /tasks
```

---

## 📸 Pages

| Page | Route | Description |
|---|---|---|
| Login | `/login` | Glassmorphism login with demo autofill |
| Dashboard | `/dashboard` | Stats, upcoming meetings, AI summary |
| Live Meeting | `/meeting/1` | Real-time room with timer, chat, controls |
| Post-Meeting | `/post-meeting/1` | AI summary, action items, transcript |
| Task Board | `/tasks` | Kanban board with inline task creation |

---

## 🏗️ Build for Production

```bash
npm run build
# Output goes to /dist — ready to deploy on Vercel, Netlify, or any static host
```

---

## 📄 License

MIT © 2026 IntellMeet
