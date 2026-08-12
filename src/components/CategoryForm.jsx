import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Loader2,
  X,
  Tags,
} from "lucide-react";

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
    formData.append(
      "description",
      data.description || ""
    );
    formData.append("status", data.status);

    if (category) {
      await updateCategory(category.id, formData);
    } else {
      await addCategory(formData);
    }

    onSuccess();
  };

  const inputStyle =
    "w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50";

  const errorStyle =
    "mt-1.5 text-xs font-medium text-red-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-3 backdrop-blur-[3px] sm:p-4">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[24px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-5 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <Tags size={20} />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-indigo-500">
                Catalogue
              </p>

              <h2 className="mt-0.5 text-lg font-bold tracking-tight text-slate-950">
                {category
                  ? "Edit Category"
                  : "Add Category"}
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Organize products into categories.
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

        <form
          onSubmit={handleSubmit(submitForm)}
          className="space-y-5 p-5 sm:p-6"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Category Name
            </label>

            <input
              placeholder="e.g. Beverages"
              className={inputStyle}
              {...register("name", {
                required:
                  "Category name is required",
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

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
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