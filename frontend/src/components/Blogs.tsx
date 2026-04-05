import { useBlogs } from "../hooks"
import { AppBar } from "./AppBar"
import { BlogCard } from "./BlogCard"

export const Blogs = () => {

    const {loading, blogs} = useBlogs();

    if(loading){
        return <div role="status" className="max-w-sm animate-pulse">
            <div className="h-2.5 bg-neutral-quaternary rounded-full w-48 mb-4"></div>
            <div className="h-2 bg-neutral-quaternary rounded-full max-w-[360px] mb-2.5"></div>
            <div className="h-2 bg-neutral-quaternary rounded-full mb-2.5"></div>
            <div className="h-2 bg-neutral-quaternary rounded-full max-w-[330px] mb-2.5"></div>
            <div className="h-2 bg-neutral-quaternary rounded-full max-w-[300px] mb-2.5"></div>
            <div className="h-2 bg-neutral-quaternary rounded-full max-w-[360px]"></div>
            <span className="sr-only">Loading...</span>
        </div>
    }
    
    return <div>
        <div>
            <AppBar username="Kunal"></AppBar>
        </div>
        <div className="grid grid-cols-1 gap-6 px-40 py-30 justify-center ">
            <BlogCard authorName="Kunal" title="First Blog" content="The early morning air carried a quiet sense of possibility as the city slowly came to life. Street vendors arranged their stalls with practiced ease, while the faint hum of traffic began to build in the distance. It was one of those rare moments when everything felt unhurried, as if time itself had decided to take a brief pause. People moved with purpose yet without urgency, sipping tea, exchanging greetings, and preparing for the day ahead. In these simple routines, there was a subtle beauty often overlooked—a reminder that even the most ordinary moments can hold a sense of calm and meaning if we take the time to notice them." publishDate="5 May 2026"></BlogCard>
            <BlogCard authorName="Rohit" title="First Blog" content="The early morning air carried a quiet sense of possibility as the city slowly came to life. Street vendors arranged their stalls with practiced ease, while the faint hum of traffic began to build in the distance. It was one of those rare moments when everything felt unhurried, as if time itself had decided to take a brief pause. People moved with purpose yet without urgency, sipping tea, exchanging greetings, and preparing for the day ahead. In these simple routines, there was a subtle beauty often overlooked—a reminder that even the most ordinary moments can hold a sense of calm and meaning if we take the time to notice them." publishDate="5 May 2026"></BlogCard>
            <BlogCard authorName="Rahul" title="First Blog" content="The early morning air carried a quiet sense of possibility as the city slowly came to life. Street vendors arranged their stalls with practiced ease, while the faint hum of traffic began to build in the distance. It was one of those rare moments when everything felt unhurried, as if time itself had decided to take a brief pause. People moved with purpose yet without urgency, sipping tea, exchanging greetings, and preparing for the day ahead. In these simple routines, there was a subtle beauty often overlooked—a reminder that even the most ordinary moments can hold a sense of calm and meaning if we take the time to notice them." publishDate="5 May 2026"></BlogCard>
        </div>
    </div>
}