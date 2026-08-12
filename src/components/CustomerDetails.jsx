import { X, UserRound } from "lucide-react";

export default function CustomerDetails({
  customer,
  onClose,
}) {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-4 sm:p-5">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            Customer Details
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <UserRound size={26} />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
                {customer.name}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {customer.phone || "--"}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Address
              </p>

              <p className="mt-1 font-medium text-slate-800">
                {customer.address || "--"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Status
              </p>

              <span
                className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                  customer.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {customer.status || "--"}
              </span>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Total Purchases
              </p>

              <p className="mt-1 font-medium text-slate-800">
                {customer.total_purchases != null
                  ? `Rs. ${customer.total_purchases}`
                  : "--"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Total Udhaar
              </p>

              <p className="mt-1 font-medium text-slate-800">
                {customer.total_udhaar != null
                  ? `Rs. ${customer.total_udhaar}`
                  : customer.current_balance != null
                    ? `Rs. ${customer.current_balance}`
                    : "--"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Paid Amount
              </p>

              <p className="mt-1 font-medium text-slate-800">
                {customer.paid_amount != null
                  ? `Rs. ${customer.paid_amount}`
                  : "--"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Remaining Amount
              </p>

              <p className="mt-1 font-medium text-slate-800">
                {customer.remaining_amount != null
                  ? `Rs. ${customer.remaining_amount}`
                  : customer.current_balance != null
                    ? `Rs. ${customer.current_balance}`
                    : "--"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-xl bg-slate-900 px-5 py-2.5 font-medium text-white hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}