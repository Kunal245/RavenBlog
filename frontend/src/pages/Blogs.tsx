import { useBlogs } from "../hooks"
import { AppBar } from "../components/AppBar"
import { BlogCard } from "../components/BlogCard"

export const Blogs = () => {

    const {loading, blogs} = useBlogs();

    if(loading){
        return <div role="status" className="w-screen h-screen bg-taupe-100 animate-pulse">
            <div className="h-2.5 bg-neutral-quaternary rounded-full w-48 mb-4"></div>
            <div className="h-2 bg-neutral-quaternary rounded-full max-w-[360px] mb-2.5"></div>
            <div className="h-2 bg-neutral-quaternary rounded-full mb-2.5"></div>
            <div className="h-2 bg-neutral-quaternary rounded-full max-w-[330px] mb-2.5"></div>
            <div className="h-2 bg-neutral-quaternary rounded-full max-w-[300px] mb-2.5"></div>
            <div className="h-2 bg-neutral-quaternary rounded-full max-w-[360px]"></div>
            <span className="sr-only">Loading...</span>
        </div>
    }
    
    return <div className="bg-taupe-600">
        <div>
            <AppBar username="Kunal"></AppBar>
        </div>
        <div className="grid grid-cols-1 gap-6 px-40 py-30 justify-center ">
            {[...blogs].reverse().map(blog => 
                <BlogCard 
                    id={blog.id}
                    authorName={blog.author.name || "Anonymous"} 
                    title={blog.title} 
                    content={blog.content} 
                    publishDate={"5 May 2026"}
                /> )}
        </div>
    </div>
}