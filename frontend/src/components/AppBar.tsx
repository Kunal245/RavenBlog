import { Avatar } from "./BlogCard";

interface AppBarProps{
    username: string
}

export const AppBar = ({username}:AppBarProps ) => {
  return (
    <div className="bg-[#f5f0e8] border-b border-[#d4c9b0] px-8 h-[60px] flex items-center justify-between w-full">
      
      <a href="/" className="flex items-center gap-2.5 no-underline">
        <RavenIcon />
        <span className="font-serif text-[19px] font-medium text-[#2c2218] tracking-tight">
          Raven<span className="text-[#8a6a40]">Blog</span>
        </span>
      </a>

      <nav className="flex items-center gap-7">
        <a href="/discover" className="font-serif text-[13px] text-[#7a6a52] hover:text-[#2c2218] transition-colors no-underline tracking-wide">
          Home
        </a>
        <a href="/following" className="font-serif text-[13px] text-[#7a6a52] hover:text-[#2c2218] transition-colors no-underline tracking-wide">
          Logout
        </a>
        <a href="/bookmarks" className="font-serif text-[13px] text-[#7a6a52] hover:text-[#2c2218] transition-colors no-underline tracking-wide">
          Profile
        </a>
        <button className="font-serif text-[12.5px] text-[#f5f0e8] bg-[#2c2218] hover:bg-[#4a3a28] transition-colors rounded-full px-[18px] py-[7px] tracking-wider">
          ✦ Write
        </button>
        <Avatar name={username}></Avatar>
      </nav>
    </div>
  );
};

const RavenIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="opacity-75">
    <path
      d="M4 8c0-2.5 2-5 5-5 1.5 0 2.8.6 3.7 1.6C14 3.5 16 3 17.5 3.5c-1 1-1.5 2-1.5 3 1 .5 2 1.5 2.5 3-.5 0-1.2-.2-1.8-.5C16 11 14.5 12 12 12c1 1 1 3-1 4-1-1-1.5-2.5-1-4C7.5 12 5 10 4 8z"
      fill="#2c2218"
    />
    <path
      d="M10 16c0 2 1 4 3 5-3 0-6-1.5-7-4 1 0 2.5-.5 4-1z"
      fill="#2c2218"
    />
  </svg>
);