import { useState } from "react";
import { AppBar } from "../components/AppBar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";


export const Publish = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate()

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const canPublish = title.trim().length > 0 && content.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#faf6ef] animate-fade-down">
      <AppBar
        username="Kunal"
        rightSlot={
          <button
            onClick={async () => {
                const response = await axios.post(`${BACKEND_URL}/api/v1/blog`, {
                    title,
                    content,
                }, {
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                });
                navigate(`/blog/${response.data.id}`)
            }}
            disabled={!canPublish}
            className="font-serif text-[12.5px] text-[#f5f0e8] bg-[#2c2218] disabled:bg-[#b0a090] disabled:cursor-not-allowed hover:bg-[#4a3a28] transition-colors rounded-full px-5 py-[7px] tracking-wider"
          >
            Publish →
          </button>
        }
      />

      <div className="max-width-2xl max-w-[680px] mx-auto px-8 pt-14 pb-20">

        {/* Label */}
        <div className="flex items-center gap-3 mb-10">
          <span className="font-serif text-[11px] tracking-[0.14em] uppercase text-[#9a8870]">
            New post
          </span>
          <div className="flex-1 h-px bg-[#d4c9b0]" />
        </div>

        {/* Title */}
        <textarea
          rows={2}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Your title here…"
          className="w-full font-serif text-[36px] font-medium text-[#1e160e] bg-transparent border-none outline-none resize-none leading-snug tracking-tight placeholder:text-[#c4b89e] border-b border-[#d4c9b0] pb-5 mb-6"
        />

        {/* Content */}
        <textarea
          rows={14}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tell your story…"
          className="w-full font-serif text-[17px] text-[#3a2e22] leading-[1.85] bg-transparent border-none outline-none resize-none min-h-[360px] placeholder:text-[#c4b89e] placeholder:italic"
        />

        {/* Toolbar */}
        <div className="flex items-center gap-1.5 pt-3 border-t border-[#d4c9b0] mt-8">
          {["B", "I", '"'].map((t, i) => (
            <button key={i} className="font-serif text-[13px] text-[#9a8870] hover:text-[#2c2218] hover:bg-[#ede8df] px-2.5 py-1 rounded-md transition-colors">
              {t}
            </button>
          ))}
          <div className="w-px h-4 bg-[#d4c9b0] mx-1" />
          {["H1", "H2", "Link"].map((t, i) => (
            <button key={i} className="font-serif text-[13px] text-[#9a8870] hover:text-[#2c2218] hover:bg-[#ede8df] px-2.5 py-1 rounded-md transition-colors">
              {t}
            </button>
          ))}
          <span className="ml-auto font-serif text-xs text-[#b0a090]">
            {wordCount} words
          </span>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mt-6 flex-wrap">
          {["Essay", "Culture", "Life"].map((tag) => (
            <span key={tag} className="font-serif text-[11.5px] text-[#8a6a40] bg-[#ede8df] rounded-full px-3 py-1">
              {tag}
            </span>
          ))}
          <input
            placeholder="+ add tag"
            className="font-serif text-xs text-[#5a4a38] bg-transparent border border-dashed border-[#c9b897] rounded-full px-3 py-1 w-28 outline-none placeholder:text-[#c4b89e]"
          />
        </div>
      </div>
    </div>
  );
};