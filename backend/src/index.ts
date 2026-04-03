
import 'dotenv/config'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { PrismaPg } from "@prisma/adapter-pg";
import { Hono } from 'hono'

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const api = new Hono().basePath('/api/v1')

api.post('/signup', (c) => {
  return c.text('Hello Hono!')
})
api.post('/signin', (c) => {
  return c.text('Hello Hono!')
})
api.post('/blog', (c) => {
  return c.text('Hello Hono!')
})

api.put('/blog', (c) => {
  return c.text('Hello Hono!')
})

api.get('/blog/:id', (c) => {
  return c.text('Hello Hono!')
})

export default api
