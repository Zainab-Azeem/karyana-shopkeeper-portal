import { Menu } from "lucide-react";
import useAuth from "../hooks/useAuth";

export default function Topbar({ setMenuOpen }) {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:h-20 sm:px-5 md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMenuOpen(true)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
        >
          <Menu size={22} />
        </button>

        <p className="hidden text-sm text-slate-500 sm:block">
          Welcome back
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-800">
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
            className="h-10 w-10 rounded-full border-2 border-white object-cover shadow sm:h-11 sm:w-11"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700 sm:h-11 sm:w-11">
            {user?.name?.charAt(0) || "S"}
          </div>
        )}
      </div>
    </header>
  );
}