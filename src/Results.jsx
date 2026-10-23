import { useState, useEffect } from "react";
import Topbar from "./component/Topbar";
import { Plus, X } from "lucide-react";
import api from "./api";

function calcGPA(subjects) {
  if (!subjects?.length) return "0.0";
  const avg = subjects.reduce((a, s) => a + s.marks, 0) / subjects.length;
  if (avg >= 90) return "4.0";
  if (avg >= 80) return "3.7";
  if (avg >= 70) return "3.0";
  if (avg >= 60) return "2.5";
  return "2.0";
}

export default function Results() {
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    student: "",
    semester: "1st",
    subjects: [
      { name: "Subject 1", marks: 0, total: 100 },
      { name: "Subject 2", marks: 0, total: 100 },
      { name: "Subject 3", marks: 0, total: 100 },
      { name: "Subject 4", marks: 0, total: 100 },
    ],
  });

  const fetchResults = async () => {
    try {
      const [resultsRes, studentsRes] = await Promise.all([
        api.get("/results"),
        api.get("/students"),
      ]);
      setResults(resultsRes.data);
      setStudents(studentsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const updateSubject = (index, field, value) => {
    const updated = [...form.subjects];
    updated[index] = { ...updated[index], [field]: field === "marks" || field === "total" ? +value : value };
    setForm({ ...form, subjects: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/results", form);
      setShowForm(false);
      setForm({
        student: "",
        semester: "1st",
        subjects: [
          { name: "Subject 1", marks: 0, total: 100 },
          { name: "Subject 2", marks: 0, total: 100 },
          { name: "Subject 3", marks: 0, total: 100 },
          { name: "Subject 4", marks: 0, total: 100 },
        ],
      });
      fetchResults();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving result");
    }
  };

  return (
    <div>
      <Topbar title="Results" />
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Examination Results</h1>
            <p className="text-slate-500 text-sm mt-1">Student performance overview</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold"
          >
            <Plus size={18} /> Add Result
          </button>
        </div>

        {loading ? (
          <p className="text-center text-slate-400 py-10">Loading...</p>
        ) : results.length === 0 ? (
          <p className="text-center text-slate-400 py-10">No results yet. Click "Add Result"</p>
        ) : (
          <div className="space-y-5">
            {results.map((r) => {
              const student = r.student || {};
              const total = r.subjects?.reduce((a, s) => a + s.marks, 0) || 0;
              const max = r.subjects?.reduce((a, s) => a + s.total, 0) || 1;
              const percent = Math.round((total / max) * 100);
              const gpa = calcGPA(r.subjects);

              return (
                <div key={r._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">
                        {(student.name || "?")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{student.name}</p>
                        <p className="text-xs text-slate-500">
                          {student.studentId} • {student.course}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-xs text-slate-400">Percentage</p>
                        <p className="font-bold text-slate-800">{percent}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-400">GPA</p>
                        <p className="font-bold text-indigo-600">{gpa}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {r.subjects?.map((sub, i) => (
                      <div key={i} className="bg-slate-50 rounded-xl p-3">
                        <p className="text-xs text-slate-500 truncate">{sub.name}</p>
                        <p className="font-semibold text-slate-800 mt-1">
                          {sub.marks}
                          <span className="text-slate-400 text-xs">/{sub.total}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-800">Add Result</h2>
              <button type="button" onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Student</label>
                <select
                  required
                  value={form.student}
                  onChange={(e) => setForm({ ...form, student: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select student</option>
                  {students.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} ({s.studentId})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Semester</label>
                <select
                  value={form.semester}
                  onChange={(e) => setForm({ ...form, semester: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              {form.subjects.map((sub, i) => (
                <div key={i} className="grid grid-cols-3 gap-2">
                  <input
                    placeholder="Subject name"
                    value={sub.name}
                    onChange={(e) => updateSubject(i, "name", e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-sm col-span-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="number"
                    placeholder="Marks"
                    value={sub.marks}
                    onChange={(e) => updateSubject(i, "marks", e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="number"
                    placeholder="Total"
                    value={sub.total}
                    onChange={(e) => updateSubject(i, "total", e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-semibold">
                Cancel
              </button>
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold">
                Save Result
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}