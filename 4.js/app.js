/**
 * JAVASCRIPT HOISTING & TEMPORAL DEAD ZONE (TDZ): COMPREHENSIVE GUIDE
 * 
 * Hoisting is JavaScript's default behavior of moving declarations to the top of the current scope before execution.
 */

// ==========================================
// 1. HOISTING WITH var
// ==========================================
/**
 * Definition: Variables declared with 'var' are hoisted to the top of their function/global scope and initialized with 'undefined'.
 * Use Case: Understanding legacy code behavior.
 * 
 * Dos and Don'ts:
 * - DON'T: Rely on hoisting to use 'var' variables before they are declared. It makes code confusing and prone to bugs.
 * 
 * Corner Cases:
 * - Only the declaration is hoisted, NOT the initialization/assignment.
 */

console.log("var accessed before declaration:", legacyVar); // Outputs: undefined
var legacyVar = 10;
console.log("var accessed after assignment:", legacyVar); // Outputs: 10

// ==========================================
// 2. TEMPORAL DEAD ZONE (TDZ) - let & const
// ==========================================
/**
 * Definition: 'let' and 'const' are hoisted to the top of their block scope, but they are NOT initialized. The time between entering the scope and the actual declaration is the Temporal Dead Zone.
 * Use Case: Enforcing stricter coding practices where variables must be declared before use.
 * 
 * Dos and Don'ts:
 * - DO: Always declare variables at the top of their respective scopes to avoid TDZ-related ReferenceErrors.
 * 
 * Corner Cases:
 * - Accessing a variable in the TDZ throws a ReferenceError, which is safer than returning 'undefined' (like 'var' does).
 */

// console.log(modernVar); // ReferenceError: Cannot access before initialization
let modernVar = 20;
console.log("let accessed after initialization:", modernVar); // Outputs: 20

// ==========================================
// 3. HOISTING WITH FUNCTIONS
// ==========================================
/**
 * Definition: 
 * - Function Declarations: Completely hoisted. The entire function body is moved to the top, allowing execution before declaration.
 * - Function Expressions: Behave like variables. If assigned to 'var', they are hoisted as 'undefined'. If assigned to 'let'/'const', they fall into the TDZ.
 * 
 * Dos and Don'ts:
 * - DO: Use function declarations if you prefer structuring your code with helper functions at the bottom.
 * - DON'T: Try to execute function expressions before their assignment line.
 */

// Works perfectly because it's a Function Declaration
hoistedFunction(); 
function hoistedFunction() {
  console.log("Function Declaration executed successfully.");
}

// Throws TypeError (if var) or ReferenceError (if let/const)
// notHoistedFunction(); 
const notHoistedFunction = function() {
  console.log("Function Expression.");
};

// ==========================================
// 4. NESTED SCOPES & HOISTING
// ==========================================
/**
 * Definition: Hoisting happens per scope. An inner function creates a new scope, and declarations within it are hoisted to the top of that specific inner function, not the global scope.
 */

var a = 100;
function outer() {
  console.log("Outer accessing global 'a':", a); // 100

  function inner() {
    // If 'a' was declared inside inner() with var, this console.log would print 'undefined' due to inner hoisting.
    console.log("Inner accessing global 'a':", a); // 100
  }
  inner();
}
outer();
