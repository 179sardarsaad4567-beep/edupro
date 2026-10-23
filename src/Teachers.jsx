import { useState, useEffect } from "react";
import Topbar from "./component/Topbar";
import { Search, Plus, Pencil, Trash2, X } from "lucide-react";
import api from "./api";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "", email: "", subject: "", department: "CS", phone: "", status: "Active"
  });
  const [loading, setLoading] = useState(true);

  const fetchTeachers = async () => {
    try {
      const res = await api.get("/teachers", { params: { search } });
      setTeachers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isCurrentRequest = true;
    const loadTeachers = async () => {
      try {
        const res = await api.get("/teachers", { params: { search } });
        if (isCurrentRequest) setTeachers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isCurrentRequest) setLoading(false);
      }
    };
    loadTeachers();
    return () => {
      isCurrentRequest = false;
    };
  }, [search]);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", email: "", subject: "", department: "CS", phone: "", status: "Active" });
    setShowForm(true);
  };

  const openEdit = (t) => {
    setEditing(t);
    setForm({
      name: t.name, email: t.email, subject: t.subject,
      department: t.department, phone: t.phone || "", status: t.status
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/teachers/${editing._id}`, form);
      } else {
        await api.post("/teachers", form);
      }
      setShowForm(false);
      fetchTeachers();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving teacher");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this teacher?")) return;
    try {
      await api.delete(`/teachers/${id}`);
      fetchTeachers();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting teacher");
    }
  };

  return (
    <div>
      <Topbar title="Teachers" />
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Teachers</h1>
            <p className="text-slate-500 text-sm mt-1">Manage teaching staff</p>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200">
            <Plus size={18} /> Add Teacher
          </button>
        </div>

        <div className="relative mb-5 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search teachers..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-5 py-3.5 font-semibold">Teacher</th>
                <th className="px-5 py-3.5 font-semibold">ID</th>
                <th className="px-5 py-3.5 font-semibold">Subject</th>
                <th className="px-5 py-3.5 font-semibold">Department</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-400">Loading...</td></tr>
              ) : teachers.length === 0 ? (
                <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-400">No teachers found</td></tr>
              ) : teachers.map((t) => (
                <tr key={t._id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                        {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{t.name}</p>
                        <p className="text-xs text-slate-500">{t.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{t.teacherId}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{t.subject}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{t.department}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      t.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                    }`}>{t.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(t)} className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(t._id)} className="p-2 rounded-lg hover:bg-rose-50 text-rose-500"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-800">{editing ? "Edit Teacher" : "Add Teacher"}</h2>
              <button type="button" onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Email</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Subject</label>
                <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Department</label>
                  <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>CS</option><option>SE</option><option>DS</option><option>IT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>Active</option><option>Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-semibold">Cancel</button>
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold">{editing ? "Update" : "Save"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}