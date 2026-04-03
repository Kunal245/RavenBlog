
import 'dotenv/config'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono'
import { sign } from 'hono/jwt'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
    SECRET: string
  }
}>().basePath('/api/v1')

app.post('/signup', async (c) => {
  const prisma = new PrismaClient({
    accelerateUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  
  const body = await c.req.json();
  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: body.password,
    },
  })
  
  const token = await sign({ id: user.id}, c.env.SECRET)
  return c.json({
    jwt: token
  })

})
app.post('/signin', async (c) => {
  const prisma = new PrismaClient({
    accelerateUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const user = await prisma.user.findUnique({
    where: {
      email: body.email
    }
  })

  if(!user) {
    c.status(403);
    return c.json({
      error: "User doesn't exist"
    })
  }

  const jwt = await sign({id: user.id}, c.env.SECRET)
  return c.json({ jwt });

})
app.post('/blog', (c) => {
  return c.text('Hello Hono!')
})

app.put('/blog', (c) => {
  return c.text('Hello Hono!')
})

app.get('/blog/:id', (c) => {
  return c.text('Hello Hono!')
})

export default app
