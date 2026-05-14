/**
 * ==========================================
 * RESTful API DESIGN: RULES & BEST PRACTICES
 * ==========================================
 *
 * WHAT IS REST?
 * REST (REpresentational State Transfer) is an architectural style for providing 
 * standards between computer systems on the web, making it easier for systems 
 * to communicate with each other.
 *
 * THE 6 GUIDING PRINCIPLES OF REST:
 * 1. Stateless: Each request contains all information needed to process it.
 * 2. Client-Server: Separation of concerns between the UI and data storage.
 * 3. Uniform Interface: Simplified architecture through a common language.
 * 4. Cacheable: Responses must define themselves as cacheable or not.
 * 5. Layered System: A client cannot tell if it's connected to the end server or an intermediate.
 * 6. Code on Demand (Optional): Sending executable code (like Java applets/JS).
 *
 * HTTP METHODS (THE VERBS):
 * - GET: Retrieve data (Safe & Idempotent).
 * - POST: Create new data (Not Idempotent).
 * - PUT: Replace/Update existing data (Idempotent).
 * - PATCH: Partially update existing data (Not necessarily Idempotent).
 * - DELETE: Remove data (Idempotent).
 *
 * BEST PRACTICES:
 *
 * 1. USE NOUNS, NOT VERBS
 *    - GOOD: GET /users, POST /users
 *    - BAD: GET /getUsers, POST /create-user
 *
 * 2. USE PLURALS
 *    - Use /products instead of /product.
 *
 * 3. VERSION YOUR API
 *    - Use /api/v1/products to ensure backward compatibility when changes occur.
 *
 * 4. USE SUB-RESOURCES FOR RELATIONSHIPS
 *    - GET /users/123/orders (Get orders of user 123).
 *
 * 5. PROPER HTTP STATUS CODES
 *    - 200 OK: Success (GET/PUT).
 *    - 201 Created: Successfully created (POST).
 *    - 204 No Content: Successfully deleted (DELETE).
 *    - 400 Bad Request: Client-side error (Validation failed).
 *    - 401 Unauthorized: Authentication required.
 *    - 403 Forbidden: Authenticated but not allowed.
 *    - 404 Not Found: Resource doesn't exist.
 *    - 500 Internal Server Error: Server-side crash.
 *
 * 6. FILTERING, SORTING, & PAGINATION
 *    - GET /products?price[gte]=100&sort=name&page=2&limit=10
 *
 * API CONTRACT:
 * An API contract is a shared understanding between the provider and consumer.
 * - Consistent JSON structure.
 * - Standardized error handling (e.g., { status: 'error', message: '...' }).
 * - Predictable behavior for each endpoint.
 * ==========================================
 */

import express from "express";

const app = express();
app.use(express.json());

// Example Implementation
const products = [
  { id: 1, name: "Laptop", price: 1200 },
  { id: 2, name: "Phone", price: 800 },
];

// GET: Fetch all products
app.get("/api/v1/products", (req, res) => {
  res.status(200).json({
    status: "success",
    results: products.length,
    data: { products },
  });
});

// POST: Create a product
app.post("/api/v1/products", (req, res) => {
  const newId = products[products.length - 1].id + 1;
  const newProduct = Object.assign({ id: newId }, req.body);
  products.push(newProduct);

  res.status(201).json({
    status: "success",
    data: { product: newProduct },
  });
});

app.listen(3000, () => {
  console.log("REST API Server running on port 3000");
});
