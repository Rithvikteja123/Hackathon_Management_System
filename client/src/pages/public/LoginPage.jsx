import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiArrowRight } from "react-icons/hi";
import { RiRocketLine } from "react-icons/ri";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || null;
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const getRoleRedirect = (role) => {
    const map = { admin: "/admin", organizer: "/organizer", participant: "/participant", judge: "/judge" };
    const invalidFrom = !from || ["/unauthorized", "/login", "/signup"].includes(from);
    return invalidFrom ? (map[role] || "/") : from;
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const user = await login(data);
      toast.success(`Welcome back, ${user.name}! 👋`);
      navigate(getRoleRedirect(user.role), { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-white text-zinc-900 flex flex-col lg:flex-row">
      {/* Left side — Decorative branding */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-zinc-50 p-8 flex-col justify-between border-r border-zinc-200">
        <div className="blob w-80 h-80 bg-black/5 -top-20 -left-20" />
        <div className="blob w-72 h-72 bg-zinc-400/8 bottom-10 right-10" style={{ animationDelay: "3s" }} />

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-8 h-8 bg-black flex items-center justify-center font-black text-white text-base shadow-xs">
            ◈
          </div>
          <span className="font-black text-lg tracking-tight text-black">
            Co<span className="text-zinc-400 font-black">Build</span>
          </span>
        </Link>

        {/* Hero Card */}
        <div className="relative z-10 max-w-md my-auto py-4">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-black leading-tight mb-3">
            Welcome back to <span className="gradient-text">CoBuild</span>
          </h2>
          <p className="text-zinc-600 text-xs leading-relaxed mb-6">
            Access your custom dashboard, manage your hackathons, evaluate assigned submissions, or check live rankings.
          </p>

          <div className="card-glass p-4 border border-zinc-200 bg-white">
            <p className="text-[11px] text-zinc-800 font-semibold uppercase tracking-wider mb-1">◈ Platform Highlight</p>
            <p className="text-xs text-zinc-600">
              Role-based authorization guarantees that Participants, Organizers, Judges, and Admins operate with complete security and separation.
            </p>
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-zinc-500">
          © {new Date().getFullYear()} CoBuild. Built by Rithvik.
        </div>
      </div>

      {/* Right side — Form (Compact Single Page Layout) */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-6 overflow-y-auto bg-white">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-sm my-auto py-2"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center">
              <RiRocketLine className="text-white text-base font-bold" />
            </div>
            <span className="font-extrabold text-lg text-black">Co<span className="text-zinc-400 font-extrabold">Build</span></span>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-black tracking-tight">Sign In</h1>
              <p className="text-zinc-600 text-xs mt-0.5">Enter your email and password.</p>
            </div>
            <Link to="/" className="text-xs font-semibold text-zinc-700 hover:text-black flex items-center gap-1 bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 px-3 py-1 rounded-lg transition-all">
              ← Home
            </Link>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Email */}
            <div>
              <label className="input-label text-[11px] mb-1" htmlFor="login-email">Email Address</label>
              <div className="relative flex items-center">
                <HiOutlineMail className="absolute left-3 text-zinc-400 text-base pointer-events-none z-10" />
                <input
                  {...register("email")}
                  type="email"
                  id="login-email"
                  placeholder="you@example.com"
                  className={`input-field input-with-icon-left !py-2 !text-xs bg-white border-zinc-200 focus:border-black text-black ${errors.email ? "error" : ""}`}
                />
              </div>
              {errors.email && <p className="input-error text-[10px]">⚠ {errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="input-label text-[11px] mb-1" htmlFor="login-password">Password</label>
              <div className="relative flex items-center">
                <HiOutlineLockClosed className="absolute left-3 text-zinc-400 text-base pointer-events-none z-10" />
                <input
                  {...register("password")}
                  type={showPass ? "text" : "password"}
                  id="login-password"
                  placeholder="••••••••"
                  className={`input-field input-with-icon-left input-with-icon-right !py-2 !text-xs bg-white border-zinc-200 focus:border-black text-black ${errors.password ? "error" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 text-zinc-400 hover:text-zinc-700 z-10 cursor-pointer"
                >
                  {showPass ? <HiOutlineEyeOff size={16} /> : <HiOutlineEye size={16} />}
                </button>
              </div>
              {errors.password && <p className="input-error text-[10px]">⚠ {errors.password.message}</p>}
            </div>

            <button
              type="submit"
              id="login-submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 bg-black text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-zinc-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In <HiArrowRight className="text-sm" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-zinc-600 mt-4">
            Don't have an account yet?{" "}
            <Link to="/signup" className="text-black hover:text-zinc-700 font-semibold underline underline-offset-4">
              Create a free account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
