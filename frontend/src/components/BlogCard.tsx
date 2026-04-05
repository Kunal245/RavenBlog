import { Link } from "react-router-dom";

interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishDate: string;
  id: string
}

export const BlogCard = ({
  authorName,
  title,
  content,
  publishDate,
  id,
}: BlogCardProps) => {
  return <div>
    <Link to={`/blog/${id}`}>
      <div className="group bg-[#f5f0e8] border border-[#d4c9b0] rounded-sm px-8 py-7 max-w-xl cursor-pointer transition-colors hover:border-[#a89070]">
        <div className="flex items-center gap-2.5 mb-4 font-serif text-xs text-[#7a6a52] tracking-wide">
          <Avatar name={authorName} />
          <span>{authorName}</span>
          <span className="text-[#b0a090]">·</span>
          <span>{publishDate}</span>
        </div>

        {/* Title */}
        <h2 className="font-serif text-xl font-medium text-[#2c2218] leading-snug mb-2.5">
          {title}
        </h2>

        {/* Excerpt */}
        <p className="font-serif text-sm italic text-[#5a4a38] leading-relaxed mb-4">
          {content.slice(0, 100) + "..."}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#d4c9b0] pt-3 mt-1">
          <span className="font-serif text-xs text-[#9a8870] tracking-wider lowercase">
            {`${Math.ceil(content.length / 300)} min read`}
          </span>
          <span className="font-serif text-xs text-[#7a5c38] tracking-widest lowercase border-b border-[#c9a870] pb-px">
            continue reading →
          </span>
        </div>
      </div>
    </Link>
  </div>
};

export function Avatar({ name }: { name: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-[#c9b897] flex items-center justify-center flex-shrink-0">
      <span className="font-serif text-sm font-medium text-[#4a3a28]">
        {name[0]}
      </span>
    </div>
  );
}