# Daily To-Do App

A clean, production-grade To-Do web app built with plain HTML, CSS, and JavaScript — no frameworks, no build tools.

## Features

- **Add tasks** — type and press Enter or click "Add Task"
- **Pending Tasks** — all incomplete tasks shown with timestamp of when they were added
- **Completed Tasks** — completed tasks move here with a completion timestamp
- **Edit tasks** — click the pen icon to edit any task via a modal
- **Delete tasks** — click the trash icon on any task
- **Mark complete / undo** — click the circle to toggle between pending and completed
- **Clear all completed** — bulk-delete all completed tasks at once
- **Date & Time** — every task shows when it was added; completed tasks also show when completed
- **Persistent storage** — tasks saved to `localStorage` so they survive page refreshes
- **Responsive** — works on mobile and desktop

## Folder Structure

```
todo-app/
├── index.html          ← Main HTML page
├── css/
│   └── style.css       ← All styles
├── js/
│   └── app.js          ← All JavaScript logic
└── README.md           ← This file
```

## How to Run in VS Code

### Option 1 — Live Server (recommended)
1. Open the `todo-app` folder in VS Code
2. Install the **Live Server** extension (by Ritwick Dey) from the Extensions panel
3. Right-click `index.html` → **Open with Live Server**
4. The app opens at `http://127.0.0.1:5500`

### Option 2 — Open directly in browser
1. Navigate to the `todo-app` folder in your file explorer
2. Double-click `index.html` — it opens in your default browser
3. Note: `localStorage` works fine with `file://` in most browsers

## No installation required
This app uses only:
- Google Fonts (loaded from CDN)
- Font Awesome icons (loaded from CDN)
- Vanilla JavaScript (no npm, no node_modules)
