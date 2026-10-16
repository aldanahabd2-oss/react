# RectAssets — SE411 Project Part 1

React frontend for managing **company computer / IT assets** (add, view, update, delete).

Data is stored in an in-memory collection of objects (no database). Backend comes in Part 2.

## Quick start

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm test` | Run tests |
| `npm run preview` | Preview production build |

## Features

- Navigation menu: **Assets**, **Add Asset**, **About**
- CRUD for computer assets (tag, name, type, assignee, department, status, purchase date)
- Search / filter on the assets list
- About page for team members (name + student ID)

## Documentation

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for architecture, technology stack, and feature details.

## Team

Update names and student IDs in `src/pages/AboutPage.jsx` before submitting.

## Course

SE411 — Fall 2026-27 · Deadline for Part 1: 17 October 2026
