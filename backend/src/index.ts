
import 'dotenv/config'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono'


const api = new Hono<{
  Bindings: {
    DATABASE_URL: string
  }
}>().basePath('/api/v1')

api.post('/signup', async (c) => {
  const prisma = new PrismaClient({
    accelerateUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  await prisma.user.create({
    data: {
      email: body.email,
      password: body.password,
    },
  })

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
