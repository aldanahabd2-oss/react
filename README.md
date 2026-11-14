# RectAssets — SE411 Project (Parts 1 & 2)

React frontend + Java Spring Boot backend for managing **company computer / IT assets**.

| Part | Deliverable |
|------|-------------|
| Part 1 | React app (menu, CRUD UI, About page) |
| Part 2 | Spring server + integration + JUnit/Mockito tests |

Public repo: https://github.com/Nfyuji/react

## Quick start

### 1) Start the Spring backend

```bash
cd backend
./mvnw spring-boot:run
```

Windows:

```bash
cd backend
.\mvnw.cmd spring-boot:run
```

Backend: `http://localhost:8080`

### 2) Start the React frontend

```bash
npm install
npm run dev
```

Frontend: `http://localhost:5173`

## Features

- Add asset
- Search asset by ID
- List all assets with pagination
- Update asset
- Delete asset (frontend + API)
- About page (team members)
- Backend unit tests (JUnit + Mockito)

## REST API

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/assets` | Create |
| GET | `/api/assets/{id}` | Find by ID |
| GET | `/api/assets?page=0&size=5` | Paginated list |
| PUT | `/api/assets/{id}` | Update |
| DELETE | `/api/assets/{id}` | Delete |

## Tests

```bash
# Frontend
npm test

# Backend
cd backend
./mvnw test
```

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — architecture + API details
- [docs/PRESENTATION.md](docs/PRESENTATION.md) — 2 presentation slides

## Team

Update names/IDs in `src/pages/AboutPage.jsx` before the demo.
