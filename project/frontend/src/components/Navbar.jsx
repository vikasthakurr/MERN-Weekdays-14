import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, User, Menu, Search, ChevronDown, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="bg-white border-b border-[#E8E8E8] sticky top-0 z-50">
        <div className="max-w-[1320px] mx-auto px-6 h-16 flex items-center gap-6">

          <Link to="/" className="text-[#1A1A1A] text-xl font-bold tracking-tight flex-shrink-0">
            Commerce
          </Link>

          {/* Search */}
          <div className="flex-grow max-w-2xl relative hidden md:block">
            <div className="flex items-center border border-[#E8E8E8] rounded-full bg-[#F6F6F6] hover:border-[#1A1A1A] transition-colors overflow-hidden">
              <button className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-[#1A1A1A] border-r border-[#E8E8E8] whitespace-nowrap hover:bg-gray-100 transition-colors">
                All categories <ChevronDown size={14} />
              </button>
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search anything"
                  className="w-full bg-transparent py-2.5 pl-4 pr-10 text-sm outline-none placeholder:text-[#717171]"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                    <X size={14} />
                  </button>
                )}
              </div>
              <button className="px-4 py-2.5 text-[#1A1A1A] hover:text-gray-600">
                <Search size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <Link to="/login" className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-50 transition-colors text-sm font-medium text-[#1A1A1A]">
              <User size={20} />
              <span className="hidden lg:block">Account</span>
            </Link>

            <Link to="/cart" className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-50 transition-colors relative">
              <ShoppingBag size={20} className="text-[#1A1A1A]" />
              <span className="hidden lg:block text-sm font-medium text-[#1A1A1A]">Shopping</span>
            </Link>

            <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 rounded-full hover:bg-gray-50 transition-colors">
              <Menu size={20} className="text-[#1A1A1A]" />
            </button>
          </div>
        </div>

        <div className="hidden md:block border-t border-[#E8E8E8] bg-white">
          <div className="max-w-[1320px] mx-auto px-6 flex items-center gap-8 h-10">
            {[
              { to: "/categories", label: "All Categories" },
              { to: "/#new-arrivals", label: "New Arrivals" },
              { to: "/#on-sale", label: "On Sale" },
              { to: "/categories", label: "Clothing & Shoes" },
              { to: "/categories", label: "Home & Living" },
              { to: "/categories", label: "Art & Collectibles" },
            ].map(({ to, label }) => (
              <Link key={label} to={to} className="text-xs font-medium text-[#717171] hover:text-[#1A1A1A] transition-colors whitespace-nowrap">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-72 bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E8E8]">
                <span className="text-lg font-bold text-[#1A1A1A]">Commerce</span>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-full hover:bg-gray-100">
                  <X size={18} />
                </button>
              </div>
              <div className="px-4 py-3 border-b border-[#E8E8E8]">
                <div className="flex items-center border border-[#E8E8E8] rounded-full bg-[#F6F6F6] px-3 py-2 gap-2">
                  <Search size={16} className="text-[#717171] shrink-0" />
                  <input
                    type="text" value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search anything"
                    className="flex-grow bg-transparent text-sm outline-none placeholder:text-[#717171]"
                  />
                </div>
              </div>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="mx-4 my-3 flex items-center justify-center gap-2 bg-[#1A1A1A] text-white py-2.5 rounded-full text-sm font-semibold">
                <User size={16} /> Sign In
              </Link>
              <nav className="flex-grow px-2 py-2 overflow-y-auto">
                {[
                  { to: "/categories", label: "All Categories" },
                  { to: "/#new-arrivals", label: "New Arrivals" },
                  { to: "/#on-sale", label: "On Sale" },
                ].map(({ to, label }) => (
                  <Link key={label} to={to} onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm font-medium hover:bg-gray-50 rounded-xl transition-colors border-b border-[#F6F6F6]">
                    {label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
