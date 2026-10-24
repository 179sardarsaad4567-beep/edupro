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
    <div className="min-h-screen bg-slate-50/50 pb-12 overflow-x-hidden">
      <Topbar title="Attendance" />
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Header Section: Stack on mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Attendance</h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Mark daily attendance</p>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Date Picker */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
              <Calendar size={16} className="text-slate-400 shrink-0" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="text-xs sm:text-sm focus:outline-none bg-transparent"
              />
            </div>
            
            {/* Percentage Badge */}
            <div className="bg-indigo-50 text-indigo-600 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold">
              {presentCount}/{records.length} ({percent}%)
            </div>

            {/* Save Button */}
            <button
              onClick={saveAttendance}
              className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-indigo-100 transition-colors"
            >
              Save Attendance
            </button>
          </div>
        </div>

        {/* Responsive Table Container */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] sm:text-xs uppercase tracking-wider">
                  <th className="px-4 sm:px-5 py-3.5 font-semibold">Student</th>
                  <th className="px-4 sm:px-5 py-3.5 font-semibold">ID</th>
                  <th className="px-4 sm:px-5 py-3.5 font-semibold">Course</th>
                  <th className="px-4 sm:px-5 py-3.5 font-semibold">Overall %</th>
                  <th className="px-4 sm:px-5 py-3.5 font-semibold text-center">Today</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-12 text-center text-slate-400 text-sm">
                      Loading...
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-12 text-center text-slate-400 text-sm">
                      No active students found
                    </td>
                  </tr>
                ) : (
                  records.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 sm:px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                            {r.name
                              ? r.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)
                              : "ST"}
                          </div>
                          <p className="font-medium text-slate-800 text-xs sm:text-sm truncate">{r.name}</p>
                        </div>
                      </td>
                      <td className="px-4 sm:px-5 py-3.5 text-xs sm:text-sm text-slate-600 truncate">{r.studentId}</td>
                      <td className="px-4 sm:px-5 py-3.5 text-xs sm:text-sm text-slate-600 truncate">{r.course}</td>
                      <td className="px-4 sm:px-5 py-3.5 text-xs sm:text-sm text-slate-600">{r.attendance || 0}%</td>
                      <td className="px-4 sm:px-5 py-3.5 text-center">
                        <button
                          onClick={() => toggle(r._id)}
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl inline-flex items-center justify-center transition-all ${
                            r.present
                              ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                              : "bg-rose-100 text-rose-500 hover:bg-rose-200"
                          }`}
                        >
                          {r.present ? <Check size={16} /> : <X size={16} />}
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
    </div>
  );
}