import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2, X } from "lucide-react";

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
    const values = {
      shop_id: user?.shop_id,
      name: data.name,
      phone: data.phone,
      email: data.email || "",
      address: data.address || "",
      opening_balance: Number(data.opening_balance || 0),
      current_balance: Number(data.opening_balance || 0),
      credit_limit: Number(data.credit_limit || 0),
      status: data.status,
    };

    if (customer) {
      await updateCustomer(customer.id, values);
    } else {
      await addCustomer(values);
    }

    onSuccess();
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
              {customer ? "Edit Customer" : "Add Customer"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter customer information.
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
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Customer Name
            </label>

            <input
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
            <label className="mb-2 block text-sm font-medium text-slate-700">
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

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Opening Balance
            </label>

            <input
              type="number"
              step="0.01"
              className={inputStyle}
              {...register("opening_balance", {
                min: {
                  value: 0,
                  message: "Opening balance cannot be negative",
                },
              })}
            />

            {errors.opening_balance && (
              <p className={errorStyle}>
                {errors.opening_balance.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Credit Limit
            </label>

            <input
              type="number"
              step="0.01"
              className={inputStyle}
              {...register("credit_limit", {
                min: {
                  value: 0,
                  message: "Credit limit cannot be negative",
                },
              })}
            />

            {errors.credit_limit && (
              <p className={errorStyle}>
                {errors.credit_limit.message}
              </p>
            )}
          </div>

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