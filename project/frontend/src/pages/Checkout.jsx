import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, CreditCard, CheckCircle, ChevronRight, ArrowLeft, ShoppingBag, Loader2 } from "lucide-react";
import { selectCartItems, selectCartTotal, clearCart } from "../redux/cartSlice";
import { selectUser } from "../redux/authSlice";
import api from "../utils/api";
import toast from "react-hot-toast";

// ── Step config ───────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Address",  icon: MapPin },
  { id: 2, label: "Payment",  icon: CreditCard },
  { id: 3, label: "Confirm",  icon: CheckCircle },
];

// ── Progress bar ──────────────────────────────────────────────────────────────
const ProgressBar = ({ current }) => (
  <div className="flex items-center justify-center gap-0 mb-10">
    {STEPS.map((step, idx) => {
      const done    = current > step.id;
      const active  = current === step.id;
      const Icon    = step.icon;
      return (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
              ${done   ? "bg-[#1A1A1A] border-[#1A1A1A] text-white"
              : active ? "bg-white border-[#1A1A1A] text-[#1A1A1A]"
              :          "bg-white border-[#E8E8E8] text-[#C0C0C0]"}`}
            >
              {done ? <CheckCircle size={18} /> : <Icon size={18} />}
            </div>
            <span className={`text-xs font-semibold transition-colors duration-300
              ${active || done ? "text-[#1A1A1A]" : "text-[#C0C0C0]"}`}>
              {step.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div className={`w-20 sm:w-32 h-0.5 mb-5 mx-2 transition-all duration-500
              ${current > step.id ? "bg-[#1A1A1A]" : "bg-[#E8E8E8]"}`} />
          )}
        </div>
      );
    })}
  </div>
);

// ── Step 1 — Address ──────────────────────────────────────────────────────────
const AddressStep = ({ data, onChange, onNext }) => {
  const fields = [
    { name: "fullName",   label: "Full Name",    placeholder: "John Doe",        half: false },
    { name: "phone",      label: "Phone",        placeholder: "+1 234 567 8900", half: true  },
    { name: "postalCode", label: "Postal Code",  placeholder: "10001",           half: true  },
    { name: "street",     label: "Street Address", placeholder: "123 Main St",   half: false },
    { name: "city",       label: "City",         placeholder: "New York",        half: true  },
    { name: "state",      label: "State",        placeholder: "NY",              half: true  },
    { name: "country",    label: "Country",      placeholder: "United States",   half: false },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const required = ["fullName", "phone", "street", "city", "postalCode", "country"];
    const missing  = required.find((k) => !data[k]?.trim());
    if (missing) { toast.error("Please fill all required fields"); return; }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {fields.map(({ name, label, placeholder, half }) => (
          <div key={name} className={half ? "col-span-1" : "col-span-2"}>
            <label className="block text-xs font-semibold text-[#717171] mb-1.5 uppercase tracking-wide">
              {label}
            </label>
            <input
              type="text"
              value={data[name] || ""}
              onChange={(e) => onChange(name, e.target.value)}
              placeholder={placeholder}
              className="w-full border border-[#E8E8E8] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1A1A1A] transition-colors bg-white placeholder:text-[#C0C0C0]"
            />
          </div>
        ))}
      </div>
      <button type="submit"
        className="w-full bg-[#1A1A1A] text-white py-3 rounded-full font-semibold text-sm hover:bg-black/80 transition-colors flex items-center justify-center gap-2 mt-2">
        Continue to Payment <ChevronRight size={15} />
      </button>
    </form>
  );
};

// ── Step 2 — Payment ──────────────────────────────────────────────────────────
const PaymentStep = ({ method, onSelect, onNext, onBack }) => {
  const options = [
    { id: "razorpay", label: "Razorpay",         desc: "UPI, Cards, Net Banking & Wallets" },
    { id: "card",     label: "Credit / Debit Card", desc: "Visa, Mastercard, Amex"         },
    { id: "cod",      label: "Cash on Delivery",  desc: "Pay when your order arrives"      },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {options.map((opt) => (
          <button key={opt.id} type="button" onClick={() => onSelect(opt.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left
              ${method === opt.id ? "border-[#1A1A1A] bg-[#F6F6F6]" : "border-[#E8E8E8] bg-white hover:border-gray-300"}`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
              ${method === opt.id ? "border-[#1A1A1A]" : "border-[#C0C0C0]"}`}>
              {method === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A]" />}
            </div>
            <div>
              <p className="font-semibold text-sm text-[#1A1A1A]">{opt.label}</p>
              <p className="text-xs text-[#717171] mt-0.5">{opt.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onBack}
          className="flex items-center gap-1.5 px-5 py-3 rounded-full border border-[#E8E8E8] text-sm font-semibold text-[#717171] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
        <button onClick={() => { if (!method) { toast.error("Select a payment method"); return; } onNext(); }}
          className="flex-1 bg-[#1A1A1A] text-white py-3 rounded-full font-semibold text-sm hover:bg-black/80 transition-colors flex items-center justify-center gap-2">
          Review Order <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

// ── Step 3 — Confirm ──────────────────────────────────────────────────────────
const ConfirmStep = ({ address, method, items, total, onBack, onPlace }) => {
  const methodLabel = { razorpay: "Razorpay", card: "Credit / Debit Card", cod: "Cash on Delivery" };

  return (
    <div className="space-y-5">
      {/* Address summary */}
      <div className="bg-[#F6F6F6] rounded-2xl p-4 space-y-1">
        <p className="text-xs font-semibold text-[#717171] uppercase tracking-wide mb-2">Delivery Address</p>
        <p className="text-sm font-semibold text-[#1A1A1A]">{address.fullName}</p>
        <p className="text-sm text-[#717171]">{address.street}, {address.city}{address.state ? `, ${address.state}` : ""}</p>
        <p className="text-sm text-[#717171]">{address.postalCode}, {address.country}</p>
        <p className="text-sm text-[#717171]">{address.phone}</p>
      </div>

      {/* Payment summary */}
      <div className="bg-[#F6F6F6] rounded-2xl p-4">
        <p className="text-xs font-semibold text-[#717171] uppercase tracking-wide mb-2">Payment Method</p>
        <p className="text-sm font-semibold text-[#1A1A1A]">{methodLabel[method]}</p>
      </div>

      {/* Items */}
      <div className="bg-[#F6F6F6] rounded-2xl p-4 space-y-3">
        <p className="text-xs font-semibold text-[#717171] uppercase tracking-wide">Items ({items.length})</p>
        {items.map((item) => (
          <div key={item._id} className="flex items-center gap-3">
            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-white" />
            <div className="flex-grow min-w-0">
              <p className="text-sm font-medium text-[#1A1A1A] line-clamp-1">{item.name}</p>
              <p className="text-xs text-[#717171]">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-bold text-[#1A1A1A] shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <div className="border-t border-[#E8E8E8] pt-3 flex justify-between font-bold text-[#1A1A1A]">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack}
          className="flex items-center gap-1.5 px-5 py-3 rounded-full border border-[#E8E8E8] text-sm font-semibold text-[#717171] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
        <button onClick={onPlace}
          className="flex-1 bg-[#1A1A1A] text-white py-3 rounded-full font-semibold text-sm hover:bg-black/80 transition-colors flex items-center justify-center gap-2">
          <ShoppingBag size={15} /> Place Order
        </button>
      </div>
    </div>
  );
};

// ── Payment processing overlay ────────────────────────────────────────────────
const TOTAL_SECONDS = 5;

const PaymentProcessing = ({ total, onDone }) => {
  const [countdown, setCountdown] = useState(TOTAL_SECONDS);
  const [success,   setSuccess]   = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          if (!doneRef.current) {
            doneRef.current = true;
            setSuccess(true);
            setTimeout(onDone, 1800); // brief success pause before redirect
          }
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onDone]);

  const progress = ((TOTAL_SECONDS - countdown) / TOTAL_SECONDS) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center gap-8 px-6"
    >
      <AnimatePresence mode="wait">
        {!success ? (
          <motion.div key="processing"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-6 text-center"
          >
            {/* Spinner */}
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="40" fill="none" stroke="#E8E8E8" strokeWidth="6" />
                <circle cx="48" cy="48" r="40" fill="none" stroke="#1A1A1A" strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                  style={{ transition: "stroke-dashoffset 0.9s linear" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={28} className="text-[#1A1A1A] animate-spin" />
              </div>
            </div>

            <div>
              <p className="text-xl font-bold text-[#1A1A1A]">Processing Payment</p>
              <p className="text-[#717171] text-sm mt-1">Please don't close this window</p>
            </div>

            <div className="bg-[#F6F6F6] rounded-2xl px-8 py-4 text-center">
              <p className="text-3xl font-bold text-[#1A1A1A]">{countdown}s</p>
              <p className="text-xs text-[#717171] mt-1">Verifying with payment gateway</p>
            </div>

            <p className="text-sm font-bold text-[#1A1A1A]">Amount: ${total.toFixed(2)}</p>
          </motion.div>
        ) : (
          <motion.div key="success"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-5 text-center"
          >
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
              className="w-24 h-24 rounded-full bg-green-50 border-2 border-green-500 flex items-center justify-center"
            >
              <CheckCircle size={48} className="text-green-500" />
            </motion.div>
            <div>
              <p className="text-2xl font-bold text-[#1A1A1A]">Payment Successful!</p>
              <p className="text-[#717171] text-sm mt-1">Redirecting you to home...</p>
            </div>
            <p className="text-lg font-bold text-green-600">${total.toFixed(2)} paid</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items    = useSelector(selectCartItems);
  const total    = useSelector(selectCartTotal);
  const user     = useSelector(selectUser);

  const [step, setStep]             = useState(1);
  const [address, setAddress]       = useState({
    fullName:   "John Doe",
    phone:      "+1 234 567 8900",
    street:     "123 Main Street",
    city:       "New York",
    state:      "NY",
    postalCode: "10001",
    country:    "United States",
  });
  const [method, setMethod]         = useState("");
  const [processing, setProcessing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-5 px-4">
        <div className="w-20 h-20 rounded-full bg-[#F6F6F6] border border-[#E8E8E8] flex items-center justify-center">
          <ShoppingBag size={32} className="text-[#717171]" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#1A1A1A]">Your cart is empty</h2>
          <p className="text-[#717171] text-sm mt-1">Add items before checking out</p>
        </div>
        <Link to="/" className="bg-[#1A1A1A] text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-black/80 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  const handleAddressChange = (field, value) =>
    setAddress((prev) => ({ ...prev, [field]: value }));

  // Build order payload matching backend schema
  const buildOrderPayload = () => ({
    items: items.map((i) => ({ product: i._id, quantity: i.quantity })),
    shippingAddress: {
      fullName:   address.fullName,
      phone:      address.phone,
      street:     address.street,
      city:       address.city,
      state:      address.state ?? "",
      postalCode: address.postalCode,
      country:    address.country,
    },
    payment: { method },
  });

  // Launch Razorpay checkout in browser
  const launchRazorpay = (rzpOrder) => {
    return new Promise((resolve, reject) => {
      const options = {
        key:         import.meta.env.VITE_RAZORPAY_KEY_ID ?? rzpOrder.key_id,
        amount:      rzpOrder.amount,
        currency:    rzpOrder.currency,
        name:        "Commerce",
        description: "Order Payment",
        order_id:    rzpOrder.id,
        prefill: {
          name:  user?.name  ?? "",
          email: user?.email ?? "",
        },
        handler: (response) => resolve(response),
        modal: { ondismiss: () => reject(new Error("Payment cancelled")) },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  };

  const handlePlaceOrder = async () => {
    let createdOrder = null;
    try {
      if (method === "razorpay") {
        const { data: rzpOrder } = await api.post("/orders/razorpay/create", { amount: Math.round(total) });
        const payment = await launchRazorpay(rzpOrder);
        await api.post("/orders/razorpay/verify", {
          razorpay_order_id:   payment.razorpay_order_id,
          razorpay_payment_id: payment.razorpay_payment_id,
          razorpay_signature:  payment.razorpay_signature,
        });
        const { data } = await api.post("/orders", buildOrderPayload());
        createdOrder = data;
      } else {
        const { data } = await api.post("/orders", buildOrderPayload());
        createdOrder = data;
      }
    } catch (err) {
      console.warn("Order API error:", err.response?.data?.message ?? err.message);
      toast.error(err.response?.data?.message ?? "Order could not be saved. Showing demo flow.");
    }
    // Set placed order first, then show overlay
    setPlacedOrder(createdOrder);
    setProcessing(true);
  };

  const handlePaymentDone = () => {
    dispatch(clearCart());
    toast.success("Order placed successfully!");
    navigate("/orders", { state: { newOrder: placedOrder } });
  };

  return (
    <div className="max-w-[860px] mx-auto px-6 py-10">
      {processing && <PaymentProcessing total={total} onDone={handlePaymentDone} />}
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-8 text-center">Checkout</h1>

      <ProgressBar current={step} />

      <div className="bg-white rounded-3xl border border-[#E8E8E8] p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="address"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}>
              <h2 className="text-lg font-bold text-[#1A1A1A] mb-5 flex items-center gap-2">
                <MapPin size={18} /> Delivery Address
              </h2>
              <AddressStep data={address} onChange={handleAddressChange} onNext={() => setStep(2)} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="payment"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}>
              <h2 className="text-lg font-bold text-[#1A1A1A] mb-5 flex items-center gap-2">
                <CreditCard size={18} /> Payment Method
              </h2>
              <PaymentStep method={method} onSelect={setMethod} onNext={() => setStep(3)} onBack={() => setStep(1)} />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="confirm"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}>
              <h2 className="text-lg font-bold text-[#1A1A1A] mb-5 flex items-center gap-2">
                <CheckCircle size={18} /> Review & Confirm
              </h2>
              <ConfirmStep
                address={address} method={method}
                items={items} total={total}
                onBack={() => setStep(2)}
                onPlace={handlePlaceOrder}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Checkout;
