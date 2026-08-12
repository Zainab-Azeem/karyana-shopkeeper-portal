import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Tags,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

import {
  getCategories,
  deleteCategory,
} from "../api/CategoryApi";

import CategoryForm from "../components/CategoryForm";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const extractList = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;

    if (Array.isArray(response?.data?.categories)) {
      return response.data.categories;
    }

    if (Array.isArray(response?.categories)) {
      return response.categories;
    }

    return [];
  };

  const loadCategories = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getCategories();
      setCategories(extractList(response));
    } catch (error) {
      console.log(error);
      setError("Unable to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getCategories();
        setCategories(extractList(response));
      } catch (error) {
        console.log(error);
        setError("Unable to load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (category) => {
    const confirmDelete = window.confirm(
      `Delete "${category.name}"?`
    );

    if (!confirmDelete) return;

    try {
      await deleteCategory(category.id);

      toast.success("Category deleted");
      loadCategories();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to delete category"
      );
    }
  };

  const handleSuccess = () => {
    toast.success(
      editing ? "Category updated" : "Category added"
    );

    setFormOpen(false);
    setEditing(null);

    loadCategories();
  };

  const filteredCategories = categories.filter((category) => {
    const value = search.toLowerCase();

    return (
      category.name?.toLowerCase().includes(value) ||
      category.description?.toLowerCase().includes(value)
    );
  });

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">
            Catalogue
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Categories
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Organize your products into clear groups.
          </p>
        </div>

        <button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(15,23,42,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-600 sm:w-auto"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Search */}
      <section className="mt-7 rounded-[22px] border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-5">
        <div className="relative max-w-xl">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
          />
        </div>
      </section>

      {/* Table */}
      <section className="mt-6 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <Tags size={18} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">
              Category Catalogue
            </p>

            <p className="text-xs text-slate-400">
              {filteredCategories.length} categories
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-72 items-center justify-center">
            <div className="text-center">
              <Loader2
                size={32}
                className="mx-auto animate-spin text-indigo-500"
              />

              <p className="mt-3 text-sm text-slate-500">
                Loading categories...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-72 flex-col items-center justify-center">
            <p className="font-medium text-red-600">
              {error}
            </p>

            <button
              onClick={loadCategories}
              className="mt-4 rounded-xl bg-slate-950 px-4 py-2.5 text-white"
            >
              Try Again
            </button>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-300">
              <Tags size={30} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-800">
              No categories found
            </h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-slate-50/80 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                <tr>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-t border-slate-100 transition hover:bg-indigo-[0.025]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="h-11 w-11 rounded-xl border border-slate-100 object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 text-violet-600">
                            <Tags size={19} />
                          </div>
                        )}

                        <p className="font-semibold text-slate-900">
                          {category.name}
                        </p>
                      </div>
                    </td>

                    <td className="max-w-md px-6 py-4 text-sm text-slate-500">
                      {category.description || "No description"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          category.status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            category.status === "Active"
                              ? "bg-emerald-500"
                              : "bg-slate-400"
                          }`}
                        />

                        {category.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditing(category);
                            setFormOpen(true);
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-amber-50 hover:text-amber-600"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => handleDelete(category)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {formOpen && (
        <CategoryForm
          category={editing}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}