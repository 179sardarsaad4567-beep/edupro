// import { NavLink } from "react-router-dom";
// import {
//   LayoutDashboard, Users, GraduationCap, BookOpen,
//   CalendarCheck, FileText, CreditCard, Bell, User, LogOut, Shield
// } from "lucide-react";
// import { useAuth } from "./AuthContext";

// const links = [
//   { to: "/", icon: LayoutDashboard, label: "Dashboard" },
//   { to: "/students", icon: Users, label: "Students" },
//   { to: "/teachers", icon: GraduationCap, label: "Teachers" },
//   { to: "/courses", icon: BookOpen, label: "Courses" },
//   { to: "/attendance", icon: CalendarCheck, label: "Attendance" },
//   { to: "/results", icon: FileText, label: "Results" },
//   { to: "/fees", icon: CreditCard, label: "Fees" },
//   { to: "/notices", icon: Bell, label: "Notices" },
//   { to: "/admin", icon: Shield, label: "Admin" },
//   { to: "/profile", icon: User, label: "Profile" },
// ];

// export default function Sidebar() {
//   const { user, logout } = useAuth();

//   return (
//     <aside className="fixed inset-y-0 left-0 w-64 bg-[#0f172a] text-slate-300 flex flex-col z-50">
//       <div className="p-6 flex items-center gap-3">
//         <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-bold text-lg">
//           E
//         </div>
//         <div>
//           <h1 className="text-white font-bold text-lg leading-tight">EduSphere</h1>
//           <p className="text-[10px] tracking-widest text-slate-400">PRO MANAGEMENT</p>
//         </div>
//       </div>

//       <nav className="flex-1 px-3 space-y-1 mt-4 overflow-y-auto">
//         {links.map((link) => (
//           <NavLink
//             key={link.to}
//             to={link.to}
//             end={link.to === "/"}
//             className={({ isActive }) =>
//               `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
//                 isActive
//                   ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40"
//                   : "hover:bg-slate-800 hover:text-white"
//               }`
//             }
//           >
//             <link.icon size={18} />
//             {link.label}
//           </NavLink>
//         ))}
//       </nav>

//       <div className="p-4 border-t border-slate-800">
//         <div className="flex items-center gap-3 mb-3">
//           <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
//             {user?.name?.[0]?.toUpperCase() || "A"}
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
//             <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
//           </div>
//         </div>
//         <button
//           onClick={logout}
//           className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-red-600/20 hover:text-red-400 text-sm transition-all"
//         >
//           <LogOut size={16} /> Logout
//         </button>
//       </div>
//     </aside>
//   );
// }


import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  FileText,
  Wallet,
  Bell,
  Shield,
  User,
  LogOut,
  X,
} from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/students", label: "Students", icon: Users },
  { to: "/teachers", label: "Teachers", icon: GraduationCap },
  { to: "/courses", label: "Courses", icon: BookOpen },
  { to: "/attendance", label: "Attendance", icon: ClipboardList },
  { to: "/results", label: "Results", icon: FileText },
  { to: "/fees", label: "Fees", icon: Wallet },
  { to: "/notices", label: "Notices", icon: Bell },
  { to: "/admin", label: "Admin", icon: Shield },
  { to: "/profile", label: "Profile", icon: User },
];

export default function Sidebar({ onClose }) {
  return (
    <aside className="h-full bg-slate-900 text-white flex flex-col w-64">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center font-bold">
            E
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">EduSphere</p>
            <p className="text-[10px] text-slate-400">PRO MANAGEMENT</p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden p-1">
          <X size={20} />
        </button>
      </div>

      {/* Links */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                isActive
                  ? "bg-violet-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-700">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}