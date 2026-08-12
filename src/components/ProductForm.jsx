import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  X,
  Loader2,
  Package,
} from "lucide-react";

import {
  addProduct,
  updateProduct,
} from "../api/ProductApi";

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
    "w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50";

  const errorStyle =
    "mt-1.5 text-xs font-medium text-red-500";

  const labelStyle =
    "mb-2 block text-sm font-semibold text-slate-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-3 backdrop-blur-[3px] sm:p-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[24px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-5 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Package size={21} />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-indigo-500">
                Inventory
              </p>

              <h2 className="mt-0.5 text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
                {product
                  ? "Edit Product"
                  : "Add Product"}
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Enter product information below.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(submitForm)}
          className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6"
        >
          {/* Product Name */}
          <div className="sm:col-span-2">
            <label className={labelStyle}>
              Product Name
            </label>

            <input
              placeholder="Enter product name"
              className={inputStyle}
              {...register("name", {
                required:
                  "Product name is required",
              })}
            />

            {errors.name && (
              <p className={errorStyle}>
                {errors.name.message}
              </p>
            )}
          </div>

          {/* SKU */}
          <div>
            <label className={labelStyle}>
              SKU
            </label>

            <input
              placeholder="e.g. PROD-001"
              className={inputStyle}
              {...register("sku", {
                pattern: {
                  value: /^[A-Za-z0-9_-]+$/,
                  message:
                    "SKU can only contain letters, numbers, - and _",
                },
              })}
            />

            {errors.sku && (
              <p className={errorStyle}>
                {errors.sku.message}
              </p>
            )}
          </div>

          {/* Barcode */}
          <div>
            <label className={labelStyle}>
              Barcode
            </label>

            <input
              placeholder="Enter barcode"
              className={inputStyle}
              {...register("barcode", {
                pattern: {
                  value: /^[A-Za-z0-9-]+$/,
                  message:
                    "Enter a valid barcode",
                },
              })}
            />

            {errors.barcode && (
              <p className={errorStyle}>
                {errors.barcode.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className={labelStyle}>
              Category
            </label>

            <select
              className={inputStyle}
              {...register("category_id", {
                required:
                  "Category is required",
              })}
            >
              <option value="">
                Select Category
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>

            {errors.category_id && (
              <p className={errorStyle}>
                {errors.category_id.message}
              </p>
            )}
          </div>

          {/* Unit */}
          <div>
            <label className={labelStyle}>
              Unit
            </label>

            <select
              className={inputStyle}
              {...register("unit")}
            >
              <option value="PCS">PCS</option>
              <option value="KG">KG</option>
              <option value="Litre">
                Litre
              </option>
              <option value="Pack">
                Pack
              </option>
            </select>
          </div>

          {/* Purchase Price */}
          <div>
            <label className={labelStyle}>
              Purchase Price
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                Rs.
              </span>

              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                className={`${inputStyle} pl-12`}
                {...register(
                  "purchase_price",
                  {
                    required:
                      "Purchase price is required",
                    min: {
                      value: 0.01,
                      message:
                        "Purchase price must be greater than 0",
                    },
                  }
                )}
              />
            </div>

            {errors.purchase_price && (
              <p className={errorStyle}>
                {errors.purchase_price.message}
              </p>
            )}
          </div>

          {/* Sale Price */}
          <div>
            <label className={labelStyle}>
              Sale Price
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                Rs.
              </span>

              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                className={`${inputStyle} pl-12`}
                {...register(
                  "selling_price",
                  {
                    required:
                      "Sale price is required",
                    min: {
                      value: 0.01,
                      message:
                        "Sale price must be greater than 0",
                    },
                  }
                )}
              />
            </div>

            {errors.selling_price && (
              <p className={errorStyle}>
                {errors.selling_price.message}
              </p>
            )}
          </div>

          {/* Stock */}
          <div>
            <label className={labelStyle}>
              Stock Quantity
            </label>

            <input
              type="number"
              className={inputStyle}
              {...register(
                "stock_quantity",
                {
                  required:
                    "Stock quantity is required",
                  min: {
                    value: 0,
                    message:
                      "Stock quantity cannot be negative",
                  },
                }
              )}
            />

            {errors.stock_quantity && (
              <p className={errorStyle}>
                {errors.stock_quantity.message}
              </p>
            )}
          </div>

          {/* Minimum Stock */}
          <div>
            <label className={labelStyle}>
              Minimum Stock Level
            </label>

            <input
              type="number"
              className={inputStyle}
              {...register(
                "min_stock_level",
                {
                  min: {
                    value: 0,
                    message:
                      "Minimum stock level cannot be negative",
                  },
                }
              )}
            />

            {errors.min_stock_level && (
              <p className={errorStyle}>
                {errors.min_stock_level.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className={labelStyle}>
              Status
            </label>

            <select
              className={inputStyle}
              {...register("status")}
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:col-span-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(15,23,42,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isSubmitting && (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              )}

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