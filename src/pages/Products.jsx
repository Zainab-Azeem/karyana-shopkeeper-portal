import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Package,
  Loader2,
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

        setProducts(
          extractList(productResponse)
        );

        const categoryResponse =
          await getCategories();

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
        setError(
          "Unable to load products."
        );
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

      setProducts(
        extractList(response)
      );

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

      setProducts(
        extractList(response)
      );

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

  const handleDelete = async (
    product
  ) => {
    const confirmDelete =
      window.confirm(
        `Delete "${product.name}"?`
      );

    if (!confirmDelete) return;

    try {
      await deleteProduct(product.id);

      toast.success(
        "Product deleted"
      );

      loadProducts();
    } catch (error) {
      console.log(error);

      toast.error(
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
      {/* Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Products
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your shop products
            and stock.
          </p>
        </div>

        <button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 sm:w-auto"
        >
          <Plus size={19} />
          Add Product
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_200px_180px_auto]">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
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
              placeholder="Search products..."
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600"
          >
            <option value="">
              All Categories
            </option>

            {categories.map(
              (item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              )
            )}
          </select>

          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600"
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
            className="rounded-xl bg-slate-900 px-5 py-2.5 font-medium text-white transition hover:bg-slate-800 sm:col-span-2 lg:col-span-1"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-72 items-center justify-center p-6">
            <div className="text-center">
              <Loader2
                size={32}
                className="mx-auto animate-spin text-blue-600"
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
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center p-6 text-center">
            <Package
              size={42}
              className="text-slate-300"
            />

            <h3 className="mt-4 font-semibold text-slate-800">
              No products found
            </h3>

            <button
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
              className="mt-4 text-sm font-medium text-blue-600"
            >
              Add Product
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-4">
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

                    <th className="px-5 py-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentProducts.map(
                    (product) => (
                      <tr
                        key={
                          product.id
                        }
                        className="border-t border-slate-100 transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {product.image ? (
                              <img
                                src={
                                  product.image
                                }
                                alt={
                                  product.name
                                }
                                className="h-11 w-11 shrink-0 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                <Package
                                  size={
                                    20
                                  }
                                />
                              </div>
                            )}

                            <div>
                              <p className="font-medium text-slate-900">
                                {
                                  product.name
                                }
                              </p>

                              <p className="text-xs text-slate-400">
                                {product.barcode ||
                                  "No barcode"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-700">
                          {product.sku ||
                            "--"}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-900">
                            Rs.{" "}
                            {
                              product.selling_price
                            }
                          </p>

                          <p className="text-xs text-slate-400">
                            Cost: Rs.{" "}
                            {
                              product.purchase_price
                            }
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-900">
                            {
                              product.stock_quantity
                            }{" "}
                            {
                              product.unit
                            }
                          </p>

                          <p className="text-xs text-slate-400">
                            Min:{" "}
                            {
                              product.min_stock_level
                            }
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              product.status ===
                              "Active"
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {
                              product.status
                            }
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                setViewing(
                                  product
                                )
                              }
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                              title="View"
                            >
                              <Eye
                                size={
                                  17
                                }
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
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-amber-50 hover:text-amber-600"
                              title="Edit"
                            >
                              <Pencil
                                size={
                                  17
                                }
                              />
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(
                                  product
                                )
                              }
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                              title="Delete"
                            >
                              <Trash2
                                size={
                                  17
                                }
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-center text-sm text-slate-500 sm:text-left">
                  Page {page} of{" "}
                  {totalPages}
                </p>

                <div className="flex justify-center gap-2 sm:justify-end">
                  <button
                    disabled={
                      page === 1
                    }
                    onClick={() =>
                      setPage(
                        page - 1
                      )
                    }
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <button
                    disabled={
                      page ===
                      totalPages
                    }
                    onClick={() =>
                      setPage(
                        page + 1
                      )
                    }
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Modal */}
      {formOpen && (
        <ProductForm
          product={editing}
          categories={categories}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSuccess={
            handleSuccess
          }
        />
      )}

      {/* Details Modal */}
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