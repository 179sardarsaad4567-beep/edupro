import { useState, useEffect } from "react";
import Topbar from "./component/Topbar";
import { Search, Plus, Pencil, Trash2, X } from "lucide-react";
import api from "./api";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "", email: "", course: "Computer Science", semester: "1st", phone: "", status: "Active"
  });
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/students", { params: { search } });
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isCurrentRequest = true;
    const loadStudents = async () => {
      try {
        const res = await api.get("/students", { params: { search } });
        if (isCurrentRequest) setStudents(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isCurrentRequest) setLoading(false);
      }
    };
    loadStudents();
    return () => {
      isCurrentRequest = false;
    };
  }, [search]);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", email: "", course: "Computer Science", semester: "1st", phone: "", status: "Active" });
    setShowForm(true);
  };

  const openEdit = (student) => {
    setEditing(student);
    setForm({
      name: student.name,
      email: student.email,
      course: student.course,
      semester: student.semester,
      phone: student.phone || "",
      status: student.status,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/students/${editing._id}`, form);
      } else {
        await api.post("/students", form);
      }
      setShowForm(false);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving student");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await api.delete(`/students/${id}`);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting student");
    }
  };

  return (
    <div>
      <Topbar title="Students" />
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Student Directory</h1>
            <p className="text-slate-500 text-sm mt-1">Manage all student records</p>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200">
            <Plus size={18} /> Add Student
          </button>
        </div>

        <div className="relative mb-5 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, ID or course..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-5 py-3.5 font-semibold">Student</th>
                <th className="px-5 py-3.5 font-semibold">ID</th>
                <th className="px-5 py-3.5 font-semibold">Course</th>
                <th className="px-5 py-3.5 font-semibold">Semester</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-400">Loading...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-400">No students found</td></tr>
              ) : students.map((s) => (
                <tr key={s._id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                        {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{s.name}</p>
                        <p className="text-xs text-slate-500">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{s.studentId}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{s.course}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{s.semester}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      s.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                    }`}>{s.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(s)} className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(s._id)} className="p-2 rounded-lg hover:bg-rose-50 text-rose-500"><Trash2 size={15} /></button>
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
              <h2 className="text-lg font-bold text-slate-800">{editing ? "Edit Student" : "Add New Student"}</h2>
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
                <label className="block text-xs font-semibold text-slate-500 mb-1">Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Course</label>
                  <select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>Computer Science</option>
                    <option>Software Engineering</option>
                    <option>Data Science</option>
                    <option>Information Technology</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Semester</label>
                  <select value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {["1st","2nd","3rd","4th","5th","6th","7th","8th"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
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