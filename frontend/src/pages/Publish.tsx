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
            Publish ✍️
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
      </div>
    </div>
  );
};