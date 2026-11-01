# H.A. Andreou & Co website

Public website, live chat and admin console for H.A. Andreou & Co (Helena Antonis Andreou LLC), Larnaca, Cyprus.
Design inspired by neo.law, using the H.A. Andreou & Co logo colours (navy #2A4475 and gold #B08B4F).

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

English and Greek. Website text lives in `client/src/i18n/*.js`.
Lawyers, expertise areas and job positions have a Translations box in the admin editor; empty translations fall back to English.
Office hours, chat greetings and the careers introduction are translated in admin Settings.

## Admin console (`/admin`)

* **Inquiries**: messages from the website contact forms, status (new, in progress, closed), internal notes, reply by email, delete
* **Live Chat**: all conversations with unread counts and a sound alert, reply in real time, quick replies, close or delete. While an admin is signed in, visitors see "Our team is online".
* **Lawyers**: add, edit, hide, reorder and delete lawyers, upload or remove photos, biography, education, admissions, languages, practice areas
* **Expertise**: add, edit, reorder and delete areas of law
* **Careers**: job applications with CV download, status and notes, and the open positions shown on the website
* **Settings**: firm contact details, office hours, chat greetings, translations, social links (Facebook, Instagram and LinkedIn show on the website and `/link` only when filled in)

Starter content: the team list confirmed by the firm (six people shown on the website and four hidden until their roles are confirmed, all without photos for now, so initials are shown), the expertise areas and the contact details. Expertise images are stock photos (see Photo credits) and live in `server/seed-images`; they are loaded into the database on first start. Lawyer photos can be uploaded from Lawyers in the admin console.

## Deploy on Render

`render.yaml` creates the web service and a Postgres database. Set `ADMIN_PASSWORD` in the Render dashboard. For email notifications add the `SMTP_*`, `MAIL_FROM` and `NOTIFY_EMAIL` variables (see `.env.example`).

## Photo credits

The page header photos (client/public/heroes) and the expertise photos (server/seed-images/areas) are free stock photos from Unsplash (unsplash.com), used under the Unsplash License, which allows commercial use without attribution.

The homepage background video (client/public/video/hero-larnaca.mp4) is an aerial clip of Larnaca from Pexels (pexels.com/video/40014781), used under the Pexels License, which also allows commercial use without attribution. To switch the homepage back to the animated network background, set `HERO_BACKGROUND = 'network'` at the top of client/src/pages/Home.jsx.

## Emails and opening hours

With the SMTP settings in place (see .env.example), the website sends:

* to the office: every enquiry, every job application with the CV attached, every new live chat, and new messages in an ongoing chat (at most one email every 15 minutes per chat);
* to visitors, in the language they used on the website: a confirmation after an enquiry (with the promised reply time, 2 working days by default), a confirmation after a job application, and the team's live chat replies if they have left the website.

The live chat greeting follows the opening hours in Admin > Settings (Cyprus time, with closed dates for holidays). Use "Send a test email" on the same page to check the setup.
