import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { leaderboardAPI, hackathonAPI } from "../../services/apiServices";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiTrophyLine, RiMedalLine, RiAwardLine,
} from "react-icons/ri";
import {
  HiOutlineCode, HiOutlineExternalLink, HiOutlineSearch,
  HiOutlineSparkles, HiOutlineUserGroup, HiOutlineShieldCheck,
} from "react-icons/hi";
import { FaGithub } from "react-icons/fa";

const LeaderboardPage = () => {
  const [params] = useSearchParams();
  const hackathonId = params.get("hackathon");
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState(hackathonId || "");
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hackathonInfo, setHackathonInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    hackathonAPI.getAll({ limit: 100 })
      .then(r => {
        const list = r.data.data.hackathons || [];
        setHackathons(list);
        if (!hackathonId && list.length > 0) {
          setSelectedHackathon(list[0]._id);
        }
      })
      .catch(console.error);
  }, [hackathonId]);

  useEffect(() => {
    if (!selectedHackathon) return;
    setLoading(true);
    leaderboardAPI.get(selectedHackathon)
      .then(r => setLeaderboard(r.data.data.leaderboard || []))
      .catch(() => setLeaderboard([]))
      .finally(() => setLoading(false));

    const h = hackathons.find(item => item._id === selectedHackathon);
    if (h) setHackathonInfo(h);
  }, [selectedHackathon, hackathons]);

  const filteredLeaderboard = leaderboard.filter(e =>
    e.team?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.submission?.projectName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];
  const restLeaderboard = filteredLeaderboard.filter(e => e.rank > 3);

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-black/10 selection:text-black">
      <Navbar />

      <div className="pt-28 pb-20 px-4 max-w-5xl mx-auto space-y-8">
        
        {/* Header Hero Section */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-widest shadow-xs"
          >
            <RiTrophyLine className="text-base" /> Official Live Standings
          </motion.div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-black">
            Hackathon <span className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 bg-clip-text text-transparent">Leaderboard</span>
          </h1>
          <p className="text-zinc-600 text-sm sm:text-base max-w-lg mx-auto">
            Discover the top-ranked teams and award winners evaluated by official judges.
          </p>
        </div>

        {/* Hackathon Event Selector & Info Card */}
        <div className="card bg-white border-zinc-200 p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center text-xl font-bold border border-amber-200 shadow-xs">
                🏆
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Active Event</p>
                <h2 className="text-base font-extrabold text-black">
                  {hackathonInfo ? hackathonInfo.title : "Select a Hackathon"}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedHackathon}
                onChange={e => setSelectedHackathon(e.target.value)}
                className="bg-white border border-zinc-300 text-black text-xs sm:text-sm font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:border-black transition-all cursor-pointer sm:w-72 shadow-xs"
              >
                <option value="">-- Select Hackathon Event --</option>
                {hackathons.map(h => (
                  <option key={h._id} value={h._id}>{h.title}</option>
                ))}
              </select>
            </div>
          </div>

          {hackathonInfo && (
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-zinc-200 text-xs text-zinc-600">
              <span className="badge badge-primary text-[10px] font-bold capitalize">
                {hackathonInfo.status?.replace(/_/g, " ")}
              </span>
              <span>Mode: <strong className="text-zinc-900 capitalize">{hackathonInfo.mode}</strong></span>
              <span>Theme: <strong className="text-zinc-900">{hackathonInfo.theme}</strong></span>
              {hackathonInfo.prizePool && (
                <span className="text-amber-800 font-bold ml-auto flex items-center gap-1">
                  💰 Prize Pool: {hackathonInfo.prizePool}
                </span>
              )}
            </div>
          )}
        </div>

        {!selectedHackathon && (
          <div className="empty-state py-20 card border-dashed border-zinc-200 bg-white">
            <RiTrophyLine className="text-5xl text-zinc-400 mb-2" />
            <p className="text-black text-sm font-semibold">Please select a hackathon above to view live standings</p>
          </div>
        )}

        {loading && (
          <div className="space-y-4 py-8">
            <div className="grid grid-cols-3 gap-4 h-64">
              <div className="skeleton rounded-2xl" />
              <div className="skeleton rounded-2xl" />
              <div className="skeleton rounded-2xl" />
            </div>
            {[1, 2, 3].map(i => <div key={i} className="skeleton h-16 rounded-xl" />)}
          </div>
        )}

        {!loading && selectedHackathon && leaderboard.length === 0 && (
          <div className="empty-state py-16 card border-zinc-200 bg-white text-center space-y-2">
            <HiOutlineSparkles className="text-4xl text-amber-500 mx-auto" />
            <p className="text-black font-bold text-base">Evaluations in Progress</p>
            <p className="text-zinc-600 text-xs max-w-sm mx-auto">
              Judges are currently reviewing team project submissions. Standings will be announced here once evaluations are published.
            </p>
          </div>
        )}

        {!loading && leaderboard.length > 0 && (
          <div className="space-y-10">

            {/* 🏆 TOP 3 PODIUM SECTION 🏆 */}
            <div className="pt-6 pb-2">
              <h3 className="text-xs font-bold text-center text-amber-800 uppercase tracking-widest mb-6 flex items-center justify-center gap-2">
                <HiOutlineSparkles /> Top Ranked Winners Podium <HiOutlineSparkles />
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end max-w-4xl mx-auto">

                {/* 🥈 SECOND PLACE (SLOT 1 ON DESKTOP) */}
                {top2 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="order-2 md:order-1 card bg-gradient-to-b from-slate-50 to-white border-slate-300 p-5 rounded-2xl text-center space-y-3 relative shadow-md hover:border-slate-400 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 border border-slate-300 flex items-center justify-center text-2xl font-black mx-auto shadow-xs">
                      🥈
                    </div>
                    <span className="badge bg-slate-100 text-slate-800 border-slate-300 text-[10px] uppercase font-extrabold tracking-wider">
                      2nd Runner Up
                    </span>

                    <div>
                      <h4 className="text-base font-extrabold text-black group-hover:text-slate-800 truncate">
                        {top2.team?.name}
                      </h4>
                      <p className="text-xs text-zinc-600 truncate mt-0.5">{top2.submission?.projectName}</p>
                    </div>

                    <div className="bg-zinc-100 border border-zinc-200 py-2 px-3 rounded-xl">
                      <p className="text-[10px] text-zinc-500 uppercase font-bold">Score</p>
                      <p className="text-2xl font-black text-slate-900">{top2.averageScore} <span className="text-xs font-semibold text-zinc-500">pts</span></p>
                    </div>

                    {/* Links */}
                    <div className="flex items-center justify-center gap-3 pt-1">
                      {top2.submission?.githubRepo && (
                        <a href={top2.submission.githubRepo} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-600 hover:text-black flex items-center gap-1">
                          <FaGithub /> Repo
                        </a>
                      )}
                      {top2.submission?.liveDemoUrl && (
                        <a href={top2.submission.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-semibold">
                          <HiOutlineExternalLink /> Demo
                        </a>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="order-2 md:order-1 card border-dashed border-zinc-200 p-6 text-center text-zinc-500 text-xs opacity-50 bg-white">
                    2nd Place TBD
                  </div>
                )}

                {/* 🥇 FIRST PLACE (CENTER TALLER PODIUM) */}
                {top1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="order-1 md:order-2 card bg-gradient-to-b from-amber-50 to-white border-amber-400 p-6 rounded-3xl text-center space-y-4 relative shadow-lg hover:border-amber-500 transition-all scale-105 group z-10"
                  >
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white font-extrabold text-[10px] uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md flex items-center gap-1">
                      👑 1ST PLACE WINNER
                    </div>

                    <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 border-2 border-amber-400 flex items-center justify-center text-3xl font-black mx-auto shadow-sm mt-2">
                      🥇
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-black group-hover:text-amber-900 transition-colors truncate">
                        {top1.team?.name}
                      </h3>
                      <p className="text-xs font-semibold text-amber-800 truncate mt-0.5">{top1.submission?.projectName}</p>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 py-2.5 px-4 rounded-2xl shadow-xs">
                      <p className="text-[10px] text-amber-800 uppercase font-extrabold tracking-wider">Grand Champion Score</p>
                      <p className="text-3xl font-black text-amber-800">{top1.averageScore} <span className="text-xs font-bold text-zinc-600">pts</span></p>
                    </div>

                    {/* Links */}
                    <div className="flex items-center justify-center gap-4 pt-1">
                      {top1.submission?.githubRepo && (
                        <a href={top1.submission.githubRepo} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-700 hover:text-black flex items-center gap-1 font-semibold">
                          <FaGithub /> GitHub Repo
                        </a>
                      )}
                      {top1.submission?.liveDemoUrl && (
                        <a href={top1.submission.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-bold">
                          <HiOutlineExternalLink /> Live Demo
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* 🥉 THIRD PLACE (SLOT 3 ON DESKTOP) */}
                {top3 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="order-3 card bg-gradient-to-b from-amber-100/40 to-white border-amber-300 p-5 rounded-2xl text-center space-y-3 relative shadow-md hover:border-amber-400 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center text-2xl font-black mx-auto shadow-xs">
                      🥉
                    </div>
                    <span className="badge bg-amber-100 text-amber-800 border-amber-300 text-[10px] uppercase font-extrabold tracking-wider">
                      3rd Place
                    </span>

                    <div>
                      <h4 className="text-base font-extrabold text-black group-hover:text-amber-800 truncate">
                        {top3.team?.name}
                      </h4>
                      <p className="text-xs text-zinc-600 truncate mt-0.5">{top3.submission?.projectName}</p>
                    </div>

                    <div className="bg-zinc-100 border border-zinc-200 py-2 px-3 rounded-xl">
                      <p className="text-[10px] text-zinc-500 uppercase font-bold">Score</p>
                      <p className="text-2xl font-black text-amber-800">{top3.averageScore} <span className="text-xs font-semibold text-zinc-500">pts</span></p>
                    </div>

                    {/* Links */}
                    <div className="flex items-center justify-center gap-3 pt-1">
                      {top3.submission?.githubRepo && (
                        <a href={top3.submission.githubRepo} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-600 hover:text-black flex items-center gap-1">
                          <FaGithub /> Repo
                        </a>
                      )}
                      {top3.submission?.liveDemoUrl && (
                        <a href={top3.submission.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-semibold">
                          <HiOutlineExternalLink /> Demo
                        </a>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="order-3 card border-dashed border-zinc-200 p-6 text-center text-zinc-500 text-xs opacity-50 bg-white">
                    3rd Place TBD
                  </div>
                )}

              </div>
            </div>

            {/* FULL STANDINGS TABLE / LIST */}
            <div className="space-y-4 pt-4 border-t border-zinc-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-2">
                  <HiOutlineShieldCheck className="text-amber-700 text-base" /> Full Team Leaderboard
                </h3>

                <div className="relative w-full sm:w-64">
                  <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm pointer-events-none" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search team or project…"
                    className="input-field pl-9 text-xs py-2 bg-white border-zinc-200 text-black"
                  />
                </div>
              </div>

              <div className="grid gap-3">
                {filteredLeaderboard.map((entry, idx) => (
                  <motion.div
                    key={entry.submission?._id || idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={`card flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 transition-all bg-white ${
                      entry.rank === 1 ? "border-amber-400 bg-amber-50/50" :
                      entry.rank === 2 ? "border-slate-300 bg-slate-50/50" :
                      entry.rank === 3 ? "border-amber-300 bg-amber-50/30" :
                      "hover:border-zinc-400"
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Rank badge */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                        entry.rank === 1 ? "bg-amber-100 text-amber-800 border border-amber-300" :
                        entry.rank === 2 ? "bg-slate-100 text-slate-800 border border-slate-300" :
                        entry.rank === 3 ? "bg-amber-100 text-amber-800 border border-amber-300" :
                        "bg-zinc-100 text-zinc-700 border border-zinc-200"
                      }`}>
                        {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : `#${entry.rank}`}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-extrabold text-black truncate">{entry.submission?.projectName}</h4>
                          <span className="text-xs text-zinc-700 font-bold">({entry.team?.name})</span>
                        </div>
                        {entry.submission?.techStack?.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap mt-1">
                            {entry.submission.techStack.map(t => (
                              <span key={t} className="text-[10px] bg-zinc-100 border border-zinc-200 text-zinc-700 px-2 py-0.5 rounded-md">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0 self-end sm:self-auto">
                      <div className="text-right">
                        <p className={`text-xl font-black ${
                          entry.rank === 1 ? "text-amber-800" :
                          entry.rank === 2 ? "text-slate-800" :
                          entry.rank === 3 ? "text-amber-800" : "text-black"
                        }`}>
                          {entry.averageScore} <span className="text-xs font-semibold text-zinc-500">pts</span>
                        </p>
                        <p className="text-[10px] text-zinc-500">{entry.reviewCount} review{entry.reviewCount !== 1 ? "s" : ""}</p>
                      </div>

                      <div className="flex items-center gap-2 pl-2 border-l border-zinc-200">
                        {entry.submission?.githubRepo && (
                          <a href={entry.submission.githubRepo} target="_blank" rel="noopener noreferrer"
                            className="p-2 text-zinc-600 hover:text-black bg-zinc-100 border border-zinc-200 rounded-lg transition-colors" title="View Repository">
                            <FaGithub className="text-sm" />
                          </a>
                        )}
                        {entry.submission?.liveDemoUrl && (
                          <a href={entry.submission.liveDemoUrl} target="_blank" rel="noopener noreferrer"
                            className="p-2 text-emerald-700 hover:text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg transition-colors" title="View Live Demo">
                            <HiOutlineExternalLink className="text-sm" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
