# ScholarPort — Academic Portfolio Manager

Full-stack MERN application for researchers to manage a portfolio of academic publications: organize papers, track citations, run advanced searches, and present work in a professional format. The portfolio is public; registered users can create and manage their own entries.

## Live Demo

- **Web app:** https://scholarport.vercel.app
- **Backend API:** https://scholarport-api.onrender.com

> The free Render tier sleeps the server after 15 minutes of inactivity, so the first load may take 30–50 seconds before the app becomes responsive.

![ScholarPort](screenshot.png)

---

## Tech Stack (MERN)

**Frontend** — React 18 (SPA) · React Router v6 · Context API / useContext (global auth state) · Axios with interceptors (HTTP + automatic JWT handling) · React Toastify · custom responsive CSS with CSS variables and dark mode

**Backend** — Node.js + Express.js (REST API) · MongoDB + Mongoose · JWT authentication · bcryptjs (password hashing) · Express Validator

**Testing** — Jest + Supertest (backend) · React Testing Library (frontend) · MongoDB Memory Server (isolated in-memory test DB)

**Deployment** — Frontend on Vercel · Backend on Render · Database on MongoDB Atlas

---

## Features

**Public area** — browse all articles, article detail with abstract and citations, full-text search across title/author/abstract, filters by author and publication year, paginated results.

**Protected area (registered users)** — JWT registration and login; create, edit, and delete your own articles; add, edit, and delete citations; ownership enforced so each user manages only their own content.

---

## Architecture notes

- Stateless JWT auth, token stored client-side and attached via Axios interceptors
- Protected routes on both frontend (route guards) and backend (auth middleware)
- Ownership checks at the API level for every mutating operation
- Test coverage across backend endpoints and frontend components, with an in-memory Mongo instance for isolated runs
