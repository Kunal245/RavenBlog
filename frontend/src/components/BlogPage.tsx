import { AppBar } from "./AppBar";
import type { Blog } from "../hooks";

export const BlogPage = ({ blog }: { blog: Blog }) => {
  const wordCount = blog.content.split(" ").length;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <div className="min-h-screen bg-[#faf6ef]">
      <AppBar username="Kunal" />

      {/* Hero */}
      <div className="max-w-2xl mx-auto px-8 pt-16 pb-10">
        <span className="inline-block font-serif text-[11px] tracking-[0.12em] uppercase text-[#8a6a40] border border-[#c9a870] rounded-full px-3 py-1 mb-6">
          {`${readTime} min read`}
        </span>

        <h1 className="font-serif text-[38px] font-medium text-[#1e160e] leading-[1.2] tracking-tight mb-5">
          {blog.title}
        </h1>

        {/* Author meta strip */}
        <div className="flex items-center gap-3 py-5 border-t border-b border-[#d4c9b0] mt-8">
          <div className="w-10 h-10 rounded-full bg-[#c9b897] flex items-center justify-center font-serif text-base font-medium text-[#4a3a28] flex-shrink-0">
            {blog.author.name?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="flex-1">
            <p className="font-serif text-[13.5px] font-medium text-[#2c2218]">
              {blog.author.name || "Anonymous"}
            </p>
            <p className="font-serif text-xs text-[#9a8870] mt-0.5">
              {"6 April"} · {wordCount.toLocaleString()} words
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="font-serif text-xs text-[#9a8870] hover:text-[#2c2218] transition-colors bg-transparent border-none cursor-pointer">
              ♡ Like
            </button>
            <button className="font-serif text-xs text-[#9a8870] hover:text-[#2c2218] transition-colors bg-transparent border-none cursor-pointer">
              ⬆ Share
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-2xl mx-auto px-8 prose-beige">
        <div className="font-serif text-[17px] text-[#3a2e22] leading-[1.85] [&>p]:mb-7 [&>p:first-child::first-letter]:font-serif [&>p:first-child::first-letter]:text-[64px] [&>p:first-child::first-letter]:font-medium [&>p:first-child::first-letter]:float-left [&>p:first-child::first-letter]:leading-[0.8] [&>p:first-child::first-letter]:mr-2.5 [&>p:first-child::first-letter]:mt-1.5 [&>p:first-child::first-letter]:text-[#8a6a40]">
          {blog.content.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* Ornament divider */}
        <div className="flex items-center gap-4 my-12">
          <div className="flex-1 h-px bg-[#d4c9b0]" />
          <span className="font-serif text-base text-[#c9a870]">✦</span>
          <div className="flex-1 h-px bg-[#d4c9b0]" />
        </div>
      </div>
    </div>
  );
};