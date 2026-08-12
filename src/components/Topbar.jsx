import {
  Menu,
  Bell,
} from "lucide-react";

import useAuth from "../hooks/useAuth";

export default function Topbar({ setMenuOpen }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/70 bg-white/90 px-4 backdrop-blur-xl sm:h-20 sm:px-5 md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMenuOpen(true)}
          className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:bg-slate-50 md:hidden"
        >
          <Menu size={21} />
        </button>

        <div>
          <p className="hidden text-xs font-medium uppercase tracking-[0.16em] text-slate-400 sm:block">
            Karyana Portal
          </p>

          <p className="hidden text-sm font-semibold text-slate-800 sm:block">
            Store Management
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:text-indigo-600">
          <Bell size={18} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white" />
        </button>

        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-900">
            {user?.name || "Shopkeeper"}
          </p>

          <p className="text-xs capitalize text-slate-500">
            {user?.role || "shopkeeper"}
          </p>
        </div>

        {user?.profile_image ? (
          <img
            src={user.profile_image}
            alt={user?.name || "Shopkeeper"}
            className="h-10 w-10 rounded-xl border border-slate-200 object-cover shadow-sm sm:h-11 sm:w-11"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 font-semibold text-white shadow-md shadow-indigo-500/20 sm:h-11 sm:w-11">
            {user?.name?.charAt(0) || "S"}
          </div>
        )}
      </div>
    </header>
  );
}