import { useEffect, useState } from "react";
import {
  Package,
  ShoppingCart,
  Users,
  Truck,
  Loader2,
} from "lucide-react";

import useAuth from "../hooks/useAuth";
import { getDashboardSummary } from "../api/DashboardApi";

export default function Dashboard() {
  const { user } = useAuth();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getDashboardSummary();
        setSummary(response.data || response);
      } catch (error) {
        console.log(error);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const cards = [
    {
      title: "Products",
      value: summary?.total_products ?? 0,
      icon: Package,
    },
    {
      title: "Today's Orders",
      value: summary?.today_orders ?? 0,
      icon: ShoppingCart,
    },
    {
      title: "Customers",
      value: summary?.total_customers ?? 0,
      icon: Users,
    },
    {
      title: "Suppliers",
      value: summary?.total_suppliers ?? 0,
      icon: Truck,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Here is an overview of your shop.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Main Stats */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon size={22} />
              </div>

              <p className="mt-5 text-sm font-medium text-slate-500">
                {card.title}
              </p>

              <div className="mt-1 min-h-9">
                {loading ? (
                  <Loader2
                    size={24}
                    className="animate-spin text-blue-600"
                  />
                ) : (
                  <h2 className="text-3xl font-bold text-slate-900">
                    {card.value}
                  </h2>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Extra Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">
            Today's Sales
          </p>

          <p className="mt-1 text-lg font-bold text-slate-900">
            Rs. {summary?.today_sales ?? "0.00"}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">
            Today's Profit
          </p>

          <p className="mt-1 text-lg font-bold text-slate-900">
            Rs. {summary?.today_profit ?? "0.00"}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">
            Pending Udhaar
          </p>

          <p className="mt-1 text-lg font-bold text-slate-900">
            Rs. {summary?.pending_udhaar ?? "0.00"}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">
            Low Stock Products
          </p>

          <p className="mt-1 text-lg font-bold text-slate-900">
            {summary?.low_stock_count ?? 0}
          </p>
        </div>
      </div>

      {/* Shop Information */}
      <div className="mt-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Shop Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your account and shop details
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                user?.status?.toLowerCase() === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {user?.status || "--"}
            </span>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Shopkeeper
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {user?.name || "--"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Email
              </p>

              <p className="mt-1 break-all font-semibold text-slate-800">
                {user?.email || "--"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Location
              </p>

              <p className="mt-1 font-semibold text-slate-800">
                {user?.location || "--"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Role
              </p>

              <p className="mt-1 font-semibold capitalize text-slate-800">
                {user?.role || "--"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}