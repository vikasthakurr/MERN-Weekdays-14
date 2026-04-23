/**
 * JAVASCRIPT CALLBACKS
 * 
 * What is a Callback?
 * A callback is a function passed as an argument to another function.
 * This technique allows a function to call another function.
 * A callback function can run after another function has finished (useful in asynchronous operations).
 * 
 * Why use Callbacks?
 * 1. Asynchronous Execution: JS is single-threaded. Callbacks help manage asynchronous tasks 
 *    like network requests (API calls), file reading, or timers (setTimeout) without blocking the main thread.
 * 2. Event Handling: Callbacks are widely used to handle user interactions like clicks, form submissions, etc.
 * 
 * Callback Hell (Pyramid of Doom)
 * When multiple asynchronous operations depend on each other, you might end up with deeply nested callbacks.
 * This makes the code hard to read, debug, and maintain. 
 * The `makeMaggi` example below is a perfect demonstration of Callback Hell.
 * 
 * Modern Alternatives to Callbacks (for async logic):
 * - Promises (.then, .catch)
 * - Async / Await (Syntactic sugar over Promises, makes async code look synchronous)
 */

function sayHi(name, cb) {
  setTimeout(() => {
    console.log("hi", name);
    // cb();
  }, 6000);
}

function sayBye() {
  console.log("bye");
}

// // sayHi();
// // sayBye();

// // sayHi("vikas", sayBye.bind(this));

// sayHi("vikas", sayBye);

function makeMaggi(rawmagii, cb) {
  setTimeout(() => {
    console.log(`${rawmagii} will start the process`);
    cb();
  }, 5000);
}

function boilWater(cb) {
  console.log("water boiled please proccessss");
  cb();
}

function addMasala(cb) {
  console.log("masala added");
  cb();
}

function addMaggi(cb) {
  console.log("maggi added");
  cb();
}

function serving(cb) {
  console.log("maggi is ready to serve");
  cb();
}

makeMaggi("yuppeewe", () => {
  boilWater(() => {
    addMasala(() => {
      addMaggi(() => {
        serving(() => {
          console.log("maggi done and dusted");
        });
      });
    });
  });
});
