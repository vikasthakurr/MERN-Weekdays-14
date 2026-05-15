/**
 * MONGOOSE & CRUD OPERATIONS NOTES
 * 
 * 1. Mongoose: An ODM (Object Data Modeling) library for MongoDB and Node.js. 
 *    It provides a straight-forward, schema-based solution to model your application data.
 * 
 * 2. Schema: Defines the structure of the document (fields, types, validations).
 * 3. Model: A wrapper on the Mongoose schema that provides an interface to the database for CRUD.
 * 
 * CRUD Operations:
 * - CREATE (POST): Adding new data to the database. (e.g., User.save())
 * - READ (GET): Retrieving data from the database. (e.g., User.find())
 * - UPDATE (PUT/PATCH): Modifying existing data. (e.g., User.findByIdAndUpdate())
 * - DELETE (DELETE): Removing data from the database. (e.g., User.findByIdAndDelete())
 */

import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://vikaskumar20012001:Vikas123@dummyy.4vmhuwk.mongodb.net/dummy",
  )
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model("user", userSchema);

// --- CREATE: Register a new user ---
// Uses .save() to persist the new document to the database.

app.post("/register", async (req, res) => {
  const { username, email } = req.body;
  const password = req.body.password;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existied = await User.findOne({ email });
  if (existied) return res.status(400).send("user already exis");

  const user = new User({
    username,
    email,
    password: hashedPassword,
  });

  await user.save();
  return res.send("user created");
});

//login

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).send("user not exist");

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) return res.status(400).send("password is not matching");

  // const token = jwt.sign(
  //   { id: user._id, username: user.username, email: user.email },
  //   "secretkey",
  // );

  const token = jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    "secretkey",
  );
  console.log(token);
  res.end("logged in");
});

// --- READ: Get all users ---
// Uses User.find() to retrieve all documents from the 'users' collection.

app.get("/users", async (req, res) => {
  const users = await User.find();
  if (!users) return res.status(400).send("no user found");
  return res.json(users);
});

// --- UPDATE: Modify a user by ID ---
// Uses User.findByIdAndUpdate() to find a document and apply changes.
// { new: true } returns the modified document rather than the original.
  const id = req.params.id;
  const updateUser = await User.findByIdAndUpdate(id, req.body, { new: true });
  if (!updateUser) return res.status(400).send("user not updated");
  return res.send("user updated");
// });

// --- DELETE: Remove a user by ID ---
// Uses User.findByIdAndDelete() to find and remove a document from the database.

app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;
  const deleteUser = await User.findByIdAndDelete(id);
  if (!deleteUser) return res.status(400).send("user not deleted");
  return res.send("user deleted");
});
app.listen(3000, () => {
  console.log("server started");
});
