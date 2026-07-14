# Ad-Dinweb Full Stack Application

## Project Structure
- `/client` - React frontend (Vite)
- `/server` - Node.js backend (Express)

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn

## Installation

### Backend Setup
```bash
cd server
npm install
cp .env.example .env  # Configure your environment variables
npm run dev
```

## Deployment

### Render: full-stack application

The included `render.yaml` deploys the React client and Express API as one web service. It runs `npm run build`, starts with `npm start`, and checks `GET /api/health`.

In Render, set `MONGO_URI`. Render generates `JWT_SECRET`. Add `CLIENT_URL` only if the frontend is deployed on another domain. The Express fallback returns `index.html` for React Router URLs, so refreshes work.

### Hostinger: Node.js application

Set the application root to this repository, run `npm run build` during deployment, and use `npm start` as the startup command. Set `NODE_ENV=production`, `MONGO_URI`, and `JWT_SECRET` in Hostinger's environment-variable settings. The same Express fallback supports page refreshes.

### Hostinger: static frontend with a separate API

Before building, set `VITE_API_URL=https://your-api-domain/api`. Run `npm run build` and upload all files from `client/dist` to `public_html`, including the generated `.htaccess`. On the API host, set `CLIENT_URL` to the exact Hostinger URL or URLs, for example `https://example.com,https://www.example.com`.
