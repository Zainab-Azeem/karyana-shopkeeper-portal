import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <div className="min-w-0 flex-1">
        <Topbar setMenuOpen={setMenuOpen} />

        <main className="p-4 sm:p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}