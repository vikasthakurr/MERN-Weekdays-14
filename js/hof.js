// /*
//  * ========================================================
//  * HIGHER ORDER FUNCTIONS (HOF) & POLYFILLS IN JAVASCRIPT
//  * ========================================================
//  *
//  * 1. HIGHER ORDER FUNCTIONS (HOF):
//  * A Higher-Order Function is a function that does at least one of the following:
//  * - Takes one or more functions as arguments (callbacks).
//  * - Returns a function as its result.
//  *
//  * Common built-in HOFs in JavaScript: map(), filter(), reduce(), setTimeout().
//  *
//  * Example of a generic HOF:
//  */

// function genericHOF(operation, x, y) {
//   // 'operation' is a callback function passed as an argument
//   return operation(x, y);
// }

// function add(a, b) { return a + b; }
// function multiply(a, b) { return a * b; }

// console.log("Generic HOF Add:", genericHOF(add, 5, 10)); // 15
// console.log("Generic HOF Multiply:", genericHOF(multiply, 5, 10)); // 50

// /*
//  * 2. POLYFILLS:
//  * A polyfill is a piece of code (usually JavaScript on the Web) used to provide
//  * modern functionality on older browsers that do not natively support it.
//  * It "fills in" the gap.
//  *
//  * We often use prototypes to add our own methods to existing built-in objects
//  * like Array, String, etc. (like the custom map/filter implementation).
//  *
//  * Below is a generic example of a polyfill for the `Array.prototype.map` method:
//  */

// // Custom Map Polyfill Example
// if (!Array.prototype.myMap) {
//   Array.prototype.myMap = function(callback) {
//     let result = [];
//     for (let i = 0; i < this.length; i++) {
//       // 'this' refers to the array the method is called on
//       result.push(callback(this[i], i, this));
//     }
//     return result;
//   };
// }

// const nums = [1, 2, 3];
// const doubled = nums.myMap(num => num * 2);
// console.log("Custom Map Polyfill Result:", doubled); // [2, 4, 6]





let salary = [1000, 2000, 3000, 4000, 5000];

//arr.map(()=>{})
//salary.map(calculateTenPecent())
// const res = salary.map(calculateTenPercent);
// console.log(res);

function calculateTenPercent(salary) {
  return salary * 0.1;
}

function calculateTwentypercent(salary) {
  return salary * 0.2;
}

let arr2 = [100, 200, 300, 400];
// function gstCalculator(salary, cb) {
//   let result = [];
//   for (let i = 0; i < salary.length; i++) {
//     result.push(cb(salary[i]));
//   }
//   return result;
// }

// Array.prototype.gstCalculator = function (cb) {
//   let result = [];
//   for (let i = 0; i < this.length; i++) {
//     result.push(cb(this[i]));
//   }
//   return result;
// };
// const tax = gstCalculator(arr2, calculateTenPercent);
const tax = salary.gstCalculator(calculateTenPercent);
console.log(tax);
