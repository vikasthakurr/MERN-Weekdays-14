import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Shield, Calendar, Pencil, Check, X, Camera, Lock, KeyRound } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, updateUser } from "../redux/authSlice";
import api from "../utils/api";
import toast from "react-hot-toast";

// ── Editable field ────────────────────────────────────────────────────────────
const EditableField = ({ icon: Icon, label, value, field, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState(value ?? "");

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) onSave(field, trimmed);
    setEditing(false);
  };
  const cancel = () => { setDraft(value ?? ""); setEditing(false); };

  return (
    <div className="bg-white rounded-2xl border border-[#E8E8E8] p-5 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#717171]">
          <Icon size={15} />
          <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
        </div>
        {!editing && (
          <button onClick={() => { setDraft(value ?? ""); setEditing(true); }}
            className="text-[#717171] hover:text-[#1A1A1A] transition-colors p-1 rounded-lg hover:bg-[#F6F6F6]">
            <Pencil size={14} />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {editing ? (
          <motion.div key="edit"
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2">
            <input autoFocus value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") cancel(); }}
              className="flex-grow border border-[#1A1A1A] rounded-xl px-3 py-2 text-sm outline-none bg-white" />
            <button onClick={commit}
              className="w-8 h-8 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors shrink-0">
              <Check size={13} />
            </button>
            <button onClick={cancel}
              className="w-8 h-8 bg-[#F6F6F6] rounded-full flex items-center justify-center hover:bg-[#E8E8E8] transition-colors shrink-0">
              <X size={13} />
            </button>
          </motion.div>
        ) : (
          <motion.p key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-sm font-semibold text-[#1A1A1A] truncate">
            {value || <span className="text-[#C0C0C0] font-normal">Not set</span>}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Read-only field ───────────────────────────────────────────────────────────
const ReadField = ({ icon: Icon, label, value }) => (
  <div className="bg-white rounded-2xl border border-[#E8E8E8] p-5 space-y-2">
    <div className="flex items-center gap-2 text-[#717171]">
      <Icon size={15} />
      <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
    </div>
    <p className="text-sm font-semibold text-[#1A1A1A] capitalize">{value}</p>
  </div>
);

// ── Avatar ────────────────────────────────────────────────────────────────────
const AvatarUpload = ({ avatar, name, onUpload }) => {
  const inputRef = useRef(null);
  const [preview,  setPreview]  = useState(avatar ?? null);
  const [hovering, setHovering] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      const { data } = await api.patch("/users/me/avatar", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUpload(data.profileImage);
      toast.success("Avatar updated");
    } catch {
      toast.error("Avatar upload failed");
      setPreview(avatar ?? null);
    }
  };

  return (
    <div className="relative w-24 h-24 shrink-0">
      <div
        className="w-24 h-24 rounded-2xl overflow-hidden bg-[#F6F6F6] border border-[#E8E8E8] cursor-pointer"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={() => inputRef.current?.click()}
      >
        {preview
          ? <img src={preview} alt="avatar" className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center text-white text-2xl font-bold uppercase">
              {name?.[0] ?? <User size={28} />}
            </div>
        }
        <AnimatePresence>
          {hovering && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1 rounded-2xl">
              <Camera size={18} className="text-white" />
              <span className="text-white text-[9px] font-semibold uppercase tracking-wider">Change</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <button onClick={() => inputRef.current?.click()}
        className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center shadow-md hover:bg-black/80 transition-colors border-2 border-white">
        <Camera size={12} />
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const Profile = () => {
  const user     = useSelector(selectUser);
  const dispatch = useDispatch();
  const [pwForm,    setPwForm]    = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwOpen,    setPwOpen]    = useState(false);

  if (!user) return <Navigate to="/login" />;

  // Backend stores "name", not "username"
  const displayName = user.name ?? user.username ?? "";

  const handleSave = async (field, value) => {
    try {
      // field "name" maps directly; "email" maps directly
      const { data } = await api.patch("/users/me", { [field]: value });
      dispatch(updateUser({ name: data.name, email: data.email }));
      toast.success("Saved");
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Update failed");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) { toast.error("Passwords don't match"); return; }
    if (pwForm.newPassword.length < 6) { toast.error("Min 6 characters"); return; }
    setPwLoading(true);
    try {
      await api.patch("/users/me/change-password", {
        currentPassword: pwForm.currentPassword,
        newPassword:     pwForm.newPassword,
      });
      toast.success("Password changed");
      setPwForm({ currentPassword: "", newPassword: "", confirm: "" });
      setPwOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to change password");
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="space-y-4">

        {/* ── Header card ── */}
        <div className="bg-white rounded-3xl border border-[#E8E8E8] p-6">
          <div className="flex items-center gap-5">
            <AvatarUpload
              avatar={user.avatar ?? user.profileImage}
              name={displayName}
              onUpload={(url) => dispatch(updateUser({ avatar: url, profileImage: url }))}
            />
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-[#1A1A1A] truncate">{displayName}</h1>
              <p className="text-sm text-[#717171] truncate mt-0.5">{user.email}</p>
              <span className={`inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize
                ${user.role === "admin" ? "bg-purple-50 text-purple-600" : "bg-[#F6F6F6] text-[#717171]"}`}>
                <Shield size={11} /> {user.role ?? "user"}
              </span>
            </div>
          </div>
        </div>

        {/* ── Editable info ── */}
        <div className="bg-[#F6F6F6] rounded-3xl p-4 space-y-3">
          <p className="text-xs font-semibold text-[#717171] uppercase tracking-wider px-1">Account Info</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <EditableField icon={User}     label="Name"  value={displayName}  field="name"  onSave={handleSave} />
            <EditableField icon={Mail}     label="Email" value={user.email}   field="email" onSave={handleSave} />
            <ReadField     icon={Shield}   label="Role"  value={user.role ?? "user"} />
            <ReadField     icon={Calendar} label="Member Since"
              value={user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                : "May 2026"} />
          </div>
        </div>

        {/* ── Change password ── */}
        <div className="bg-white rounded-3xl border border-[#E8E8E8] overflow-hidden">
          <button onClick={() => setPwOpen((v) => !v)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#F6F6F6] transition-colors">
            <span className="flex items-center gap-2 text-sm font-semibold text-[#1A1A1A]">
              <KeyRound size={16} className="text-[#717171]" /> Change Password
            </span>
            <span className="text-xs text-[#717171]">{pwOpen ? "Hide" : "Show"}</span>
          </button>

          <AnimatePresence>
            {pwOpen && (
              <motion.div key="pw"
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-[#E8E8E8]">
                <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { key: "currentPassword", label: "Current",  placeholder: "Current password"   },
                      { key: "newPassword",      label: "New",      placeholder: "Min 6 characters"   },
                      { key: "confirm",          label: "Confirm",  placeholder: "Repeat new password" },
                    ].map(({ key, label, placeholder }) => (
                      <div key={key} className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#717171] uppercase tracking-wide">{label}</label>
                        <input type="password" value={pwForm[key]} placeholder={placeholder} required
                          onChange={(e) => setPwForm((f) => ({ ...f, [key]: e.target.value }))}
                          className="w-full border border-[#E8E8E8] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1A1A1A] transition-colors bg-[#F6F6F6]" />
                      </div>
                    ))}
                  </div>
                  <button type="submit" disabled={pwLoading}
                    className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-black/80 transition-colors disabled:opacity-50">
                    {pwLoading ? "Saving…" : "Update Password"}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </motion.div>
    </div>
  );
};

export default Profile;
