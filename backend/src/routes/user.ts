
import 'dotenv/config'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from "hono";
import { sign } from 'hono/jwt'
import { signinInput, signupInput } from '@kunal245/medium-common';

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        SECRET: string,
    }
}>();

//signup
userRouter.post('/signup', async (c) => {
  const body = await c.req.json();
  const { success } = signupInput.safeParse(body)
  
  if(!success) {
    c.status(411)
    c.json({
      error: "Wrong Inputs"
    })
  }

  const prisma = new PrismaClient({
    accelerateUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  
  
  try{
    const user = await prisma.user.create({
      data: {
        email: body.username,
        password: body.password,
        name: body.name,
      },
    })
    
    const token = await sign({ id: user.id }, c.env.SECRET)
    return c.text(token)
  } catch(e) {
    c.status(411);
    return ("Invalid")
  }
})

//signin
userRouter.post('/signin', async (c) => {
  const body = await c.req.json();
  const { success } = signinInput.safeParse(body)
  
  if(!success) {
    c.status(411)
    c.json({
      error: "Wrong Inputs"
    })
  }

  const prisma = new PrismaClient({
    accelerateUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());


  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.username,
        password: body.password,
      }
    })
  
    if(!user) {
      c.status(403);
      return c.json({
        error: "Wrong creds"
      })
    }
  
    const token = await sign({id: user.id}, c.env.SECRET)
    return c.text(token);

  } catch(err) {
    c.status(411);
    return c.text("Invalid")
  }

})