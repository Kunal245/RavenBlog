import { useParams } from "react-router-dom";
import { useBlog } from "../hooks"
import { BlogPage } from "../components/BlogPage";

export const Blog = () => {

    const { id } = useParams();
    const {loading, blog} = useBlog({
        id: id || ""
    });

    if(loading){
        return <div role="status" className=" w-screen h-screen bg-taupe-100 animate-pulse">
            <div className="h-2.5 bg-neutral-quaternary rounded-full w-48 mb-4"></div>
            <div className="h-2 bg-neutral-quaternary rounded-full max-w-[360px] mb-2.5"></div>
            <div className="h-2 bg-neutral-quaternary rounded-full mb-2.5"></div>
            <div className="h-2 bg-neutral-quaternary rounded-full max-w-[330px] mb-2.5"></div>
            <div className="h-2 bg-neutral-quaternary rounded-full max-w-[300px] mb-2.5"></div>
            <div className="h-2 bg-neutral-quaternary rounded-full max-w-[360px]"></div>
            <span className="sr-only">Loading...</span>
        </div>
    }
    if (!blog) return <div>Blog not found</div>;

    return <div className="bg-taupe-600">
            <BlogPage blog={blog}></BlogPage>
        </div>
}