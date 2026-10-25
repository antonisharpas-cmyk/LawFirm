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

* `/` Home (hero, firm, expertise, team, how we work, enquiry form)
* `/lawyers` and `/lawyers/:slug` lawyer profiles
* `/expertise`, `/about`, `/careers` (open positions and applications with CV upload), `/contact` (enquiry form and map)
* `/terms`, `/cookies`, `/privacy`
* `/link` link in bio page for social media profiles
* Live chat button on every page

## Languages

English, Greek, Russian and Hebrew (right to left). Website text lives in `client/src/i18n/*.js`.
Lawyers, expertise areas and job positions have a Translations box in the admin editor; empty translations fall back to English.
Office hours, chat greetings and the careers introduction are translated in admin Settings.

## Admin console (`/admin`)

* **Inquiries**: messages from the website contact forms, status (new, in progress, closed), internal notes, reply by email, delete
* **Live Chat**: all conversations with unread counts and a sound alert, reply in real time, quick replies, close or delete. While an admin is signed in, visitors see "Our team is online".
* **Lawyers**: add, edit, hide, reorder and delete lawyers, upload or remove photos, biography, education, admissions, languages, practice areas
* **Expertise**: add, edit, reorder and delete areas of law
* **Careers**: job applications with CV download, status and notes, and the open positions shown on the website
* **Settings**: firm contact details, office hours, chat greetings, translations, social links (Facebook, Instagram and LinkedIn show on the website and `/link` only when filled in)

The three lawyers in the starter content are placeholders. Replace them from the admin console.

## Deploy on Render

`render.yaml` creates the web service and a Postgres database. Set `ADMIN_PASSWORD` in the Render dashboard. For email notifications add the `SMTP_*`, `MAIL_FROM` and `NOTIFY_EMAIL` variables (see `.env.example`).
