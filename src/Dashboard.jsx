import { useState, useEffect } from "react";
import Topbar from "./component/Topbar";
import { Users, GraduationCap, BookOpen, TrendingUp, Bell } from "lucide-react";
import api from "./api";

export default function Dashboard() {
  const [stats, setStats] = useState({ students: 0, teachers: 0, courses: 0, notices: 0 });
  const [recentStudents, setRecentStudents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, teachersRes, coursesRes, noticesRes] = await Promise.all([
          api.get("/students"),
          api.get("/teachers"),
          api.get("/courses"),
          api.get("/notices"),
        ]);

        setStats({
          students: studentsRes.data.length,
          teachers: teachersRes.data.length,
          courses: coursesRes.data.length,
          notices: noticesRes.data.length,
        });
        setRecentStudents(studentsRes.data.slice(0, 5));
        setNotices(noticesRes.data.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cards = [
    { label: "Total Students", value: stats.students, icon: Users, color: "text-indigo-500", bg: "bg-indigo-50" },
    { label: "Active Teachers", value: stats.teachers, icon: GraduationCap, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Total Courses", value: stats.courses, icon: BookOpen, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Notices", value: stats.notices, icon: Bell, color: "text-rose-500", bg: "bg-rose-50" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12 overflow-x-hidden">
      <Topbar title="Dashboard" />
      
      {/* Main Container */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Welcome back 👋</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Here's what's happening in your institute today.</p>
        </div>

        {/* Stats Cards Grid: 1 col on mobile, 2 on tablet, 4 on large screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8">
          {cards.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
                <TrendingUp size={16} className="text-emerald-500" />
              </div>
              <p className="text-slate-500 text-xs sm:text-sm mt-3 sm:mt-4">{stat.label}</p>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">
                {loading ? "..." : stat.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Content Layout: 1 col on mobile, 3 cols on lg screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Students Section (Takes 2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 text-sm sm:text-base">Recent Students</h3>
              <span className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg font-medium">
                {stats.students} Total
              </span>
            </div>
            
            <div className="divide-y divide-slate-50">
              {recentStudents.length === 0 ? (
                <p className="px-5 py-8 text-center text-slate-400 text-sm">No students yet</p>
              ) : recentStudents.map((s) => (
                <div key={s._id} className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
                      {s.name ? s.name.split(" ").map((n) => n[0]).join("").slice(0, 2) : "ST"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 text-xs sm:text-sm truncate">{s.name}</p>
                      <p className="text-[11px] sm:text-xs text-slate-500 truncate">{s.course} {s.semester}</p>
                    </div>
                  </div>
                  <span className={`text-[11px] sm:text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${
                    s.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                  }`}>{s.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Notices Section (Takes 1 col) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-2">
              <Bell size={18} className="text-indigo-500" />
              <h3 className="font-semibold text-slate-800 text-sm sm:text-base">Latest Notices</h3>
            </div>
            
            <div className="p-4 space-y-3">
              {notices.length === 0 ? (
                <p className="text-center text-slate-400 text-sm py-6">No notices yet</p>
              ) : notices.map((n) => (
                <div key={n._id} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                      n.type === "Exam" ? "bg-rose-100 text-rose-600" :
                      n.type === "Fee" ? "bg-amber-100 text-amber-600" :
                      n.type === "Event" ? "bg-emerald-100 text-emerald-600" :
                      "bg-slate-200 text-slate-600"
                    }`}>{n.type}</span>
                    <span className="text-[10px] text-slate-400 truncate">{n.date}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-700 line-clamp-2">{n.title}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}