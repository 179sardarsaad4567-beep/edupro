import { useState, useEffect } from "react";
import Topbar from "./component/Topbar";
import { Check, X, Calendar } from "lucide-react";
import api from "./api";

export default function Attendance() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/attendance");
        setRecords(res.data.map((s) => ({ ...s, present: true })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const toggle = (id) => {
    setRecords(records.map((r) => (r._id === id ? { ...r, present: !r.present } : r)));
  };

  const saveAttendance = async () => {
    try {
      await api.post("/attendance", {
        date,
        records: records.map((r) => ({ studentId: r._id, present: r.present })),
      });
      alert("Attendance saved successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error saving attendance");
    }
  };

  const presentCount = records.filter((r) => r.present).length;
  const percent = records.length ? Math.round((presentCount / records.length) * 100) : 0;

  return (
    <div>
      <Topbar title="Attendance" />
      <div className="p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Attendance</h1>
            <p className="text-slate-500 text-sm mt-1">Mark daily attendance</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
              <Calendar size={16} className="text-slate-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="text-sm focus:outline-none"
              />
            </div>
            <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-sm font-semibold">
              {presentCount}/{records.length} ({percent}%)
            </div>
            <button
              onClick={saveAttendance}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-500"
            >
              Save Attendance
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-5 py-3.5 font-semibold">Student</th>
                <th className="px-5 py-3.5 font-semibold">ID</th>
                <th className="px-5 py-3.5 font-semibold">Course</th>
                <th className="px-5 py-3.5 font-semibold">Overall %</th>
                <th className="px-5 py-3.5 font-semibold text-center">Today</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center text-slate-400">
                    Loading...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center text-slate-400">
                    No active students found
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                          {r.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <p className="font-medium text-slate-800 text-sm">{r.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{r.studentId}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{r.course}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{r.attendance || 0}%</td>
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => toggle(r._id)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                          r.present
                            ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                            : "bg-rose-100 text-rose-500 hover:bg-rose-200"
                        }`}
                      >
                        {r.present ? <Check size={18} /> : <X size={18} />}
                      </button>
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