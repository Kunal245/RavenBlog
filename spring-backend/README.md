# RavenBlog Spring Backend

This is an authentication-only Spring Boot 3 / Java 21 migration. The existing `../backend` Hono Worker remains the active backend and has not been changed.

## Implemented compatible endpoints

- `POST /api/v1/user/signup`
- `POST /api/v1/user/signin`

Both accept the existing JSON field names (`username`, `password`, and optional `name`) and return the raw JWT string expected by the existing frontend. Tokens use HS256 with an `{ "id": "<user UUID>" }` payload, matching the Worker contract.

New registrations use BCrypt. On successful sign-in, a legacy plaintext password from the existing database is transparently upgraded to BCrypt.

## Configuration

Set the same environment variables used by the Node.js backend:

```text
DATABASE_URL=postgresql://database_user:database_password@host:5432/database
SECRET=a-secret-of-at-least-32-bytes
```

`DATABASE_URL` may also be a `jdbc:postgresql://...` URL. Spring derives the JDBC host, database, username, and password from a standard PostgreSQL URI, so no separate Spring datasource variables are required. Prisma Accelerate URLs are not JDBC-compatible and cannot be used by Spring Boot.

`SECRET` is used directly as the JWT signing key, preserving compatibility with the existing Worker. It must be at least 32 UTF-8 bytes for HS256.

The service maps the existing PostgreSQL table named `"User"`; `spring.jpa.hibernate.ddl-auto=validate` ensures it validates rather than alters that schema.

## Run

```bash
mvn spring-boot:run
```

Maven is not installed in the current workspace environment, so this command could not be executed here.
