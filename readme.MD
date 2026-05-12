# Video Call Participants App

A full-stack web application that displays a searchable, responsive list of video call participants and allows users to preview and toggle microphone and camera states for each participant.

## Tech Stack

- **Frontend:** Next.js (React) with TypeScript and Zustand for client-side state management.
- **Backend:** FastAPI with REST APIs for participant retrieval and media state updates.
- **Database:** PostgreSQL for persistence of participant identity, presence, and media state data.
- **ORM:** SQLAlchemy for database interaction and schema mapping.
- **Containerization:** Docker Compose for PostgreSQL and backend service setup, as listed as an optional bonus capability in the assignment.

## Features

### Core Requirements

- Searchable participant list with **debounced** search input.
- Responsive participant tiles showing name, avatar/placeholder, and online/offline presence.
- Per-participant controls to toggle microphone and camera state.
- Participant detail modal with larger preview, media state, email, and role.
- Backend-persisted participant and interaction state that survives refreshes.
- API validation and error handling for invalid participant IDs and malformed payloads.

### Bonus Features Included

- Real webcam preview using `getUserMedia()`.
- Audio level visualization in the participant detail modal.
- Zustand global state management on the frontend.
- Server-side pagination and search filtering.
- Docker setup for FastAPI and PostgreSQL.

## Project Structure

```txt
video-participants-app/
  backend/
    app/
      __init__.py
      main.py
      database.py
      models.py
      schemas.py
      crud.py
      seed.py
    Dockerfile
    requirements.txt
  frontend/
    app/
      globals.css
      layout.tsx
      page.tsx
    components/
      MediaPreview.tsx
      ParticipantCard.tsx
      ParticipantDetailModal.tsx
      SearchBar.tsx
    lib/
      api.ts
      store.ts
      types.ts
      useDebounce.ts
    package.json
    tsconfig.json
    next-env.d.ts
    .env.local
  docker-compose.yml
```

## Architecture Overview

The application follows the assignment’s expected flow: **Frontend → Backend REST APIs → PostgreSQL**. The frontend never owns durable participant state by itself; instead, it fetches data from FastAPI and writes updates back through REST endpoints so state changes persist across requests and page refreshes.

### Frontend

The Next.js frontend renders the participant list, search input, pagination controls, and detail modal. Search is debounced before sending requests, which reduces unnecessary API calls while satisfying the requirement for debounced filtering.

Zustand is used to keep participant data and selected participant state synchronized across the page and modal. Optimistic UI updates are used for mic/camera toggles so the interface feels immediate, and failed requests roll back to the previous state.

### Backend

FastAPI exposes REST endpoints for listing participants, fetching details, updating microphone state, updating camera state, and updating online/offline presence. SQLAlchemy models define the PostgreSQL schema, while Pydantic schemas validate request and response payloads to support data integrity and clean API behavior.

### Database

PostgreSQL stores participant identity data, presence, media state, and timestamps, which matches the persistence requirements in the assignment. The schema is intentionally small and normalized around a single `participants` table because the app scope is limited to one participant entity with mutable presence and media state.

## Database Design Rationale

The `participants` table contains:

- `id` – primary key
- `name` – participant display name
- `email` – unique contact information
- `role` – user role or designation
- `avatar_url` – optional profile image
- `is_online` – current presence state
- `mic_enabled` – microphone status
- `camera_enabled` – camera status
- `created_at` – record creation timestamp
- `updated_at` – latest update timestamp

This design supports all required UI operations directly: search by name, tile rendering, detail view rendering, and persisted media toggling. Indexing `name` and `email` improves lookup and search behavior for participant retrieval scenarios described in the assignment.

## API Design

| Endpoint | Method | Purpose |
|---|---|---|
| `/health` | GET | Service health check |
| `/participants` | GET | Fetch participants with optional `search`, `skip`, and `limit` parameters. |
| `/participants/{id}` | GET | Fetch details for a single participant. |
| `/participants/{id}/mic` | PATCH | Update microphone state for a participant. |
| `/participants/{id}/camera` | PATCH | Update camera state for a participant. |
| `/participants/{id}/presence` | PATCH | Update online/offline status for a participant. |

### Example Requests

#### Get paginated participants

```http
GET /participants?search=aarav&skip=0&limit=6
```

#### Update microphone state

```http
PATCH /participants/1/mic
Content-Type: application/json

{
  "enabled": false
}
```

#### Update camera state

```http
PATCH /participants/1/camera
Content-Type: application/json

{
  "enabled": true
}
```

## Setup Instructions

### Prerequisites

- Python 3.12+
- Node.js 18+
- PostgreSQL 14+
- npm
- Docker Desktop (optional, for containerized setup)

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd video-participants-app
```

### 2. Configure PostgreSQL

Create a PostgreSQL database named `participants_db`.

Example using `psql`:

```sql
CREATE DATABASE participants_db;
```

### 3. Backend setup

```bash
cd backend
py -3.12 -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Set the database URL as an environment variable.

**PowerShell**

```powershell
$env:DATABASE_URL="postgresql+psycopg://postgres:your_password@localhost:5432/participants_db"
```

**Command Prompt**

```cmd
set DATABASE_URL=postgresql+psycopg://postgres:your_password@localhost:5432/participants_db
```

Seed the database:

```bash
python -m app.seed
```

Run the backend:

```bash
uvicorn app.main:app --reload
```

Backend API docs will be available at:

- [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 4. Frontend setup

Open a **new terminal** and do not use backend Python packages for frontend setup, since Node/npm dependencies are managed separately.

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000
```

Run the frontend:

```bash
npm run dev
```

Frontend will be available at:

- [http://localhost:3000](http://localhost:3000)

## Docker Setup

The assignment lists Docker setup for API + PostgreSQL as an optional extra-credit feature. This project includes Docker Compose for PostgreSQL and the FastAPI backend.

Run:

```bash
docker compose up --build
```

Seed the database after containers are up:

```bash
docker exec -it participants_backend python -m app.seed
```

## UX Notes

The interface includes loading, empty, and error states, which are explicitly required in the assignment. It is also responsive across mobile, tablet, and desktop layouts, with participant tiles adapting to available width in a grid.

Mic and camera changes update immediately in the UI through optimistic updates, then persist through backend API calls so the values survive refreshes. The detail modal fetches participant data from the backend instead of relying only on local state, which aligns with the assignment’s requirement that detail data come from the backend.

## Testing

The assignment requires at least one testing approach and specifically mentions search/filtering, mic/camera toggling, and error handling scenarios. A recommended setup for this project is:

- **Frontend:** Jest + React Testing Library for component tests
- **Backend (bonus):** FastAPI API tests with `pytest` and `httpx`

Suggested test coverage:

- Search input debounce and backend filtering behavior.
- Mic toggle request and optimistic UI update flow.
- Camera toggle persistence behavior.
- Invalid participant ID returning `404`.
- Empty state rendering when no participants match search.

## Known Considerations

- Webcam and microphone preview depend on browser permissions and available hardware.
- `getUserMedia()` works best in secure/local development contexts and may behave differently in restricted browser environments.
- If PostgreSQL is running on a non-default port, update `DATABASE_URL` accordingly.
- The frontend should be run from the `frontend/` directory, while the backend should be run inside the backend Python virtual environment.

## Future Improvements

The backend is designed to support future extensibility for presence updates, as requested in the assignment. Natural next steps would include WebSocket-based real-time presence, authentication, audit logging for media state changes, and richer participant metadata.
