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
