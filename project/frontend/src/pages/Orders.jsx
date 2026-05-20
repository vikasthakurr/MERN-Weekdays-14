import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, CheckCircle, ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  processing: "bg-amber-50 text-amber-700 border-amber-200",
  shipped:    "bg-blue-50 text-blue-700 border-blue-200",
  delivered:  "bg-green-50 text-green-700 border-green-200",
  cancelled:  "bg-red-50 text-red-600 border-red-200",
  completed:  "bg-green-50 text-green-700 border-green-200",
  pending:    "bg-gray-50 text-[#717171] border-[#E8E8E8]",
  failed:     "bg-red-50 text-red-600 border-red-200",
};

const Badge = ({ label }) => (
  <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full border ${STATUS_COLORS[label] ?? "bg-gray-50 text-[#717171] border-[#E8E8E8]"}`}>
    {label}
  </span>
);

const OrderCard = ({ order, onCancel }) => {
  const [expanded, setExpanded]   = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const date = new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const handleCancel = async (e) => {
    e.stopPropagation();
    if (!confirm("Cancel this order?")) return;
    setCancelling(true);
    try {
      toast.success("Order cancelled");
      onCancel(order._id);
    } catch (err) {
      toast.error("Failed to cancel");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden"
    >
      <button onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#F6F6F6] transition-colors text-left">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#F6F6F6] border border-[#E8E8E8] flex items-center justify-center shrink-0">
            <Package size={16} className="text-[#717171]" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-[#1A1A1A] truncate">Order #{order._id.slice(-8).toUpperCase()}</p>
            <p className="text-xs text-[#717171] mt-0.5">{date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <Badge label={order.orderStatus} />
          <Badge label={order.paymentStatus} />
          <span className="font-bold text-sm text-[#1A1A1A]">${order.totalAmount?.toFixed(2)}</span>
          {order.orderStatus === "processing" && (
            <button onClick={handleCancel} disabled={cancelling}
              className="text-xs font-medium text-red-500 hover:text-red-700 border border-red-200 px-2.5 py-1 rounded-full transition-colors disabled:opacity-50">
              {cancelling ? "…" : "Cancel"}
            </button>
          )}
          {expanded ? <ChevronUp size={15} className="text-[#717171]" /> : <ChevronDown size={15} className="text-[#717171]" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div key="body"
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#E8E8E8] px-5 py-4 space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-[#F6F6F6] rounded-lg flex items-center justify-center text-[10px] font-semibold text-[#717171]">
                      {item.quantity}×
                    </span>
                    <span className="text-[#1A1A1A]">{item.name}</span>
                  </div>
                  <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              {order.shippingAddress && (
                <div className="mt-3 pt-3 border-t border-[#E8E8E8] text-xs text-[#717171] space-y-0.5">
                  <p className="font-semibold text-[#1A1A1A] uppercase tracking-wider text-[10px] mb-1">Shipped to</p>
                  <p>{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.zip}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Orders = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const location = useLocation();
  const newOrder = location.state?.newOrder;

  useEffect(() => {
    api.get("/orders/v1/my-orders")
      .then(({ data }) => setOrders(data.data ?? []))
      .catch((err) => setError("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = (id) => {
    setOrders((prev) => prev.map((o) => o._id === id ? { ...o, orderStatus: "cancelled" } : o));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <AnimatePresence>
        {newOrder && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle size={18} className="text-green-600 shrink-0" />
            <div>
              <p className="font-semibold text-green-800 text-sm">Order placed successfully!</p>
              <p className="text-green-600 text-xs mt-0.5">Order #{newOrder._id.slice(-8).toUpperCase()} is being processed.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">My Orders</h1>
          <p className="text-[#717171] text-sm mt-0.5">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
        </div>
        <Link to="/" className="text-sm font-medium text-[#717171] hover:text-[#1A1A1A] transition-colors">
          Continue Shopping
        </Link>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-2xl border border-[#E8E8E8] animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 rounded-full bg-[#F6F6F6] border border-[#E8E8E8] flex items-center justify-center">
            <ShoppingBag size={28} className="text-[#717171]" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-[#1A1A1A]">No orders yet</p>
            <p className="text-[#717171] text-sm mt-1">Your placed orders will appear here.</p>
          </div>
          <Link to="/" className="bg-[#1A1A1A] text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-black/80 transition-colors">
            Start Shopping
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => <OrderCard key={order._id} order={order} onCancel={handleCancel} />)}
        </div>
      )}
    </div>
  );
};

export default Orders;
