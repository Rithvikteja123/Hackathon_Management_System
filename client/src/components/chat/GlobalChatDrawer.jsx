import { useState, useEffect, useRef } from "react";
import { messageAPI } from "../../services/apiServices";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { format } from "date-fns";
import {
  HiOutlineChatAlt2, HiOutlineX, HiOutlinePaperAirplane,
  HiOutlineUser, HiOutlineShieldCheck, HiOutlineSparkles,
} from "react-icons/hi";
import { RiTrophyLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";

const roleBadgeStyle = {
  admin:       { bg: "bg-red-100 text-red-700 border-red-200",       tag: "ADMIN",       icon: HiOutlineShieldCheck },
  organizer:   { bg: "bg-purple-100 text-purple-700 border-purple-200", tag: "ORGANIZER",   icon: HiOutlineSparkles },
  judge:       { bg: "bg-amber-100 text-amber-800 border-amber-200",   tag: "JUDGE",       icon: RiTrophyLine },
  participant: { bg: "bg-emerald-100 text-emerald-800 border-emerald-200", tag: "PARTICIPANT", icon: HiOutlineUser },
};

const GlobalChatDrawer = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputContent, setInputContent] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const fetchMessages = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const res = await messageAPI.get();
      const list = res.data.data.messages || [];
      setMessages(list);
    } catch (_) {
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  // Poll for new messages every 3 seconds while chat drawer is open
  useEffect(() => {
    if (!isOpen) return;
    fetchMessages(true);
    const timer = setInterval(() => {
      fetchMessages(false);
    }, 3000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputContent.trim() || sending) return;

    setSending(true);
    try {
      await messageAPI.send({ content: inputContent.trim() });
      setInputContent("");
      await fetchMessages(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-xs">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 250 }}
          className="w-full max-w-full sm:max-w-md bg-white border-l border-zinc-200 flex flex-col h-full shadow-2xl relative"
        >
          {/* Header */}
          <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center text-lg">
                <HiOutlineChatAlt2 />
              </div>
              <div>
                <h3 className="font-extrabold text-black text-base leading-tight flex items-center gap-2">
                  Hackathon Group Chat 💬
                </h3>
                <p className="text-[11px] text-zinc-500">Public discussion forum for all roles</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-zinc-500 hover:text-black rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <HiOutlineX className="text-xl" />
            </button>
          </div>

          {/* Role Legend Bar */}
          <div className="px-4 py-2 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between text-[10px] gap-1 flex-wrap">
            <span className="text-purple-700 font-bold">● ORGANIZER</span>
            <span className="text-amber-700 font-bold">● JUDGE</span>
            <span className="text-emerald-700 font-bold">● PARTICIPANT (TEAM)</span>
            <span className="text-red-700 font-bold">● ADMIN</span>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-zinc-50/50">
            {loading ? (
              <div className="py-12 flex justify-center"><div className="spinner" /></div>
            ) : messages.length === 0 ? (
              <div className="empty-state py-16">
                <HiOutlineChatAlt2 className="text-4xl text-zinc-400 mx-auto" />
                <p className="text-zinc-600 text-xs mt-2">No messages sent yet</p>
                <p className="text-zinc-500 text-[11px]">Be the first to start the group discussion!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender === user?._id;
                const badge = roleBadgeStyle[msg.senderRole] || roleBadgeStyle.participant;
                const Icon = badge.icon;

                let displayName = "";
                if (msg.senderRole === "participant") {
                  displayName = msg.teamName || "Participant Team";
                } else {
                  displayName = msg.senderName;
                }

                return (
                  <div
                    key={msg._id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"} space-y-1`}
                  >
                    {/* Sender Identity & Role Badge */}
                    <div className="flex items-center gap-1.5 text-[11px] font-bold">
                      <span className={`px-2 py-0.5 rounded-md border flex items-center gap-1 font-extrabold ${badge.bg}`}>
                        <Icon className="text-xs" /> [{badge.tag}]
                      </span>
                      <span className="text-zinc-900">{displayName}</span>
                      <span className="text-[10px] text-zinc-500 font-medium ml-1">
                        {format(new Date(msg.createdAt), "h:mm a")}
                      </span>
                    </div>

                    {/* Message Content Bubble */}
                    <div
                      className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed break-words shadow-xs ${
                        isMe
                          ? "bg-black text-white rounded-tr-none"
                          : "bg-white text-zinc-900 border border-zinc-200 rounded-tl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Bar */}
          <form onSubmit={handleSend} className="p-3 border-t border-zinc-200 bg-white flex items-center gap-2">
            <input
              type="text"
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder={`Message as ${user?.role === "participant" ? "Team Member" : user?.name}...`}
              className="flex-1 bg-white border border-zinc-300 focus:border-black text-black text-xs rounded-xl px-3.5 py-2.5 outline-none transition-colors placeholder:text-zinc-400"
            />

            <button
              type="submit"
              disabled={!inputContent.trim() || sending}
              className="btn-primary text-xs px-4 py-2.5 flex items-center gap-1.5 font-bold disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <HiOutlinePaperAirplane className="rotate-90" />
              {sending ? "..." : "Send"}
            </button>
          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GlobalChatDrawer;
