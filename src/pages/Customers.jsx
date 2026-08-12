import { useEffect, useState } from "react";
import {
  Eye,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";
import { toast } from "react-toastify";

import {
  deleteCustomer,
  getCustomers,
} from "../api/CustomerApi";

import CustomerForm from "../components/CustomerForm";
import CustomerDetails from "../components/CustomerDetails";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
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

    if (Array.isArray(response?.data?.customers)) {
      return response.data.customers;
    }

    if (Array.isArray(response?.customers)) {
      return response.customers;
    }

    return [];
  };

  const loadCustomers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getCustomers();
      setCustomers(extractList(response));
    } catch (error) {
      console.log(error);
      setError("Unable to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getCustomers();
        setCustomers(extractList(response));
      } catch (error) {
        console.log(error);
        setError("Unable to load customers.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const value = search.trim().toLowerCase();

    return (
      customer.name?.toLowerCase().includes(value) ||
      customer.phone?.includes(value) ||
      customer.address?.toLowerCase().includes(value)
    );
  });

  const handleDelete = async (customer) => {
    const confirmed = window.confirm(
      `Delete "${customer.name}"?`
    );

    if (!confirmed) return;

    try {
      await deleteCustomer(customer.id);

      toast.success("Customer deleted");
      loadCustomers();
    } catch (error) {
      console.log(error);
      toast.error("Unable to delete customer");
    }
  };

  const handleSuccess = () => {
    toast.success(
      editing ? "Customer updated" : "Customer added"
    );

    setFormOpen(false);
    setEditing(null);

    loadCustomers();
  };

  const showAmount = (value) => {
    if (value == null || value === "") {
      return "--";
    }

    return `Rs. ${value}`;
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Customers
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your shop customers and balances.
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
          Add Customer
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
            placeholder="Search customers..."
            className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Customer List */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-72 items-center justify-center p-6">
            <div className="text-center">
              <Loader2
                size={32}
                className="mx-auto animate-spin text-blue-600"
              />

              <p className="mt-3 text-sm text-slate-500">
                Loading customers...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-72 flex-col items-center justify-center p-6 text-center">
            <p className="font-medium text-red-600">
              {error}
            </p>

            <button
              onClick={loadCustomers}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
              Try Again
            </button>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center p-6 text-center">
            <UserRound
              size={42}
              className="text-slate-300"
            />

            <h3 className="mt-4 font-semibold text-slate-800">
              No customers found
            </h3>

            <button
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
              className="mt-4 text-sm font-medium text-blue-600"
            >
              Add Customer
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">
                    Customer
                  </th>

                  <th className="px-5 py-4">
                    Phone
                  </th>

                  <th className="px-5 py-4">
                    Address
                  </th>

                  <th className="px-5 py-4">
                    Purchases
                  </th>

                  <th className="px-5 py-4">
                    Udhaar
                  </th>

                  <th className="px-5 py-4">
                    Paid
                  </th>

                  <th className="px-5 py-4">
                    Remaining
                  </th>

                  <th className="px-5 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map((customer) => {
                  const udhaar =
                    customer.total_udhaar ??
                    customer.current_balance;

                  const remaining =
                    customer.remaining_amount ??
                    customer.current_balance;

                  return (
                    <tr
                      key={customer.id}
                      className="border-t border-slate-100 transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <UserRound size={19} />
                          </div>

                          <p className="font-medium text-slate-900">
                            {customer.name}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">
                        {customer.phone || "--"}
                      </td>

                      <td className="max-w-xs px-5 py-4 text-sm text-slate-500">
                        {customer.address || "--"}
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-800">
                        {showAmount(customer.total_purchases)}
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-800">
                        {showAmount(udhaar)}
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-800">
                        {showAmount(customer.paid_amount)}
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-800">
                        {showAmount(remaining)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setViewing(customer)}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                            title="View"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            onClick={() => {
                              setEditing(customer);
                              setFormOpen(true);
                            }}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-amber-50 hover:text-amber-600"
                            title="Edit"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() => handleDelete(customer)}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {formOpen && (
        <CustomerForm
          customer={editing}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSuccess={handleSuccess}
        />
      )}

      {viewing && (
        <CustomerDetails
          customer={viewing}
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}