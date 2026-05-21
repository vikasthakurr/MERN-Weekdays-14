import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    title:     { type: String, required: true }, // snapshot at order time
    thumbnail: { type: String },
    price:     { type: Number, required: true }, // price at order time
    quantity:  { type: Number, required: true, min: 1 },
    subtotal:  { type: Number, required: true }, // price * quantity
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName:   { type: String, required: true },
    phone:      { type: String, required: true },
    street:     { type: String, required: true },
    city:       { type: String, required: true },
    state:      { type: String },
    postalCode: { type: String, required: true },
    country:    { type: String, required: true },
  },
  { _id: false }
);

const paymentInfoSchema = new mongoose.Schema(
  {
    method:          { type: String, enum: ["razorpay", "cod", "card"], required: true },
    status:          { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    paidAt:          { type: Date },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items:           { type: [orderItemSchema], required: true },
    shippingAddress: { type: shippingAddressSchema, required: true },
    payment:         { type: paymentInfoSchema, required: true },

    itemsTotal:      { type: Number, required: true }, // sum of all subtotals
    shippingCharge:  { type: Number, default: 0 },
    discount:        { type: Number, default: 0 },
    grandTotal:      { type: Number, required: true }, // itemsTotal + shipping - discount

    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"],
      default: "pending",
      index: true,
    },

    deliveredAt:  { type: Date },
    cancelledAt:  { type: Date },
    cancelReason: { type: String },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
