import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#faf6ef] flex flex-col overflow-hidden">

      {/* Nav */}
      <nav className="bg-[#f5f0e8] border-b border-[#d4c9b0] px-10 h-[60px] flex items-center justify-between animate-fade-down">
        <span className="font-serif text-[19px] font-medium text-[#2c2218]">
          Raven<span className="text-[#8a6a40]">Blog</span>
        </span>
        <div className="flex items-center gap-8">
          <button onClick={() => navigate("/signin")} className="font-serif text-[13px] text-[#7a6a52] hover:text-[#2c2218] transition-colors bg-transparent border-none cursor-pointer">
            Sign in
          </button>
        </div>
      </nav>

      {/* Umm */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-8 py-16 relative">

        {/* Floating cards */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute left-[4%] top-[22%] bg-[#f5f0e8] border border-[#d4c9b0] rounded-xl p-3 w-44 animate-float-in">
            <p className="font-serif text-[13px] font-medium text-[#2c2218] mb-1">Waiting for her reply</p>
            <p className="font-serif text-[11px] text-[#9a8870]">Last Seen · 69 years ago</p>
          </div>
          <div className="absolute right-[4%] top-[30%] bg-[#f5f0e8] border border-[#d4c9b0] rounded-xl p-3 w-44 animate-float-in">
            <p className="font-serif text-[13px] font-medium text-[#2c2218] mb-1">Letters Never Sent</p>
            <p className="font-serif text-[11px] text-[#9a8870]">Can we talk? · 0.1 sec ago</p>
          </div>
        </div>

        <h1 className="font-serif text-[clamp(42px,7vw,72px)] font-medium text-[#1e160e] leading-[1.1] tracking-tight mb-6 animate-fade-up">
          Welcome to.<br />
          <em className="italic text-[#8a6a40]">Raven Blog.</em><br />
        </h1>

        <div className="flex items-center gap-4 animate-fade-up">
          <button
            onClick={() => navigate("/signup")}
            className="font-serif text-[13.5px] text-[#f5f0e8] bg-[#2c2218] hover:bg-[#4a3a28] hover:-translate-y-px active:translate-y-0 transition-all rounded-full px-8 py-3.5 tracking-wider"
          >
            Sign Up
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-10 w-full max-w-[560px] animate-fade-up">
          <div className="flex-1 h-px bg-[#d4c9b0]" />
          <span className="font-serif text-[14px] text-[#c9a870]">❤️</span>
          <div className="flex-1 h-px bg-[#d4c9b0]" />
        </div>
      </main>
    </div>
  );
};