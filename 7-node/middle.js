/**
 * ==========================================
 * EXPRESS MIDDLEWARE: A COMPREHENSIVE GUIDE
 * ==========================================
 *
 * WHAT IS MIDDLEWARE?
 * Middleware functions are functions that have access to the request object (req),
 * the response object (res), and the next middleware function in the application’s
 * request-response cycle.
 *
 * Middleware can:
 * - Execute any code.
 * - Make changes to the request and the response objects.
 * - End the request-response cycle.
 * - Call the next middleware function in the stack.
 *
 * TYPES OF MIDDLEWARE:
 *
 * 1. APPLICATION-LEVEL MIDDLEWARE
 *    Bound to an instance of the app object using app.use() or app.METHOD().
 *    Example: app.use((req, res, next) => { console.log('Time:', Date.now()); next(); });
 *
 * 2. ROUTER-LEVEL MIDDLEWARE
 *    Works exactly like application-level middleware, but bound to express.Router().
 *    Example: router.use(function (req, res, next) { ... });
 *
 * 3. ERROR-HANDLING MIDDLEWARE
 *    Always takes four arguments: (err, req, res, next).
 *    Must be defined LAST, after all other app.use() and route calls.
 *    Example: app.use((err, req, res, next) => { res.status(500).send('Something broke!'); });
 *
 * 4. BUILT-IN MIDDLEWARE
 *    Express has built-in middleware like:
 *    - express.static: Serves static assets.
 *    - express.json: Parses incoming requests with JSON payloads.
 *    - express.urlencoded: Parses incoming requests with URL-encoded payloads.
 *
 * 5. THIRD-PARTY MIDDLEWARE
 *    Middleware installed via npm to add functionality.
 *    Examples: morgan, cors, cookie-parser, helmet.
 *
 * DOS AND DON'TS:
 *
 * DOS:
 * - ALWAYS call next() if you don't end the response cycle, or the request will hang.
 * - ORDER MATTERS: Define middleware in the exact order you want them to execute.
 * - Keep middleware modular and focused on a single task (Single Responsibility Principle).
 * - Place generic middleware (like logging/parsing) BEFORE specific routes.
 *
 * DON'TS:
 * - DON'T send a response AND call next() simultaneously (can cause "Headers already sent" errors).
 * - DON'T perform heavy, time-consuming synchronous tasks as they block the event loop.
 * - DON'T forget to put error-handling middleware at the very bottom of the file.
 * - DON'T omit the 'next' parameter in the function signature even if you don't use it (sometimes required for Express to identify middleware types).
 * ==========================================
 */

import express from "express";
import fs from "fs";
import morgan from "morgan";
const app = express();
// 4. Built-in middleware
app.use(express.json());

const router = express.Router();

// 2. Router-level middleware example
function logger(req, res, next) {
  console.log("logger");
  next();
}
router.use(logger);
router.get("/", (req, res) => {
  res.end("hello");
});

let username = "vikasthakur";
let password = "123456";

// app.use((req, res, next) => {
//   if (req.body.username === username && req.body.password === password) {
//     next();
//   } else {
//     res.end("invalid usernam");
//   }
// });

// app.use((req, res, next) => {
//   fs.appendFileSync(
//     "./log.txt",
//     `\n${req.body.username} logged in at ${new Date()} and visited ${req.url}`,
//   );
//   next();
// });

// app.use(morgan("combined"));

app.get("/", (req, res) => {
  throw new Error("error on the server");
});

// 3. Error-handling middleware (must have 4 arguments)
app.use((err, req, res, next) => {
  console.log(err);
  res.end("hi error aaya hai!");
});

app.post("/login", (req, res) => {
  //   console.log(req.body);
  res.end("login successfully");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
