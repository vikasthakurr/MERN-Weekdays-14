import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, ShoppingBag, Plus, Minus, Truck, RotateCcw, Shield, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, increase, decrease, selectCartItem } from "../redux/cartSlice";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Stars = ({ rating, size = 13 }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star key={n} size={size}
        className={rating >= n ? "text-[#F5A623]" : "text-[#E8E8E8]"}
        fill={rating >= n ? "currentColor" : "none"} />
    ))}
  </div>
);

export default function ProductModal({ product, onClose }) {
  const dispatch  = useDispatch();
  const cartItem  = useSelector(selectCartItem(product._id));
  const [imgIdx, setImgIdx] = useState(0);

  const images  = product.images?.length ? product.images : [product.image ?? product.thumbnail];
  const reviews = product.reviews ?? [];
  const rating  = product.rating ?? 0;
  const isOnSale   = product.price > 100;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const prevImg = () => setImgIdx((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setImgIdx((i) => (i + 1) % images.length);

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Close */}
          <button onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md border border-[#E8E8E8] hover:bg-[#F6F6F6] transition-colors">
            <X size={16} />
          </button>

          <div className="grid md:grid-cols-2 gap-0">
            {/* ── Image panel ── */}
            <div className="relative bg-[#F6F6F6] rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none overflow-hidden">
              <div className="aspect-square relative">
                <AnimatePresence mode="wait">
                  <motion.img key={imgIdx} src={images[imgIdx]} alt={product.name}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full object-cover" />
                </AnimatePresence>

                {isOnSale && (
                  <span className="absolute top-3 left-3 bg-[#1A1A1A] text-white text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
                    Sale
                  </span>
                )}
                {isLowStock && (
                  <span className="absolute top-3 right-10 bg-orange-500 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">
                    Only {product.stock} left
                  </span>
                )}

                {images.length > 1 && (
                  <>
                    <button onClick={prevImg}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                      <ChevronLeft size={16} />
                    </button>
                    <button onClick={nextImg}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                      <ChevronRight size={16} />
                    </button>
                    {/* Dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => (
                        <button key={i} onClick={() => setImgIdx(i)}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIdx ? "bg-[#1A1A1A] w-3" : "bg-[#1A1A1A]/30"}`} />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setImgIdx(i)}
                      className={`w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${i === imgIdx ? "border-[#1A1A1A]" : "border-transparent"}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Info panel ── */}
            <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[90vh]">
              {/* Category */}
              <p className="text-[10px] font-semibold text-[#717171] uppercase tracking-widest capitalize">
                {product.category}
              </p>

              {/* Name */}
              <h2 className="text-xl font-bold text-[#1A1A1A] leading-snug">{product.name}</h2>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <Stars rating={rating} />
                <span className="text-sm font-semibold text-[#1A1A1A]">{rating > 0 ? rating.toFixed(1) : "—"}</span>
                <span className="text-xs text-[#717171]">({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-[#1A1A1A]">${product.price}</span>
                {isOnSale && (
                  <>
                    <span className="text-sm text-[#717171] line-through">${Math.round(product.price * 1.3)}</span>
                    <span className="bg-red-50 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {Math.round((1 - product.price / Math.round(product.price * 1.3)) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-sm text-[#717171] leading-relaxed line-clamp-3">{product.description}</p>
              )}

              {/* Stock status */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-xs text-[#717171]">
                  {product.stock === 0 ? "Out of stock" : isLowStock ? `Only ${product.stock} left` : `${product.stock} in stock`}
                </span>
              </div>

              {/* Cart controls */}
              {product.stock === 0 ? (
                <button disabled className="w-full bg-[#E8E8E8] text-[#717171] py-3 rounded-full font-semibold text-sm cursor-not-allowed">
                  Out of Stock
                </button>
              ) : cartItem ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#1A1A1A] rounded-full overflow-hidden">
                    <button onClick={() => dispatch(decrease(product._id))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center font-bold text-sm">{cartItem.quantity}</span>
                    <button onClick={() => dispatch(increase(product._id))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <Plus size={14} />
                    </button>
                  </div>
                  <Link to="/cart" onClick={onClose}
                    className="flex-1 border border-[#1A1A1A] text-[#1A1A1A] py-3 rounded-full font-semibold text-sm text-center hover:bg-[#1A1A1A] hover:text-white transition-colors">
                    View Cart
                  </Link>
                </div>
              ) : (
                <button onClick={() => { dispatch(addToCart(product)); toast.success("Added to cart"); }}
                  className="w-full bg-[#1A1A1A] text-white py-3 rounded-full font-semibold text-sm hover:bg-black/80 transition-colors flex items-center justify-center gap-2">
                  <ShoppingBag size={15} /> Add to Cart
                </button>
              )}

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: Truck,     label: "Free Shipping" },
                  { icon: RotateCcw, label: "30-day Returns" },
                  { icon: Shield,    label: "Secure Pay" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center text-center bg-[#F6F6F6] rounded-xl p-2.5 gap-1 border border-[#E8E8E8]">
                    <Icon size={14} className="text-[#717171]" />
                    <p className="text-[9px] font-semibold text-[#717171]">{label}</p>
                  </div>
                ))}
              </div>

              {/* View full page link */}
              <Link to={`/product/${product._id}`} onClick={onClose}
                className="text-xs text-center text-[#717171] hover:text-[#1A1A1A] transition-colors underline underline-offset-2">
                View full product page →
              </Link>

              {/* Reviews */}
              {reviews.length > 0 && (
                <div className="border-t border-[#E8E8E8] pt-4 space-y-3">
                  <p className="text-sm font-bold text-[#1A1A1A]">Reviews</p>
                  <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                    {reviews.map((r, i) => (
                      <div key={i} className="border-b border-[#E8E8E8] pb-3 last:border-0">
                        <div className="flex items-center justify-between mb-1">
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
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
