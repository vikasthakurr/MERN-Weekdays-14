import { useState } from "react";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";
import rawProducts from "../../data/products.json";
import toast from "react-hot-toast";

const seed = rawProducts.products.map((p) => ({
  _id: String(p.id), name: p.title, image: p.thumbnail,
  price: p.price, category: p.category, stock: p.stock,
}));

const EMPTY = { name: "", price: "", category: "", stock: "", image: "" };

function Modal({ title, data, onChange, onSave, onClose }) {
  const fields = [
    { key: "name",     label: "Name",     type: "text",   placeholder: "Product name"  },
    { key: "price",    label: "Price ($)", type: "number", placeholder: "0.00"          },
    { key: "category", label: "Category", type: "text",   placeholder: "electronics"   },
    { key: "stock",    label: "Stock",    type: "number", placeholder: "0"             },
    { key: "image",    label: "Image URL",type: "text",   placeholder: "https://..."   },
  ];
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E8E8]">
          <p className="font-bold text-[#1A1A1A]">{title}</p>
          <button onClick={onClose} className="text-[#717171] hover:text-[#1A1A1A]"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          {fields.map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-[#717171] mb-1.5 uppercase tracking-wide">{label}</label>
              <input type={type} value={data[key]} onChange={(e) => onChange(key, e.target.value)}
                placeholder={placeholder}
                className="w-full border border-[#E8E8E8] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1A1A1A] transition-colors" />
            </div>
          ))}
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose}
            className="flex-1 border border-[#E8E8E8] text-[#717171] py-2.5 rounded-xl text-sm font-semibold hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors">
            Cancel
          </button>
          <button onClick={onSave}
            className="flex-1 bg-[#1A1A1A] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-black/80 transition-colors">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const [products, setProducts] = useState(seed);
  const [search,   setSearch]   = useState("");
  const [modal,    setModal]    = useState(null); // null | "add" | "edit"
  const [form,     setForm]     = useState(EMPTY);
  const [editId,   setEditId]   = useState(null);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd  = () => { setForm(EMPTY); setModal("add"); };
  const openEdit = (p) => { setForm({ ...p, price: String(p.price), stock: String(p.stock) }); setEditId(p._id); setModal("edit"); };
  const closeModal = () => { setModal(null); setEditId(null); };

  const handleSave = () => {
    if (!form.name.trim() || !form.price) { toast.error("Name and price are required"); return; }
    if (modal === "add") {
      const newP = { ...form, _id: Date.now().toString(), price: Number(form.price), stock: Number(form.stock) };
      setProducts((p) => [newP, ...p]);
      toast.success("Product added");
    } else {
      setProducts((p) => p.map((x) => x._id === editId ? { ...x, ...form, price: Number(form.price), stock: Number(form.stock) } : x));
      toast.success("Product updated");
    }
    closeModal();
  };

  const handleDelete = (id) => {
    setProducts((p) => p.filter((x) => x._id !== id));
    toast.success("Product deleted");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-[#1A1A1A]">Products</h1>
        <button onClick={openAdd}
          className="bg-[#1A1A1A] text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-black/80 transition-colors">
          <Plus size={15} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717171]" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full border border-[#E8E8E8] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#1A1A1A] transition-colors bg-white" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F6F6F6] border-b border-[#E8E8E8]">
                {["Product", "Category", "Price", "Stock", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#717171] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id} className="border-b border-[#E8E8E8] hover:bg-[#F6F6F6] transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-9 h-9 rounded-xl object-cover bg-[#F6F6F6] shrink-0" />
                      <span className="font-medium text-[#1A1A1A] line-clamp-1 max-w-[180px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 capitalize text-[#717171]">{p.category}</td>
                  <td className="px-5 py-3 font-semibold text-[#1A1A1A]">${p.price}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      p.stock === 0 ? "bg-red-50 text-red-600" :
                      p.stock <= 10 ? "bg-orange-50 text-orange-600" :
                      "bg-green-50 text-green-600"}`}>
                      {p.stock === 0 ? "Out of stock" : p.stock <= 10 ? `Low (${p.stock})` : p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="text-[#717171] hover:text-[#1A1A1A] p-1 transition-colors"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(p._id)} className="text-[#717171] hover:text-red-500 p-1 transition-colors"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal
          title={modal === "add" ? "Add Product" : "Edit Product"}
          data={form}
          onChange={(k, v) => setForm((f) => ({ ...f, [k]: v }))}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
