import { useEffect, useState } from "react";
import {
  Eye,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  Truck,
  WalletCards,
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
    if (Array.isArray(response?.data)) return response.data;

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
    const value = search.toLowerCase();

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
      toast.error(
        error.response?.data?.message ||
          "Unable to delete supplier"
      );
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
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">
            Partners
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Suppliers
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage supplier details and outstanding balances.
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
          Add Supplier
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
            placeholder="Search suppliers..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-50"
          />
        </div>
      </section>

      {/* Table */}
      <section className="mt-6 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <Truck size={18} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">
              Supplier Directory
            </p>

            <p className="text-xs text-slate-400">
              {filteredSuppliers.length} suppliers
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
                Loading suppliers...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-72 flex-col items-center justify-center p-6">
            <p className="font-medium text-red-600">
              {error}
            </p>

            <button
              onClick={loadSuppliers}
              className="mt-4 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white"
            >
              Try Again
            </button>
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center p-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-300">
              <Truck size={30} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-800">
              No suppliers found
            </h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead className="bg-slate-50/80 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                <tr>
                  <th className="px-6 py-4">Supplier</th>
                  <th className="px-5 py-4">Phone</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Address</th>
                  <th className="px-5 py-4">
                    Outstanding Balance
                  </th>
                  <th className="px-6 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr
                    key={supplier.id}
                    className="border-t border-slate-100 transition-all duration-200 hover:bg-indigo-[0.025]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 text-orange-600">
                          <Truck size={19} />
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {supplier.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {supplier.contact_person || "Supplier"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {supplier.phone || "--"}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {supplier.email || "--"}
                    </td>

                    <td className="max-w-xs px-5 py-4 text-sm text-slate-500">
                      {supplier.address || "--"}
                    </td>

                    <td className="px-5 py-4">
                      {supplier.outstanding_balance != null ? (
                        <div className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">
                          <WalletCards size={15} />
                          Rs. {supplier.outstanding_balance}
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">
                          --
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setViewing(supplier)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                          title="View"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          onClick={() => {
                            setEditing(supplier);
                            setFormOpen(true);
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-amber-50 hover:text-amber-600"
                          title="Edit"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => handleDelete(supplier)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-500"
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
      </section>

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