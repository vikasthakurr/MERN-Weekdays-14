/**
 * HTTP MODULE IN NODE.JS
 * 
 * The 'http' module is a built-in Node.js module that allows Node.js to transfer data 
 * over the Hyper Text Transfer Protocol (HTTP). It's primarily used to create web servers.
 */
import http from "http";

// let's define some dummy data to send in response
let data = {
  name: "vikas",
};

const PORT = 3000;

/**
 * http.createServer()
 * This method creates an HTTP server. It takes a callback function as an argument.
 * This callback is executed every time a request is made to the server.
 * 
 * @param req (IncomingMessage): Represents the request from the client.
 * @param res (ServerResponse): Used to send a response back to the client.
 */
const server = http.createServer((req, res) => {
  // console.log(req.url);    // The path requested (e.g., '/', '/about')
  // console.log(req.method); // The HTTP method used (e.g., 'GET', 'POST')
  
  /**
   * res.statusCode: Sets the HTTP status code (200 = OK, 404 = Not Found, etc.)
   * res.setHeader: Sets custom or standard HTTP headers.
   * res.end: Signals to the server that all of the response headers and body have been sent.
   */
  // res.statusCode = 200;
  // res.setHeader("author", "vikas");
  // res.end("hi from server");

  /**
   * ROUTING EXAMPLE:
   * We can check req.url and req.method to perform different actions for different paths.
   */
  // if (req.url === "/" && req.method === "GET") {
  //     res.end("hi from home page");
  // } else if (req.url === "/about" && req.method === "GET") {
  //     res.end(JSON.stringify(data));
  // }

  /**
   * HANDLING POST DATA:
   * Node.js receives POST data in "chunks" because it streams data for efficiency.
   * We listen to the 'data' event to collect chunks and 'end' event to process the full body.
   */
  if (req.url === "/users" && req.method === "POST") {
    let body = "";

    // Event listener for incoming data chunks
    req.on("data", (chunk) => {
      body += chunk; // Buffer the data
    });

    // Event listener for when the entire request body has been received
    req.on("end", () => {
      console.log("Raw Body:", body);
      try {
        let user = JSON.parse(body);
        console.log("Parsed User:", user);
        res.end("Login successful and data received");
      } catch (err) {
        res.statusCode = 400;
        res.end("Invalid JSON");
      }
    });
  } else if (req.url === "/") {
      res.end("Welcome to the Home Page");
  } else {
      // res.end("Page not found");
  }
});

/**
 * server.listen()
 * This starts the server and makes it wait for incoming connections on the specified port.
 */
server.listen(PORT, function () {
  console.log(`Server is running at http://localhost:${PORT}`);
});

/**
 * WHY SHIFT FROM CORE NODE.JS (HTTP) TO EXPRESS.JS?
 * 
 * 1. Complexity in Routing: In core Node, you have to write nested if-else blocks 
 *    to handle different URLs and Methods. Express provides a simple 'app.get()', 
 *    'app.post()' syntax.
 * 
 * 2. Manual Body Parsing: As seen above, we have to manually listen to 'data' and 
 *    'end' events to get request bodies. Express handles this with simple 
 *    middleware like 'express.json()'.
 * 
 * 3. Middleware Support: Express is built on the concept of middleware, allowing 
 *    you to easily plug in functions for logging, authentication, and error handling.
 * 
 * 4. Boilerplate: Core Node requires a lot of repetitive code for setting headers, 
 *    status codes, and ending responses. Express abstracts these into simple methods.
 * 
 * 5. Community & Plugins: Express has a massive ecosystem of plugins (packages) 
 *    that solve common web development problems out of the box.
 */
