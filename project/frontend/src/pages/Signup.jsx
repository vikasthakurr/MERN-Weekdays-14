import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Camera, X } from "lucide-react";
import toast from "react-hot-toast";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const Signup = () => {
  const navigate = useNavigate();
  const imgRef   = useRef(null);
  const [form, setForm]         = useState({ username: "", email: "", password: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview]   = useState(null);
  const [loading, setLoading]   = useState(false);

  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#F6F6F6]">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl border border-[#E8E8E8] shadow-sm overflow-hidden"
      >
        <div className="px-8 pt-8 pb-6 border-b border-[#E8E8E8]">
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Create account</h2>
          <p className="text-sm text-[#717171] mt-1">Join millions of shoppers on Commerce</p>
        </div>

        <div className="px-8 py-6 space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <button type="button" onClick={() => imgRef.current?.click()}
                className="w-16 h-16 rounded-full border-2 border-dashed border-[#E8E8E8] overflow-hidden flex items-center justify-center bg-[#F6F6F6] hover:border-[#1A1A1A] transition-colors">
                {preview
                  ? <img src={preview} alt="" className="w-full h-full object-cover" />
                  : <Camera size={20} className="text-[#717171]" />
                }
              </button>
              <AnimatePresence>
                {preview && (
                  <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    type="button" onClick={() => { setAvatarFile(null); setPreview(null); }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow">
                    <X size={10} />
                  </motion.button>
                )}
              </AnimatePresence>
              <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1A1A1A]">Profile photo</p>
              <p className="text-xs text-[#717171]">Optional — click to upload</p>
            </div>
          </div>

          <button type="button" onClick={() => toast("Google login coming soon!", { icon: "🚧" })}
            className="w-full flex items-center justify-center gap-3 border border-[#E8E8E8] py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
            <GoogleIcon /> Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#E8E8E8]" />
            <span className="text-xs text-[#717171]">or</span>
            <div className="flex-1 h-px bg-[#E8E8E8]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: "Username", key: "username", type: "text",     Icon: User, placeholder: "Choose a username", min: 3 },
              { label: "Email",    key: "email",    type: "email",    Icon: Mail, placeholder: "your@email.com" },
              { label: "Password", key: "password", type: "password", Icon: Lock, placeholder: "Min. 6 characters", min: 6 },
            ].map(({ label, key, type, Icon, placeholder, min }) => (
              <div key={key} className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717171]" size={16} />
                  <input type={type} value={form[key]} onChange={handle(key)}
                    className="w-full border border-[#E8E8E8] rounded-full py-3 pl-11 pr-4 text-sm outline-none focus:border-[#1A1A1A] transition-colors bg-[#F6F6F6]"
                    placeholder={placeholder} minLength={min} required />
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading}
              className="w-full bg-[#1A1A1A] text-white py-3 rounded-full font-semibold text-sm hover:bg-black/80 transition-colors disabled:opacity-50">
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-[#717171]">
            Already have an account?{" "}
            <Link to="/login" className="text-[#1A1A1A] font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
