import {
  LayoutDashboard,
  Package,
  Tags,
  Users,
  Truck,
  LogOut,
  X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Sidebar({
  menuOpen,
  setMenuOpen,
}) {
  const { logout } = useAuth();
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
      <div className="flex items-start justify-between px-3">
        <div>
          <h1 className="text-2xl font-bold">
            Karyana
            <span className="text-blue-500">.</span>
          </h1>

          <p className="mt-1 text-xs text-slate-400">
            Shopkeeper Portal
          </p>
        </div>

        <button
          onClick={() => setMenuOpen(false)}
          className="text-slate-400 md:hidden"
        >
          <X size={22} />
        </button>
      </div>

      <nav className="mt-10 flex-1 space-y-2">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              <Icon size={19} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
      >
        <LogOut size={19} />
        Logout
      </button>
    </>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden min-h-screen w-64 flex-col bg-slate-950 px-4 py-6 text-white md:flex">
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-950 px-4 py-6 text-white transition-transform duration-300 md:hidden ${
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