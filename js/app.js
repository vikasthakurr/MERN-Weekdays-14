/*
  ============================================================
  HOISTING & TEMPORAL DEAD ZONE (TDZ)
  ============================================================
  
  1. WHAT IS HOISTING?
  - Hoisting is a phenomenon in JavaScript where you can access 
    variables and functions even before they are initialized.
  - This happens because the JS Engine scans the code and allocates 
    memory for all declarations during the "Memory Creation Phase" 
    before executing the code.

  ------------------------------------------------------------
  2. HOISTING WITH var
  ------------------------------------------------------------
  - Variables declared with 'var' are hoisted and initialized 
    with a default value of 'undefined'.
*/

console.log("var 'a' before declaration:", a); // Output: undefined
var a = 10;
console.log("var 'a' after declaration:", a);  // Output: 10

/*
  ------------------------------------------------------------
  3. HOISTING WITH let & const (TEMPORAL DEAD ZONE)
  ------------------------------------------------------------
  - 'let' and 'const' are also hoisted, but they are NOT initialized.
  - They stay in a "Temporal Dead Zone" (TDZ) from the start of the 
    block until the line they are initialized.
  - Accessing them in the TDZ results in a ReferenceError.
*/

// console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 20;
console.log("let 'b' after initialization:", b);

/*
  ------------------------------------------------------------
  4. HOISTING WITH FUNCTIONS
  ------------------------------------------------------------
  - FUNCTION DECLARATIONS: They are fully hoisted (the whole body is stored).
  - FUNCTION EXPRESSIONS: They behave like variables (hoisted as undefined if 'var', TDZ if 'let/const').
*/

sayHello(); // Works! Full function is hoisted
function sayHello() {
  console.log("Hello from a hoisted function declaration!");
}

// sayHi(); // TypeError: sayHi is not a function (if var) or ReferenceError (if let)
var sayHi = function() {
  console.log("Hi from a function expression!");
};

/*
  ============================================================
  SUMMARY:
  - var: Hoisted -> initialized as undefined.
  - function: Hoisted -> initialized with full content.
  - let/const: Hoisted -> stays in TDZ (uninitialized).
  ============================================================
*/

// Re-including the User's original scope example with notes:
function outer() {
  /* 
    'a' is accessible here because it's in the Global Execution Context's 
    memory space, and 'outer' has a reference to its parent's scope.
  */
  console.log("Outer accessing 'a':", a);

  function inner() {
    /* 
      Lexical Scope: 'inner' can access variables in its own scope, 
      its parent's scope (outer), and the global scope.
    */
    console.log("Inner accessing 'a':", a);
  }
  inner();
}
outer();
