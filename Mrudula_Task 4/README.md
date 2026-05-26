# SecureAuth — Login Authentication System

A clean, fully functional login/registration system built with
**vanilla HTML, CSS, and JavaScript** — no frameworks, no build tools.
Open it directly in a browser or serve it with Live Server in VS Code.

---

## Project Structure

```
auth-app/
├── index.html              ← Login page (entry point)
├── pages/
│   ├── register.html       ← Registration page
│   └── dashboard.html      ← Protected dashboard (requires login)
├── css/
│   └── style.css           ← All styles (auth + dashboard)
├── js/
│   ├── auth.js             ← Shared auth utilities & session management
│   ├── login.js            ← Login form logic
│   ├── register.js         ← Register form logic
│   └── dashboard.js        ← Dashboard guard + user display
└── README.md
```

---

## Features

- **Register** — name, email, password with live strength meter
- **Login** — validates credentials, shows clear error messages
- **Dashboard** — protected page (redirects to login if not authenticated)
- **Session guard** — `Auth.requireAuth()` protects the dashboard
- **Password visibility toggle** on all password fields
- **Client-side validation** with inline field errors
- **Persistent users** via `localStorage` (survives page refresh)
- **Session** via `sessionStorage` (clears on browser close)

---

## How to Run in VS Code

### Option 1 — Live Server (recommended)
1. Install the **Live Server** extension in VS Code
   (by Ritwick Dey — search "Live Server" in Extensions panel)
2. Open the `auth-app/` folder in VS Code
3. Right-click `index.html` → **Open with Live Server**
4. Browser opens at `http://127.0.0.1:5500/index.html`

### Option 2 — Direct file open
1. Open `auth-app/index.html` directly in any modern browser
   (Chrome, Firefox, Edge, Safari)
2. `localStorage` and `sessionStorage` work fine with `file://` URLs

---

## Flow

```
Register → Login → Dashboard
  ↑                    |
  └────────────────────┘ (logout)
```

1. Go to **Register**, create an account
2. You are redirected to **Login**
3. Sign in → you land on the **Dashboard**
4. Click **Sign out** → back to Login

---

## Security Notes

> This project is a **frontend demo** — suitable for learning and prototyping.

For a production app you would:
- Hash passwords with **bcrypt** on a server (never in the browser)
- Use **HTTPS** in production
- Store sessions server-side (JWT or cookie-based)
- Use a real database (PostgreSQL, MongoDB, etc.)
- Add CSRF protection and rate limiting

---

## Customisation

| What                  | Where                          |
|-----------------------|-------------------------------|
| Colors / theme        | `css/style.css` — `:root` vars |
| Brand name            | All HTML files — `.brand-name` |
| Redirect paths        | `js/login.js`, `js/register.js`|
| Session storage key   | `js/auth.js` — `SESSION_KEY`   |
| Password min length   | `js/register.js` — `validate()`|
