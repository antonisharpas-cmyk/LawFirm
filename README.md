# Athanasiadou Law Firm website

Public website, live chat and admin console for Athanasiadou Law Firm (Larnaca, Cyprus).
Design inspired by neo.law, using the Athanasiadou logo and colours (gold #BFA575, black, wine #402328).

Stack: React + Vite + Tailwind (client), Node.js + Express (server), PostgreSQL.

## Run locally

```bash
npm install
npm --prefix client install
cp .env.example .env      # optional, works without it
npm run dev
```

* Website: http://localhost:5173
* Admin console: http://localhost:5173/admin (default login `admin` / `change-me` until `ADMIN_PASSWORD` is set)

Without `DATABASE_URL` the server uses an in memory database, which is reset every restart. Set `DATABASE_URL` to a Postgres database to keep data. Tables and starter content are created automatically on first start.

Production build: `npm install && npm run build`, then `npm start` (serves the API and the built site on `PORT`).

## Pages

* `/` Home (hero, firm, practice areas, team, how we work, enquiry form)
* `/lawyers` and `/lawyers/:slug` lawyer profiles
* `/practice-areas`, `/about`, `/contact` (enquiry and appointment forms, map), `/privacy`
* Live chat button on every page

## Admin console (`/admin`)

* **Inquiries**: contact and appointment requests, status (new, in progress, closed), internal notes, reply by email, delete
* **Live Chat**: all conversations with unread counts and a sound alert, reply in real time, quick replies, close or delete. While an admin is signed in, visitors see "Our team is online".
* **Lawyers**: add, edit, hide, reorder and delete lawyers, upload or remove photos, biography, education, admissions, languages, practice areas
* **Practice Areas**: add, edit, reorder and delete services
* **Settings**: firm contact details, office hours, chat greetings, social links

The three lawyers in the starter content are placeholders. Replace them from the admin console.

## Deploy on Render

`render.yaml` creates the web service and a Postgres database. Set `ADMIN_PASSWORD` in the Render dashboard. For email notifications add the `SMTP_*`, `MAIL_FROM` and `NOTIFY_EMAIL` variables (see `.env.example`).
