/**
 * JAVASCRIPT FUNCTIONS: COMPREHENSIVE GUIDE
 * 
 * Functions are fundamental building blocks in JavaScript. A function is a reusable set of statements to perform a task or calculate a value.
 */

// ==========================================
// 1. FUNCTION DECLARATION (Named Function)
// ==========================================
/**
 * Definition: A function defined with the specified parameters using the 'function' keyword.
 * Use Case: Standard procedural logic that needs to be reusable.
 * 
 * Syntax:
 * function name(param1, param2) { ... }
 * 
 * Dos and Don'ts:
 * - DO: Give functions descriptive names indicating their action (e.g., calculateTotal, fetchData).
 * 
 * Corner Cases:
 * - Function declarations are fully hoisted to the top of their scope, meaning they can be called before they are defined in the code.
 */

function sum(a, b) {
  return a + b;
}
console.log("Function Declaration Sum:", sum(10, 20));

// ==========================================
// 2. FUNCTION EXPRESSION (Anonymous Function)
// ==========================================
/**
 * Definition: A function created inside an expression or assigned to a variable. It often doesn't have a name (anonymous).
 * Use Case: Passing a function as an argument (callback) or defining a function dynamically.
 * 
 * Syntax:
 * const myFunc = function(param) { ... }
 * 
 * Dos and Don'ts:
 * - DON'T: Try to call a function expression before it is defined. Variables declared with 'const' or 'let' are not hoisted in the same way function declarations are (they sit in the Temporal Dead Zone).
 */

const subtract = function(a, b) {
  return a - b;
};
console.log("Function Expression Subtract:", subtract(20, 10));

// ==========================================
// 3. ARROW FUNCTION (ES6)
// ==========================================
/**
 * Definition: A syntactically compact alternative to a regular function expression.
 * Use Case: Short callbacks (like in array methods) or when you want to preserve the lexical scope of 'this'.
 * 
 * Syntax:
 * const myFunc = (param) => { ... }
 * const oneLiner = param => param * 2; // Implicit return
 * 
 * Dos and Don'ts:
 * - DO: Use arrow functions for array methods (map, filter, reduce) for cleaner syntax.
 * - DON'T: Use arrow functions as object methods if you need to access the object's properties via 'this', because arrow functions do not have their own 'this' binding.
 */

const printMessage = (msg) => console.log(`Message: ${msg}`);
printMessage("Hello via Arrow Function");

// ==========================================
// 4. IIFE (Immediately Invoked Function Expression)
// ==========================================
/**
 * Definition: A JavaScript function that runs as soon as it is defined.
 * Use Case: Creating an isolated scope to avoid polluting the global namespace with variables.
 * 
 * Syntax:
 * (function() { ... })();
 * (() => { ... })();
 * 
 * Dos and Don'ts:
 * - DO: Prefix the IIFE with a semicolon if it follows other code to prevent parsing errors resulting from missing semicolons on previous lines.
 */

;(function() {
  const privateData = "This is isolated";
  console.log("IIFE Executed. Data:", privateData);
})();

// ==========================================
// 5. REST PARAMETERS
// ==========================================
/**
 * Definition: Allows a function to accept an indefinite number of arguments as an array.
 * Use Case: Functions that need to handle a variable number of inputs (e.g., a math sum function).
 * 
 * Syntax:
 * function myFunc(param1, ...restParams) { ... }
 * 
 * Dos and Don'ts:
 * - DO: Place the rest parameter at the very end of the function signature.
 * - DON'T: Have more than one rest parameter in a single function declaration.
 */

function sumAll(...args) {
  let total = 0;
  for (let i = 0; i < args.length; i++) {
    total += args[i];
  }
  return total;
}
console.log("Rest Parameter Sum:", sumAll(1, 2, 3, 4, 5, 10, 20));
