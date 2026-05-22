import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, ShoppingBag, Plus, Minus, Package,
  Shield, RotateCcw, Truck, Zap, Heart, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, increase, decrease, selectCartItem } from "../redux/cartSlice";
import { selectUser } from "../redux/authSlice";
import api from "../utils/api";
import rawProducts from "../data/products.json";
import toast from "react-hot-toast";

// Static fallback map: dummyId → product
const STATIC_MAP = Object.fromEntries(
  rawProducts.products.map((p) => [String(p.id), {
    _id: String(p.id), name: p.title, title: p.title,
    image: p.thumbnail, thumbnail: p.thumbnail,
    images: p.images ?? [], price: p.price,
    category: p.category, rating: p.rating,
    stock: p.stock, description: p.description,
    reviews: p.reviews ?? [],
  }])
);

// ── Helpers ───────────────────────────────────────────────────────────────────
const Stars = ({ rating, size = 14 }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map((n) => (
      <Star key={n} size={size}
        className={rating >= n ? "text-[#F5A623]" : "text-[#E8E8E8]"}
        fill={rating >= n ? "currentColor" : "none"} />
    ))}
  </div>
);

const TrustBadges = () => (
  <div className="grid grid-cols-3 gap-3">
    {[
      { icon: Truck,     label: "Free Shipping", sub: "Orders over $50" },
      { icon: RotateCcw, label: "Easy Returns",  sub: "30-day policy"   },
      { icon: Shield,    label: "Secure Pay",    sub: "256-bit SSL"     },
    ].map(({ icon: Icon, label, sub }) => (
      <div key={label} className="flex flex-col items-center text-center bg-[#F6F6F6] rounded-2xl p-3 gap-1.5 border border-[#E8E8E8]">
        <Icon size={16} className="text-[#717171]" />
        <p className="text-[10px] font-semibold text-[#1A1A1A]">{label}</p>
        <p className="text-[10px] text-[#717171]">{sub}</p>
      </div>
    ))}
  </div>
);

const Skeleton = () => (
  <div className="max-w-[1320px] mx-auto px-6 py-8 animate-pulse">
    <div className="h-4 bg-gray-200 rounded-full w-48 mb-8" />
    <div className="grid md:grid-cols-2 gap-10">
      <div className="aspect-square bg-gray-200 rounded-2xl" />
      <div className="space-y-4 py-2">
        <div className="h-3 bg-gray-200 rounded-full w-20" />
        <div className="h-8 bg-gray-200 rounded-xl w-3/4" />
        <div className="h-4 bg-gray-200 rounded-full w-1/3" />
        <div className="h-16 bg-gray-200 rounded-xl" />
        <div className="h-12 bg-gray-200 rounded-full" />
      </div>
    </div>
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const ProductDetail = () => {
  const { id }   = useParams();
  const dispatch = useDispatch();
  const user     = useSelector(selectUser);
  const cartItem = useSelector(selectCartItem(id));

  const [product,   setProduct]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setLoading(true);
    setActiveImg(0);

    const isObjectId = /^[a-f\d]{24}$/i.test(id);

    if (isObjectId) {
      // Fetch from real API
      api.get(`/products/${id}`)
        .then(({ data }) => {
          setProduct({
            _id:         data._id,
            name:        data.title ?? data.name,
            title:       data.title ?? data.name,
            image:       data.thumbnail ?? data.image,
            thumbnail:   data.thumbnail,
            images:      data.images ?? [],
            price:       data.price,
            category:    data.category,
            rating:      data.rating ?? 0,
            stock:       data.stock ?? 0,
            description: data.description,
            reviews:     data.reviews ?? [],
          });
        })
        .catch(() => {
          // Fallback to static data if API fails
          setProduct(STATIC_MAP[id] ?? null);
        })
        .finally(() => setLoading(false));
    } else {
      // Numeric ID from static JSON — use static map directly
      setProduct(STATIC_MAP[id] ?? null);
      setLoading(false);
    }
  }, [id]);

  if (loading) return <Skeleton />;

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Package size={40} className="text-[#E8E8E8]" />
        <p className="font-semibold text-[#1A1A1A]">Product not found</p>
        <Link to="/" className="bg-[#1A1A1A] text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-black/80 transition-colors">
          Back to Shop
        </Link>
      </div>
    );
  }

  const rating     = product.rating ?? 0;
  const reviews    = product.reviews ?? [];
  const isOnSale   = product.price > 100;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const images     = product.images?.length ? product.images : [product.image ?? product.thumbnail];

  const prevImg = () => setActiveImg((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setActiveImg((i) => (i + 1) % images.length);

  const handleAddToCart = () => {
    dispatch(addToCart({
      _id: product._id, name: product.name ?? product.title,
      image: product.image ?? product.thumbnail,
      price: product.price, category: product.category,
      rating: product.rating, stock: product.stock,
    }));
    toast.success("Added to cart");
  };

  return (
    <>
      <div className="max-w-[1320px] mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#717171] mb-8">
          <Link to="/" className="hover:text-[#1A1A1A] transition-colors">Home</Link>
          <span>/</span>
          <Link to={`/categories/${product.category}`} className="hover:text-[#1A1A1A] transition-colors capitalize">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#1A1A1A] font-medium line-clamp-1">{product.name ?? product.title}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Image gallery */}
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
            <div className="relative aspect-square bg-[#F6F6F6] rounded-2xl overflow-hidden border border-[#E8E8E8]">
              <AnimatePresence mode="wait">
                <motion.img key={activeImg} src={images[activeImg]} alt={product.name}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }} className="w-full h-full object-cover" />
              </AnimatePresence>

              {isOnSale && (
                <span className="absolute top-4 left-4 bg-[#1A1A1A] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
                  Sale
                </span>
              )}
              {isLowStock && (
                <span className="absolute top-4 right-4 bg-orange-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Zap size={10} /> Only {product.stock} left
                </span>
              )}

              {images.length > 1 && (
                <>
                  <button onClick={prevImg}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={nextImg}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                    <ChevronRight size={16} />
                  </button>
                </>
              )}

              <button className="absolute bottom-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform border border-[#E8E8E8]">
                <Heart size={15} className="text-[#717171]" />
              </button>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? "border-[#1A1A1A]" : "border-[#E8E8E8]"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-5 py-2">
            <Link to={`/categories/${product.category}`}
              className="text-xs font-semibold text-[#717171] uppercase tracking-widest hover:text-[#1A1A1A] transition-colors capitalize">
              {product.category}
            </Link>

            <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] leading-tight">
              {product.name ?? product.title}
            </h1>

            <div className="flex items-center gap-3">
              <Stars rating={rating} size={15} />
              <span className="text-sm font-medium text-[#1A1A1A]">{rating > 0 ? rating.toFixed(1) : "No ratings"}</span>
              <span className="text-sm text-[#717171]">({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-[#1A1A1A]">${product.price}</span>
              {isOnSale && (
                <>
                  <span className="text-lg text-[#717171] line-through">${Math.round(product.price * 1.3)}</span>
                  <span className="bg-red-50 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-red-100">
                    {Math.round((1 - product.price / Math.round(product.price * 1.3)) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {product.description && (
              <p className="text-[#717171] text-sm leading-relaxed">{product.description}</p>
            )}

            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-sm text-[#717171]">
                {product.stock === 0 ? "Out of stock" : isLowStock ? `Only ${product.stock} left — order soon!` : "In stock"}
              </span>
            </div>

            {product.stock === 0 ? (
              <button disabled className="w-full bg-[#E8E8E8] text-[#717171] py-3.5 rounded-full font-semibold text-sm cursor-not-allowed">
                Out of Stock
              </button>
            ) : cartItem ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#1A1A1A] rounded-full overflow-hidden">
                  <button onClick={() => dispatch(decrease(product._id))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <Minus size={15} />
                  </button>
                  <span className="w-10 text-center font-bold">{cartItem.quantity}</span>
                  <button onClick={() => dispatch(increase(product._id))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <Plus size={15} />
                  </button>
                </div>
                <Link to="/cart"
                  className="flex-1 border border-[#1A1A1A] text-[#1A1A1A] py-3.5 rounded-full font-semibold text-sm text-center hover:bg-[#1A1A1A] hover:text-white transition-colors">
                  View Cart
                </Link>
              </div>
            ) : (
              <button onClick={handleAddToCart}
                className="w-full bg-[#1A1A1A] text-white py-3.5 rounded-full font-semibold text-sm hover:bg-black/80 transition-colors flex items-center justify-center gap-2">
                <ShoppingBag size={16} /> Add to Cart
              </button>
            )}

            <TrustBadges />
          </motion.div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <section className="mt-12 pt-10 border-t border-[#E8E8E8] space-y-5">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-[#1A1A1A]">Customer Reviews</h2>
              <Stars rating={rating} size={15} />
              <span className="text-sm font-semibold text-[#1A1A1A]">{rating.toFixed(1)}</span>
              <span className="text-sm text-[#717171]">({reviews.length})</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((r, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#E8E8E8] p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-[10px] font-bold uppercase shrink-0">
                        {r.reviewerName?.[0] ?? "U"}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#1A1A1A]">{r.reviewerName ?? "Anonymous"}</p>
                        {r.date && (
                          <p className="text-[10px] text-[#717171]">
                            {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        )}
                      </div>
                    </div>
                    <Stars rating={r.rating} size={11} />
                  </div>
                  {r.comment && <p className="text-xs text-[#717171] leading-relaxed">{r.comment}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Sign in to review */}
        {!user && (
          <div className="mt-8 pt-6 border-t border-[#E8E8E8]">
            <p className="text-sm text-[#717171]">
              <Link to="/login" className="font-semibold text-[#1A1A1A] underline">Sign in</Link> to leave a review.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetail;
