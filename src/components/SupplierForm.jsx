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
        supplier_code:
          supplier.supplier_code || "",
        name: supplier.name || "",
        contact_person:
          supplier.contact_person || "",
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
        supplier_code:
          data.supplier_code.trim(),
        name: data.name.trim(),
        contact_person:
          data.contact_person?.trim() || "",
        phone: data.phone?.trim() || "",
        email: data.email?.trim() || "",
        address: data.address?.trim() || "",
        status: data.status,
      };

      if (supplier) {
        await updateSupplier(
          supplier.id,
          values
        );
      } else {
        await addSupplier(values);
      }

      onSuccess();
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Unable to save supplier."
      );
    }
  };

  const inputStyle =
    "w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50";

  const errorStyle =
    "mt-1.5 text-xs font-medium text-red-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-3 backdrop-blur-[3px] sm:p-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[24px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-4 py-4 backdrop-blur-xl sm:px-6 sm:py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.17em] text-indigo-500">
              Supplier
            </p>

            <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
              {supplier
                ? "Edit Supplier"
                : "Add Supplier"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter supplier information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(submitForm)}
          className="grid gap-5 p-4 sm:grid-cols-2 sm:p-6"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Supplier Code
            </label>

            <input
              placeholder="e.g. SUP-001"
              className={inputStyle}
              {...register("supplier_code", {
                required:
                  "Supplier code is required",
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

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Supplier Name
            </label>

            <input
              placeholder="Enter supplier name"
              className={inputStyle}
              {...register("name", {
                required:
                  "Supplier name is required",
              })}
            />

            {errors.name && (
              <p className={errorStyle}>
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Contact Person
            </label>

            <input
              placeholder="Contact person"
              className={inputStyle}
              {...register("contact_person")}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Phone Number
            </label>

            <input
              placeholder="03XXXXXXXXX"
              className={inputStyle}
              {...register("phone", {
                pattern: {
                  value: /^03\d{9}$/,
                  message:
                    "Enter a valid phone number",
                },
              })}
            />

            {errors.phone && (
              <p className={errorStyle}>
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email
            </label>

            <input
              type="email"
              placeholder="supplier@email.com"
              className={inputStyle}
              {...register("email", {
                pattern: {
                  value:
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message:
                    "Enter a valid email",
                },
              })}
            />

            {errors.email && (
              <p className={errorStyle}>
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
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

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Address
            </label>

            <textarea
              rows="3"
              placeholder="Enter supplier address"
              className={`${inputStyle} resize-none`}
              {...register("address")}
            />
          </div>

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
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(15,23,42,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-600 disabled:opacity-60 sm:w-auto"
            >
              {isSubmitting && (
                <Loader2
                  size={17}
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