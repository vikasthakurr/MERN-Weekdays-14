/**
 * JAVASCRIPT PROMISES
 * 
 * What is a Promise?
 * A Promise is an object representing the eventual completion (or failure) of an asynchronous operation 
 * and its resulting value. It acts like a proxy for a value not necessarily known when the promise is created.
 * 
 * States of a Promise:
 * 1. Pending: Initial state, neither fulfilled nor rejected.
 * 2. Fulfilled (Resolved): The operation completed successfully.
 * 3. Rejected: The operation failed (e.g., network error).
 * 
 * Consuming a Promise:
 * - .then(callback): Executed when the Promise is fulfilled. Can be chained.
 * - .catch(callback): Executed when the Promise is rejected or an error is thrown in the chain.
 * - .finally(callback): Executed regardless of whether the Promise is fulfilled or rejected (good for cleanup).
 * 
 * Promise Combinators (Static Methods):
 * - Promise.all(iterable): Waits for ALL promises to be fulfilled. Rejects immediately if ANY promise rejects.
 * - Promise.race(iterable): Returns the first promise to settle (either fulfilled OR rejected).
 * - Promise.allSettled(iterable): Waits for all promises to settle (both fulfilled and rejected). Returns an array of their outcomes.
 * - Promise.any(iterable): Returns the first promise to fulfill. Only rejects if ALL promises reject (throws AggregateError).
 */

// const response = fetch("https://jsonplaceholder.typicode.com/todos/1");
// response
//   .then((res) => res.json())
//   .then((data) => console.log(data))
//   .then(() => console.log("then"))
//   .then(() => {
//     throw new Error("error in then");
//   })
//   .catch((err) => {
//     console.log(err);
//   })
//   .finally(() => {
//     console.log("finally");
//   });

// const p1 = Promise.reject("hi 1");
// const p2 = Promise.reject("hi 2");
// const p3 = Promise.reject("due to data not avaqilable");

// Promise.any([p1, p2, p3])
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
/**
 * ---------------------------------------------------------
 * COMPARISON: API Calls using Callbacks vs Promises
 * ---------------------------------------------------------
 * 
 * 1. The Old Way: Using Callbacks (XMLHttpRequest)
 * Notice how success and error handling are split, and how nested it can become.
 * 
 * function getUserDataCallback(userId, successCallback, errorCallback) {
 *   const xhr = new XMLHttpRequest();
 *   xhr.open('GET', `https://jsonplaceholder.typicode.com/users/${userId}`);
 *   xhr.onload = function() {
 *     if (xhr.status === 200) {
 *       successCallback(JSON.parse(xhr.responseText)); // Success callback
 *     } else {
 *       errorCallback(new Error(`Failed with status: ${xhr.status}`)); // Error callback
 *     }
 *   };
 *   xhr.onerror = function() {
 *     errorCallback(new Error('Network Error'));
 *   };
 *   xhr.send();
 * }
 * 
 * // Usage:
 * // getUserDataCallback(1, 
 * //   (data) => console.log("Callback Success:", data), 
 * //   (error) => console.error("Callback Error:", error)
 * // );
 * 
 * 
 * 2. The Modern Way: Using Promises (fetch API)
 * Promises provide a much cleaner, more linear syntax with built-in error chaining.
 * 
 * function getUserDataPromise(userId) {
 *   return fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
 *     .then(response => {
 *       if (!response.ok) {
 *         throw new Error(`Failed with status: ${response.status}`);
 *       }
 *       return response.json();
 *     });
 * }
 * 
 * // Usage:
 * // getUserDataPromise(1)
 * //   .then(data => console.log("Promise Success:", data))
 * //   .catch(error => console.error("Promise Error:", error));
 */

