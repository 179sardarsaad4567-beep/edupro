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
    <div className="min-h-screen overflow-x-hidden bg-slate-50/50 pb-12">
      <Topbar title="Attendance" />

      <main className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">Attendance</h1>
            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">Mark daily attendance</p>
          </div>

          <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:flex sm:w-auto sm:gap-3">
            <label className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <Calendar size={16} className="shrink-0 text-slate-400" aria-hidden="true" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                aria-label="Attendance date"
                className="min-w-0 w-full bg-transparent text-xs focus:outline-none sm:text-sm"
              />
            </label>

            <div className="whitespace-nowrap rounded-xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 sm:px-4 sm:text-sm">
              {presentCount}/{records.length} ({percent}%)
            </div>

            <button
              onClick={saveAttendance}
              className="col-span-2 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-100 transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:col-span-1 sm:w-auto"
            >
              Save Attendance
            </button>
          </div>
        </div>

        <section aria-label="Student attendance records">
          <div className="grid gap-3 lg:hidden">
            {loading ? (
              <div className="rounded-2xl border border-slate-100 bg-white px-4 py-12 text-center text-sm text-slate-400 shadow-sm" role="status">
                Loading...
              </div>
            ) : records.length === 0 ? (
              <div className="rounded-2xl border border-slate-100 bg-white px-4 py-12 text-center text-sm text-slate-400 shadow-sm">
                No active students found
              </div>
            ) : (
              records.map((r) => (
                <article key={r._id} className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-xs font-bold text-indigo-600">
                      {r.name
                        ? r.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                        : "ST"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="break-words text-sm font-semibold text-slate-800">{r.name || "Unnamed student"}</h2>
                      <p className="mt-0.5 break-all text-xs text-slate-500">ID: {r.studentId || "—"}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggle(r._id)}
                      aria-label={`Mark ${r.name || "student"} as ${r.present ? "absent" : "present"}`}
                      aria-pressed={r.present}
                      className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                        r.present
                          ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                          : "bg-rose-100 text-rose-500 hover:bg-rose-200"
                      }`}
                    >
                      {r.present ? <Check size={18} aria-hidden="true" /> : <X size={18} aria-hidden="true" />}
                      <span>{r.present ? "Present" : "Absent"}</span>
                    </button>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-3 text-xs min-[400px]:grid-cols-2">
                    <div className="min-w-0">
                      <p className="text-slate-400">Course</p>
                      <p className="mt-1 break-words font-medium text-slate-700">{r.course || "—"}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-slate-400">Overall attendance</p>
                      <p className="mt-1 font-medium text-slate-700">{r.attendance || 0}%</p>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] sm:text-xs uppercase tracking-wider">
                  <th className="px-5 py-3.5 font-semibold">Student</th>
                  <th className="px-5 py-3.5 font-semibold">ID</th>
                  <th className="px-5 py-3.5 font-semibold">Course</th>
                  <th className="px-5 py-3.5 font-semibold">Overall %</th>
                  <th className="px-5 py-3.5 text-center font-semibold">Today</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-12 text-center text-sm text-slate-400" role="status">
                      Loading...
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-12 text-center text-sm text-slate-400">
                      No active students found
                    </td>
                  </tr>
                ) : (
                  records.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-xs font-bold text-indigo-600">
                            {r.name
                              ? r.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)
                              : "ST"}
                          </div>
                          <p className="break-words text-sm font-medium text-slate-800">{r.name || "Unnamed student"}</p>
                        </div>
                      </td>
                      <td className="break-all px-5 py-3.5 text-sm text-slate-600">{r.studentId || "—"}</td>
                      <td className="break-words px-5 py-3.5 text-sm text-slate-600">{r.course || "—"}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{r.attendance || 0}%</td>
                      <td className="px-5 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => toggle(r._id)}
                          aria-label={`Mark ${r.name || "student"} as ${r.present ? "absent" : "present"}`}
                          aria-pressed={r.present}
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                            r.present
                              ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                              : "bg-rose-100 text-rose-500 hover:bg-rose-200"
                          }`}
                        >
                          {r.present ? <Check size={16} aria-hidden="true" /> : <X size={16} aria-hidden="true" />}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}