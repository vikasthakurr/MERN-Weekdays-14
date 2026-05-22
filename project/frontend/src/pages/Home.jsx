import { useEffect, useRef, useState } from "react";
import { Star, ShoppingBag, Plus, Minus, Heart, ArrowRight, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, increase, decrease, selectCartItem } from "../redux/cartSlice";
import toast from "react-hot-toast";
import rawProducts from "../data/products.json";

// Normalize JSON shape to match component expectations
const ALL_PRODUCTS = rawProducts.products.map((p) => ({
  _id: String(p.id),
  name: p.title,
  image: p.thumbnail,
  price: p.price,
  category: p.category,
  rating: p.rating,
  stock: p.stock,
  description: p.description,
  reviews: p.reviews ?? [],
}));

// ── Reveal hook ───────────────────────────────────────────────────────────────
const useReveal = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: "400px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
};

// ── Skeletons ─────────────────────────────────────────────────────────────────
const CardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-100" />
    <div className="p-4 space-y-2">
      <div className="h-3 bg-gray-100 rounded-full w-3/4" />
      <div className="h-3 bg-gray-100 rounded-full w-1/2" />
      <div className="h-4 bg-gray-100 rounded-full w-1/3 mt-1" />
    </div>
  </div>
);

const SkeletonGrid = ({ count = 5 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
  </div>
);

// ── Lazy section ──────────────────────────────────────────────────────────────
const LazySection = ({ id, title, viewAllTo, skeletonCount = 5, children }) => {
  const [ref, visible] = useReveal();
  return (
    <div id={id} ref={ref}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-[#1A1A1A]">{title}</h2>
        {viewAllTo && (
          <Link to={viewAllTo} className="flex items-center gap-1 text-sm font-medium text-[#717171] hover:text-[#1A1A1A] transition-colors">
            View all <ArrowRight size={14} />
          </Link>
        )}
      </div>
      {visible ? children : <SkeletonGrid count={skeletonCount} />}
    </div>
  );
};

const BATCH = 10;

const Home = () => {
  const { hash } = useLocation();
  const allProducts = ALL_PRODUCTS;
  const results = [];
  const loading = false;
  const isSearching = false;
  const [visibleCount, setVisibleCount] = useState(BATCH);
  const sentinelRef = useRef(null);
  const totalRef = useRef(allProducts.length);
  totalRef.current = allProducts.length;

  const collectionSlice = allProducts.slice(0, visibleCount);
  const hasMore = visibleCount < allProducts.length;

  useEffect(() => { setVisibleCount(BATCH); }, [allProducts]);
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.replace("#", ""));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [hash]);
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisibleCount((c) => Math.min(c + BATCH, totalRef.current)); },
      { rootMargin: "400px", threshold: 0 }
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, [hasMore]);

  // Loading skeleton
  if (loading && allProducts.length === 0) {
    return (
      <div>
        <div className="bg-gray-100 h-80 animate-pulse" />
        <div className="max-w-[1320px] mx-auto px-6 py-10 space-y-10">
          <SkeletonGrid count={5} />
        </div>
      </div>
    );
  }

  // Search results
  if (isSearching) {
    return (
      <div className="max-w-[1320px] mx-auto px-6 py-8 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Search Results</h2>
          <span className="text-sm text-[#717171]">{results.length} item{results.length !== 1 ? "s" : ""} found</span>
        </div>
        {results.length === 0 ? (
          <div className="flex flex-col items-center py-24 gap-4 text-center">
            <p className="text-5xl">🔍</p>
            <p className="text-lg font-semibold">No results found</p>
            <p className="text-[#717171] text-sm">Try different keywords</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {results.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Hero banner */}
      <section className="relative bg-[#F0EDE8] overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-6 py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 animate-fadein">
            <p className="text-sm font-semibold text-[#717171] uppercase tracking-widest">New Collection</p>
            <h1 className="text-4xl md:text-6xl font-bold text-[#1A1A1A] leading-tight">
              Find things<br />you'll love.
            </h1>
            <p className="text-[#717171] text-base max-w-md leading-relaxed">
              Support independent sellers. Discover unique hand-picked items from creators around the world.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link to="/#all-products"
                className="bg-[#1A1A1A] text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-black/80 transition-colors">
                Shop Now
              </Link>
              <Link to="/categories"
                className="border border-[#1A1A1A] text-[#1A1A1A] px-8 py-3 rounded-full font-semibold text-sm hover:bg-gray-50 transition-colors">
                Browse Categories
              </Link>
            </div>
          </div>
          <div className="hidden md:flex justify-end">
            <img src="/hero.png" alt="Hero" fetchPriority="high" decoding="sync"
              className="h-80 md:h-[420px] object-contain" />
          </div>
        </div>
      </section>

      {/* Category banner cards */}
      <section className="max-w-[1320px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Clothing & Shoes", color: "bg-[#E8F0E8]" },
            { label: "Home & Living",    color: "bg-[#F0E8E8]" },
            { label: "Art & Collectibles", color: "bg-[#E8E8F0]" },
          ].map(({ label, color }) => (
            <Link key={label} to="/categories"
              className={`${color} rounded-2xl p-6 flex items-center justify-between group hover:shadow-md transition-shadow`}>
              <span className="font-semibold text-[#1A1A1A]">{label}</span>
              <ChevronRight size={18} className="text-[#717171] group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </section>

      {/* Trust badges */}
      <section className="max-w-[1320px] mx-auto px-6 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "A community doing good", desc: "Commerce is a global online marketplace, where people come together." },
            { title: "Support independent creators", desc: "Millions of people selling the things they love." },
            { title: "Peace of mind", desc: "Privacy is the highest priority of our dedicated team." },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-6 flex items-start gap-4 border border-[#E8E8E8]">
              <div className="w-12 h-12 rounded-full bg-[#F6F6F6] shrink-0" />
              <div>
                <p className="font-semibold text-sm text-[#1A1A1A]">{title}</p>
                <p className="text-xs text-[#717171] mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Category icon carousel */}
      <CategoryIconRow products={allProducts} />

      {/* Product sections */}
      <div className="max-w-[1320px] mx-auto px-6 py-8 space-y-12">

        <LazySection id="new-arrivals" title="New Arrivals" viewAllTo="/categories" skeletonCount={5}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {allProducts.slice(0, 5).map((p, i) => <ProductCard key={p._id} product={p} eager={i < 5} />)}
          </div>
        </LazySection>

        <LazySection id="on-sale" title="On Sale" viewAllTo="/categories" skeletonCount={5}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {allProducts.slice(5, 10).map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </LazySection>

        <LazySection id="all-products" title="Discover unique hand-picked items" viewAllTo="/categories" skeletonCount={10}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {collectionSlice.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
          {!hasMore && allProducts.length > 0 && (
            <p className="text-center text-[#717171] text-sm py-8">You've seen everything</p>
          )}
        </LazySection>

        {hasMore && (
          <div ref={sentinelRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        )}
      </div>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
};

// ── Category icon row ─────────────────────────────────────────────────────────
const CategoryIconRow = ({ products }) => {
  const cats = [...new Set(products.map((p) => p.category).filter(Boolean))].slice(0, 8);
  if (!cats.length) return null;
  const catMap = {};
  products.forEach((p) => { if (p.category && !catMap[p.category]) catMap[p.category] = p.image; });

  return (
    <section className="max-w-[1320px] mx-auto px-6 py-6">
      <p className="text-xs font-semibold text-[#717171] uppercase tracking-widest mb-4">Only on Commerce.</p>
      <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
        {cats.map((cat) => (
          <Link key={cat} to={`/categories/${cat}`} className="flex flex-col items-center gap-2 shrink-0 group">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border border-[#E8E8E8] shadow-sm group-hover:shadow-md transition-shadow">
              <img src={catMap[cat]} alt={cat} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <span className="text-[10px] font-medium text-[#717171] text-center capitalize whitespace-nowrap">{cat}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

// ── Newsletter ────────────────────────────────────────────────────────────────
const Newsletter = () => {
  const [email, setEmail] = useState("");
  return (
    <section className="max-w-[1320px] mx-auto px-6 py-8">
      <div className="bg-white border border-[#E8E8E8] rounded-3xl p-8 md:p-12 text-center space-y-5">
        <p className="text-2xl font-bold text-[#1A1A1A]">Yes!</p>
        <p className="text-[#717171] max-w-lg mx-auto text-sm leading-relaxed">
          Send me exclusive offers, unique gift ideas, and personalized tips for shopping and selling on Commerce.
        </p>
        <div className="flex max-w-md mx-auto border border-[#E8E8E8] rounded-full overflow-hidden bg-[#F6F6F6]">
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Drop your Email"
            className="flex-grow bg-transparent px-5 py-3 text-sm outline-none placeholder:text-[#717171]"
          />
          <button
            onClick={() => { if (email) { toast.success("Subscribed!"); setEmail(""); } }}
            className="bg-[#1A1A1A] text-white px-6 py-3 text-sm font-semibold flex items-center gap-2 hover:bg-black/80 transition-colors rounded-full m-1"
          >
            Subscribe <ArrowRight size={14} />
          </button>
        </div>
        <p className="text-xs text-[#717171]">First order only. You're ready?</p>
      </div>
    </section>
  );
};

// ── Footer ────────────────────────────────────────────────────────────────────
export const Footer = () => (
  <footer className="bg-white border-t border-[#E8E8E8] mt-8">
    <div className="max-w-[1320px] mx-auto px-6 py-4 text-center">
      <p className="text-xs text-[#717171]">Commerce, is powered by 100% renewable electricity.</p>
    </div>
    <div className="max-w-[1320px] mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-5 gap-8">
      <div className="col-span-2 md:col-span-1 space-y-3">
        <p className="font-bold text-[#1A1A1A]">Commerce</p>
        <p className="text-xs text-[#717171] leading-relaxed">Cricklewood, London NW2 6QG, UK</p>
        <div className="flex gap-3">
          {["f", "t", "in", "d"].map((s) => (
            <div key={s} className="w-8 h-8 rounded-full bg-[#F6F6F6] border border-[#E8E8E8] flex items-center justify-center text-xs font-bold text-[#717171] hover:bg-gray-100 cursor-pointer transition-colors">
              {s}
            </div>
          ))}
        </div>
      </div>
      {[
        { title: "Shop", links: ["Gift cards", "Site map", "Blog", "Login", "Sign in"] },
        { title: "Sell", links: ["Sell on Commerce", "Teams", "Forums", "Affiliates"] },
        { title: "About", links: ["Commerce, Inc.", "Policies", "Investors", "Careers", "Press"] },
        { title: "Help", links: ["Help Center", "Trust and safety", "Privacy settings"] },
      ].map(({ title, links }) => (
        <div key={title} className="space-y-3">
          <p className="font-semibold text-sm text-[#1A1A1A]">{title}</p>
          <ul className="space-y-2">
            {links.map((l) => (
              <li key={l}><a href="#" className="text-xs text-[#717171] hover:text-[#1A1A1A] transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="border-t border-[#E8E8E8]">
      <div className="max-w-[1320px] mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-[#717171]">© 2024 Commerce, Inc.</p>
        <div className="flex gap-6">
          {["Privacy policy", "Terms of use", "Cookies"].map((l) => (
            <a key={l} href="#" className="text-xs text-[#717171] hover:text-[#1A1A1A] transition-colors">{l}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

// ── Product card ──────────────────────────────────────────────────────────────
const ProductCard = ({ product, eager = false }) => {
  const dispatch = useDispatch();
  const cartItem = useSelector(selectCartItem(product._id));
  const rating = product.rating ?? 0;
  const isOnSale = product.price > 100;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#E8E8E8] hover:shadow-lg transition-shadow group flex flex-col">
      <Link to={`/product/${product._id}`} className="relative aspect-square overflow-hidden bg-[#F6F6F6] block">
        <img
          src={product.image} alt={product.name}
          loading={eager ? "eager" : "lazy"} decoding={eager ? "sync" : "async"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {isOnSale && (
          <span className="absolute top-3 left-3 bg-[#1A1A1A] text-white text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Sale
          </span>
        )}
        {/* Favorite button */}
        <button className="absolute top-3 right-3 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110">
          <Heart size={13} className="text-[#717171]" />
        </button>
      </Link>

      <div className="p-4 flex flex-col flex-grow gap-2">
        {/* Color swatches placeholder */}
        <div className="flex gap-1">
          {[...Array(Math.min(3, 5))].map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full border border-[#E8E8E8]"
              style={{ backgroundColor: ["#C8A882","#8B7355","#D4C5B0","#6B5B45","#E8DDD0"][i] }} />
          ))}
        </div>

        <h3 className="text-sm font-medium text-[#1A1A1A] line-clamp-2 leading-snug flex-grow">{product.name}</h3>

        {rating > 0 && (
          <div className="flex items-center gap-1">
            <Star size={11} fill="#F5A623" className="text-[#F5A623]" />
            <span className="text-xs text-[#717171]">{rating.toFixed(1)}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="font-bold text-[#1A1A1A]">${product.price}</span>
          {isOnSale && (
            <span className="text-xs text-[#717171] line-through">${Math.round(product.price * 1.3)}</span>
          )}
        </div>

        {cartItem ? (
          <div className="flex items-center justify-between border border-[#1A1A1A] rounded-full px-2 py-1 mt-1">
            <button onClick={() => dispatch(decrease(product._id))} className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
              <Minus size={12} />
            </button>
            <span className="text-sm font-semibold">{cartItem.quantity}</span>
            <button onClick={() => dispatch(increase(product._id))} className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
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
    </div>
  );
};

export { ProductCard };
export default Home;
