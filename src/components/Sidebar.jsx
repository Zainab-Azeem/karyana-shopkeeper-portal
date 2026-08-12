import {
  LayoutDashboard,
  Package,
  Tags,
  Users,
  Truck,
  LogOut,
  X,
  ShoppingBag,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Sidebar({
  menuOpen,
  setMenuOpen,
}) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const links = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      path: "/products",
      icon: Package,
    },
    {
      name: "Categories",
      path: "/categories",
      icon: Tags,
    },
    {
      name: "Customers",
      path: "/customers",
      icon: Users,
    },
    {
      name: "Suppliers",
      path: "/suppliers",
      icon: Truck,
    },
  ];

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 shadow-lg shadow-indigo-500/20">
            <ShoppingBag size={21} className="text-white" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-wide text-white">
              KARYANA
            </h1>

            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
              Shopkeeper Portal
            </p>
          </div>
        </div>

        <button
          onClick={() => setMenuOpen(false)}
          className="rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white md:hidden"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="mt-10 flex-1 space-y-2">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
                    : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 h-7 w-1 rounded-r-full bg-indigo-400 shadow-[0_0_14px_rgba(129,140,248,0.9)]" />
                  )}

                  <Icon
                    size={18}
                    className="transition-transform duration-200 group-hover:scale-110"
                  />

                  {item.name}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Card */}
      <div className="mb-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
        <div className="flex items-center gap-3">
          {user?.profile_image ? (
            <img
              src={user.profile_image}
              alt={user?.name || "Shopkeeper"}
              className="h-10 w-10 rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 font-semibold text-indigo-300">
              {user?.name?.charAt(0) || "S"}
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {user?.name || "Shopkeeper"}
            </p>

            <p className="text-xs capitalize text-slate-500">
              {user?.role || "shopkeeper"}
            </p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
      >
        <LogOut size={18} />
        Logout
      </button>
    </>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden min-h-screen w-64 flex-col bg-[#07101f] px-4 py-6 text-white shadow-[12px_0_40px_rgba(15,23,42,0.07)] md:flex">
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#07101f] px-4 py-6 text-white shadow-2xl transition-transform duration-300 md:hidden ${
          menuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}