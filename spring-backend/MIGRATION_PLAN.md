# RavenBlog Spring Boot Migration Plan

## Goal

Build a Java 21 / Spring Boot 3 backend alongside the existing Hono Cloudflare Worker. Do not delete, overwrite, or change `../backend` until the Spring implementation has been validated and cut over deliberately.

## Compatibility baseline

- Preserve the `/api/v1` URL prefix and the JSON request/response shapes used by `../frontend`.
- Keep the existing PostgreSQL schema as the initial source of truth.
- Run both backends independently during the migration.
- Change the frontend API URL only after all required Spring endpoints have passed end-to-end testing.

## Phase 1 — Authentication (complete)

- Create the standalone Maven/Spring Boot service in this directory.
- Map the existing PostgreSQL `"User"` table through JPA without schema changes.
- Migrate `POST /api/v1/user/signup` and `POST /api/v1/user/signin`.
- Preserve the existing request fields: `username`, `password`, and optional `name`.
- Preserve the raw HS256 JWT response with an `id` claim.
- Hash newly created passwords with BCrypt and transparently upgrade legacy plaintext passwords after a successful login.
- Install stateless JWT authentication infrastructure for later protected endpoints.

## Phase 2 — Posts module (complete)

- Map PostgreSQL `"Post"` to a JPA entity and relate it to `User`.
- Migrate the protected endpoints:
  - `POST /api/v1/blog`
  - `PUT /api/v1/blog`
  - `DELETE /api/v1/blog`
  - `GET /api/v1/blog/bulk`
  - `GET /api/v1/blog/{id}`
- Preserve the response payloads expected by the current frontend.
- Enforce that only a post author can update or delete that post; this corrects a current authorization flaw in the Hono backend.

## Phase 3 — Database migrations and API hardening

- Add Flyway and baseline the existing Prisma-managed schema before introducing any database changes.
- Add timestamps, deterministic post ordering, and pagination through versioned migrations if approved.
- Replace inappropriate legacy validation status code `411` with standard API statuses (`400`, `401`, `403`, `404`, `409`, or `422`).
- Add consistent error responses and global exception handling.
- Restrict CORS to the actual frontend origins when deployment configuration is known.
- Introduce expiring JWTs and token claims such as issuer/audience in a planned compatibility release.

## Phase 4 — Testing

- Add unit tests for validation, password upgrade behavior, JWT parsing, and authorization rules.
- Add repository/controller integration tests against PostgreSQL (preferably Testcontainers).
- Add API contract tests covering the current frontend flows.
- Test old and new backends against a staging copy of the database.

## Phase 5 — Deployment and cutover

- Deploy this Spring Boot service to a JVM/container-capable environment; Cloudflare Workers is not a Spring Boot runtime.
- Use a normal PostgreSQL JDBC URL rather than the Prisma Accelerate URL.
- Configure secrets through the deployment platform, never source control.
- Point a staging frontend at Spring Boot, then run end-to-end signup, signin, list, read, publish, update, and delete checks.
- Switch the production frontend API base URL only after acceptance testing and monitoring are ready.
- Keep the Node/Hono service available for rollback during a short transition period; retire it only after explicit approval.
