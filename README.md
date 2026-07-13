# RavenBlog

RavenBlog is a blog application with a React frontend and a PostgreSQL-backed Spring Boot API. A Hono Worker implementation remains in `backend/`. The frontend uses the Spring API at `http://localhost:8080` for local development.

## Features

- Signup and signin with an email address and password.
- JWT-based authentication for post mutations.
- Create, list, read, update, and delete posts.
- PostgreSQL persistence for users and posts.
- Spring Boot protects post mutation routes and restricts updates and deletes to the post author.
- React routes for signup, signin, the post list, post detail, and post publishing.

## Tech Stack

| Area | Implementation |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, React Router, Axios, Tailwind CSS, Flowbite |
| Backend | Spring Boot 3.4 on Java 21; Hono Worker in `backend/` |
| Database | PostgreSQL, Prisma schema and migrations; Spring Data JPA mappings |
| Authentication | HS256 JWTs; Spring uses BCrypt for new passwords and supports migration from legacy plaintext passwords |
| Deployment | Vercel SPA rewrite configuration for the frontend |

## Project Structure

```text
.
├── backend/
│   ├── prisma/
│   │   ├── migrations/20260403184644_init_schema/migration.sql
│   │   └── schema.prisma
│   ├── src/
│   │   ├── index.ts
│   │   └── routes/
│   │       ├── blog.ts
│   │       └── user.ts
│   ├── package.json
│   ├── prisma.config.ts
│   └── tsconfig.json
├── common/
│   ├── src/index.ts
│   ├── package.json
│   └── tsconfig.json
├── docs/
│   └── SECURITY.md
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/index.ts
│   │   ├── pages/
│   │   ├── App.tsx
│   │   ├── config.ts
│   │   ├── index.css
│   │   └── main.tsx
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.ts
├── spring-backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/ravenblog/
│   │   │   │   ├── api/
│   │   │   │   ├── auth/
│   │   │   │   ├── blog/
│   │   │   │   ├── config/
│   │   │   │   ├── security/
│   │   │   │   ├── user/
│   │   │   │   └── RavenBlogApplication.java
│   │   │   └── resources/application.yml
│   │   └── test/
│   ├── pom.xml
│   └── RUN.md
└── README.md
```

## Getting Started

### Prerequisites

- Node.js and npm
- Java 21
- Maven
- A PostgreSQL database initialized with the schema in `backend/prisma/schema.prisma`

### Installation

Install the frontend dependencies:

```bash
cd frontend
npm install
```

Install the Hono Worker dependencies only when running that implementation:

```bash
cd backend
npm install
```

### Environment Variables

The Spring service reads these variables:

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Direct PostgreSQL URL: `postgresql://user:password@host:5432/database` or `jdbc:postgresql://...` |
| `SECRET` | Yes | JWT signing secret of at least 32 UTF-8 bytes |

Create `spring-backend/.env` locally, or export the variables in your shell:

```dotenv
DATABASE_URL=postgresql://database_user:database_password@host:5432/database
SECRET=replace-with-a-secret-of-at-least-32-bytes
```

The Hono Worker also uses `DATABASE_URL` and `SECRET` as Cloudflare bindings. Prisma reads `DATABASE_URL` from `backend/.env`.

### Running Locally

Start the Spring API from one terminal:

```bash
cd spring-backend
set -a
. ./.env
set +a
mvn spring-boot:run
```

The Spring API listens on `http://localhost:8080`.

Start the frontend from another terminal:

```bash
cd frontend
npm run dev
```

## API

The frontend is configured for the Spring API. Both backend implementations expose the routes below. They differ on blog-read access and post ownership checks.

User request bodies use `username` (an email address) and `password`; signup also accepts optional `name`. Blog creation accepts `title` and `content`; updates additionally require `id`; deletion requires `id`.

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `POST` | `/api/v1/user/signup` | Creates a user and returns a plain-text JWT. | No |
| `POST` | `/api/v1/user/signin` | Verifies credentials and returns a plain-text JWT. | No |
| `POST` | `/api/v1/blog` | Creates a post for the authenticated user. | Yes — Spring and Hono |
| `PUT` | `/api/v1/blog` | Updates a post. Spring requires the post author; Hono does not check ownership. | Yes — Spring and Hono |
| `DELETE` | `/api/v1/blog` | Deletes a post. Spring requires the post author; Hono does not check ownership. | Yes — Spring and Hono |
| `GET` | `/api/v1/blog/bulk` | Returns all posts with author names. | Spring: No; Hono: Yes |
| `GET` | `/api/v1/blog/{id}` | Returns a post with its author's name. | Spring: No; Hono: Yes |

## Database

Prisma defines the PostgreSQL schema. The Spring entities map the same quoted tables, `"User"` and `"Post"`, and Hibernate is configured to validate rather than alter them.

| Table | Columns | Relationships |
| --- | --- | --- |
| `User` | `id` (UUID string, primary key), `email` (unique), `name` (nullable), `password` | Has many posts |
| `Post` | `id` (UUID string, primary key), `title`, `content`, `published` (defaults to `false`), `authorId` | Belongs to `User` through `authorId` |

The Prisma migration creates the unique index on `User.email` and the foreign key from `Post.authorId` to `User.id`.

## Authentication

The Spring service signs HS256 tokens containing the user ID: `{ "id": "<user-id>" }`. The frontend stores the response as `Bearer <token>` in `localStorage` and uses it in the `Authorization` header for blog requests.

Spring stores passwords created through its signup endpoint with BCrypt. When a user with a legacy plaintext password signs in successfully through Spring, the password is replaced with a BCrypt hash in the same transaction. The Hono Worker continues to create and compare legacy plaintext passwords.

Spring uses stateless security, disables CSRF, permits user routes and blog reads, and requires a valid bearer token for blog mutations. Hono applies its JWT middleware to every blog route.

## Development

```bash
# Frontend
cd frontend
npm run dev

# Spring API
cd spring-backend
set -a && . ./.env && set +a
mvn spring-boot:run

mvn test

# Hono Worker
cd backend
npm run dev
```

```bash
cd frontend
npm run build
npm run lint
```

## Deployment

`frontend/vercel.json` rewrites all paths to `/index.html` so client-side routes resolve after deployment.

The Hono Worker package provides `npm run deploy`, which runs `wrangler deploy --minify`.
