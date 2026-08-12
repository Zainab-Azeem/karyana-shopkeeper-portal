import { X } from "lucide-react";

export default function ProductDetails({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-xl font-bold">
            Product Details
          </h2>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="mx-auto h-32 w-32 rounded-xl object-cover"
            />
          )}

          <h3 className="mt-4 text-center text-xl font-bold">
            {product.name}
          </h3>

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400">SKU</p>
              <p className="font-medium">{product.sku || "--"}</p>
            </div>

            <div>
              <p className="text-slate-400">Barcode</p>
              <p className="font-medium">{product.barcode || "--"}</p>
            </div>

            <div>
              <p className="text-slate-400">Purchase Price</p>
              <p className="font-medium">
                Rs. {product.purchase_price}
              </p>
            </div>

            <div>
              <p className="text-slate-400">Sale Price</p>
              <p className="font-medium">
                Rs. {product.selling_price}
              </p>
            </div>

            <div>
              <p className="text-slate-400">Stock</p>
              <p className="font-medium">
                {product.stock_quantity} {product.unit}
              </p>
            </div>

            <div>
              <p className="text-slate-400">Minimum Stock</p>
              <p className="font-medium">
                {product.min_stock_level}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}