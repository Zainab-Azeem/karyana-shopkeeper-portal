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

    if (Array.isArray(response?.data)) {
      return response.data;
    }

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
      console.log(error);
      toast.error("Unable to delete category");
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
    const value = search.trim().toLowerCase();

    return (
      category.name?.toLowerCase().includes(value) ||
      category.description?.toLowerCase().includes(value)
    );
  });

  return (
    <div className="mx-auto max-w-7xl">
      {/* Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Categories
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Organize products into categories.
          </p>
        </div>

        <button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 sm:w-auto"
        >
          <Plus size={19} />
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="relative w-full sm:max-w-xl">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Category List */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-72 items-center justify-center p-6">
            <div className="text-center">
              <Loader2
                size={32}
                className="mx-auto animate-spin text-blue-600"
              />

              <p className="mt-3 text-sm text-slate-500">
                Loading categories...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-72 flex-col items-center justify-center p-6 text-center">
            <p className="font-medium text-red-600">
              {error}
            </p>

            <button
              onClick={loadCategories}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
              Try Again
            </button>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center p-6 text-center">
            <Tags size={42} className="text-slate-300" />

            <h3 className="mt-4 font-semibold text-slate-800">
              No categories found
            </h3>

            <button
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
              className="mt-4 text-sm font-medium text-blue-600"
            >
              Add Category
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4 sm:px-6">
                    Category
                  </th>

                  <th className="px-5 py-4 sm:px-6">
                    Description
                  </th>

                  <th className="px-5 py-4 sm:px-6">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right sm:px-6">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-t border-slate-100 transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="h-11 w-11 shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <Tags size={20} />
                          </div>
                        )}

                        <p className="font-medium text-slate-900">
                          {category.name}
                        </p>
                      </div>
                    </td>

                    <td className="max-w-md px-5 py-4 text-sm text-slate-500 sm:px-6">
                      {category.description || "No description"}
                    </td>

                    <td className="px-5 py-4 sm:px-6">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          category.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {category.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 sm:px-6">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditing(category);
                            setFormOpen(true);
                          }}
                          className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                          title="Edit"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => handleDelete(category)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                          title="Delete"
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
      </div>

      {/* Add / Edit Form */}
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