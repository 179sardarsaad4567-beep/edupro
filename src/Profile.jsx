import Topbar from "./component/Topbar";
import { useAuth } from "./component/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div>
      <Topbar title="Profile" />
      <div className="p-8 max-w-2xl">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl font-bold">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{user?.name}</h1>
              <p className="text-slate-500 capitalize">{user?.role} Account</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-slate-50">
              <span className="text-sm text-slate-500">Email</span>
              <span className="text-sm font-medium text-slate-800">{user?.email}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-slate-50">
              <span className="text-sm text-slate-500">Role</span>
              <span className="text-sm font-medium text-slate-800 capitalize">{user?.role}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-slate-50">
              <span className="text-sm text-slate-500">Institute</span>
              <span className="text-sm font-medium text-slate-800">EduSphere Academy</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-sm text-slate-500">Status</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}