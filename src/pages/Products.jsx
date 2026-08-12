import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Package,
  Loader2,
  SlidersHorizontal,
  Boxes,
} from "lucide-react";
import { toast } from "react-toastify";

import {
  getProducts,
  searchProducts,
  filterProducts,
  deleteProduct,
} from "../api/ProductApi";

import { getCategories } from "../api/CategoryApi";

import ProductForm from "../components/ProductForm";
import ProductDetails from "../components/ProductDetails";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);

  const [page, setPage] = useState(1);

  const perPage = 8;

  const extractList = (response) => {
    if (Array.isArray(response)) return response;

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.data?.products)) {
      return response.data.products;
    }

    if (Array.isArray(response?.products)) {
      return response.products;
    }

    return [];
  };

  const loadProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getProducts();
      setProducts(extractList(response));
    } catch (error) {
      console.log(error);
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        const productResponse = await getProducts();

        setProducts(extractList(productResponse));

        const categoryResponse = await getCategories();

        const list =
          categoryResponse?.data?.categories ||
          categoryResponse?.data ||
          categoryResponse?.categories ||
          [];

        setCategories(
          Array.isArray(list) ? list : []
        );
      } catch (error) {
        console.log(error);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = async () => {
    if (!search.trim()) {
      loadProducts();
      return;
    }

    setLoading(true);

    try {
      const response =
        await searchProducts(search);

      setProducts(extractList(response));
      setPage(1);
    } catch (error) {
      console.log(error);

      toast.error(
        "Unable to search products"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    if (!category && !status) {
      loadProducts();
      return;
    }

    setLoading(true);

    try {
      const response =
        await filterProducts(
          category,
          status
        );

      setProducts(extractList(response));
      setPage(1);
    } catch (error) {
      console.log(error);

      toast.error(
        "Unable to filter products"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (product) => {
    const confirmDelete =
      window.confirm(
        `Delete "${product.name}"?`
      );

    if (!confirmDelete) return;

    try {
      await deleteProduct(product.id);

      toast.success("Product deleted");

      loadProducts();
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Unable to delete product"
      );
    }
  };

  const handleSuccess = () => {
    toast.success(
      editing
        ? "Product updated"
        : "Product added"
    );

    setFormOpen(false);
    setEditing(null);

    loadProducts();
  };

  const totalPages = Math.ceil(
    products.length / perPage
  );

  const currentProducts =
    products.slice(
      (page - 1) * perPage,
      page * perPage
    );

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">
            Inventory
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Products
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your shop products and stock.
          </p>
        </div>

        <button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(15,23,42,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-[0_14px_30px_rgba(79,70,229,0.18)] active:translate-y-0 sm:w-auto"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Search + Filters */}
      <section className="mt-7 rounded-[22px] border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <SlidersHorizontal size={17} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">
              Search & Filter
            </p>

            <p className="text-xs text-slate-400">
              Find products quickly
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_200px_180px_auto]">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Search by product name..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
            />
          </div>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
          >
            <option value="">
              All Categories
            </option>

            {categories.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.name}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
          >
            <option value="">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>
          </select>

          <button
            onClick={handleFilter}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 sm:col-span-2 lg:col-span-1"
          >
            Filter
          </button>
        </div>
      </section>

      {/* Product Table */}
      <section className="mt-6 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Boxes size={18} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Product Inventory
              </p>

              <p className="text-xs text-slate-400">
                {products.length} products found
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-72 items-center justify-center p-6">
            <div className="text-center">
              <Loader2
                size={32}
                className="mx-auto animate-spin text-indigo-500"
              />

              <p className="mt-3 text-sm text-slate-500">
                Loading products...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-72 flex-col items-center justify-center p-6 text-center">
            <p className="font-medium text-red-600">
              {error}
            </p>

            <button
              onClick={loadProducts}
              className="mt-4 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center p-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
              <Package size={30} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-800">
              No products found
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Add your first product to get started.
            </p>

            <button
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
              className="mt-4 text-sm font-semibold text-indigo-600"
            >
              Add Product
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-slate-50/80">
                  <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    <th className="px-6 py-4">
                      Product
                    </th>

                    <th className="px-5 py-4">
                      SKU
                    </th>

                    <th className="px-5 py-4">
                      Price
                    </th>

                    <th className="px-5 py-4">
                      Stock
                    </th>

                    <th className="px-5 py-4">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentProducts.map(
                    (product) => {
                      const isLowStock =
                        Number(
                          product.stock_quantity
                        ) <=
                        Number(
                          product.min_stock_level
                        );

                      return (
                        <tr
                          key={product.id}
                          className="group border-t border-slate-100 transition-all duration-200 hover:bg-indigo-[0.025]"
                        >
                          {/* Product */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3.5">
                              {product.image ? (
                                <img
                                  src={
                                    product.image
                                  }
                                  alt={
                                    product.name
                                  }
                                  className="h-12 w-12 shrink-0 rounded-xl border border-slate-100 object-cover shadow-sm"
                                />
                              ) : (
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600">
                                  <Package
                                    size={20}
                                  />
                                </div>
                              )}

                              <div>
                                <p className="font-semibold text-slate-900">
                                  {
                                    product.name
                                  }
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                  {product.barcode ||
                                    "No barcode"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* SKU */}
                          <td className="px-5 py-4 text-sm text-slate-600">
                            {product.sku ||
                              "--"}
                          </td>

                          {/* Price */}
                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-slate-900">
                              Rs.{" "}
                              {
                                product.selling_price
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              Cost: Rs.{" "}
                              {
                                product.purchase_price
                              }
                            </p>
                          </td>

                          {/* Stock */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-slate-900">
                                {
                                  product.stock_quantity
                                }{" "}
                                {
                                  product.unit
                                }
                              </p>

                              {isLowStock && (
                                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600">
                                  Low
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-xs text-slate-400">
                              Min:{" "}
                              {
                                product.min_stock_level
                              }
                            </p>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                product.status ===
                                "Active"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  product.status ===
                                  "Active"
                                    ? "bg-emerald-500"
                                    : "bg-slate-400"
                                }`}
                              />

                              {
                                product.status
                              }
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() =>
                                  setViewing(
                                    product
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600"
                                title="View"
                              >
                                <Eye
                                  size={17}
                                />
                              </button>

                              <button
                                onClick={() => {
                                  setEditing(
                                    product
                                  );

                                  setFormOpen(
                                    true
                                  );
                                }}
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-all duration-200 hover:bg-amber-50 hover:text-amber-600"
                                title="Edit"
                              >
                                <Pencil
                                  size={17}
                                />
                              </button>

                              <button
                                onClick={() =>
                                  handleDelete(
                                    product
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500"
                                title="Delete"
                              >
                                <Trash2
                                  size={17}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-center text-sm text-slate-500 sm:text-left">
                  Page{" "}
                  <span className="font-semibold text-slate-800">
                    {page}
                  </span>{" "}
                  of {totalPages}
                </p>

                <div className="flex justify-center gap-2 sm:justify-end">
                  <button
                    disabled={page === 1}
                    onClick={() =>
                      setPage(page - 1)
                    }
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <button
                    disabled={
                      page === totalPages
                    }
                    onClick={() =>
                      setPage(page + 1)
                    }
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* Product Form */}
      {formOpen && (
        <ProductForm
          product={editing}
          categories={categories}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSuccess={handleSuccess}
        />
      )}

      {/* Product Details */}
      {viewing && (
        <ProductDetails
          product={viewing}
          onClose={() =>
            setViewing(null)
          }
        />
      )}
    </div>
  );
}