import express from "express";
import fs from "fs";
import ejs from "ejs";

// console.log(express);

const server = express();
server.use(express.json());
server.set("view engine", "ejs");
server.use(express.static("public"));

server.get("/", (req, res) => {
  res.render("vikas");
});

server.get("/products", (req, res) => {
  fs.readFile("./product.json", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      res.end("error while reading file");
    } else {
      res.end(data);
    }
  });
});

server.post("/login", (req, res) => {
  console.log(req.body);
  res.status(201).json({ message: "login done" });
  //   res.end("login done");
});

server.listen(3000, function () {
  console.log("server started at 3000");
});

/**
 * EXPRESS.JS & CORE CONCEPTS
 * 
 * 1. Express Server:
 *    - It is a fast, unopinionated, minimalist web framework for Node.js.
 *    - It simplifies the process of building robust APIs and web applications.
 * 
 * 2. EJS (Embedded JavaScript Templates):
 *    - A template engine that allows you to generate HTML markup with plain JavaScript.
 *    - 'server.set("view engine", "ejs")' tells Express to use EJS for rendering views.
 *    - 'res.render("filename")' looks for a file in the 'views' folder by default.
 * 
 * 3. Static File Serving:
 *    - 'express.static("public")' is a built-in middleware to serve static assets 
 *      like images, CSS files, and JavaScript files from a folder (e.g., 'public').
 * 
 * 4. File System (fs):
 *    - A built-in Node.js module to interact with the file system.
 *    - Used here to read 'product.json' and send its content to the client.
 * 
 * 5. Request & Response Methods:
 *    - 'req.body': Contains data sent in a POST request (requires express.json()).
 *    - 'res.status()': Sets the HTTP status code.
 *    - 'res.json()': Sends a JSON response and sets the correct Content-Type.
 */

