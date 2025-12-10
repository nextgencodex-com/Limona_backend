# Limona Backend

Simple Express API wired to MySQL. Use the same MySQL credentials you sign in with via phpMyAdmin.

## Setup
- Install dependencies: `npm install`
- Copy `.env` and set `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (phpMyAdmin shows these values under server info). Adjust `DB_PORT` if phpMyAdmin runs MySQL on a custom port.
- Start server: `npm start`

## Endpoints
- `GET /health` basic service check
- `GET /api/v1/users/db-check` runs `SELECT 1` against MySQL to confirm connectivity

## Troubleshooting
- If the db check fails, verify MySQL is running and the user has network access from this machine.
- For local phpMyAdmin stacks (XAMPP/WAMP/MAMP), host is usually `127.0.0.1`, port `3306`, and user `root` with the password you set during install.
