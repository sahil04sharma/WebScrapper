# Hacker News Scraper — MERN Full-Stack App

A mini full-stack MERN application that scrapes the top 10 stories from
[Hacker News](https://news.ycombinator.com), stores them in MongoDB, exposes
authenticated REST APIs, and lets users bookmark their favourites from a React
frontend.

> Built as the assignment submission for the Full Stack Developer (MERN) role.

---

## Tech Stack

**Backend:** Node.js, Express 5, MongoDB + Mongoose, JWT auth (`jsonwebtoken` + `bcrypt`), Cheerio + Axios for scraping.
**Frontend:** React 19 + Vite, React Router v7, Axios, React Context API for auth state.

---

## Folder Structure

```
WebScrapper/
├── Backend/
│   ├── server.js                  # entry point — connects DB, runs scraper, starts server
│   └── src/
│       ├── app.js                 # Express app + middleware + route mounting
│       ├── config/db.js           # Mongoose connection
│       ├── models/                # User.js, Story.js
│       ├── controllers/           # authController.js, storyController.js
│       ├── routes/                # authRoutes.js, storyRoutes.js, scrapeRoutes.js
│       ├── middleware/            # auth.js (JWT protect), errorHandler.js
│       └── services/scraper.js    # Hacker News scraper (cheerio)
└── Frontend/
    └── src/
        ├── api/axios.js           # axios instance with token interceptor
        ├── context/AuthContext.jsx
        ├── components/            # Navbar, ProtectedRoute, StoryCard
        └── pages/                 # Stories, StoryDetail, Login, Register, Bookmarks
```

---

## Environment Variables

### Backend (`Backend/.env`)

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hn_scraper
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
SCRAPE_ON_START=true
CLIENT_ORIGIN=http://localhost:5173
```

### Frontend (`Frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

`.env.example` files are provided in both folders. Copy them to `.env` and fill in your values.

---

## Running Locally

> Requires **Node 18+** and a running **MongoDB** instance (local or Atlas).

### 1. Backend

```bash
cd Backend
cp .env.example .env       # fill in MONGO_URI and JWT_SECRET
npm install
npm run dev                # nodemon (or `npm start` for plain node)
```

Server starts on `http://localhost:5000`. On startup it connects to MongoDB and
runs the Hacker News scraper once (controlled by `SCRAPE_ON_START`).

### 2. Frontend

```bash
cd Frontend
cp .env.example .env
npm install
npm run dev
```

App runs on `http://localhost:5173`.

---

## API Reference

### Auth

| Method | Endpoint              | Body                          | Description           |
| ------ | --------------------- | ----------------------------- | --------------------- |
| POST   | `/api/auth/register`  | `{ name, email, password }`   | Register a user       |
| POST   | `/api/auth/login`     | `{ email, password }`         | Login, returns JWT    |
| GET    | `/api/auth/me`        | —                             | Current user (auth)   |

### Stories

| Method | Endpoint                          | Auth | Description                                       |
| ------ | --------------------------------- | ---- | ------------------------------------------------- |
| GET    | `/api/stories?page=1&limit=10`    | No   | Paginated list, sorted by points (desc)           |
| GET    | `/api/stories/:id`                | No   | Get one story                                     |
| POST   | `/api/stories/:id/bookmark`       | Yes  | Toggle bookmark for the current user              |
| GET    | `/api/stories/bookmarks/me`       | Yes  | List the current user's bookmarked stories        |

### Scraper

| Method | Endpoint        | Auth | Description                              |
| ------ | --------------- | ---- | ---------------------------------------- |
| POST   | `/api/scrape`   | No   | Trigger a scrape of the HN front page    |

Authenticated requests must include `Authorization: Bearer <token>`.

---

## Key Design Decisions

- **Bookmarks live on the `User` document** (`bookmarks: [ObjectId<Story>]`) so
  they scale with users, not stories, and a toggle is a single document write.
- **Scraper is idempotent** — `findOneAndUpdate({ url }, ..., { upsert: true })`
  so re-scraping never duplicates stories and updates point counts.
- **Auth state in React Context** with `localStorage` persistence; an axios
  interceptor injects the bearer token on every request and clears storage on
  401 responses.
- **Pagination** returns `{ page, limit, total, totalPages, stories }` so the
  client can render real pagination controls.

---

## Features Checklist

- [x] Scraper for HN top 10 (title, url, points, author, postedAt)
- [x] Runs on server start
- [x] `POST /api/scrape` manual trigger
- [x] JWT register / login
- [x] Protected bookmark toggle
- [x] Stories list sorted by points
- [x] React Context for auth state
- [x] Protected `/bookmarks` page
- [x] Pagination (`?page=&limit=`) — bonus
- [x] Clean folder structure (routes / controllers / models / middleware)
- [x] `.env` for all secrets

---

## License

MIT
