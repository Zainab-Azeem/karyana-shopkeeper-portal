import {
  X,
  UserRound,
  Phone,
  MapPin,
  WalletCards,
  BadgeCheck,
} from "lucide-react";

export default function CustomerDetails({
  customer,
  onClose,
}) {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-3 backdrop-blur-[3px] sm:p-4">
      <div className="w-full max-w-xl overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.17em] text-indigo-500">
              Customer Profile
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
              Customer Details
            </h2>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
              <UserRound size={26} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-950">
                {customer.name}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {customer.phone || "No phone number"}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Detail
              icon={Phone}
              label="Phone"
              value={customer.phone || "--"}
            />

            <Detail
              icon={MapPin}
              label="Address"
              value={customer.address || "--"}
            />

            <Detail
              icon={BadgeCheck}
              label="Status"
              value={customer.status || "--"}
            />

            <Detail
              icon={WalletCards}
              label="Total Purchases"
              value={customer.total_purchases ?? "--"}
            />

            <Detail
              icon={WalletCards}
              label="Total Udhaar"
              value={
                customer.total_udhaar ??
                customer.current_balance ??
                "--"
              }
            />

            <Detail
              icon={WalletCards}
              label="Paid Amount"
              value={customer.paid_amount ?? "--"}
            />

            <Detail
              icon={WalletCards}
              label="Remaining Amount"
              value={
                customer.remaining_amount ??
                customer.current_balance ??
                "--"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon size={15} />

        <p className="text-[11px] font-semibold uppercase tracking-[0.1em]">
          {label}
        </p>
      </div>

      <p className="mt-2 break-words text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}