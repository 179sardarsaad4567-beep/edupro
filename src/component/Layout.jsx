// import { Outlet } from "react-router-dom";
// import Sidebar from "./Sidebar";

// export default function Layout() {
//   return (
//     <div className="min-h-screen bg-slate-50">
//       <Sidebar />
//       <main className="ml-64 min-h-screen">
//         <Outlet />
//       </main>
//     </div>
//   );
// }
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react";

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 bg-slate-900 text-white px-4 py-3 sticky top-0 z-30">
          <button onClick={() => setOpen(true)} className="p-1">
            <Menu size={24} />
          </button>
          <span className="font-semibold">EduSphere Pro</span>
        </div>

        <main className="flex-1 p-4 md:p-6 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}