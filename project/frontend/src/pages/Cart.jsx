import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { increase, decrease, removeItem, clearCart, selectCartItems, selectCartTotal } from "../redux/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const items    = useSelector(selectCartItems);
  const total    = useSelector(selectCartTotal);
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-5 px-4">
        <div className="w-20 h-20 rounded-full bg-[#F6F6F6] border border-[#E8E8E8] flex items-center justify-center">
          <ShoppingBag size={32} className="text-[#717171]" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#1A1A1A]">Your cart is empty</h2>
          <p className="text-[#717171] text-sm mt-1">Add items to get started</p>
        </div>
        <Link to="/" className="bg-[#1A1A1A] text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-black/80 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1320px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-6">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div key={item._id} layout
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl border border-[#E8E8E8] p-4 flex items-center gap-4"
              >
                <Link to={`/product/${item._id}`} className="w-20 h-20 rounded-xl overflow-hidden bg-[#F6F6F6] shrink-0">
                  <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
                </Link>
                <div className="flex-grow min-w-0">
                  <h3 className="font-medium text-sm text-[#1A1A1A] line-clamp-2 leading-snug">{item.name}</h3>
                  <p className="font-bold text-[#1A1A1A] mt-1">${item.price}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center border border-[#E8E8E8] rounded-full overflow-hidden">
                    <button onClick={() => dispatch(decrease(item._id))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => dispatch(increase(item._id))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="font-bold text-sm w-16 text-right">${(item.price * item.quantity).toFixed(2)}</span>
                  <button onClick={() => dispatch(removeItem(item._id))} className="text-[#717171] hover:text-red-500 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <button onClick={() => dispatch(clearCart())}
            className="text-sm text-[#717171] hover:text-red-500 transition-colors flex items-center gap-1.5 font-medium">
            <Trash2 size={13} /> Clear all items
          </button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-[#E8E8E8] p-6 sticky top-24 space-y-4">
            <h2 className="font-bold text-[#1A1A1A]">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-[#717171]">
                <span>Subtotal ({items.length} item{items.length !== 1 ? "s" : ""})</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600 font-medium">
                <span>Delivery</span>
                <span>Free</span>
              </div>
              <div className="border-t border-[#E8E8E8] pt-3 flex justify-between font-bold text-[#1A1A1A]">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={() => navigate("/checkout")}
              className="w-full bg-[#1A1A1A] text-white py-3 rounded-full font-semibold text-sm hover:bg-black/80 transition-colors flex items-center justify-center gap-2">
              Proceed to Checkout <ArrowRight size={15} />
            </button>
            <Link to="/" className="block text-center text-sm text-[#717171] hover:text-[#1A1A1A] transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
