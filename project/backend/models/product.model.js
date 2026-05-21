import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    rating: { type: Number, required: true },
    comment: { type: String },
    date: { type: Date },
    reviewerName: { type: String },
    reviewerEmail: { type: String },
  },
  { _id: false }
);

const dimensionsSchema = new mongoose.Schema(
  {
    width: { type: Number },
    height: { type: Number },
    depth: { type: Number },
  },
  { _id: false }
);

const metaSchema = new mongoose.Schema(
  {
    createdAt: { type: Date },
    updatedAt: { type: Date },
    barcode: { type: String },
    qrCode: { type: String },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    dummyId: { type: Number, unique: true }, // original id from dummyjson
    title: { type: String, required: true, trim: true },
    description: { type: String },
    category: { type: String, index: true },
    price: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    tags: [{ type: String }],
    brand: { type: String },
    sku: { type: String },
    weight: { type: Number },
    dimensions: { type: dimensionsSchema },
    warrantyInformation: { type: String },
    shippingInformation: { type: String },
    availabilityStatus: { type: String },
    reviews: [reviewSchema],
    returnPolicy: { type: String },
    minimumOrderQuantity: { type: Number, default: 1 },
    meta: { type: metaSchema },
    images: [{ type: String }],
    thumbnail: { type: String },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
