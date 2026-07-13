# Authentication Migration Summary

## Scope completed

Only the authentication module has been migrated. The existing Node.js Hono backend and the React frontend have not been changed.

## New Spring Boot project

`spring-backend` is a Java 21 Maven project using Spring Boot 3 with Spring Web, Spring Data JPA, PostgreSQL, Lombok, Validation, Spring Security, and JJWT.

## Compatible endpoints

| Endpoint | Request | Successful response |
|---|---|---|
| `POST /api/v1/user/signup` | `{ "username": "email", "password": "min 6 chars", "name": "optional" }` | Raw JWT text |
| `POST /api/v1/user/signin` | `{ "username": "email", "password": "min 6 chars" }` | Raw JWT text |

The field name remains `username`, even though it contains an email address, because that is what the current frontend sends.

## Database behavior

- JPA maps the existing PostgreSQL table `"User"`.
- User IDs remain UUID strings, matching the existing Prisma schema.
- Hibernate is configured with `ddl-auto: validate`, so the Spring service validates the existing schema instead of creating or changing tables.
- This service requires a direct PostgreSQL JDBC URL; it cannot use the Prisma Accelerate connection URL.

## Password migration

- New accounts store passwords with BCrypt.
- Existing accounts created through the Node backend have plaintext passwords.
- When a legacy user successfully signs in through Spring Boot, the plaintext password is immediately replaced by a BCrypt hash in the same transaction.
- Incorrect passwords are rejected without changing stored data.

## JWT and security behavior

- The service signs HS256 JWTs with the same minimal payload shape as the Hono service: `{ "id": "<user-id>" }`.
- A `Bearer <token>` authentication filter extracts that `id` and places it in Spring Security’s context for future protected routes.
- Authentication endpoints are public; the service is stateless and CSRF is disabled for this JSON API.
- CORS currently permits all origins to match the existing Worker behavior. This should be restricted when deployment origins are finalized.
- The existing `SECRET` environment variable is used directly as the JWT signing key. The secret must be at least 32 UTF-8 bytes for HS256; no separate `JWT_SECRET` is required.
- The existing `DATABASE_URL` is the only datasource input. Spring derives JDBC settings from a standard `postgresql://user:password@host/database` URL; no separate Spring database username/password variables are required.

## Files added

- `pom.xml` — Maven dependencies and Java 21 setup.
- `src/main/java/com/ravenblog/auth/` — auth DTOs, controller, service, and JWT service.
- `src/main/java/com/ravenblog/security/` — security configuration and JWT filter.
- `src/main/java/com/ravenblog/user/` — existing user-table JPA entity and repository.
- `src/main/java/com/ravenblog/api/` — API validation/error handling.
- `src/main/resources/application.yml` — database/JWT configuration.
- `README.md` — local configuration and run instructions.

## Verification status

File structure and patch whitespace were checked. Maven is not installed in the current environment, so compilation and runtime verification have not yet been possible.
