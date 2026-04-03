
## A hono based blog posting application

#### Docker Setup for local Postgres

- Build and run docker image locally for Postgres database using ``` docker run -d --name myblogapp -e POSTGRES_PASSWORD=mypostgrespassword -p 5433:5432 postgres ``` 

### Initialization

- First create a parent folder for you main application
- Initialize hono in /backend ``` npm create hono@latest ```
- Initialize prisma in /backend ``` npm install prisma @types/pg --save-dev npm install @prisma/client @prisma/adapter-pg pg dotenv ``` ``` npx prisma init ```
- Configure the databases url in .env (use your postgres db connection string, neondb) and wrangler.jsonc (use accelerate connection string, prisma accelerate)
- Add schemas in schema.prisma
- Migrate your db using ``` npx prisma migrate dev --name init_schema ```
- Generate prisma client ``` npx prisma generate ``` (use --no-engine flag if you are using older version)
- Install prisma accelerate extension ``` npm install @prisma/extension-accelerate ```
- Optimize and initiate Prisma Client in the index.js to use Prisma v7 as there is major changes in v7 read these **[Docs](https://www.prisma.io/docs/prisma-postgres/quickstart/prisma-orm#7-instantiate-prisma-client)**, **[Docs(for accelerate)](https://www.prisma.io/docs/accelerate/getting-started#24-extend-your-prisma-client-instance-with-the-accelerate-extension)** for referance


