import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import GlobalChatDrawer from "../chat/GlobalChatDrawer";
import { useChat } from "../../context/ChatContext";
import { motion } from "framer-motion";
import { HiOutlineHome, HiOutlineChatAlt2, HiOutlineMenuAlt3 } from "react-icons/hi";

/**
 * Dashboard layout — responsive sidebar drawer + sticky top bar with Group Chat & Back to Home
 */
const DashboardLayout = ({ children }) => {
  const { isChatOpen, openChat, closeChat, unreadCount } = useChat();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white text-zinc-900">
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 ml-0 lg:ml-64 min-h-screen overflow-x-hidden"
      >
        {/* Sticky Top Bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-zinc-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Toggle Button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-zinc-700 hover:text-black hover:bg-zinc-100 border border-zinc-200 transition-colors"
              title="Open Navigation Menu"
            >
              <HiOutlineMenuAlt3 className="text-lg" />
            </button>

            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Dashboard Workspace</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* 💬 TOP GLOBAL GROUP CHAT BUTTON WITH UNREAD COUNTER BADGE */}
            <button
              onClick={openChat}
              className="relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-all shadow-xs group cursor-pointer"
            >
              <HiOutlineChatAlt2 className="text-sm text-indigo-600 group-hover:scale-110 transition-transform" />
              <span className="hidden xs:inline sm:inline">💬 Group Chat</span>
              <span className="xs:hidden sm:hidden">Chat</span>

              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-lg shadow-red-500/40 animate-bounce border border-red-300 ml-0.5">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Top Back to Home Button */}
            <Link
              to="/"
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-700 hover:text-black bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 transition-all shadow-xs"
            >
              <HiOutlineHome className="text-sm text-zinc-500" />
              <span className="hidden sm:inline">← Back to Home</span>
              <span className="sm:hidden">Home</span>
            </Link>
          </div>
        </header>

        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
          {children}
        </div>

        {/* Global Chat Drawer Component */}
        <GlobalChatDrawer isOpen={isChatOpen} onClose={closeChat} />
      </motion.main>
    </div>
  );
};

export default DashboardLayout;
