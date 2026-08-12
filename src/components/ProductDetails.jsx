import {
  X,
  Package,
  Barcode,
  Tag,
  ShoppingCart,
  Boxes,
  TriangleAlert,
} from "lucide-react";

export default function ProductDetails({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-3 backdrop-blur-[3px] sm:p-4">
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[24px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-5 backdrop-blur-xl sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.17em] text-indigo-500">
              Inventory
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
              Product Details
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {/* Product Hero */}
          <div className="rounded-[20px] bg-gradient-to-r from-indigo-50 via-blue-50 to-violet-50 p-5">
            <div className="flex flex-col items-center gap-4 sm:flex-row">

              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white text-indigo-500 shadow-sm">
                  <Package size={34} />
                </div>
              )}

              <div className="text-center sm:text-left">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                    product.status === "Active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      product.status === "Active"
                        ? "bg-emerald-500"
                        : "bg-slate-400"
                    }`}
                  />

                  {product.status || "Active"}
                </span>

                <h3 className="mt-2 text-xl font-bold text-slate-950">
                  {product.name}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {product.unit || "Product"}
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <DetailCard
              icon={Tag}
              label="SKU"
              value={product.sku || "--"}
            />

            <DetailCard
              icon={Barcode}
              label="Barcode"
              value={product.barcode || "--"}
            />

            <DetailCard
              icon={ShoppingCart}
              label="Purchase Price"
              value={`Rs. ${product.purchase_price}`}
            />

            <DetailCard
              icon={ShoppingCart}
              label="Sale Price"
              value={`Rs. ${product.selling_price}`}
              highlight
            />

            <DetailCard
              icon={Boxes}
              label="Current Stock"
              value={`${product.stock_quantity} ${product.unit}`}
            />

            <DetailCard
              icon={TriangleAlert}
              label="Minimum Stock"
              value={product.min_stock_level}
            />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailCard({
  icon: Icon,
  label,
  value,
  highlight = false,
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition hover:bg-white hover:shadow-sm">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon size={15} />

        <p className="text-[11px] font-semibold uppercase tracking-[0.1em]">
          {label}
        </p>
      </div>

      <p
        className={`mt-2 text-sm font-bold ${
          highlight ? "text-indigo-600" : "text-slate-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
}