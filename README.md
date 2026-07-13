# RavenBlog

RavenBlog is a blog application with a React single-page frontend, a Spring Boot API backed by PostgreSQL, and a retained Hono/Cloudflare Worker API. The frontend is currently configured to use the Spring service at `http://localhost:8080` during local development.

## Features

- Account signup and signin with email-format usernames and passwords of at least six characters.
- HS256 JWT issuance and bearer-token authentication.
- Create, list, read, update, and delete blog posts.
- PostgreSQL persistence for users and posts.
- Spring Boot protects post mutation routes and restricts updates and deletes to the post author.
- React routes for signup, signin, the post list, post detail, and post publishing.

## Tech Stack

| Area | Implementation |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, React Router, Axios, Tailwind CSS, Flowbite |
| Backend | Spring Boot 3.4 on Java 21; Hono on Cloudflare Workers is also present in `backend/` |
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

Install dependencies for the frontend and, if it will be used, the Hono Worker:

```bash
cd frontend
npm install

cd ../backend
npm install
```

Maven resolves Spring dependencies when the Spring service is started.

### Environment Variables

The Spring service reads these variables:

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Direct PostgreSQL URL: `postgresql://user:password@host:5432/database` or `jdbc:postgresql://...` |
| `SECRET` | Yes | JWT signing secret of at least 32 UTF-8 bytes |

Create `spring-backend/.env` locally, or export the variables in your shell. The file is ignored by Git.

```dotenv
DATABASE_URL=postgresql://database_user:database_password@host:5432/database
SECRET=replace-with-a-secret-of-at-least-32-bytes
```

The Hono Worker also expects `DATABASE_URL` and `SECRET` through its Cloudflare bindings. Its Prisma configuration reads `DATABASE_URL` from `backend/.env` for Prisma commands.

### Running Locally

Start the Spring API from one terminal:

```bash
cd spring-backend
set -a
. ./.env
set +a
mvn spring-boot:run
```

The Spring API listens on `http://localhost:8080`. This matches `frontend/src/config.ts`.

Start the frontend from another terminal:

```bash
cd frontend
npm run dev
```

## API

The frontend uses the Spring API. The Hono Worker exposes the same route paths but has different read-route authorization and does not perform Spring's post-author ownership check.

User request bodies use `username` (an email address) and `password`; signup also accepts optional `name`. Blog creation accepts `title` and `content`; updates additionally require `id`; deletion requires `id`.

### Spring Boot API

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `POST` | `/api/v1/user/signup` | Creates a user and returns a JWT as plain text. | No |
| `POST` | `/api/v1/user/signin` | Verifies credentials and returns a JWT as plain text. | No |
| `POST` | `/api/v1/blog` | Creates a post for the authenticated user. | Yes — Bearer JWT |
| `PUT` | `/api/v1/blog` | Updates a post when the authenticated user is its author. | Yes — Bearer JWT |
| `DELETE` | `/api/v1/blog` | Deletes a post when the authenticated user is its author. | Yes — Bearer JWT |
| `GET` | `/api/v1/blog/bulk` | Returns all posts with each author's name. | No |
| `GET` | `/api/v1/blog/{id}` | Returns one post with its author's name. | No |

### Hono Worker API

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `POST` | `/api/v1/user/signup` | Creates a user and returns a JWT as plain text. | No |
| `POST` | `/api/v1/user/signin` | Verifies credentials and returns a JWT as plain text. | No |
| `POST` | `/api/v1/blog` | Creates a post for the authenticated user. | Yes — Bearer JWT |
| `PUT` | `/api/v1/blog` | Updates a post by ID. | Yes — Bearer JWT |
| `DELETE` | `/api/v1/blog` | Deletes a post by ID. | Yes — Bearer JWT |
| `GET` | `/api/v1/blog/bulk` | Returns all posts with each author's name. | Yes — Bearer JWT |
| `GET` | `/api/v1/blog/{id}` | Returns one post with its author's name. | Yes — Bearer JWT |

## Database

Prisma defines the PostgreSQL schema. The Spring entities map the same quoted tables, `"User"` and `"Post"`, and Hibernate is configured to validate rather than alter them.

| Table | Columns | Relationships |
| --- | --- | --- |
| `User` | `id` (UUID string, primary key), `email` (unique), `name` (nullable), `password` | Has many posts |
| `Post` | `id` (UUID string, primary key), `title`, `content`, `published` (defaults to `false`), `authorId` | Belongs to `User` through `authorId` |

The Prisma migration creates the unique index on `User.email` and the foreign key from `Post.authorId` to `User.id`.

## Authentication

Signup and signin accept JSON request bodies. The Spring service signs an HS256 JWT containing only the user ID claim: `{ "id": "<user-id>" }`. The frontend stores the response as `Bearer <token>` in `localStorage` and sends it in the `Authorization` header for blog requests.

Spring stores passwords created through its signup endpoint with BCrypt. When a user with a legacy plaintext password signs in successfully through Spring, the password is replaced with a BCrypt hash in the same transaction. The Hono Worker continues to create and compare legacy plaintext passwords.

The Spring security configuration is stateless, disables CSRF, permits the user routes and blog reads, and requires a valid bearer token for blog mutations. The Hono Worker applies its JWT middleware to every blog route.

## Development

```bash
# Frontend
cd frontend
npm run dev

# Spring API (load spring-backend/.env first)
cd spring-backend
mvn spring-boot:run

# Hono Worker
cd backend
npm run dev
```

Additional frontend commands:

```bash
cd frontend
npm run build
npm run lint
```

## Deployment

`frontend/vercel.json` configures Vercel to rewrite all paths to `/index.html`, allowing client-side routes to resolve after deployment.

The Hono Worker package provides `npm run deploy`, which runs `wrangler deploy --minify`.

## Contributing

Keep changes focused, preserve the existing API request shapes where compatibility matters, and update the relevant documentation with behavior changes. Run the frontend build and lint commands before opening a pull request; run the Spring test suite when the environment permits it.

## License

MIT
