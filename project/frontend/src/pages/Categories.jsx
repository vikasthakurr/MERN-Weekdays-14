import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingBag, Plus, Minus, SlidersHorizontal, X, Heart, ChevronRight } from "lucide-react";
import FilterSidebar, { SORT_OPTIONS } from "../components/FilterSidebar";
import toast from "react-hot-toast";
import rawProducts from "../data/products.json";

const ALL_PRODUCTS = rawProducts.products.map((p) => ({
  _id: String(p.id),
  name: p.title,
  image: p.thumbnail,
  price: p.price,
  category: p.category,
  rating: p.rating,
  stock: p.stock,
  description: p.description,
}));

const DEFAULT_FILTERS = { category: "all", priceRange: [0, 1000], minRating: null, sort: "newest" };

// ── Skeleton ──────────────────────────────────────────────────────────────────
const CardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden animate-pulse border border-[#E8E8E8]">
    <div className="aspect-square bg-[#F6F6F6]" />
    <div className="p-4 space-y-2">
      <div className="h-2.5 bg-[#F6F6F6] rounded-full w-1/3" />
      <div className="h-3 bg-[#F6F6F6] rounded-full w-3/4" />
      <div className="h-3 bg-[#F6F6F6] rounded-full w-1/2" />
      <div className="h-4 bg-[#F6F6F6] rounded-full w-1/4 mt-1" />
      <div className="h-8 bg-[#F6F6F6] rounded-full mt-2" />
    </div>
  </div>
);

// ── Product card ──────────────────────────────────────────────────────────────
const ProductCard = ({ product }) => {
  const dispatch = () => {};
  const cartItem = null;
  const rating   = product.rating ?? 0;
  const isOnSale = product.price > 100;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="bg-white rounded-2xl overflow-hidden border border-[#E8E8E8] hover:shadow-md transition-shadow group flex flex-col"
    >
      {/* Image */}
      <Link to={`/product/${product._id}`} className="relative aspect-square bg-[#F6F6F6] overflow-hidden block shrink-0">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {isOnSale && (
          <span className="absolute top-2.5 left-2.5 bg-[#1A1A1A] text-white text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Sale
          </span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); toast("Wishlist coming soon!", { icon: "♡" }); }}
          className="absolute top-2.5 right-2.5 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#E8E8E8] opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
        >
          <Heart size={12} className="text-[#717171]" />
        </button>
      </Link>

      {/* Info */}
      <div className="p-3 flex flex-col flex-grow gap-1.5">
        <p className="text-[10px] font-semibold text-[#717171] uppercase tracking-widest capitalize">
          {product.category}
        </p>
        <h3 className="text-sm font-medium text-[#1A1A1A] line-clamp-2 leading-snug flex-grow">
          {product.name}
        </h3>

        {rating > 0 && (
          <div className="flex items-center gap-1">
            <Star size={11} fill="#F5A623" className="text-[#F5A623]" />
            <span className="text-xs text-[#717171]">{rating.toFixed(1)}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="font-bold text-[#1A1A1A] text-sm">${product.price}</span>
          {isOnSale && (
            <span className="text-xs text-[#717171] line-through">${Math.round(product.price * 1.3)}</span>
          )}
        </div>

        {/* Cart controls */}
        {cartItem ? (
          <div className="flex items-center justify-between border border-[#1A1A1A] rounded-full px-1.5 py-1 mt-1">
            <button
              onClick={() => dispatch(decrease(product._id))}
              className="w-6 h-6 flex items-center justify-center hover:bg-[#F6F6F6] rounded-full transition-colors"
            >
              <Minus size={12} />
            </button>
            <span className="text-sm font-semibold text-[#1A1A1A]">{cartItem.quantity}</span>
            <button
              onClick={() => dispatch(increase(product._id))}
              className="w-6 h-6 flex items-center justify-center hover:bg-[#F6F6F6] rounded-full transition-colors"
            >
              <Plus size={12} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => { dispatch(addToCart(product)); toast.success("Added to cart"); }}
            className="w-full border border-[#1A1A1A] text-[#1A1A1A] py-2 rounded-full text-xs font-semibold hover:bg-[#1A1A1A] hover:text-white transition-colors flex items-center justify-center gap-1.5 mt-1"
          >
            <ShoppingBag size={12} /> Add to cart
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const Categories = () => {
  const { category: urlCategory } = useParams();
  const navigate  = useNavigate();
  const allProducts = ALL_PRODUCTS;

  const [filters, setFilters]         = useState({ ...DEFAULT_FILTERS, category: urlCategory ?? "all" });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const categories = useMemo(
    () => [...new Set(allProducts.map((p) => p.category).filter(Boolean))].sort(),
    [allProducts]
  );

  // Sync URL → filter
  useEffect(() => {
    setFilters((f) => ({ ...f, category: urlCategory ?? "all" }));
  }, [urlCategory]);

  // Apply filters + sort locally
  const products = useMemo(() => {
    let result = [...allProducts];

    if (filters.category !== "all")
      result = result.filter((p) => p.category === filters.category);

    result = result.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    if (filters.minRating)
      result = result.filter((p) => (p.rating ?? 0) >= filters.minRating);

    switch (filters.sort) {
      case "price-asc":  result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "popular":    result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
      default: break; // newest — keep original order
    }

    return result;
  }, [allProducts, filters]);

  const handleFilterChange   = useCallback((patch) => setFilters((f) => ({ ...f, ...patch })), []);
  const handleReset          = useCallback(() => { setFilters(DEFAULT_FILTERS); navigate("/categories"); }, [navigate]);
  const handleCategorySelect = useCallback((cat) => {
    setFilters((f) => ({ ...f, category: cat }));
    navigate(cat === "all" ? "/categories" : `/categories/${cat}`);
  }, [navigate]);

  const activeSort = SORT_OPTIONS.find((o) => o.value === filters.sort)?.label ?? "Newest first";

  return (
    <div className="max-w-[1320px] mx-auto px-6 py-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[#717171] mb-6">
        <Link to="/" className="hover:text-[#1A1A1A] transition-colors">Home</Link>
        <ChevronRight size={12} />
        {filters.category !== "all" ? (
          <>
            <Link to="/categories" className="hover:text-[#1A1A1A] transition-colors">Categories</Link>
            <ChevronRight size={12} />
            <span className="text-[#1A1A1A] font-medium capitalize">{filters.category}</span>
          </>
        ) : (
          <span className="text-[#1A1A1A] font-medium">Categories</span>
        )}
      </nav>

      {/* Page title + count */}
      <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">
            {filters.category === "all" ? "All Products" : <span className="capitalize">{filters.category}</span>}
          </h1>
          <p className="text-sm text-[#717171] mt-0.5">
            {`${products.length} product${products.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Sort dropdown — desktop */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-sm text-[#717171]">Sort:</span>
          <div className="relative">
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange({ sort: e.target.value })}
              className="appearance-none bg-white border border-[#E8E8E8] rounded-full px-4 py-2 pr-8 text-sm font-medium text-[#1A1A1A] outline-none cursor-pointer hover:border-[#1A1A1A] transition-colors"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-[#717171] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap mb-6">
        {["all", ...categories].map((cat) => (
          <button key={cat} onClick={() => handleCategorySelect(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors border
              ${filters.category === cat
                ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                : "bg-white text-[#717171] border-[#E8E8E8] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"}`}
          >
            {cat === "all" ? "All" : cat}
          </button>
        ))}
      </div>

      <div className="flex gap-6 items-start">

        {/* Sidebar — desktop */}
        <aside className="hidden lg:block w-52 shrink-0 sticky top-24 bg-white border border-[#E8E8E8] rounded-2xl p-5">
          <FilterSidebar
            categories={categories}
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleReset}
          />
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">

          {/* Mobile toolbar */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <button onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 bg-white border border-[#E8E8E8] px-4 py-2 rounded-full text-sm font-medium text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors">
              <SlidersHorizontal size={14} /> Filters
            </button>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange({ sort: e.target.value })}
              className="appearance-none bg-white border border-[#E8E8E8] rounded-full px-4 py-2 text-sm font-medium text-[#1A1A1A] outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Grid */}
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center bg-white rounded-2xl border border-[#E8E8E8]">
              <p className="text-4xl">🛍️</p>
              <p className="font-semibold text-[#1A1A1A]">No products found</p>
              <p className="text-[#717171] text-sm">Try adjusting your filters</p>
              <button onClick={handleReset}
                className="bg-[#1A1A1A] text-white px-8 py-2.5 rounded-full font-semibold text-sm hover:bg-black/80 transition-colors">
                Clear Filters
              </button>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-72 bg-white z-50 p-6 overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="font-bold text-[#1A1A1A]">Filters</span>
                <button onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-[#F6F6F6] rounded-full transition-colors">
                  <X size={16} className="text-[#717171]" />
                </button>
              </div>
              <FilterSidebar
                categories={categories}
                filters={filters}
                onChange={handleFilterChange}
                onReset={() => { handleReset(); setSidebarOpen(false); }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Categories;
