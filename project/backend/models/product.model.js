/**
 * @file product.model.js
 * @description Mongoose schema and model for products.
 *
 * Schema mirrors the dummyjson.com product shape so the seeder can insert
 * data without transformation loss. All fields except title and price are optional.
 *
 * Sub-schemas (all with _id: false):
 *  - reviewSchema     — individual product review
 *  - dimensionsSchema — physical dimensions (width, height, depth)
 *  - metaSchema       — barcode, QR code, and API timestamps
 *
 * Indexes:
 *  - dummyId  — unique (prevents duplicate seeder runs)
 *  - category — for fast category filtering
 */

import mongoose from "mongoose";

/**
 * A single product review left by a customer.
 */
const reviewSchema = new mongoose.Schema(
  {
    rating:        { type: Number, required: true },
    comment:       { type: String },
    date:          { type: Date },
    reviewerName:  { type: String },
    reviewerEmail: { type: String },
  },
  { _id: false }
);

/**
 * Physical dimensions of the product packaging (in cm).
 */
const dimensionsSchema = new mongoose.Schema(
  {
    width:  { type: Number },
    height: { type: Number },
    depth:  { type: Number },
  },
  { _id: false }
);

/**
 * Product metadata from the dummyjson API.
 */
const metaSchema = new mongoose.Schema(
  {
    createdAt: { type: Date },
    updatedAt: { type: Date },
    barcode:   { type: String },
    qrCode:    { type: String },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    /** Original numeric ID from dummyjson — unique to prevent duplicate seeding */
    dummyId:              { type: Number, unique: true },
    title:                { type: String, required: true, trim: true },
    description:          { type: String },
    /** Indexed for fast category filtering and distinct() queries */
    category:             { type: String, index: true },
    price:                { type: Number, required: true },
    discountPercentage:   { type: Number, default: 0 },
    /** Average rating (0–5) */
    rating:               { type: Number, default: 0 },
    /** Available units in inventory */
    stock:                { type: Number, default: 0 },
    tags:                 [{ type: String }],
    brand:                { type: String },
    /** Stock Keeping Unit identifier */
    sku:                  { type: String },
    /** Weight in grams */
    weight:               { type: Number },
    dimensions:           { type: dimensionsSchema },
    warrantyInformation:  { type: String },
    shippingInformation:  { type: String },
    /** e.g. "In Stock", "Low Stock", "Out of Stock" */
    availabilityStatus:   { type: String },
    reviews:              [reviewSchema],
    returnPolicy:         { type: String },
    minimumOrderQuantity: { type: Number, default: 1 },
    meta:                 { type: metaSchema },
    /** Array of full-size image URLs */
    images:               [{ type: String }],
    /** Single thumbnail image URL */
    thumbnail:            { type: String },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
