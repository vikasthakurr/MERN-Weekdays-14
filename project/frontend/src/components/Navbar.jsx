import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, User, Menu, Search, ChevronDown, X, Star, LogOut, ShoppingCart, UserCircle, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearch } from "../context/Searchcontext";
import { useSelector, useDispatch } from "react-redux";
import { selectCartCount } from "../redux/cartSlice";
import { selectUser, logoutUser } from "../redux/authSlice";
import ProductModal from "./ProductModal";
import toast from "react-hot-toast";

const MAX_SUGGESTIONS = 6;

const Navbar = () => {
  const navigate    = useNavigate();
  const dispatch    = useDispatch();
  const { query, setQuery, results, clearSearch } = useSearch();
  const cartCount   = useSelector(selectCartCount);
  const user        = useSelector(selectUser);

  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const searchRef  = useRef(null);
  const userMenuRef = useRef(null);

  // Close search dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setDropdownOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    setUserMenuOpen(false);
    toast.success("Logged out");
    navigate("/");
  };

  const suggestions = results.slice(0, MAX_SUGGESTIONS);

  const handleChange = (e) => {
    setQuery(e.target.value);
    setDropdownOpen(true);
  };

  const handleClear = () => {
    clearSearch();          // resets query → results revert to all products
    setDropdownOpen(false);
  };

  const handleSelect = (product) => {
    clearSearch();
    setDropdownOpen(false);
    setModalProduct(product);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setDropdownOpen(false);
    navigate(`/categories?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <>
      <nav className="bg-white border-b border-[#E8E8E8] sticky top-0 z-50">
        <div className="max-w-[1320px] mx-auto px-6 h-16 flex items-center gap-6">

          <Link to="/" className="text-[#1A1A1A] text-xl font-bold tracking-tight flex-shrink-0">
            Commerce
          </Link>

          {/* Search — desktop */}
          <form onSubmit={handleSubmit} ref={searchRef}
            className="flex-grow max-w-2xl relative hidden md:block">
            <div className={`flex items-center border rounded-full bg-[#F6F6F6] transition-colors overflow-hidden
              ${dropdownOpen && query ? "border-[#1A1A1A]" : "border-[#E8E8E8] hover:border-[#1A1A1A]"}`}>
              <button type="button"
                className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-[#1A1A1A] border-r border-[#E8E8E8] whitespace-nowrap hover:bg-gray-100 transition-colors">
                All categories <ChevronDown size={14} />
              </button>
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={query}
                  onChange={handleChange}
                  onFocus={() => setDropdownOpen(true)}
                  placeholder="Search anything"
                  className="w-full bg-transparent py-2.5 pl-4 pr-10 text-sm outline-none placeholder:text-[#717171]"
                />
                {query && (
                  <button type="button" onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                    <X size={14} />
                  </button>
                )}
              </div>
              <button type="submit" className="px-4 py-2.5 text-[#1A1A1A] hover:text-gray-600">
                <Search size={18} />
              </button>
            </div>

            {/* Dropdown */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#E8E8E8] shadow-xl overflow-hidden z-50"
                >
                  {/* Header */}
                  <div className="px-4 py-2.5 border-b border-[#E8E8E8] flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#717171] uppercase tracking-wide">
                      {query.trim() ? `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"` : "All Products"}
                    </span>
                    {query && (
                      <button type="button" onClick={handleClear}
                        className="text-xs text-[#717171] hover:text-[#1A1A1A] transition-colors font-medium">
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Suggestions */}
                  {suggestions.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-[#717171]">No products found</div>
                  ) : (
                    <ul>
                      {suggestions.map((p) => (
                        <li key={p._id}>
                          <button type="button" onClick={() => handleSelect(p)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F6F6F6] transition-colors text-left">
                            <img src={p.image} alt={p.name}
                              className="w-10 h-10 rounded-xl object-cover bg-[#F6F6F6] shrink-0" />
                            <div className="flex-grow min-w-0">
                              <p className="text-sm font-medium text-[#1A1A1A] line-clamp-1">{p.name}</p>
                              <p className="text-xs text-[#717171] capitalize">{p.category}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-sm font-bold text-[#1A1A1A]">${p.price}</p>
                              {p.rating > 0 && (
                                <p className="text-xs text-[#717171] flex items-center gap-0.5 justify-end">
                                  <Star size={10} fill="#F5A623" className="text-[#F5A623]" />
                                  {p.rating.toFixed(1)}
                                </p>
                              )}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Footer — view all */}
                  {results.length > MAX_SUGGESTIONS && (
                    <button type="submit"
                      className="w-full px-4 py-3 border-t border-[#E8E8E8] text-xs font-semibold text-[#717171] hover:text-[#1A1A1A] hover:bg-[#F6F6F6] transition-colors text-center">
                      View all {results.length} results →
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-1 ml-auto">

            {/* User menu / login */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-50 transition-colors text-sm font-medium text-[#1A1A1A]">
                  <div className="w-7 h-7 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-xs font-bold uppercase shrink-0">
                    {user.avatar
                      ? <img src={user.avatar} alt="" className="w-full h-full object-cover rounded-full" />
                      : user.name?.[0]}
                  </div>
                  <span className="hidden lg:block max-w-[120px] truncate">
                    Welcome, {user.name?.split(" ")[0]}
                  </span>
                  <ChevronDown size={14} className={`hidden lg:block transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-[#E8E8E8] shadow-xl overflow-hidden z-50"
                    >
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-[#E8E8E8]">
                        <p className="text-sm font-bold text-[#1A1A1A] truncate">{user.name}</p>
                        <p className="text-xs text-[#717171] truncate">{user.email}</p>
                        {user.role === "admin" && (
                          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-[10px] font-semibold">
                            <ShieldCheck size={10} /> Admin
                          </span>
                        )}
                      </div>

                      {/* Menu items */}
                      <div className="py-1">
                        <Link to="/profile" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#1A1A1A] hover:bg-[#F6F6F6] transition-colors">
                          <UserCircle size={16} className="text-[#717171]" /> My Profile
                        </Link>
                        <Link to="/orders" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#1A1A1A] hover:bg-[#F6F6F6] transition-colors">
                          <ShoppingCart size={16} className="text-[#717171]" /> My Orders
                        </Link>
                        {user.role === "admin" && (
                          <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#1A1A1A] hover:bg-[#F6F6F6] transition-colors">
                            <ShieldCheck size={16} className="text-[#717171]" /> Admin Panel
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-[#E8E8E8] py-1">
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login"
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-50 transition-colors text-sm font-medium text-[#1A1A1A]">
                <User size={20} />
                <span className="hidden lg:block">Sign In</span>
              </Link>
            )}

            <Link to="/cart"
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-50 transition-colors relative">
              <div className="relative">
                <ShoppingBag size={20} className="text-[#1A1A1A]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#1A1A1A] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </div>
              <span className="hidden lg:block text-sm font-medium text-[#1A1A1A]">Cart</span>
            </Link>

            <button onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-full hover:bg-gray-50 transition-colors">
              <Menu size={20} className="text-[#1A1A1A]" />
            </button>
          </div>
        </div>

        {/* Sub-nav */}
        <div className="hidden md:block border-t border-[#E8E8E8] bg-white">
          <div className="max-w-[1320px] mx-auto px-6 flex items-center gap-8 h-10">
            {[
              { to: "/categories",    label: "All Categories" },
              { to: "/#new-arrivals", label: "New Arrivals"   },
              { to: "/#on-sale",      label: "On Sale"        },
              { to: "/categories",    label: "Clothing & Shoes" },
              { to: "/categories",    label: "Home & Living"  },
              { to: "/categories",    label: "Art & Collectibles" },
            ].map(({ to, label }) => (
              <Link key={label} to={to}
                className="text-xs font-medium text-[#717171] hover:text-[#1A1A1A] transition-colors whitespace-nowrap">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>        {mobileOpen && (
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
                  <input type="text" value={query} onChange={handleChange}
                    placeholder="Search anything"
                    className="flex-grow bg-transparent text-sm outline-none placeholder:text-[#717171]" />
                  {query && (
                    <button onClick={handleClear}><X size={14} className="text-gray-400" /></button>
                  )}
                </div>
              </div>
              <div className="px-4 py-3 border-b border-[#E8E8E8]">
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-sm font-bold uppercase shrink-0">
                      {user.name?.[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#1A1A1A] truncate">{user.name}</p>
                      <p className="text-xs text-[#717171] truncate">{user.email}</p>
                    </div>
                  </div>
                ) : (
                  <Link to="/login" onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 bg-[#1A1A1A] text-white py-2.5 rounded-full text-sm font-semibold">
                    <User size={16} /> Sign In
                  </Link>
                )}
              </div>
              <nav className="flex-grow px-2 py-2 overflow-y-auto">
                {[
                  { to: "/categories",    label: "All Categories" },
                  { to: "/#new-arrivals", label: "New Arrivals"   },
                  { to: "/#on-sale",      label: "On Sale"        },
                ].map(({ to, label }) => (
                  <Link key={label} to={to} onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm font-medium hover:bg-gray-50 rounded-xl transition-colors border-b border-[#F6F6F6]">
                    {label}
                  </Link>
                ))}
                {user && (
                  <>
                    <Link to="/profile" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-gray-50 rounded-xl transition-colors border-b border-[#F6F6F6]">
                      <UserCircle size={15} /> My Profile
                    </Link>
                    <Link to="/orders" onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-gray-50 rounded-xl transition-colors border-b border-[#F6F6F6]">
                      <ShoppingCart size={15} /> My Orders
                    </Link>
                    <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                      <LogOut size={15} /> Logout
                    </button>
                  </>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Product detail modal triggered from search */}
      {modalProduct && <ProductModal product={modalProduct} onClose={() => setModalProduct(null)} />}
    </>
  );
};

export default Navbar;
