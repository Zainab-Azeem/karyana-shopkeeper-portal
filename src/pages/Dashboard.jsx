import { useEffect, useState } from "react";
import {
  Package,
  ShoppingCart,
  Users,
  Truck,
  Loader2,
  WalletCards,
  TrendingUp,
  CreditCard,
  TriangleAlert,
  MapPin,
  Mail,
  UserRound,
  BadgeCheck,
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
      title: "Total Products",
      value: summary?.total_products ?? 0,
      icon: Package,
      iconBg: "bg-violet-50",
      iconText: "text-violet-600",
    },
    {
      title: "Today's Orders",
      value: summary?.today_orders ?? 0,
      icon: ShoppingCart,
      iconBg: "bg-blue-50",
      iconText: "text-blue-600",
    },
    {
      title: "Total Customers",
      value: summary?.total_customers ?? 0,
      icon: Users,
      iconBg: "bg-emerald-50",
      iconText: "text-emerald-600",
    },
    {
      title: "Total Suppliers",
      value: summary?.total_suppliers ?? 0,
      icon: Truck,
      iconBg: "bg-orange-50",
      iconText: "text-orange-600",
    },
  ];

  const financialStats = [
    {
      title: "Today's Sales",
      value: `Rs. ${summary?.today_sales ?? "0.00"}`,
      icon: WalletCards,
      iconBg: "bg-blue-50",
      iconText: "text-blue-600",
    },
    {
      title: "Today's Profit",
      value: `Rs. ${summary?.today_profit ?? "0.00"}`,
      icon: TrendingUp,
      iconBg: "bg-emerald-50",
      iconText: "text-emerald-600",
    },
    {
      title: "Pending Udhaar",
      value: `Rs. ${summary?.pending_udhaar ?? "0.00"}`,
      icon: CreditCard,
      iconBg: "bg-amber-50",
      iconText: "text-amber-600",
    },
    {
      title: "Low Stock Products",
      value: summary?.low_stock_count ?? 0,
      icon: TriangleAlert,
      iconBg: "bg-red-50",
      iconText: "text-red-500",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">
            Overview
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Good evening, {user?.name?.split(" ")[0] || "Shopkeeper"} 👋
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Here's what is happening in your shop today.
          </p>
        </div>

        <div className="w-fit rounded-2xl border border-indigo-100 bg-white px-5 py-3 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Account Status
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

            <span className="text-sm font-semibold capitalize text-slate-800">
              {user?.status || "--"}
            </span>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Main Cards */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              style={{
                animationDelay: `${index * 70}ms`,
              }}
              className="card-enter group rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(79,70,229,0.08)]"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg} ${card.iconText}`}
                >
                  <Icon size={22} />
                </div>

                <span className="h-2 w-2 rounded-full bg-slate-200 transition group-hover:bg-indigo-400" />
              </div>

              <p className="mt-5 text-sm font-medium text-slate-500">
                {card.title}
              </p>

              <div className="mt-1 min-h-10">
                {loading ? (
                  <Loader2
                    size={23}
                    className="animate-spin text-indigo-500"
                  />
                ) : (
                  <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                    {card.value}
                  </h2>
                )}
              </div>

              <p className="mt-3 text-xs text-slate-400">
                Current shop overview
              </p>
            </div>
          );
        })}
      </div>

      {/* Financial Summary */}
      <section className="mt-6 rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.17em] text-indigo-500">
            Financial Summary
          </p>

          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            Today's business performance
          </h2>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {financialStats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-all duration-200 hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.iconBg} ${item.iconText}`}
                  >
                    <Icon size={19} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      {item.title}
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-950">
                      {item.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Shop Info */}
      <section className="mt-6 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.17em] text-indigo-500">
            Shop Information
          </p>

          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            Account and shop details
          </h2>
        </div>

        <div className="grid gap-0 sm:grid-cols-2">
          <InfoItem
            icon={UserRound}
            label="Shopkeeper"
            value={user?.name || "--"}
          />

          <InfoItem
            icon={Mail}
            label="Email"
            value={user?.email || "--"}
          />

          <InfoItem
            icon={MapPin}
            label="Location"
            value={user?.location || "--"}
          />

          <InfoItem
            icon={BadgeCheck}
            label="Role"
            value={user?.role || "--"}
            capitalize
          />
        </div>
      </section>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
  capitalize = false,
}) {
  return (
    <div className="flex items-start gap-4 border-b border-slate-100 p-5 last:border-b-0 sm:p-6 sm:odd:border-r">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p
          className={`mt-1 break-all font-semibold text-slate-800 ${
            capitalize ? "capitalize" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}