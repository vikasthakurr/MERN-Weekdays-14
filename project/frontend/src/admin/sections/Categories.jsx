import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import rawProducts from "../../data/products.json";
import toast from "react-hot-toast";

const INITIAL = [...new Set(rawProducts.products.map((p) => p.category))].sort();

export default function Categories() {
  const [categories, setCategories] = useState(INITIAL);
  const [newCat,     setNewCat]     = useState("");
  const [editId,     setEditId]     = useState(null); // index
  const [editVal,    setEditVal]    = useState("");

  const handleAdd = () => {
    const trimmed = newCat.trim().toLowerCase();
    if (!trimmed) return;
    if (categories.includes(trimmed)) { toast.error("Category already exists"); return; }
    setCategories((c) => [...c, trimmed].sort());
    setNewCat("");
    toast.success("Category added");
  };

  const handleDelete = (cat) => {
    setCategories((c) => c.filter((x) => x !== cat));
    toast.success("Category deleted");
  };

  const startEdit = (idx) => { setEditId(idx); setEditVal(categories[idx]); };

  const confirmEdit = () => {
    const trimmed = editVal.trim().toLowerCase();
    if (!trimmed) return;
    setCategories((c) => c.map((x, i) => (i === editId ? trimmed : x)).sort());
    setEditId(null);
    toast.success("Category updated");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-[#1A1A1A]">Categories</h1>

      {/* Add */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] p-5">
        <p className="text-sm font-semibold text-[#1A1A1A] mb-3">Add New Category</p>
        <div className="flex gap-3">
          <input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="e.g. electronics"
            className="flex-1 border border-[#E8E8E8] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1A1A1A] transition-colors"
          />
          <button onClick={handleAdd}
            className="bg-[#1A1A1A] text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-black/80 transition-colors">
            <Plus size={15} /> Add
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E8E8E8]">
          <p className="font-bold text-[#1A1A1A]">{categories.length} Categories</p>
        </div>
        <ul className="divide-y divide-[#E8E8E8]">
          {categories.map((cat, idx) => (
            <li key={cat} className="flex items-center gap-3 px-6 py-3">
              {editId === idx ? (
                <>
                  <input
                    value={editVal}
                    onChange={(e) => setEditVal(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") confirmEdit(); if (e.key === "Escape") setEditId(null); }}
                    autoFocus
                    className="flex-1 border border-[#1A1A1A] rounded-lg px-3 py-1.5 text-sm outline-none"
                  />
                  <button onClick={confirmEdit} className="text-green-600 hover:text-green-700 p-1"><Check size={16} /></button>
                  <button onClick={() => setEditId(null)} className="text-[#717171] hover:text-[#1A1A1A] p-1"><X size={16} /></button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm font-medium text-[#1A1A1A] capitalize">{cat}</span>
                  <button onClick={() => startEdit(idx)} className="text-[#717171] hover:text-[#1A1A1A] p-1 transition-colors"><Pencil size={15} /></button>
                  <button onClick={() => handleDelete(cat)} className="text-[#717171] hover:text-red-500 p-1 transition-colors"><Trash2 size={15} /></button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
