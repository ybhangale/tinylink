# TinyLink – URL Shortener 

A simple Bitly-style URL shortener & dashboard built with Next.js, Postgres, and Vercel.

---

## Features

- **Shorten any long URL** to a simple code
- **Track click stats** for each short link
- **Dashboard UI**: Create, view, copy, and delete links
- **Instant Copy-to-Clipboard** for all links
- **Healthcheck endpoint** for autograder
- **Fully RESTful API** (GET/POST/DELETE)

---

## Tech Stack

- [x] Next.js (API routes, frontend, SSR)
- [x] PostgreSQL (Neon, Railway, or Render)
- [x] Hosted on Vercel (easy deployment)
- [x] Plain CSS with responsive layout

---

## Setup & Local Development

1. **Clone the repo:**

   ```
   git clone https://github.com/ybhangale/tinylink
   cd tinylink
   ```

2. **Install dependencies:**

   ```
   npm install
   ```

3. **Set environment variables:**

   - Create a `.env.local` file:
     ```
     DATABASE_URL=-----------------------
     ```
   - See `.env.local` for format.

4. **Create the database table:**

   ```sql
   CREATE TABLE links (
     id SERIAL PRIMARY KEY,
     original_url TEXT NOT NULL,
     short_code VARCHAR(16) UNIQUE,
     click_count INTEGER DEFAULT 0
   );
   ```

5. **Start the dev server:**

   ```
   npm run dev
   ```

6. **Open** [http://localhost:3000](http://localhost:3000)

---

## API Endpoints

### Create / Get Links

- **POST /api/links**
  - `{ url: "https://..." }` ⇒ `{ short_url, short_code }`
- **GET /api/links**
  - Returns `{ links: [...] }` array

### Get / Delete Link by Code

- **GET /api/links/{code}**
  - Returns individual link info
- **DELETE /api/links/{code}**
  - Deletes link

### Redirect

- **GET /{code}**
  - Redirects to original URL and increments click count

### Healthcheck

- **GET /api/healthz**
  - Returns `{ ok: true, version: "1.0" }`

---

## Dashboard Features

- **Create link**
- **See all links/stats**
- **Copy any link to clipboard**
- **Delete unused links**
- **Instant feedback and error handling**
- **Mobile responsive**

---

## Deployment

- Clone repo and push to GitHub
- Deploy on [Vercel](https://vercel.com/) (Import from GitHub, set `DATABASE_URL`)
- Tested live endpoints before submission

---

