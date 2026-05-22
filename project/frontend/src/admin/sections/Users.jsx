import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Search, Loader2 } from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";

const EMPTY_FORM = { name: "", email: "", role: "user" };

function Modal({ title, data, onChange, onSave, onClose, saving }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E8E8]">
          <p className="font-bold text-[#1A1A1A]">{title}</p>
          <button onClick={onClose} className="text-[#717171] hover:text-[#1A1A1A]"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          {[
            { key: "name",  label: "Name",  type: "text",  placeholder: "Full name"        },
            { key: "email", label: "Email", type: "email", placeholder: "user@example.com" },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-[#717171] mb-1.5 uppercase tracking-wide">{label}</label>
              <input type={type} value={data[key]} onChange={(e) => onChange(key, e.target.value)}
                placeholder={placeholder}
                className="w-full border border-[#E8E8E8] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1A1A1A] transition-colors" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-[#717171] mb-1.5 uppercase tracking-wide">Role</label>
            <select value={data.role} onChange={(e) => onChange("role", e.target.value)}
              className="w-full border border-[#E8E8E8] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1A1A1A] bg-white">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} disabled={saving}
            className="flex-1 border border-[#E8E8E8] text-[#717171] py-2.5 rounded-xl text-sm font-semibold hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors">
            Cancel
          </button>
          <button onClick={onSave} disabled={saving}
            className="flex-1 bg-[#1A1A1A] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-black/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            {saving && <Loader2 size={14} className="animate-spin" />} Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Users() {
  const [users,  setUsers]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal,  setModal]  = useState(null);
  const [form,   setForm]   = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/admin/users?limit=100");
      setUsers(data.users ?? data.data ?? []);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd  = () => { setForm(EMPTY_FORM); setModal("add"); };
  const openEdit = (u) => { setForm({ name: u.name, email: u.email, role: u.role }); setEditId(u._id); setModal("edit"); };
  const closeModal = () => { setModal(null); setEditId(null); };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) { toast.error("Name and email are required"); return; }
    setSaving(true);
    try {
      if (modal === "edit") {
        const { data } = await api.patch(`/admin/users/${editId}`, { name: form.name, email: form.email, role: form.role });
        setUsers((u) => u.map((x) => x._id === editId ? { ...x, ...data } : x));
        toast.success("User updated");
      } else {
        toast("User creation requires registration endpoint");
      }
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((u) => u.filter((x) => x._id !== id));
      toast.success("User deleted");
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Delete failed");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-[#1A1A1A]">All Users</h1>
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717171]" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full border border-[#E8E8E8] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#1A1A1A] transition-colors bg-white" />
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-[#717171]" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F6F6F6] border-b border-[#E8E8E8]">
                  {["Name", "Email", "Role", "Joined", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#717171] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u._id} className="border-b border-[#E8E8E8] hover:bg-[#F6F6F6] transition-colors">
                    <td className="px-5 py-3 font-medium text-[#1A1A1A]">{u.name}</td>
                    <td className="px-5 py-3 text-[#717171]">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize
                        ${u.role === "admin" ? "bg-purple-50 text-purple-600" : "bg-gray-100 text-[#717171]"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[#717171] whitespace-nowrap">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(u)} className="text-[#717171] hover:text-[#1A1A1A] p-1 transition-colors"><Pencil size={15} /></button>
                        <button onClick={() => handleDelete(u._id)} className="text-[#717171] hover:text-red-500 p-1 transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="text-center text-[#717171] text-sm py-10">No users found</p>}
          </div>
        )}
      </div>

      {modal && (
        <Modal
          title="Edit User"
          data={form}
          onChange={(k, v) => setForm((f) => ({ ...f, [k]: v }))}
          onSave={handleSave}
          onClose={closeModal}
          saving={saving}
        />
      )}
    </div>
  );
}
