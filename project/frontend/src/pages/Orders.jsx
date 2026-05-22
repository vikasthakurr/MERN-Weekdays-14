import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, CheckCircle, ChevronDown, ChevronUp, ShoppingBag, Truck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  pending:    "bg-gray-50    text-[#717171]  border-[#E8E8E8]",
  confirmed:  "bg-blue-50   text-blue-700   border-blue-200",
  processing: "bg-amber-50  text-amber-700  border-amber-200",
  shipped:    "bg-purple-50 text-purple-700 border-purple-200",
  delivered:  "bg-green-50  text-green-700  border-green-200",
  cancelled:  "bg-red-50    text-red-600    border-red-200",
  refunded:   "bg-orange-50 text-orange-600 border-orange-200",
};

const PAY_COLORS = {
  pending:  "bg-yellow-50 text-yellow-600 border-yellow-200",
  paid:     "bg-green-50  text-green-600  border-green-200",
  failed:   "bg-red-50    text-red-600    border-red-200",
  refunded: "bg-orange-50 text-orange-600 border-orange-200",
};

const Badge = ({ label, colorMap }) => (
  <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full border capitalize
    ${(colorMap ?? STATUS_COLORS)[label] ?? "bg-gray-50 text-[#717171] border-[#E8E8E8]"}`}>
    {label}
  </span>
);

// ── Single order card ─────────────────────────────────────────────────────────
const OrderCard = ({ order, onCancel }) => {
  const [expanded,   setExpanded]   = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "—";

  const canCancel = ["pending", "confirmed"].includes(order.status);

  const handleCancel = async (e) => {
    e.stopPropagation();
    if (!confirm("Cancel this order?")) return;
    setCancelling(true);
    try {
      await api.patch(`/orders/my/${order._id}/cancel`);
      toast.success("Order cancelled");
      onCancel(order._id);
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to cancel");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden">

      {/* Header row */}
      <button onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#F6F6F6] transition-colors text-left">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#F6F6F6] border border-[#E8E8E8] flex items-center justify-center shrink-0">
            <Package size={16} className="text-[#717171]" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-[#1A1A1A]">
              #{order._id.slice(-8).toUpperCase()}
            </p>
            <p className="text-xs text-[#717171] mt-0.5">{date}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-3 flex-wrap justify-end">
          <Badge label={order.status} colorMap={STATUS_COLORS} />
          <Badge label={order.payment?.status ?? "pending"} colorMap={PAY_COLORS} />
          <span className="font-bold text-sm text-[#1A1A1A]">${order.grandTotal?.toFixed(2) ?? "—"}</span>
          {canCancel && (
            <button onClick={handleCancel} disabled={cancelling}
              className="text-xs font-medium text-red-500 hover:text-red-700 border border-red-200 px-2.5 py-1 rounded-full transition-colors disabled:opacity-50">
              {cancelling ? "…" : "Cancel"}
            </button>
          )}
          {expanded ? <ChevronUp size={15} className="text-[#717171]" /> : <ChevronDown size={15} className="text-[#717171]" />}
        </div>
      </button>

      {/* Expanded body */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div key="body"
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden">
            <div className="border-t border-[#E8E8E8] px-5 py-4 space-y-4">

              {/* Items */}
              <div className="space-y-2">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {item.thumbnail && (
                      <img src={item.thumbnail} alt={item.title}
                        className="w-10 h-10 rounded-xl object-cover bg-[#F6F6F6] shrink-0" />
                    )}
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-medium text-[#1A1A1A] line-clamp-1">
                        {item.title ?? item.name}
                      </p>
                      <p className="text-xs text-[#717171]">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-[#1A1A1A] shrink-0">
                      ${item.subtotal?.toFixed(2) ?? (item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="bg-[#F6F6F6] rounded-xl p-3 space-y-1.5 text-sm">
                <div className="flex justify-between text-[#717171]">
                  <span>Items total</span>
                  <span>${order.itemsTotal?.toFixed(2)}</span>
                </div>
                {order.shippingCharge > 0 && (
                  <div className="flex justify-between text-[#717171]">
                    <span>Shipping</span>
                    <span>${order.shippingCharge?.toFixed(2)}</span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${order.discount?.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-[#1A1A1A] border-t border-[#E8E8E8] pt-1.5">
                  <span>Grand Total</span>
                  <span>${order.grandTotal?.toFixed(2)}</span>
                </div>
              </div>

              {/* Shipping address */}
              {order.shippingAddress && (
                <div className="text-xs text-[#717171] space-y-0.5">
                  <p className="font-semibold text-[#1A1A1A] uppercase tracking-wider text-[10px] mb-1 flex items-center gap-1">
                    <Truck size={11} /> Shipping to
                  </p>
                  <p>{order.shippingAddress.fullName} · {order.shippingAddress.phone}</p>
                  <p>{order.shippingAddress.street}, {order.shippingAddress.city}
                    {order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ""}
                  </p>
                  <p>{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                </div>
              )}

              {/* Payment method */}
              <p className="text-xs text-[#717171]">
                Payment: <span className="font-semibold text-[#1A1A1A] capitalize">{order.payment?.method}</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const Orders = () => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const location  = useLocation();
  const newOrder  = location.state?.newOrder;

  useEffect(() => {
    // Backend route: GET /api/v1/orders/my
    api.get("/orders/my")
      .then(({ data }) => setOrders(data.orders ?? data.data ?? []))
      .catch(() => setError("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = (id) =>
    setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status: "cancelled" } : o));

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

      {/* New order banner */}
      <AnimatePresence>
        {newOrder && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle size={18} className="text-green-600 shrink-0" />
            <div>
              <p className="font-semibold text-green-800 text-sm">Order placed successfully!</p>
              <p className="text-green-600 text-xs mt-0.5">
                Order #{newOrder._id?.slice(-8).toUpperCase()} is being processed.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">My Orders</h1>
          <p className="text-[#717171] text-sm mt-0.5">
            {orders.length} order{orders.length !== 1 ? "s" : ""}
          </p>
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
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} onCancel={handleCancel} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
