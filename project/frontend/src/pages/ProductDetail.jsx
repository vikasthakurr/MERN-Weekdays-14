import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingBag, Plus, Minus, ArrowLeft, Package, Shield, RotateCcw, Truck, Zap, Send, Trash2, Heart } from "lucide-react";
import toast from "react-hot-toast";

const Skeleton = () => (
  <div className="max-w-[1320px] mx-auto px-6 py-8 animate-pulse">
    <div className="h-4 bg-gray-200 rounded-full w-48 mb-8" />
    <div className="grid md:grid-cols-2 gap-10">
      <div className="space-y-3">
        <div className="aspect-square bg-gray-200 rounded-2xl" />
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => <div key={i} className="aspect-square bg-gray-200 rounded-xl" />)}
        </div>
      </div>
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

const Stars = ({ rating, size = 14, interactive = false, onRate, hover, onHover }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map((n) => (
      <button key={n} type="button" disabled={!interactive}
        onClick={() => interactive && onRate?.(n)}
        onMouseEnter={() => interactive && onHover?.(n)}
        onMouseLeave={() => interactive && onHover?.(0)}
        className={interactive ? "cursor-pointer" : "cursor-default"}
      >
        <Star size={size}
          className={(hover || rating) >= n ? "text-[#F5A623]" : "text-[#E8E8E8]"}
          fill={(hover || rating) >= n ? "currentColor" : "none"}
        />
      </button>
    ))}
  </div>
);

const TrustBadges = () => (
  <div className="grid grid-cols-3 gap-3">
    {[
      { icon: Truck,     label: "Free Shipping", sub: "Orders over $50" },
      { icon: RotateCcw, label: "Easy Returns",  sub: "30-day policy" },
      { icon: Shield,    label: "Secure Pay",    sub: "256-bit SSL" },
    ].map(({ icon: Icon, label, sub }) => (
      <div key={label} className="flex flex-col items-center text-center bg-[#F6F6F6] rounded-2xl p-3 gap-1.5 border border-[#E8E8E8]">
        <Icon size={16} className="text-[#717171]" />
        <p className="text-[10px] font-semibold text-[#1A1A1A]">{label}</p>
        <p className="text-[10px] text-[#717171]">{sub}</p>
      </div>
    ))}
  </div>
);

const ReviewForm = ({ productId, onAdded }) => {
  const user = null; // auth removed
  const [rating, setRating] = useState(0);
  const [hover, setHover]   = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) return (
    <p className="text-sm text-[#717171]">
      <Link to="/login" className="font-semibold text-[#1A1A1A] underline">Sign in</Link> to leave a review.
    </p>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) { toast.error("Please select a rating"); return; }
    toast.success("Review submitted!");
    setRating(0); setComment("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#F6F6F6] rounded-2xl p-5 space-y-4 border border-[#E8E8E8]">
      <p className="font-semibold text-sm text-[#1A1A1A]">Write a Review</p>
      <Stars rating={rating} size={22} interactive onRate={setRating} hover={hover} onHover={setHover} />
      <textarea value={comment} onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience…" required rows={3}
        className="w-full bg-white rounded-xl py-3 px-4 text-sm outline-none focus:ring-1 focus:ring-[#1A1A1A] transition-all resize-none border border-[#E8E8E8]"
      />
      <button type="submit" disabled={loading || !rating}
        className="flex items-center gap-2 bg-[#1A1A1A] text-white px-5 py-2.5 rounded-full font-semibold text-xs hover:bg-black/80 transition-colors disabled:opacity-40">
        <Send size={12} /> {loading ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
};

const ReviewCard = ({ review, productId, currentUserId, isAdmin, onDeleted }) => {
  const [deleting, setDeleting] = useState(false);
  const canDelete = currentUserId && (review.user === currentUserId || isAdmin);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      toast.success("Review deleted");
      onDeleted(review._id);
    } catch (err) {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="border-b border-[#E8E8E8] pb-4 last:border-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-xs font-semibold uppercase overflow-hidden shrink-0">
            {review.avatar ? <img src={review.avatar} alt="" className="w-full h-full object-cover" /> : review.username?.[0]}
          </div>
          <div>
            <p className="font-semibold text-sm text-[#1A1A1A]">{review.username}</p>
            <p className="text-xs text-[#717171]">{new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Stars rating={review.rating} size={12} />
          {canDelete && (
            <button onClick={handleDelete} disabled={deleting} className="text-[#717171] hover:text-red-500 transition-colors">
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
      <p className="text-sm text-[#717171] mt-2 leading-relaxed">{review.comment}</p>
    </div>
  );
};

const RelatedProducts = ({ category, currentId }) => {
  const allProducts = [];
  const dispatch = () => {};
  const related = allProducts.filter((p) => p.category === category && p._id !== currentId).slice(0, 4);
  if (!related.length) return null;

  return (
    <section className="max-w-[1320px] mx-auto px-6 py-8 border-t border-[#E8E8E8]">
      <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">You May Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((p) => (
          <Link key={p._id} to={`/product/${p._id}`} className="group bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-square bg-[#F6F6F6] overflow-hidden">
              <img src={p.image} alt={p.name} loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-3">
              <p className="font-medium text-xs text-[#1A1A1A] line-clamp-2 leading-snug">{p.name}</p>
              <p className="font-bold text-sm mt-1">${p.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = () => {};
  const cartItem = null;
  const user = null; // auth removed

  const [product, setProduct]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setLoading(true); setActiveImg(0);
    setError("API not available");
    setLoading(false);
  }, [id]);

  if (loading) return <Skeleton />;
  if (error || !product) {
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
  const images     = [product.image];

  const handleAddToCart = () => { dispatch(addToCart(product)); toast.success("Added to cart"); };
  const handleReviewAdded   = (updated) => setProduct(updated);
  const handleReviewDeleted = (reviewId) => setProduct((prev) => ({
    ...prev,
    reviews: prev.reviews.filter((r) => r._id !== reviewId),
    numReviews: prev.numReviews - 1,
  }));

  return (
    <>
      <div className="max-w-[1320px] mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#717171] mb-8">
          <Link to="/" className="hover:text-[#1A1A1A] transition-colors">Home</Link>
          <span>/</span>
          <Link to={`/categories/${product.category}`} className="hover:text-[#1A1A1A] transition-colors capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-[#1A1A1A] font-medium line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Image gallery */}
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
            <div className="relative aspect-square bg-[#F6F6F6] rounded-2xl overflow-hidden border border-[#E8E8E8]">
              <AnimatePresence mode="wait">
                <motion.img key={activeImg} src={images[activeImg]} alt={product.name}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                  className="w-full h-full object-cover" />
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

          {/* Product info */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-5 py-2">
            <Link to={`/categories/${product.category}`}
              className="text-xs font-semibold text-[#717171] uppercase tracking-widest hover:text-[#1A1A1A] transition-colors capitalize">
              {product.category}
            </Link>

            <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] leading-tight">{product.name}</h1>

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

            <p className="text-[#717171] text-sm leading-relaxed">{product.description}</p>

            {/* Color swatches */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#717171] uppercase tracking-wider">Colors</p>
              <div className="flex gap-2">
                {["#C8A882","#8B7355","#D4C5B0","#6B5B45","#E8DDD0"].map((c, i) => (
                  <button key={i} className="w-6 h-6 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform ring-1 ring-[#E8E8E8]"
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>

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
                  <button onClick={() => dispatch(decrease(product._id))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <Minus size={15} />
                  </button>
                  <span className="w-10 text-center font-bold">{cartItem.quantity}</span>
                  <button onClick={() => dispatch(increase(product._id))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <Plus size={15} />
                  </button>
                </div>
                <Link to="/cart" className="flex-1 border border-[#1A1A1A] text-[#1A1A1A] py-3.5 rounded-full font-semibold text-sm text-center hover:bg-[#1A1A1A] hover:text-white transition-colors">
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
        <section className="mt-12 pt-10 border-t border-[#E8E8E8] space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#1A1A1A]">Customer Reviews</h2>
            {reviews.length > 0 && (
              <div className="flex items-center gap-3 mt-2">
                <Stars rating={rating} size={16} />
                <span className="text-xl font-bold text-[#1A1A1A]">{rating.toFixed(1)}</span>
                <span className="text-[#717171] text-sm">based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-[#717171] text-sm">No reviews yet. Be the first!</p>
              ) : (
                reviews.map((r) => (
                  <ReviewCard key={r._id} review={r} productId={id}
                    currentUserId={user?._id} isAdmin={user?.role === "admin"}
                    onDeleted={handleReviewDeleted} />
                ))
              )}
            </div>
            <ReviewForm productId={id} onAdded={handleReviewAdded} />
          </div>
        </section>
      </div>

      <RelatedProducts category={product.category} currentId={id} />
    </>
  );
};

export default ProductDetail;
