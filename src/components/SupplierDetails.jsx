import { Truck, X } from "lucide-react";

export default function SupplierDetails({
  supplier,
  onClose,
}) {
  if (!supplier) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-4 sm:p-5">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            Supplier Details
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
          {/* Supplier Info */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Truck size={26} />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
                {supplier.name}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {supplier.contact_person || "Supplier"}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Phone
              </p>

              <p className="mt-1 font-medium text-slate-800">
                {supplier.phone || "--"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Email
              </p>

              <p className="mt-1 break-all font-medium text-slate-800">
                {supplier.email || "--"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Address
              </p>

              <p className="mt-1 font-medium text-slate-800">
                {supplier.address || "--"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Outstanding Balance
              </p>

              <p className="mt-1 font-medium text-slate-800">
                {supplier.outstanding_balance != null
                  ? `Rs. ${supplier.outstanding_balance}`
                  : "--"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Status
              </p>

              <span
                className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                  supplier.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {supplier.status || "--"}
              </span>
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