import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingBag, Plus, Minus, Search, X, SlidersHorizontal, Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, increase, decrease, selectCartItem } from "../redux/cartSlice";
import { useSearch } from "../context/Searchcontext";
import ProductModal from "../components/ProductModal";
import rawProducts from "../data/products.json";
import toast from "react-hot-toast";

const ALL_PRODUCTS = rawProducts.products.map((p) => ({
  _id: String(p.id),
  name: p.title,
  image: p.thumbnail,
  images: p.images ?? [],
  price: p.price,
  category: p.category,
  rating: p.rating,
  stock: p.stock,
  description: p.description,
  reviews: p.reviews ?? [],
}));

const CATEGORIES = ["all", ...new Set(ALL_PRODUCTS.map((p) => p.category))].sort((a, b) =>
  a === "all" ? -1 : b === "all" ? 1 : a.localeCompare(b)
);

const SORT_OPTIONS = [
  { value: "default",    label: "Default"       },
  { value: "price-asc",  label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating",     label: "Top Rated"     },
  { value: "name",       label: "Name A → Z"    },
];

// ── Single card ───────────────────────────────────────────────────────────────
function ProductCard({ product, onOpenModal }) {
  const dispatch = useDispatch();
  const cartItem = useSelector(selectCartItem(product._id));
  const rating   = product.rating ?? 0;
  const isOnSale = product.price > 100;

  return (
    <motion.div layout
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
      className="bg-white rounded-2xl overflow-hidden border border-[#E8E8E8] hover:shadow-md transition-shadow group flex flex-col cursor-pointer"
    >
      {/* Image — click opens modal */}
      <div onClick={() => onOpenModal(product)}
        className="relative aspect-square bg-[#F6F6F6] overflow-hidden block shrink-0">
        <img src={product.image} alt={product.name} loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {isOnSale && (
          <span className="absolute top-2.5 left-2.5 bg-[#1A1A1A] text-white text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Sale
          </span>
        )}
        <button onClick={(e) => { e.stopPropagation(); toast("Wishlist coming soon!", { icon: "♡" }); }}
          className="absolute top-2.5 right-2.5 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#E8E8E8] opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110">
          <Heart size={12} className="text-[#717171]" />
        </button>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-grow gap-1.5">
        <p className="text-[10px] font-semibold text-[#717171] uppercase tracking-widest capitalize">
          {product.category}
        </p>
        <h3 onClick={() => onOpenModal(product)}
          className="text-sm font-medium text-[#1A1A1A] line-clamp-2 leading-snug flex-grow hover:underline cursor-pointer">
          {product.name}
        </h3>

        {rating > 0 && (
          <div className="flex items-center gap-1">
            <Star size={11} fill="#F5A623" className="text-[#F5A623]" />
            <span className="text-xs text-[#717171]">{rating.toFixed(1)}</span>
            <span className="text-xs text-[#717171]">({product.reviews.length})</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="font-bold text-[#1A1A1A] text-sm">${product.price}</span>
          {isOnSale && (
            <span className="text-xs text-[#717171] line-through">${Math.round(product.price * 1.3)}</span>
          )}
        </div>

        {cartItem ? (
          <div className="flex items-center justify-between border border-[#1A1A1A] rounded-full px-1.5 py-1 mt-1">
            <button onClick={() => dispatch(decrease(product._id))}
              className="w-6 h-6 flex items-center justify-center hover:bg-[#F6F6F6] rounded-full transition-colors">
              <Minus size={12} />
            </button>
            <span className="text-sm font-semibold text-[#1A1A1A]">{cartItem.quantity}</span>
            <button onClick={() => dispatch(increase(product._id))}
              className="w-6 h-6 flex items-center justify-center hover:bg-[#F6F6F6] rounded-full transition-colors">
              <Plus size={12} />
            </button>
          </div>
        ) : (
          <button onClick={() => { dispatch(addToCart(product)); toast.success("Added to cart"); }}
            className="w-full border border-[#1A1A1A] text-[#1A1A1A] py-2 rounded-full text-xs font-semibold hover:bg-[#1A1A1A] hover:text-white transition-colors flex items-center justify-center gap-1.5 mt-1">
            <ShoppingBag size={12} /> Add to cart
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AllProducts() {
  const { query, setQuery, clearSearch } = useSearch();

  const [category, setCategory] = useState("all");
  const [sort,     setSort]     = useState("default");
  const [modal,    setModal]    = useState(null); // product | null

  const filtered = useMemo(() => {
    let list = [...ALL_PRODUCTS];

    // search filter
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );

    // category filter
    if (category !== "all") list = list.filter((p) => p.category === category);

    // sort
    switch (sort) {
      case "price-asc":  list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating":     list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
      case "name":       list.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    return list;
  }, [query, category, sort]);

  return (
    <div className="max-w-[1320px] mx-auto px-6 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">All Products</h1>
          <p className="text-sm text-[#717171] mt-0.5">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</p>
        </div>

        {/* Sort */}
        <select value={sort} onChange={(e) => setSort(e.target.value)}
          className="border border-[#E8E8E8] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1A1A1A] bg-white cursor-pointer">
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717171]" />
        <input value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products by name, category or description..."
          className="w-full border border-[#E8E8E8] rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none focus:border-[#1A1A1A] transition-colors bg-white" />
        {query && (
          <button onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#717171] hover:text-[#1A1A1A]">
            <X size={15} />
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors border capitalize
              ${category === cat
                ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                : "bg-white text-[#717171] border-[#E8E8E8] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"}`}>
            {cat === "all" ? "All" : cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center bg-white rounded-2xl border border-[#E8E8E8]">
          <p className="text-4xl">🔍</p>
          <p className="font-semibold text-[#1A1A1A]">No products found</p>
          <p className="text-[#717171] text-sm">Try a different keyword or category</p>
          <button onClick={() => { clearSearch(); setCategory("all"); }}
            className="bg-[#1A1A1A] text-white px-8 py-2.5 rounded-full font-semibold text-sm hover:bg-black/80 transition-colors">
            Clear Filters
          </button>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <ProductCard key={p._id} product={p} onOpenModal={setModal} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modal */}
      {modal && <ProductModal product={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
