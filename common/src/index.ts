import { z } from "zod";

//zod type inferance
//signup
export const signupInput = z.object({
    username: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional()
})


//signin
export const signinInput = z.object({
    username: z.string().email(),
    password: z.string().min(6),
})


//createBlog
export const createBlogInput = z.object({
    title: z.string(),
    content: z.string(),
})


//updateBlog
export const updateBlogInput = z.object({
    title: z.string(),
    content: z.string(),
    id: z.string(),
})


//deleteBlog
export const deleteBlogInput = z.object({
    id: z.string(),
})

export type SignupInput = z.infer<typeof signupInput>
export type SigninInput = z.infer<typeof signinInput>
export type CreateBlogInput = z.infer<typeof createBlogInput>
export type UpdateBlogInput = z.infer<typeof updateBlogInput>
export type DeleteBlogInput = z.infer<typeof deleteBlogInput>