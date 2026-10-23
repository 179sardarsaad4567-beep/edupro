import { useState, useEffect } from "react";
import Topbar from "./component/Topbar";
import { Plus, X } from "lucide-react";
import api from "./api";

export default function Fees() {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    student: "",
    amount: 45000,
    paid: 0,
    status: "Pending",
  });

  const fetchFees = async () => {
    try {
      const [feesRes, studentsRes] = await Promise.all([
        api.get("/fees"),
        api.get("/students"),
      ]);
      setFees(feesRes.data);
      setStudents(studentsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/fees", form);
      setShowForm(false);
      setForm({ student: "", amount: 45000, paid: 0, status: "Pending" });
      fetchFees();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving fee");
    }
  };

  const totalCollected = fees.reduce((a, f) => a + (f.paid || 0), 0);
  const totalDue = fees.reduce((a, f) => a + ((f.amount || 0) - (f.paid || 0)), 0);

  return (
    <div>
      <Topbar title="Fees" />
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Fee Management</h1>
            <p className="text-slate-500 text-sm mt-1">Track fee payments and dues</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold"
          >
            <Plus size={18} /> Add Fee
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <p className="text-sm text-slate-500">Total Collected</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">
              Rs. {totalCollected.toLocaleString()}
            </h3>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <p className="text-sm text-slate-500">Total Due</p>
            <h3 className="text-2xl font-bold text-rose-500 mt-1">
              Rs. {totalDue.toLocaleString()}
            </h3>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <p className="text-sm text-slate-500">Records</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{fees.length}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-5 py-3.5 font-semibold">Student</th>
                <th className="px-5 py-3.5 font-semibold">Course</th>
                <th className="px-5 py-3.5 font-semibold">Total Fee</th>
                <th className="px-5 py-3.5 font-semibold">Paid</th>
                <th className="px-5 py-3.5 font-semibold">Due</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center text-slate-400">
                    Loading...
                  </td>
                </tr>
              ) : fees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center text-slate-400">
                    No fee records yet. Click "Add Fee"
                  </td>
                </tr>
              ) : (
                fees.map((f) => {
                  const student = f.student || {};
                  return (
                    <tr key={f._id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                            {(student.name || "?")
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 text-sm">{student.name}</p>
                            <p className="text-xs text-slate-500">{student.studentId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{student.course}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">
                        Rs. {(f.amount || 0).toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-emerald-600 font-medium">
                        Rs. {(f.paid || 0).toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-rose-500 font-medium">
                        Rs. {((f.amount || 0) - (f.paid || 0)).toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            f.status === "Paid"
                              ? "bg-emerald-50 text-emerald-600"
                              : f.status === "Pending"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-rose-50 text-rose-600"
                          }`}
                        >
                          {f.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-800">Add Fee Record</h2>
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
                <label className="block text-xs font-semibold text-slate-500 mb-1">Total Amount</label>
                <input
                  type="number"
                  required
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: +e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Paid Amount</label>
                <input
                  type="number"
                  value={form.paid}
                  onChange={(e) => setForm({ ...form, paid: +e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Pending</option>
                  <option>Paid</option>
                  <option>Overdue</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-semibold">
                Cancel
              </button>
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}