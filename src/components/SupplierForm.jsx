import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2, X } from "lucide-react";
import { toast } from "react-toastify";

import {
  addSupplier,
  updateSupplier,
} from "../api/SupplierApi";

import useAuth from "../hooks/useAuth";

export default function SupplierForm({
  supplier,
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
      supplier_code: "",
      name: "",
      contact_person: "",
      phone: "",
      email: "",
      address: "",
      status: "Active",
    },
  });

  useEffect(() => {
    if (supplier) {
      reset({
        supplier_code: supplier.supplier_code || "",
        name: supplier.name || "",
        contact_person: supplier.contact_person || "",
        phone: supplier.phone || "",
        email: supplier.email || "",
        address: supplier.address || "",
        status: supplier.status || "Active",
      });
    }
  }, [supplier, reset]);

  const submitForm = async (data) => {
    try {
      const values = {
        shop_id: user?.shop_id,
        supplier_code: data.supplier_code.trim(),
        name: data.name.trim(),
        contact_person: data.contact_person?.trim() || "",
        phone: data.phone?.trim() || "",
        email: data.email?.trim() || "",
        address: data.address?.trim() || "",
        status: data.status,
      };

      if (supplier) {
        await updateSupplier(supplier.id, values);
      } else {
        await addSupplier(values);
      }

      onSuccess();
    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.message ||
        "Unable to save supplier.";

      toast.error(message);
    }
  };

  const inputStyle =
    "w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

  const errorStyle =
    "mt-1 text-sm text-red-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-6 sm:py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              {supplier ? "Edit Supplier" : "Add Supplier"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter supplier information.
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

        <form
          onSubmit={handleSubmit(submitForm)}
          className="grid gap-5 p-4 sm:grid-cols-2 sm:p-6"
        >
          {/* Supplier Code */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Supplier Code
            </label>

            <input
              placeholder="e.g. SUP-001"
              className={inputStyle}
              {...register("supplier_code", {
                required: "Supplier code is required",
                pattern: {
                  value: /^[A-Za-z0-9_-]+$/,
                  message:
                    "Supplier code can only contain letters, numbers, - and _",
                },
              })}
            />

            {errors.supplier_code && (
              <p className={errorStyle}>
                {errors.supplier_code.message}
              </p>
            )}
          </div>

          {/* Supplier Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Supplier Name
            </label>

            <input
              className={inputStyle}
              {...register("name", {
                required: "Supplier name is required",
              })}
            />

            {errors.name && (
              <p className={errorStyle}>
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Contact Person */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Contact Person
            </label>

            <input
              className={inputStyle}
              {...register("contact_person")}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Phone Number
            </label>

            <input
              placeholder="03XXXXXXXXX"
              className={inputStyle}
              {...register("phone", {
                pattern: {
                  value: /^03\d{9}$/,
                  message: "Enter a valid phone number",
                },
              })}
            />

            {errors.phone && (
              <p className={errorStyle}>
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              className={inputStyle}
              {...register("email", {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
            />

            {errors.email && (
              <p className={errorStyle}>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Status
            </label>

            <select
              className={inputStyle}
              {...register("status")}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Address
            </label>

            <textarea
              rows="3"
              className={`${inputStyle} resize-none`}
              {...register("address")}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:col-span-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
            >
              {isSubmitting && (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              )}

              {isSubmitting
                ? "Saving..."
                : supplier
                  ? "Update Supplier"
                  : "Add Supplier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}