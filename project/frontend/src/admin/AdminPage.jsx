import { Link } from "react-router-dom";
import { ShieldCheck, Users, Package, ShoppingBag, ArrowLeft } from "lucide-react";
import rawProducts from "../data/products.json";

const ALL_PRODUCTS = rawProducts.products.map((p) => ({
  _id: String(p.id),
  name: p.title,
  image: p.thumbnail,
  price: p.price,
  category: p.category,
  rating: p.rating,
  stock: p.stock,
}));

const stats = [
  { label: "Total Products", value: ALL_PRODUCTS.length, icon: Package, color: "bg-blue-50 text-blue-600" },
  { label: "Categories",     value: [...new Set(ALL_PRODUCTS.map((p) => p.category))].length, icon: ShoppingBag, color: "bg-purple-50 text-purple-600" },
  { label: "In Stock",       value: ALL_PRODUCTS.filter((p) => p.stock > 0).length, icon: ShieldCheck, color: "bg-green-50 text-green-600" },
  { label: "Low Stock",      value: ALL_PRODUCTS.filter((p) => p.stock > 0 && p.stock <= 10).length, icon: Users, color: "bg-orange-50 text-orange-600" },
];

const AdminPage = () => (
  <div className="min-h-screen bg-[#F6F6F6]">
    {/* Header */}
    <div className="bg-white border-b border-[#E8E8E8] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <ShieldCheck size={20} className="text-[#1A1A1A]" />
        <span className="font-bold text-[#1A1A1A]">Admin Panel</span>
      </div>
      <Link to="/" className="flex items-center gap-1.5 text-sm text-[#717171] hover:text-[#1A1A1A] transition-colors">
        <ArrowLeft size={14} /> Back to Store
      </Link>
    </div>

    <div className="max-w-[1320px] mx-auto px-6 py-8 space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-[#E8E8E8] p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1A1A]">{value}</p>
              <p className="text-xs text-[#717171]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Products table */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E8E8E8]">
          <h2 className="font-bold text-[#1A1A1A]">All Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8E8E8] bg-[#F6F6F6]">
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#717171] uppercase tracking-wider">Product</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#717171] uppercase tracking-wider">Category</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#717171] uppercase tracking-wider">Price</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#717171] uppercase tracking-wider">Stock</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#717171] uppercase tracking-wider">Rating</th>
              </tr>
            </thead>
            <tbody>
              {ALL_PRODUCTS.map((p) => (
                <tr key={p._id} className="border-b border-[#E8E8E8] hover:bg-[#F6F6F6] transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-9 h-9 rounded-xl object-cover bg-[#F6F6F6]" />
                      <span className="font-medium text-[#1A1A1A] line-clamp-1">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 capitalize text-[#717171]">{p.category}</td>
                  <td className="px-6 py-3 font-semibold text-[#1A1A1A]">${p.price}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      p.stock === 0 ? "bg-red-50 text-red-600" :
                      p.stock <= 10 ? "bg-orange-50 text-orange-600" :
                      "bg-green-50 text-green-600"
                    }`}>
                      {p.stock === 0 ? "Out of stock" : p.stock <= 10 ? `Low (${p.stock})` : p.stock}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-[#717171]">⭐ {p.rating?.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export default AdminPage;
