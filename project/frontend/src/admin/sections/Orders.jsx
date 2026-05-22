import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";

const STATUSES = ["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const STATUS_COLOR = {
  pending:    "bg-yellow-50 text-yellow-600",
  confirmed:  "bg-blue-50 text-blue-600",
  processing: "bg-indigo-50 text-indigo-600",
  shipped:    "bg-purple-50 text-purple-600",
  delivered:  "bg-green-50 text-green-600",
  cancelled:  "bg-red-50 text-red-600",
};

// Dummy orders
const DUMMY_ORDERS = Array.from({ length: 30 }, (_, i) => ({
  _id: `ORD-${String(i + 1).padStart(4, "0")}`,
  user: `user${i + 1}@example.com`,
  total: (Math.random() * 400 + 20).toFixed(2),
  items: Math.floor(Math.random() * 5) + 1,
  status: STATUSES.slice(1)[i % (STATUSES.length - 1)],
  date: new Date(Date.now() - i * 86400000 * 2).toLocaleDateString(),
}));

export default function Orders() {
  const [search,    setSearch]    = useState("");
  const [statusFilter, setStatus] = useState("all");
  const [orders, setOrders]       = useState(DUMMY_ORDERS);

  const filtered = orders.filter((o) => {
    const matchSearch = o._id.toLowerCase().includes(search.toLowerCase()) ||
                        o.user.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id, status) =>
    setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status } : o));

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-[#1A1A1A]">All Orders</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717171]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID or user..."
            className="w-full border border-[#E8E8E8] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#1A1A1A] transition-colors bg-white" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={(e) => setStatus(e.target.value)}
            className="appearance-none border border-[#E8E8E8] rounded-xl px-4 py-2.5 pr-8 text-sm outline-none focus:border-[#1A1A1A] bg-white capitalize cursor-pointer">
            {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s === "all" ? "All Statuses" : s}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717171] pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F6F6F6] border-b border-[#E8E8E8]">
                {["Order ID", "User", "Items", "Total", "Date", "Status", "Update"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#717171] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o._id} className="border-b border-[#E8E8E8] hover:bg-[#F6F6F6] transition-colors">
                  <td className="px-5 py-3 font-semibold text-[#1A1A1A]">{o._id}</td>
                  <td className="px-5 py-3 text-[#717171]">{o.user}</td>
                  <td className="px-5 py-3 text-[#717171]">{o.items}</td>
                  <td className="px-5 py-3 font-semibold text-[#1A1A1A]">${o.total}</td>
                  <td className="px-5 py-3 text-[#717171] whitespace-nowrap">{o.date}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLOR[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="relative">
                      <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)}
                        className="appearance-none border border-[#E8E8E8] rounded-lg px-3 py-1.5 pr-7 text-xs outline-none focus:border-[#1A1A1A] bg-white capitalize cursor-pointer">
                        {STATUSES.slice(1).map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                      </select>
                      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#717171] pointer-events-none" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-[#717171] text-sm py-10">No orders found</p>
          )}
        </div>
      </div>
    </div>
  );
}
