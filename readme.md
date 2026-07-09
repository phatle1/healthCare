# MediCare Portal

A simple healthcare appointment management demo built with plain HTML, CSS, and JavaScript.

## Features

- **Login / Register** — sign in with `admin` / `admin`, or register a new account (stored in `localStorage`)
- **Session guard** — any protected page redirects unauthenticated visitors back to the sign-in page
- **Appointment dashboard**
  - Stats overview (total / upcoming / completed / cancelled)
  - Book a new appointment
  - Doctor directory
  - Appointment list with search, status filter, and cancel action 'check check check'

## Running locally

This is a static site with no build step. Serve the folder with any static file server, e.g.:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/index.html`.




# Healthcare Appointment System

## 🎯 Project Goal
A simple project for study, focused on building a foundational appointment system.

## 🏥 Key Features
- Patient appointment booking functionality.

## 🛠️ Technical Stack
- Frontend: HTML, CSS, JavaScript (Future consideration: React)

## 📂 Project Structure
- `appointments.html`: Appointment viewing/management.
- `index.html`: Main entry point.
- `register.html`: Registration page.
- `css/style.css`: Styling.
- `js/*.js`: Application logic (app.js, auth.js, data.js, guard.js, register.js, users.js).
