import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Loader2 } from "lucide-react";

import { addProduct, updateProduct } from "../api/ProductApi";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";

export default function ProductForm({
  product,
  categories,
  onClose,
  onSuccess,
}) {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      sku: "",
      barcode: "",
      category_id: "",
      purchase_price: "",
      selling_price: "",
      stock_quantity: 0,
      unit: "PCS",
      min_stock_level: 0,
      status: "Active",
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name || "",
        sku: product.sku || "",
        barcode: product.barcode || "",
        category_id: product.category_id || "",
        purchase_price: product.purchase_price || "",
        selling_price: product.selling_price || "",
        stock_quantity: product.stock_quantity ?? 0,
        unit: product.unit || "PCS",
        min_stock_level: product.min_stock_level ?? 0,
        status: product.status || "Active",
      });
    }
  }, [product, reset]);

const submitForm = async (values) => {
  try {
    const formData = new FormData();

    formData.append("shop_id", user?.shop_id);
    formData.append("name", values.name);
    formData.append("sku", values.sku || "");
    formData.append("barcode", values.barcode || "");
    formData.append("category_id", values.category_id);
    formData.append("purchase_price", values.purchase_price);
    formData.append("selling_price", values.selling_price);
    formData.append("stock_quantity", values.stock_quantity);
    formData.append("opening_stock", values.stock_quantity);
    formData.append("unit", values.unit);
    formData.append("min_stock_level", values.min_stock_level);
    formData.append("status", values.status);
    formData.append("currency", "Rs.");

    if (product) {
      await updateProduct(product.id, formData);
    } else {
      await addProduct(formData);
    }

    onSuccess();
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Unable to save product.";

    toast.error(message);
  }
};

  const inputStyle =
    "w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600";

  const errorStyle = "mt-1 text-sm text-red-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {product ? "Edit Product" : "Add Product"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter product information below.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(submitForm)}
          className="grid gap-5 p-6 sm:grid-cols-2"
        >
          {/* Product Name */}
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Product Name
            </label>

            <input
              className={inputStyle}
              {...register("name", {
                required: "Product name is required",
              })}
            />

            {errors.name && <p className={errorStyle}>{errors.name.message}</p>}
          </div>

          {/* SKU */}
          <div>
            <label className="mb-2 block text-sm font-medium">SKU</label>

            <input
              className={inputStyle}
              {...register("sku", {
                pattern: {
                  value: /^[A-Za-z0-9_-]+$/,
                  message: "SKU can only contain letters, numbers, - and _",
                },
              })}
            />

            {errors.sku && <p className={errorStyle}>{errors.sku.message}</p>}
          </div>

          {/* Barcode */}
          <div>
            <label className="mb-2 block text-sm font-medium">Barcode</label>

            <input
              className={inputStyle}
              {...register("barcode", {
                pattern: {
                  value: /^[A-Za-z0-9-]+$/,
                  message: "Enter a valid barcode",
                },
              })}
            />

            {errors.barcode && (
              <p className={errorStyle}>{errors.barcode.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-medium">Category</label>

            <select
              className={inputStyle}
              {...register("category_id", {
                required: "Category is required",
              })}
            >
              <option value="">Select Category</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {errors.category_id && (
              <p className={errorStyle}>{errors.category_id.message}</p>
            )}
          </div>

          {/* Unit */}
          <div>
            <label className="mb-2 block text-sm font-medium">Unit</label>

            <select className={inputStyle} {...register("unit")}>
              <option value="PCS">PCS</option>
              <option value="KG">KG</option>
              <option value="Litre">Litre</option>
              <option value="Pack">Pack</option>
            </select>
          </div>

          {/* Purchase Price */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Purchase Price
            </label>

            <input
              type="number"
              step="0.01"
              className={inputStyle}
              {...register("purchase_price", {
                required: "Purchase price is required",
                min: {
                  value: 0.01,
                  message: "Purchase price must be greater than 0",
                },
              })}
            />

            {errors.purchase_price && (
              <p className={errorStyle}>{errors.purchase_price.message}</p>
            )}
          </div>

          {/* Sale Price */}
          <div>
            <label className="mb-2 block text-sm font-medium">Sale Price</label>

            <input
              type="number"
              step="0.01"
              className={inputStyle}
              {...register("selling_price", {
                required: "Sale price is required",
                min: {
                  value: 0.01,
                  message: "Sale price must be greater than 0",
                },
              })}
            />

            {errors.selling_price && (
              <p className={errorStyle}>{errors.selling_price.message}</p>
            )}
          </div>

          {/* Stock Quantity */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Stock Quantity
            </label>

            <input
              type="number"
              className={inputStyle}
              {...register("stock_quantity", {
                required: "Stock quantity is required",
                min: {
                  value: 0,
                  message: "Stock quantity cannot be negative",
                },
              })}
            />

            {errors.stock_quantity && (
              <p className={errorStyle}>{errors.stock_quantity.message}</p>
            )}
          </div>

          {/* Minimum Stock */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Minimum Stock Level
            </label>

            <input
              type="number"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
              {...register("min_stock_level", {
                min: {
                  value: 0,
                  message: "Minimum stock level cannot be negative",
                },
              })}
            />

            {errors.min_stock_level && (
              <p className="mt-1 text-sm text-red-500">
                {errors.min_stock_level.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium">Status</label>

            <select className={inputStyle} {...register("status")}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 sm:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-2.5 font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {isSubmitting && <Loader2 size={18} className="animate-spin" />}

              {isSubmitting
                ? "Saving..."
                : product
                  ? "Update Product"
                  : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
