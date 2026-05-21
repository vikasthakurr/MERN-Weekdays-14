import dotenv from "dotenv";
import axios from "axios";
import mongoose from "mongoose";
import Product from "../models/product.model.js";

dotenv.config({ path: "./env/.env" });

const DUMMYJSON_URL = "https://dummyjson.com/products?limit=0"; // limit=0 returns all products

async function fetchAllProducts() {
  console.log("📦 Fetching products from dummyjson...");
  const { data } = await axios.get(DUMMYJSON_URL);
  console.log(`✅ Fetched ${data.products.length} products`);
  return data.products;
}

function mapProduct(p) {
  return {
    dummyId: p.id,
    title: p.title,
    description: p.description,
    category: p.category,
    price: p.price,
    discountPercentage: p.discountPercentage,
    rating: p.rating,
    stock: p.stock,
    tags: p.tags ?? [],
    brand: p.brand ?? null,
    sku: p.sku ?? null,
    weight: p.weight ?? null,
    dimensions: p.dimensions ?? null,
    warrantyInformation: p.warrantyInformation ?? null,
    shippingInformation: p.shippingInformation ?? null,
    availabilityStatus: p.availabilityStatus ?? null,
    reviews: (p.reviews ?? []).map((r) => ({
      rating: r.rating,
      comment: r.comment,
      date: r.date ? new Date(r.date) : null,
      reviewerName: r.reviewerName,
      reviewerEmail: r.reviewerEmail,
    })),
    returnPolicy: p.returnPolicy ?? null,
    minimumOrderQuantity: p.minimumOrderQuantity ?? 1,
    meta: p.meta
      ? {
          createdAt: p.meta.createdAt ? new Date(p.meta.createdAt) : null,
          updatedAt: p.meta.updatedAt ? new Date(p.meta.updatedAt) : null,
          barcode: p.meta.barcode ?? null,
          qrCode: p.meta.qrCode ?? null,
        }
      : null,
    images: p.images ?? [],
    thumbnail: p.thumbnail ?? null,
  };
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🔗 Connected to MongoDB");

    const products = await fetchAllProducts();
    const mapped = products.map(mapProduct);

    // Drop existing products so re-running the seeder is safe
    const deleted = await Product.deleteMany({});
    console.log(`🗑️  Cleared ${deleted.deletedCount} existing products`);

    const inserted = await Product.insertMany(mapped, { ordered: false });
    console.log(`🌱 Seeded ${inserted.length} products successfully`);
  } catch (err) {
    console.error("❌ Seeder failed:", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

seed();
