# AI BI Platform

AI BI Platform is a full-stack business intelligence app that turns natural-language questions into charts, insights, and SQL-backed analytics. It supports both database-connected analysis and CSV-based exploration, with authentication,  uploads, and AI-generated recommendations.

## Project Overview

This repository contains:

- A FastAPI backend for authentication, database connections, analytics, uploads, schema handling, and AI-powered query generation
- A React + Vite frontend for the landing page, login/register flow, dataset upload, and interactive dashboards
- CSV querying support for quick analysis of uploaded datasets
- Chart generation and insight extraction for business users who want answers without writing SQL

## Key Features

- Natural language analytics for database queries
- CSV upload and question answering
- AI-generated insights, KPIs, recommendations, and visualizations
- Smart dashboard with table, bar, line, pie, and scatter chart rendering
- User authentication and protected routes
- Database connection management
- Query history, schema metadata, dashboards, and reports

## Tech Stack

- Backend: FastAPI, SQLAlchemy, Alembic, Pydantic, JWT auth
- Frontend: React, Vite, React Router, Recharts, Tailwind CSS
- Database: PostgreSQL-compatible via `DATABASE_URL`

## Repository Structure

```text
ai-bi-platform/
├── backend/
│   ├── app/
│   ├── alembic/
│   └── .env
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
└── requirements.txt
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A PostgreSQL database

### Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r ../requirements.txt
```

Create `backend/.env` with the required variables:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ai_bi_platform
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=
REFRESH_TOKEN_EXPIRE_DAYS=
GROQ_API_KEY=your-groq-api-key
```

Run the backend:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Main User Flow

1. Sign up or log in
2. Connect to a database or upload a CSV file
3. Ask a question in plain English
4. Review the generated SQL, insights, KPIs, and charts
5. Use the smart dashboard to explore the results further

## API Notes

The backend exposes routes for:

- Authentication
- Database connections
- Schema and metadata
- Analytics and query generation
- CSV upload and CSV question answering
- User and dashboard-related operations

## Security Notes

- Do not commit `backend/.env` or any credentials
- Use a strong `SECRET_KEY`
- Keep API keys and database URLs private

## Suggested GitHub Repository Description

`AI-powered business intelligence platform for natural-language analytics, CSV exploration and automated insights.`

## License

Add your preferred license here if you plan to open source the project.
