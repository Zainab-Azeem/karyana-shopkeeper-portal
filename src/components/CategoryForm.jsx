import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2, X } from "lucide-react";

import {
  addCategory,
  updateCategory,
} from "../api/CategoryApi";

import useAuth from "../hooks/useAuth";

export default function CategoryForm({
  category,
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
      description: "",
      status: "Active",
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name || "",
        description: category.description || "",
        status: category.status || "Active",
      });
    }
  }, [category, reset]);

  const submitForm = async (data) => {
    const formData = new FormData();

    formData.append("shop_id", user?.shop_id);
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("status", data.status);

    if (category) {
      await updateCategory(category.id, formData);
    } else {
      await addCategory(formData);
    }

    onSuccess();
  };

  const inputStyle =
    "w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-6 sm:py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              {category ? "Edit Category" : "Add Category"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter category information.
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
          className="space-y-5 p-4 sm:p-6"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Category Name
            </label>

            <input
              placeholder="e.g. Beverages"
              className={inputStyle}
              {...register("name", {
                required: "Category name is required",
              })}
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              rows="4"
              placeholder="Enter category description"
              className={`${inputStyle} resize-none`}
              {...register("description")}
            />
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

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
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
                <Loader2 size={18} className="animate-spin" />
              )}

              {isSubmitting
                ? "Saving..."
                : category
                  ? "Update Category"
                  : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}