# Running the Spring Backend

## Prerequisites

- Java 21
- Maven 3.9 or newer
- PostgreSQL database containing RavenBlog's existing schema

## 1. Configure environment variables

From the repository root, set a PostgreSQL connection string and an HS256 signing secret. The secret must be at least 32 UTF-8 bytes.

```bash
export DATABASE_URL='postgresql://database_user:database_password@host:5432/database'
export SECRET='replace-with-a-secret-of-at-least-32-bytes'
```

`DATABASE_URL` can alternatively use the `jdbc:postgresql://...` form. Prisma Accelerate URLs are not supported by the Spring service.

If you already have a local `spring-backend/.env` file containing those variables, load it before starting Maven:

```bash
cd spring-backend
set -a
. ./.env
set +a
```

## 2. Start the service

```bash
mvn spring-boot:run
```

The server starts on `http://localhost:8080` by default.

## 3. Verify it is running

In a second terminal, send a request to an endpoint:

```bash
curl -i -X POST http://localhost:8080/api/v1/user/signup \\
  -H 'Content-Type: application/json' \\
  -d '{"username":"example@example.com","password":"change-me","name":"Example User"}'
```

A successful response contains the JWT string used by the frontend.

## Stop the service

Press `Ctrl+C` in the terminal running Maven.
