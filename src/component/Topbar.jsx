import { Search, Bell } from "lucide-react";
import { useAuth } from "./AuthContext";

export default function Topbar({ title }) {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>

      <div className="flex items-center gap-5">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 rounded-xl bg-slate-100 border-0 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button className="relative p-2 rounded-xl hover:bg-slate-100">
          <Bell size={18} className="text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">
            {user?.avatar}
          </div>
          <span className="text-sm font-medium text-slate-700">{user?.name}</span>
        </div>
      </div>
    </header>
  );
}