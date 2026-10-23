import { useState, useEffect } from "react";
import Topbar from "./Topbar";
import { Users, Shield, Trash2, UserPlus } from "lucide-react";
import api from "../api";
import { useAuth } from "./AuthContext";

export default function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ students: 0, teachers: 0, courses: 0, notices: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [usersRes, studentsRes, teachersRes, coursesRes, noticesRes] = await Promise.all([
          api.get("/users"),
          api.get("/students"),
          api.get("/teachers"),
          api.get("/courses"),
          api.get("/notices"),
        ]);
        setUsers(usersRes.data);
        setStats({
          students: studentsRes.data.length,
          teachers: teachersRes.data.length,
          courses: coursesRes.data.length,
          notices: noticesRes.data.length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting user");
    }
  };

  const cards = [
    { label: "Total Students", value: stats.students, color: "bg-indigo-50 text-indigo-600" },
    { label: "Total Teachers", value: stats.teachers, color: "bg-emerald-50 text-emerald-600" },
    { label: "Total Courses", value: stats.courses, color: "bg-amber-50 text-amber-600" },
    { label: "Total Notices", value: stats.notices, color: "bg-rose-50 text-rose-600" },
  ];

  return (
    <div>
      <Topbar title="Admin Panel" />
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Shield size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Admin Control Panel</h1>
              <p className="text-slate-500 text-sm">System overview & user management</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map((c) => (
            <div key={c.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <p className="text-sm text-slate-500">{c.label}</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {loading ? "..." : c.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Current Admin Info */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <UserPlus size={18} className="text-indigo-500" /> Logged in Admin
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-lg">{user?.name}</p>
              <p className="text-sm text-slate-500">{user?.email}</p>
              <span className="inline-block mt-1 text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 font-medium capitalize">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Users size={18} className="text-indigo-500" /> System Users
            </h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium">
              {users.length} users
            </span>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-5 py-3.5 font-semibold">User</th>
                <th className="px-5 py-3.5 font-semibold">Email</th>
                <th className="px-5 py-3.5 font-semibold">Role</th>
                <th className="px-5 py-3.5 font-semibold">Joined</th>
                <th className="px-5 py-3.5 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center text-slate-400">
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center text-slate-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <p className="font-medium text-slate-800 text-sm">{u.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                          u.role === "admin"
                            ? "bg-indigo-50 text-indigo-600"
                            : u.role === "teacher"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-5 py-3.5">
                      {u._id !== user?.id && (
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-2 rounded-lg hover:bg-rose-50 text-rose-500"
                          title="Delete user"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}