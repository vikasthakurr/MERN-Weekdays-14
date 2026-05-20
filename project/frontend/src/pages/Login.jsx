import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, AlertCircle, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const Login = () => {
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("Login not available — auth context removed.");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#F6F6F6]">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl border border-[#E8E8E8] shadow-sm overflow-hidden"
      >
        <div className="px-8 pt-8 pb-6 border-b border-[#E8E8E8]">
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Sign in</h2>
          <p className="text-sm text-[#717171] mt-1">Welcome back to Commerce</p>
        </div>

        <div className="px-8 py-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl flex items-center gap-2 text-sm">
              <AlertCircle size={15} className="shrink-0" /> {error}
            </div>
          )}

          <button type="button" onClick={() => toast("Google login coming soon!", { icon: "🚧" })}
            className="w-full flex items-center justify-center gap-3 border border-[#E8E8E8] py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
            <GoogleIcon /> Continue with Google
          </button>

          <button
            type="button"
            onClick={() => { navigate("/admin"); toast.success("Entered as Admin"); }}
            className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] text-white py-3 rounded-full text-sm font-semibold hover:bg-black/80 transition-colors"
          >
            <ShieldCheck size={16} /> Continue as Admin
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#E8E8E8]" />
            <span className="text-xs text-[#717171]">or</span>
            <div className="flex-1 h-px bg-[#E8E8E8]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717171]" size={16} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[#E8E8E8] rounded-full py-3 pl-11 pr-4 text-sm outline-none focus:border-[#1A1A1A] transition-colors bg-[#F6F6F6]"
                  placeholder="your@email.com" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-xs text-[#717171] hover:text-[#1A1A1A] transition-colors">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717171]" size={16} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-[#E8E8E8] rounded-full py-3 pl-11 pr-4 text-sm outline-none focus:border-[#1A1A1A] transition-colors bg-[#F6F6F6]"
                  placeholder="Your password" required />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#1A1A1A] text-white py-3 rounded-full font-semibold text-sm hover:bg-black/80 transition-colors disabled:opacity-50">
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-[#717171]">
            New to Commerce?{" "}
            <Link to="/signup" className="text-[#1A1A1A] font-semibold hover:underline">Create account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
