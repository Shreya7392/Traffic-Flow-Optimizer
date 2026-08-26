# Traffic Flow Optimizer

A monorepo project for optimizing traffic flow management with a React frontend and API server backend.

## Project Structure

- **artifacts/api-server** - Backend API server
- **artifacts/traffic-mgmt** - React frontend application
- **artifacts/mockup-sandbox** - Sandbox environment for testing
- **lib/** - Shared libraries (API client, specs, database)

## Prerequisites

- Node.js v18+
- pnpm (package manager)

## Installation

```bash
pnpm install
```

## Database configuration

The API requires PostgreSQL. Copy `artifacts/api-server/.env.example` to `artifacts/api-server/.env`, then adjust the connection string if needed:

```env
DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost:5432/traffic_db
```

For a ready-to-use local database, run:

```bash
docker compose up -d postgres
```

Set up the database schema before starting the API:

```bash
pnpm --filter @workspace/db run push
```

## Development

### Frontend
```bash
cd artifacts/traffic-mgmt
pnpm dev
```

### Backend
```bash
cd artifacts/api-server
pnpm dev
```

The API runs on port `3000` by default. Set `PORT` to use a different port.

## Build

```bash
pnpm run build
```

## Type Checking

```bash
pnpm run typecheck
```

## License

MIT
