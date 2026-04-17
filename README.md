# Tech Fest Backend (Express + TypeScript)

A comprehensive backend for the college tech fest project with layered architecture and production-minded API design.

## Architecture

- **Controllers**: Handle HTTP request/response only.
- **Services**: Handle business rules and orchestration.
- **Repositories**: Handle database operations and SQL.
- **Models**: Domain contracts and DTOs.

This separation follows SOLID principles:

- **S**: Single responsibility per layer.
- **O**: Open for extension via interfaces.
- **L**: Service code works against repository interfaces.
- **I**: Focused interfaces per domain (`IUserRepository`, `IEventRepository`, etc.).
- **D**: Dependency injection through a composition root (`src/container/container.ts`).

## Domain Features Implemented

- User registration/login with JWT and bcrypt hashing.
- Event listing with search/category filters/sorting/pagination.
- Event CRUD for admin/organizer roles.
- Event registration with duplicate protection and optional student ID upload.
- Contact/query submission and organizer response workflow.
- FAQ endpoint from resolved queries.
- Email notification sent after query resolution.

## Security and Reliability

- Helmet, CORS, compression, morgan.
- Route-level and global rate limiting.
- Zod validation middleware for body/query.
- Centralized error handling and not-found handler.
- Request-scoped tracing with `AsyncLocalStorage` internals.
- Strictly parameterized SQL queries (no string-concatenated user inputs).

## Special JS/TS Coverage Requested

- **Polyfills**: `Object.groupBy` polyfill loaded at startup.
- **Closures**: In-memory anti-spam guard for query submissions.
- **Partial Application**: Used to normalize event filter values.
- **Currying**: Used for filter-clamping and allowed-value selection.
- **Node Internals**: `AsyncLocalStorage` for per-request context propagation.

## Main API Paths

- `GET /health`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/events`
- `GET /api/v1/events/:eventId`
- `POST /api/v1/events` (admin/organizer)
- `PATCH /api/v1/events/:eventId` (admin/organizer)
- `DELETE /api/v1/events/:eventId` (admin/organizer)
- `GET /api/v1/events/summary/categories`
- `POST /api/v1/registrations` (authenticated)
- `GET /api/v1/registrations/me` (authenticated)
- `GET /api/v1/registrations/event/:eventId` (admin/organizer/faculty)
- `POST /api/v1/queries`
- `GET /api/v1/queries/faq`
- `GET /api/v1/queries` (admin/organizer/faculty)
- `PATCH /api/v1/queries/:queryId/respond` (admin/organizer/faculty)

## Run Locally

1. Copy `.env.example` to `.env` and fill credentials.
2. Run SQL from `database/schema.sql`.
3. Optional: run `database/seed.sql`.
4. Start backend:

```bash
npm install
npm run dev
```

## Build

```bash
npm run typecheck
npm run build
npm start
```
