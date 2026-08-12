import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2, X } from "lucide-react";
import { toast } from "react-toastify";

import {
  addCustomer,
  updateCustomer,
} from "../api/CustomerApi";

import useAuth from "../hooks/useAuth";

export default function CustomerForm({
  customer,
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
      phone: "",
      email: "",
      address: "",
      opening_balance: 0,
      credit_limit: 0,
      status: "Active",
    },
  });

  useEffect(() => {
    if (customer) {
      reset({
        name: customer.name || "",
        phone: customer.phone || "",
        email: customer.email || "",
        address: customer.address || "",
        opening_balance: customer.opening_balance ?? 0,
        credit_limit: customer.credit_limit ?? 0,
        status: customer.status || "Active",
      });
    }
  }, [customer, reset]);

  const submitForm = async (data) => {
    try {
      if (customer) {
        const values = {
          name: data.name.trim(),
          phone: data.phone.trim(),
          email: data.email?.trim() || "",
          address: data.address?.trim() || "",
          credit_limit: Number(data.credit_limit || 0),
          status: data.status,
        };

        await updateCustomer(customer.id, values);
      } else {
        const openingBalance = Number(
          data.opening_balance || 0
        );

        const values = {
          shop_id: user?.shop_id,
          name: data.name.trim(),
          phone: data.phone.trim(),
          email: data.email?.trim() || "",
          address: data.address?.trim() || "",
          opening_balance: openingBalance,
          current_balance: openingBalance,
          credit_limit: Number(
            data.credit_limit || 0
          ),
          status: data.status,
        };

        await addCustomer(values);
      }

      onSuccess();
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Unable to save customer."
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
              Customer
            </p>

            <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
              {customer
                ? "Edit Customer"
                : "Add Customer"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter customer information.
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
              Customer Name
            </label>

            <input
              placeholder="Enter customer name"
              className={inputStyle}
              {...register("name", {
                required: "Customer name is required",
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
              Phone Number
            </label>

            <input
              placeholder="03XXXXXXXXX"
              className={inputStyle}
              {...register("phone", {
                required: "Phone number is required",
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

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email
            </label>

            <input
              type="email"
              placeholder="customer@email.com"
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
              placeholder="Enter address"
              className={`${inputStyle} resize-none`}
              {...register("address")}
            />
          </div>

          {!customer && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Opening Balance
              </label>

              <input
                type="number"
                step="0.01"
                className={inputStyle}
                {...register("opening_balance", {
                  min: {
                    value: 0,
                    message:
                      "Opening balance cannot be negative",
                  },
                })}
              />

              {errors.opening_balance && (
                <p className={errorStyle}>
                  {errors.opening_balance.message}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Credit Limit
            </label>

            <input
              type="number"
              step="0.01"
              className={inputStyle}
              {...register("credit_limit", {
                min: {
                  value: 0,
                  message:
                    "Credit limit cannot be negative",
                },
              })}
            />

            {errors.credit_limit && (
              <p className={errorStyle}>
                {errors.credit_limit.message}
              </p>
            )}
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
                : customer
                  ? "Update Customer"
                  : "Add Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}