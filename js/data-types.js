/*
  ============================================================
  JAVASCRIPT DATA TYPES & MEMORY MANAGEMENT
  ============================================================
  
  In JavaScript, data types are divided into two main categories 
  based on how they are stored and accessed in memory.

  1. PRIMITIVE DATA TYPES (Stored in STACK Memory)
     - Types: String, Number, Boolean, Null, Undefined, Symbol, BigInt.
     - Characteristics: 
        * Fixed size.
        * Stored directly in the "Stack".
        * "Passed by Value" (When you copy them, a new independent copy is created).
  
  2. REFERENCE DATA TYPES (NON-PRIMITIVE) (Stored in HEAP Memory)
     - Types: Objects, Arrays, Functions.
     - Characteristics:
        * Dynamic size.
        * Actual data is stored in the "Heap".
        * The "Stack" only stores a "Reference" (memory address/pointer) to the Heap location.
        * "Passed by Reference" (When you copy them, you copy the address, not the data).

  ============================================================
  STACK VS HEAP MEMORY
  ============================================================
  - STACK: Fast, organized, static allocation. Used for function calls and primitives.
  - HEAP: Large, unorganized (flexible), dynamic allocation. Used for complex objects.
*/

// --- PRIMITIVE EXAMPLE (Stack Memory) ---
let a = 10;      // Value 10 stored in Stack
let b = a;       // A copy of value 10 is created in Stack for 'b'
b = 30;          // Changing 'b' doesn't affect 'a'
console.log("Primitive a:", a); // 10
console.log("Primitive b:", b); // 30

// --- REFERENCE EXAMPLE (Heap Memory) ---
let obj1 = {
  name: "vikas", // Object stored in Heap; obj1 holds the address in Stack
};

let obj2 = obj1; // obj2 now holds the SAME address as obj1 (Stack reference copied)
obj2.name = "danish"; // Modifying Heap data via obj2 reference
console.log("Reference obj1.name:", obj1.name); // "danish" (Affected because both point to same Heap data)
console.log("Reference obj2.name:", obj2.name); // "danish"

// --- TYPE CHECKING ---
let salary = 123.3456;
console.log("Type of salary:", typeof salary); // "number"

let bigNumber = 1234567890123456789012345678901234567890n;
console.log("Type of bigNumber:", typeof bigNumber); // "bigint"

let name = "vikas";
console.log("Type of name:", typeof name); // "string"

let isMarried = false;
console.log("Type of isMarried:", typeof isMarried); // "boolean"

let arr = [1, 2, 3, 4, 5];
console.log("Type of arr:", typeof arr); // "object" (Arrays are special objects)

let obj = {};
console.log("Type of obj:", typeof obj); // "object"

function abc() {}
console.log("Type of function abc:", typeof abc); // "function" (Technically a callable object)

let age;
console.log("Type of age:", typeof age); // "undefined"

let job = null;
console.log("Type of job:", typeof job); // "object" (This is a historical bug in JS!)


// --- OBJECT METHODS & PROTECTION ---
let obj3 = {
  fname: "vikas",
  lname: "thakur",
};

// Object.freeze(obj3): Makes object immutable (cannot add, delete, or change properties)
Object.freeze(obj3);
obj3.fname = "pratyush"; // Will not change in strict mode/will be ignored
obj3.salary = 234;       // Will not be added
console.log("Frozen Object:", obj3);

/*
  Object.seal(obj): 
  - Prevents adding or deleting properties.
  - Allows modification of existing properties.
*/
// let obj4 = { name: "test" };
// Object.seal(obj4);
// obj4.name = "new name"; // Works
// obj4.age = 25;          // Fails
