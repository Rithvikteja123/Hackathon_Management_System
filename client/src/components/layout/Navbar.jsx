import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import {
  HiOutlineMenuAlt3, HiOutlineX, HiOutlineChevronDown,
  HiOutlineUser, HiOutlineLogout, HiOutlineCog, HiOutlineChatAlt2,
} from "react-icons/hi";
import { RiRocketLine } from "react-icons/ri";
import toast from "react-hot-toast";
import GlobalChatDrawer from "../chat/GlobalChatDrawer";

const navLinks = [
  { label: "Hackathons", href: "/hackathons" },
  { label: "Leaderboard", href: "/leaderboard" },
];

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { isChatOpen, openChat, closeChat, unreadCount } = useChat();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    const map = {
      admin: "/admin",
      organizer: "/organizer",
      participant: "/participant",
      judge: "/judge",
    };
    return map[user.role] || "/";
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-xs"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-black flex items-center justify-center font-black text-white text-base shadow-xs group-hover:scale-105 transition-transform">
              ◈
            </div>
            <span className="font-black text-lg tracking-tight text-black">
              Co<span className="text-zinc-400 font-black">Build</span>
            </span>
          </Link>

          {/* Right Desktop Nav & Auth Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Hackathons Button */}
            <Link
              to="/hackathons"
              className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all ${
                location.pathname.startsWith("/hackathons")
                  ? "text-black bg-zinc-100 border-zinc-300 font-bold shadow-xs"
                  : "text-zinc-700 hover:text-black border-zinc-200 bg-white hover:bg-zinc-100 hover:border-zinc-300"
              }`}
            >
              Hackathons
            </Link>

            {/* Leaderboard Button */}
            <Link
              to="/leaderboard"
              className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all ${
                location.pathname.startsWith("/leaderboard")
                  ? "text-black bg-zinc-100 border-zinc-300 font-bold shadow-xs"
                  : "text-zinc-700 hover:text-black border-zinc-200 bg-white hover:bg-zinc-100 hover:border-zinc-300"
              }`}
            >
              Leaderboard
            </Link>

            {/* 💬 TOP GLOBAL GROUP CHAT BUTTON WITH UNREAD COUNTER BADGE */}
            {isAuthenticated && (
              <button
                onClick={openChat}
                className="relative px-3.5 py-2 text-xs font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-lg transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <HiOutlineChatAlt2 className="text-sm text-indigo-600" />
                <span>💬 Group Chat</span>

                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-lg shadow-red-500/40 animate-bounce border border-red-300 ml-0.5">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  title={user?.name}
                  className="w-9 h-9 rounded-full bg-white border border-zinc-300 hover:border-black hover:scale-105 transition-all flex items-center justify-center overflow-hidden cursor-pointer shadow-xs"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="text-black text-xs font-extrabold uppercase">
                      {user?.name?.[0]?.toUpperCase()}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {dropOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 rounded-xl bg-white border border-zinc-200 shadow-xl overflow-hidden"
                    >
                      <div className="px-3 py-2.5 border-b border-zinc-200">
                        <p className="text-xs text-zinc-500 font-medium">Signed in as</p>
                        <p className="text-sm text-zinc-900 font-semibold truncate">{user?.email}</p>
                        <span className="badge badge-primary mt-1">{user?.role}</span>
                      </div>
                      <div className="py-1">
                        <Link
                          to={getDashboardLink()}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 hover:text-black transition-colors"
                        >
                          <HiOutlineCog className="text-zinc-500" />
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 hover:text-black transition-colors"
                        >
                          <HiOutlineUser className="text-zinc-500" />
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <HiOutlineLogout />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-zinc-700 hover:text-black rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 hover:border-zinc-300 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary btn-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <HiOutlineX size={20} /> : <HiOutlineMenuAlt3 size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/98 backdrop-blur-md border-t border-zinc-200"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block px-3 py-2 rounded-lg text-zinc-700 hover:text-black hover:bg-zinc-100 text-sm font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-zinc-200 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <Link to={getDashboardLink()} className="btn-secondary btn-sm text-center">Dashboard</Link>
                    <button onClick={handleLogout} className="btn-danger btn-sm">Logout</button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link to="/login" className="btn-secondary btn-sm text-center justify-center">Sign In</Link>
                    <Link to="/signup" className="btn-primary btn-sm text-center justify-center">Sign Up</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Group Chat Drawer */}
      <GlobalChatDrawer isOpen={isChatOpen} onClose={closeChat} />
    </nav>
  );
};

export default Navbar;
