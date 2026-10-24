import { useState, useEffect } from "react";
import Topbar from "./component/Topbar";
import { Search, Plus, Pencil, Trash2, X, BookOpen } from "lucide-react";
import api from "./api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", duration: "4 Years", subjects: 20, status: "Active" });
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", duration: "4 Years", subjects: 20, status: "Active" });
    setShowForm(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({ name: c.name, duration: c.duration, subjects: c.subjects, status: c.status });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/courses/${editing._id}`, form);
      } else {
        await api.post("/courses", form);
      }
      setShowForm(false);
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving course");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await api.delete(`/courses/${id}`);
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting course");
    }
  };

  const filtered = courses.filter((c) =>
    `${c.name} ${c.courseId || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12 overflow-x-hidden">
      <Topbar title="Courses" />
      
      {/* Main Container with responsive padding */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Header Section: Stack on mobile, side-by-side on sm+ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Courses</h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Manage academic programs</p>
          </div>
          <button 
            onClick={openAdd}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            <Plus size={18} /> Add Course
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6 w-full max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" 
          />
        </div>

        {/* Courses Content */}
        {loading ? (
          <p className="text-center text-slate-400 py-12 text-sm">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-400 text-sm">No courses found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filtered.map((c) => (
              <div key={c._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <BookOpen size={20} className="sm:w-[22px] sm:h-[22px]" />
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      c.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                    }`}>{c.status}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 mt-3 sm:mt-4 text-base line-clamp-1">{c.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{c.courseId}</p>
                  
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-50 text-center sm:text-left">
                    <div>
                      <p className="text-[11px] text-slate-400">Duration</p>
                      <p className="text-xs sm:text-sm font-semibold text-slate-700 truncate">{c.duration}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">Students</p>
                      <p className="text-xs sm:text-sm font-semibold text-slate-700">{c.students || 0}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">Subjects</p>
                      <p className="text-xs sm:text-sm font-semibold text-slate-700">{c.subjects}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-3 border-t border-slate-50">
                  <button onClick={() => openEdit(c)} className="flex-1 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-semibold hover:bg-indigo-100 flex items-center justify-center gap-1 transition-colors">
                    <Pencil size={13} /> Edit
                  </button>
                  <button onClick={() => handleDelete(c._id)} className="flex-1 py-2 rounded-xl bg-rose-50 text-rose-500 text-xs font-semibold hover:bg-rose-100 flex items-center justify-center gap-1 transition-colors">
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Responsive Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-2xl my-auto animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h2 className="text-base sm:text-lg font-bold text-slate-800">{editing ? "Edit Course" : "Add Course"}</h2>
              <button type="button" onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"><X size={18} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Course Name</label>
                <input 
                  required 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Bachelor of Computer Science"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Duration</label>
                  <select 
                    value={form.duration} 
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                    <option>2 Years</option>
                    <option>3 Years</option>
                    <option>4 Years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Subjects</label>
                  <input 
                    type="number" 
                    value={form.subjects} 
                    onChange={(e) => setForm({ ...form, subjects: +e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
                <select 
                  value={form.status} 
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)} 
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md shadow-indigo-100 transition-colors"
                >
                  {editing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}