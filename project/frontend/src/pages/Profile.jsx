import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Shield, Calendar, Pencil, Check, X, Camera, Lock } from "lucide-react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

// ── Editable field row ───────────────────────────────────────────────────────
const EditableField = ({ icon: Icon, label, value, field, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const handleSave = () => {
    if (draft.trim() && draft.trim() !== value) onSave(field, draft.trim());
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(value);
    setEditing(false);
  };

  return (
    <div className="bg-gray-100 p-6 rounded-[20px] space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-black opacity-60">
          <Icon size={18} />
          <span className="font-bold text-xs uppercase tracking-wider">{label}</span>
        </div>
        {!editing && (
          <button
            onClick={() => { setDraft(value); setEditing(true); }}
            className="text-gray-400 hover:text-black transition-colors"
            aria-label={`Edit ${label}`}
          >
            <Pencil size={15} />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {editing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-2"
          >
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") handleCancel(); }}
              className="flex-grow bg-white border-2 border-black rounded-xl px-3 py-2 text-sm font-bold outline-none"
            />
            <button onClick={handleSave} className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors">
              <Check size={14} />
            </button>
            <button onClick={handleCancel} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
              <X size={14} />
            </button>
          </motion.div>
        ) : (
          <motion.p
            key="view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-bold"
          >
            {value}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Avatar upload ────────────────────────────────────────────────────────────
const AvatarUpload = ({ avatar, username, onUpload }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(avatar ?? null);
  const [hovering, setHovering] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Read as base64 and store — no backend needed for now
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setPreview(dataUrl);
      onUpload(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative w-28 h-28 mx-auto">
      <div
        className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-xl cursor-pointer"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-black flex items-center justify-center text-white text-3xl font-black uppercase">
            {username?.[0] ?? <User size={32} />}
          </div>
        )}

        {/* Hover overlay */}
        <AnimatePresence>
          {hovering && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1"
            >
              <Camera size={20} className="text-white" />
              <span className="text-white text-[10px] font-bold uppercase tracking-wider">Change</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Camera badge */}
      <button
        onClick={() => inputRef.current?.click()}
        className="absolute bottom-0 right-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shadow-md hover:bg-black/80 transition-colors"
        aria-label="Upload profile picture"
      >
        <Camera size={14} />
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
};

// ── Profile page ─────────────────────────────────────────────────────────────
const Profile = () => {
  const user = null; // auth removed
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);

  if (!user) return <Navigate to="/login" />;

  const handleSave = async (field, value) => {
    try {
      toast.success("Saved");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleAvatarUpload = (dataUrl) => {
    toast.success("Avatar updated");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) { toast.error("Passwords don't match"); return; }
    if (pwForm.newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setPwLoading(true);
    try {
      toast.success("Password changed");
      setPwForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      toast.error("Failed to change password");
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-gray-100 rounded-[32px] overflow-hidden bg-white shadow-sm"
      >
        {/* Cover */}
        <div className="h-36 bg-gray-100 relative" />

        {/* Avatar — overlaps cover */}
        <div className="-mt-14 px-8 pb-8">
          <AvatarUpload
            avatar={user.avatar}
            username={user.username}
            onUpload={handleAvatarUpload}
          />

          {/* Name + role */}
          <div className="text-center mt-4 space-y-1">
            <h2 className="text-3xl font-black uppercase tracking-tighter">{user.username}</h2>
            <span className="inline-block bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full capitalize">
              {user.role ?? "Customer"}
            </span>
          </div>

          {/* Editable fields */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            <EditableField icon={User} label="Username" value={user.username} field="username" onSave={handleSave} />
            <EditableField icon={Mail} label="Email"    value={user.email}    field="email"    onSave={handleSave} />

            {/* Read-only fields */}
            <div className="bg-gray-100 p-6 rounded-[20px] space-y-3">
              <div className="flex items-center space-x-2 text-black opacity-60">
                <Shield size={18} />
                <span className="font-bold text-xs uppercase tracking-wider">Role</span>
              </div>
              <p className="text-lg font-bold capitalize">{user.role ?? "Customer"}</p>
            </div>

            <div className="bg-gray-100 p-6 rounded-[20px] space-y-3">
              <div className="flex items-center space-x-2 text-black opacity-60">
                <Calendar size={18} />
                <span className="font-bold text-xs uppercase tracking-wider">Member Since</span>
              </div>
              <p className="text-lg font-bold">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                  : "May 2026"}
              </p>
            </div>
          </div>

          {/* ── Change Password ── */}
          <div className="mt-8 border-t border-gray-100 pt-8">
            <h3 className="font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Lock size={16} /> Change Password
            </h3>
            <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Current Password", key: "currentPassword", placeholder: "Current password" },
                { label: "New Password",     key: "newPassword",     placeholder: "Min. 6 characters" },
                { label: "Confirm New",      key: "confirm",         placeholder: "Repeat new password" },
              ].map(({ label, key, placeholder }) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</label>
                  <input
                    type="password"
                    value={pwForm[key]}
                    onChange={(e) => setPwForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    required
                    className="w-full bg-gray-100 rounded-2xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-black transition-all"
                  />
                </div>
              ))}
              <div className="md:col-span-3">
                <button
                  type="submit"
                  disabled={pwLoading}
                  className="bg-black text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-black/90 transition-all disabled:opacity-50"
                >
                  {pwLoading ? "Saving…" : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
