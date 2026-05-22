import { useState } from "react";
import { Camera, Pencil, X, Check, KeyRound, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

const INITIAL = {
  name:   "Admin User",
  email:  "admin@example.com",
  phone:  "+1 234 567 8900",
  avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
};

function Field({ label, value, editing, onChange }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#717171] uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {editing ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-[#1A1A1A] rounded-xl px-4 py-2.5 text-sm outline-none bg-white"
        />
      ) : (
        <p className="text-sm font-medium text-[#1A1A1A] px-4 py-2.5 bg-[#F6F6F6] rounded-xl">{value}</p>
      )}
    </div>
  );
}

export default function AdminProfile() {
  const [profile,  setProfile]  = useState(INITIAL);
  const [draft,    setDraft]    = useState(INITIAL);
  const [editing,  setEditing]  = useState(false);
  const [pwForm,   setPwForm]   = useState({ current: "", next: "", confirm: "" });
  const [showPw,   setShowPw]   = useState(false);

  const startEdit  = () => { setDraft({ ...profile }); setEditing(true); };
  const cancelEdit = () => setEditing(false);

  const saveEdit = () => {
    if (!draft.name.trim() || !draft.email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    setProfile({ ...draft });
    setEditing(false);
    toast.success("Profile updated");
  };

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfile((p) => ({ ...p, avatar: url }));
    if (editing) setDraft((d) => ({ ...d, avatar: url }));
    toast.success("Avatar updated");
  };

  const handlePasswordSave = () => {
    if (!pwForm.current) { toast.error("Enter your current password"); return; }
    if (pwForm.next.length < 6) { toast.error("New password must be at least 6 characters"); return; }
    if (pwForm.next !== pwForm.confirm) { toast.error("Passwords do not match"); return; }
    setPwForm({ current: "", next: "", confirm: "" });
    setShowPw(false);
    toast.success("Password changed");
  };

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-xl font-bold text-[#1A1A1A]">Admin Profile</h1>

      {/* Avatar + info card */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] p-6 space-y-6">

        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            <img src={profile.avatar} alt="avatar"
              className="w-20 h-20 rounded-2xl object-cover border border-[#E8E8E8]" />
            <label className="absolute -bottom-2 -right-2 w-7 h-7 bg-[#1A1A1A] rounded-full flex items-center justify-center cursor-pointer hover:bg-black/80 transition-colors">
              <Camera size={13} className="text-white" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
            </label>
          </div>
          <div>
            <p className="font-bold text-[#1A1A1A]">{profile.name}</p>
            <p className="text-sm text-[#717171]">{profile.email}</p>
            <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 bg-purple-50 text-purple-600 rounded-full text-xs font-semibold">
              <ShieldCheck size={11} /> Admin
            </span>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <Field label="Full Name" value={editing ? draft.name  : profile.name}
            editing={editing} onChange={(v) => setDraft((d) => ({ ...d, name: v }))} />
          <Field label="Email"     value={editing ? draft.email : profile.email}
            editing={editing} onChange={(v) => setDraft((d) => ({ ...d, email: v }))} />
          <Field label="Phone"     value={editing ? draft.phone : profile.phone}
            editing={editing} onChange={(v) => setDraft((d) => ({ ...d, phone: v }))} />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          {editing ? (
            <>
              <button onClick={cancelEdit}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-[#E8E8E8] text-sm font-semibold text-[#717171] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors">
                <X size={14} /> Cancel
              </button>
              <button onClick={saveEdit}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1A1A1A] text-white text-sm font-semibold hover:bg-black/80 transition-colors">
                <Check size={14} /> Save Changes
              </button>
            </>
          ) : (
            <button onClick={startEdit}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-[#E8E8E8] text-sm font-semibold text-[#717171] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors">
              <Pencil size={14} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden">
        <button onClick={() => setShowPw((v) => !v)}
          className="w-full flex items-center justify-between px-6 py-4 text-sm font-bold text-[#1A1A1A] hover:bg-[#F6F6F6] transition-colors">
          <span className="flex items-center gap-2"><KeyRound size={16} /> Change Password</span>
          <span className="text-[#717171] text-xs">{showPw ? "Hide" : "Show"}</span>
        </button>

        {showPw && (
          <div className="px-6 pb-6 space-y-4 border-t border-[#E8E8E8] pt-5">
            {[
              { key: "current", label: "Current Password",  placeholder: "••••••••" },
              { key: "next",    label: "New Password",       placeholder: "Min 6 characters" },
              { key: "confirm", label: "Confirm Password",   placeholder: "Repeat new password" },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-[#717171] uppercase tracking-wide mb-1.5">{label}</label>
                <input type="password" value={pwForm[key]} placeholder={placeholder}
                  onChange={(e) => setPwForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full border border-[#E8E8E8] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1A1A1A] transition-colors" />
              </div>
            ))}
            <button onClick={handlePasswordSave}
              className="w-full bg-[#1A1A1A] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-black/80 transition-colors">
              Update Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
