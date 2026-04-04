import { createBlogInput, deleteBlogInput, updateBlogInput } from "@kunal245/medium-common";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string
    SECRET: string
  },
  Variables: {
    userId: string,
  }
}>();

//middleware
blogRouter.use('/*', async (c, next) => {
  const getToken = c.req.header("Authorization") || "";
  const token = getToken.split(" ")[1];
  
  try{
    const response = await verify(token, c.env.SECRET, 'HS256');
    if(!response.id) {
      return c.json({
        error: "Invalid token"
      })
    }
    
    c.set("userId", response.id as string)
    await next();
    } catch(e) {
    c.status(403)
    return c.json({
        error: "You are not logged in"
    })
    }
})

blogRouter.post('/', async (c) => {
    const authorId = c.get("userId");
    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);

    if(!success){
        c.status(411)
        return c.json({
            error: "Wrong Inputs"
        })
    }

    const prisma = new PrismaClient({
    accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());


    const blog = await prisma.post.create({
        data:{
            title: body.title,
            content: body.content,
            authorId: authorId,
        }
    })

    return c.json({ id: blog.id })
})

blogRouter.put('/', async (c) => {
    const body = await c.req.json();
    const { success } = updateBlogInput.safeParse(body);

    if(!success){
        c.status(411)
        return c.json({
            error: "Wrong Inputs"
        })
    }

    const prisma = new PrismaClient({
    accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());


    const blog = await prisma.post.update({
        where:{
            id: body.id
        },
        data:{
            title: body.title,
            content: body.content,
        }
    })

    return c.json({ id: blog.id })
})

blogRouter.delete('/', async (c) => {
    const body = await c.req.json();
    const { success } = deleteBlogInput.safeParse(body);

    if(!success){
        c.status(411)
        return c.json({
            error: "Wrong Inputs"
        })
    }

    const prisma = new PrismaClient({
    accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());


    const blog = await prisma.post.delete({
        where:{
            id: body.id
        }
    })

    return c.json({ msg: "Blog deleted" })
})

blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
    accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blogs = await prisma.post.findMany();

    return c.json({
        blogs
    })
})

blogRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({
    accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blogId = c.req.param("id")

    try{
        const blog = await prisma.post.findFirst({
            where:{
                id: blogId
            },
        })
    
        return c.json({ blog }) 
    } catch(e) {
        c.status(411);
        c.json({
            error: "Error while fetching blog post"
        })
    }

})
