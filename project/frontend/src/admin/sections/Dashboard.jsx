import { Package, Tag, ShoppingCart, Users } from "lucide-react";
import rawProducts from "../../data/products.json";

const ALL_PRODUCTS = rawProducts.products;
const CATEGORIES   = [...new Set(ALL_PRODUCTS.map((p) => p.category))];

const DUMMY_ORDERS = Array.from({ length: 24 }, (_, i) => ({ id: i + 1, status: ["pending","confirmed","shipped","delivered"][i % 4] }));
const DUMMY_USERS  = Array.from({ length: 18 }, (_, i) => ({ id: i + 1 }));

const stats = [
  { label: "Total Products", value: ALL_PRODUCTS.length,          icon: Package,      color: "bg-blue-50 text-blue-600"   },
  { label: "Categories",     value: CATEGORIES.length,            icon: Tag,          color: "bg-purple-50 text-purple-600"},
  { label: "Total Orders",   value: DUMMY_ORDERS.length,          icon: ShoppingCart, color: "bg-green-50 text-green-600" },
  { label: "Total Users",    value: DUMMY_USERS.length,           icon: Users,        color: "bg-orange-50 text-orange-600"},
];

const STATUS_COLOR = {
  pending:   "bg-yellow-50 text-yellow-600",
  confirmed: "bg-blue-50 text-blue-600",
  shipped:   "bg-purple-50 text-purple-600",
  delivered: "bg-green-50 text-green-600",
};

export default function Dashboard() {
  const recentOrders = DUMMY_ORDERS.slice(0, 6);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-[#1A1A1A]">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-[#E8E8E8] p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1A1A]">{value}</p>
              <p className="text-xs text-[#717171]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E8E8E8]">
          <p className="font-bold text-[#1A1A1A]">Recent Orders</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F6F6F6] border-b border-[#E8E8E8]">
              <th className="text-left px-6 py-3 text-xs font-semibold text-[#717171] uppercase tracking-wider">Order ID</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[#717171] uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o) => (
              <tr key={o.id} className="border-b border-[#E8E8E8] hover:bg-[#F6F6F6]">
                <td className="px-6 py-3 font-medium text-[#1A1A1A]">#ORD-{String(o.id).padStart(4, "0")}</td>
                <td className="px-6 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLOR[o.status]}`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
