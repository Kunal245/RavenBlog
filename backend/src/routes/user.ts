
import 'dotenv/config'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from "hono";
import { sign, verify } from 'hono/jwt'

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        SECRET: string,
    }
}>();

//signup
userRouter.post('/signup', async (c) => {
  const prisma = new PrismaClient({
    accelerateUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  
  try{
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name,
      },
    })
    
    const token = await sign({ id: user.id }, c.env.SECRET)
    return c.json({ jwt: token })
  } catch(e) {
    c.status(411);
    return ("Invalid")
  }
})

//signin
userRouter.post('/signin', async (c) => {
  const prisma = new PrismaClient({
    accelerateUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
        password: body.password,
      }
    })
  
    if(!user) {
      c.status(403);
      return c.json({
        error: "Wrong creds"
      })
    }
  
    const jwt = await sign({id: user.id}, c.env.SECRET)
    return c.json({ jwt });

  } catch(err) {
    c.status(411);
    return c.text("Invalid")
  }

})