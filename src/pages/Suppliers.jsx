import { useEffect, useState } from "react";
import {
  Eye,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  Truck,
} from "lucide-react";
import { toast } from "react-toastify";

import {
  deleteSupplier,
  getSuppliers,
} from "../api/SupplierApi";

import SupplierForm from "../components/SupplierForm";
import SupplierDetails from "../components/SupplierDetails";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);

  const extractList = (response) => {
    if (Array.isArray(response)) return response;

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.data?.suppliers)) {
      return response.data.suppliers;
    }

    if (Array.isArray(response?.suppliers)) {
      return response.suppliers;
    }

    return [];
  };

  const loadSuppliers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getSuppliers();
      setSuppliers(extractList(response));
    } catch (error) {
      console.log(error);
      setError("Unable to load suppliers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getSuppliers();
        setSuppliers(extractList(response));
      } catch (error) {
        console.log(error);
        setError("Unable to load suppliers.");
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter((supplier) => {
    const value = search.trim().toLowerCase();

    return (
      supplier.name?.toLowerCase().includes(value) ||
      supplier.phone?.includes(value) ||
      supplier.email?.toLowerCase().includes(value) ||
      supplier.address?.toLowerCase().includes(value)
    );
  });

  const handleDelete = async (supplier) => {
    const confirmed = window.confirm(
      `Delete "${supplier.name}"?`
    );

    if (!confirmed) return;

    try {
      await deleteSupplier(supplier.id);

      toast.success("Supplier deleted");
      loadSuppliers();
    } catch (error) {
      console.log(error);
      toast.error("Unable to delete supplier");
    }
  };

  const handleSuccess = () => {
    toast.success(
      editing ? "Supplier updated" : "Supplier added"
    );

    setFormOpen(false);
    setEditing(null);

    loadSuppliers();
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Suppliers
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your shop suppliers and balances.
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
          Add Supplier
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
            placeholder="Search suppliers..."
            className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Supplier List */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-72 items-center justify-center p-6">
            <div className="text-center">
              <Loader2
                size={32}
                className="mx-auto animate-spin text-blue-600"
              />

              <p className="mt-3 text-sm text-slate-500">
                Loading suppliers...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-72 flex-col items-center justify-center p-6 text-center">
            <p className="font-medium text-red-600">
              {error}
            </p>

            <button
              onClick={loadSuppliers}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
              Try Again
            </button>
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center p-6 text-center">
            <Truck
              size={42}
              className="text-slate-300"
            />

            <h3 className="mt-4 font-semibold text-slate-800">
              No suppliers found
            </h3>

            <button
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
              className="mt-4 text-sm font-medium text-blue-600"
            >
              Add Supplier
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">
                    Supplier
                  </th>

                  <th className="px-5 py-4">
                    Phone
                  </th>

                  <th className="px-5 py-4">
                    Email
                  </th>

                  <th className="px-5 py-4">
                    Address
                  </th>

                  <th className="px-5 py-4">
                    Outstanding Balance
                  </th>

                  <th className="px-5 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr
                    key={supplier.id}
                    className="border-t border-slate-100 transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <Truck size={19} />
                        </div>

                        <div className="min-w-0">
                          <p className="font-medium text-slate-900">
                            {supplier.name}
                          </p>

                          <p className="text-xs text-slate-400">
                            {supplier.contact_person || ""}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-700">
                      {supplier.phone || "--"}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-700">
                      {supplier.email || "--"}
                    </td>

                    <td className="max-w-xs px-5 py-4 text-sm text-slate-500">
                      {supplier.address || "--"}
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-800">
                      {supplier.outstanding_balance != null
                        ? `Rs. ${supplier.outstanding_balance}`
                        : "--"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setViewing(supplier)}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                          title="View"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          onClick={() => {
                            setEditing(supplier);
                            setFormOpen(true);
                          }}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-amber-50 hover:text-amber-600"
                          title="Edit"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => handleDelete(supplier)}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
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

      {formOpen && (
        <SupplierForm
          supplier={editing}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSuccess={handleSuccess}
        />
      )}

      {viewing && (
        <SupplierDetails
          supplier={viewing}
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}