import { useState, useEffect } from "react";
import Topbar from "./component/Topbar";
import { Plus, X, Bell } from "lucide-react";
import api from "./api";

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", type: "General", description: "" });
  const [loading, setLoading] = useState(true);

  const fetchNotices = async () => {
    try {
      const res = await api.get("/notices");
      setNotices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadNotices = async () => {
      try {
        const res = await api.get("/notices");
        setNotices(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadNotices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/notices", form);
      setShowForm(false);
      setForm({ title: "", type: "General", description: "" });
      fetchNotices();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding notice");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notice?")) return;
    try {
      await api.delete(`/notices/${id}`);
      fetchNotices();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting notice");
    }
  };

  const typeColor = {
    Exam: "bg-rose-100 text-rose-600",
    Fee: "bg-amber-100 text-amber-600",
    Event: "bg-emerald-100 text-emerald-600",
    General: "bg-slate-200 text-slate-600",
  };

  return (
    <div>
      <Topbar title="Notices" />
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Notices & Announcements</h1>
            <p className="text-slate-500 text-sm mt-1">Manage institute notices</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200">
            <Plus size={18} /> Add Notice
          </button>
        </div>

        {loading ? (
          <p className="text-center text-slate-400 py-10">Loading...</p>
        ) : (
          <div className="space-y-4">
            {notices.map((n) => (
              <div key={n._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Bell size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeColor[n.type] || typeColor.General}`}>
                      {n.type}
                    </span>
                    <span className="text-xs text-slate-400">{n.date}</span>
                  </div>
                  <h3 className="font-semibold text-slate-800">{n.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{n.description}</p>
                </div>
                <button onClick={() => handleDelete(n._id)} className="text-slate-400 hover:text-rose-500 p-1 self-start">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-800">Add Notice</h2>
              <button type="button" onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Title</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>General</option><option>Exam</option><option>Fee</option><option>Event</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
                <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-semibold">Cancel</button>
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold">Publish</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}