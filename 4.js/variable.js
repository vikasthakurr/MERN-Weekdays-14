/*
  ============================================================
  JAVASCRIPT VARIABLES: var, let, and const
  ============================================================
  
  JavaScript provides three ways to declare variables, each with 
  different rules regarding scope, hoisting, and mutability.

  ------------------------------------------------------------
  1. var (The Old Way - ES5)
  ------------------------------------------------------------
  - Scope: Function-scoped (only recognized inside the function where it's defined).
  - Hoisting: Hoisted to the top and initialized as 'undefined'.
  - Redeclaration: Allowed.
  - Reassignment: Allowed.
*/

console.log("--- Testing var ---");
console.log(a); // Output: undefined (Hoisted)
var a = 10;
var a = 20; // Redeclaration allowed
a = 30; // Reassignment allowed
console.log(a); // Output: 30

function testVar() {
  var b = 50;
}
// console.log(b); // ReferenceError: b is not defined (Function-scoped)

/*
  ------------------------------------------------------------
  2. let (The Modern Way - ES6)
  ------------------------------------------------------------
  - Scope: Block-scoped (only recognized inside { ... }).
  - Hoisting: Hoisted, but NOT initialized (Temporal Dead Zone - TDZ).
  - Redeclaration: NOT allowed in the same scope.
  - Reassignment: Allowed.
*/

console.log("\n--- Testing let ---");
// console.log(c); // ReferenceError: Cannot access 'c' before initialization (TDZ)
let c = 10;
// let c = 20;  // SyntaxError: Identifier 'c' has already been declared
c = 30; // Reassignment is fine
console.log(c); // Output: 30

if (true) {
  let blockVar = "I am inside a block";
  console.log(blockVar);
}
// console.log(blockVar); // ReferenceError: blockVar is not defined (Block-scoped)

/*
  ------------------------------------------------------------
  3. const (The Constant Way - ES6)
  ------------------------------------------------------------
  - Scope: Block-scoped.
  - Hoisting: Hoisted, but NOT initialized (TDZ).
  - Redeclaration: NOT allowed.
  - Reassignment: NOT allowed.
  - Initialization: MUST be initialized at the time of declaration.
*/

console.log("\n--- Testing const ---");
const d = 100;
// d = 200;      // TypeError: Assignment to constant variable.
// const e;      // SyntaxError: Missing initializer in const declaration

const person = { name: "vikas" };
person.name = "danish"; // This is ALLOWED! (The reference is constant, but the object data is mutable)
console.log(person.name); // Output: danish

/*
  ============================================================
  SUMMARY COMPARISON
  ============================================================
  Feature        | var          | let          | const
  ---------------|--------------|--------------|------------
  Scope          | Function     | Block        | Block
  Hoisting       | Yes (undef)  | Yes (TDZ)    | Yes (TDZ)
  Redeclare      | Yes          | No           | No
  Reassign       | Yes          | Yes          | No
  ============================================================
*/
