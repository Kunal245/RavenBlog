import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "./BlogCard";

interface AppBarProps {
  username: string;
  rightSlot?: React.ReactNode;
}

export const AppBar = ({ username, rightSlot }: AppBarProps) => {
  const navigate = useNavigate();
  async function sendRequest() {
      try{
        localStorage.removeItem("token")
        navigate("/signup")
      } catch(e){
        alert("Error while logging out")
      }
    }

  return (
    <div className="bg-[#f5f0e8] border-b border-[#d4c9b0] px-8 h-[60px] flex items-center justify-between w-full">

      <Link to="/blogs" className="flex items-center gap-2.5 no-underline">
        <RavenIcon />
        <span className="font-serif text-[19px] font-medium text-[#2c2218] tracking-tight">
          Raven<span className="text-[#8a6a40]">Blog</span>
        </span>
      </Link>

      <nav className="flex items-center gap-7">
        <Link to="/" className="font-serif text-[13px] text-[#7a6a52] hover:text-[#2c2218] transition-colors no-underline tracking-wide">
          Home
        </Link>
        <button
          onClick={sendRequest}
          className="font-serif text-[13px] text-[#7a6a52] hover:text-[#2c2218] transition-colors bg-transparent border-none cursor-pointer tracking-wide"
        >
          Logout
        </button>

        {rightSlot ?? (
          <Link
            to="/publish"
            className="font-serif text-[12.5px] text-[#f5f0e8] bg-[#2c2218] hover:bg-[#4a3a28] transition-colors rounded-full px-[18px] py-[7px] tracking-wider no-underline"
          >
            💕Write
          </Link>
        )}

        <Avatar name={username} />
      </nav>
    </div>
  );
};

// const RavenIcon = () => (
//   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="opacity-75">
//     <path
//       d="M4 8c0-2.5 2-5 5-5 1.5 0 2.8.6 3.7 1.6C14 3.5 16 3 17.5 3.5c-1 1-1.5 2-1.5 3 1 .5 2 1.5 2.5 3-.5 0-1.2-.2-1.8-.5C16 11 14.5 12 12 12c1 1 1 3-1 4-1-1-1.5-2.5-1-4C7.5 12 5 10 4 8z"
//       fill="#2c2218"
//     />
//     <path
//       d="M10 16c0 2 1 4 3 5-3 0-6-1.5-7-4 1 0 2.5-.5 4-1z"
//       fill="#2c2218"
//     />
//   </svg>
// );

const RavenIcon = () => (
  <svg 
    className="w-6 h-6 opacity-75" 
    aria-hidden="true" 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    fill="none" 
    viewBox="0 0 24 24"
  >
    <path 
      stroke="#968966" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
    />
  </svg>
);