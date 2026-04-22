/**
 * 📦 JAVASCRIPT OBJECTS: THE ULTIMATE STUDENT GUIDE
 *
 * What is an Object?
 * Think of an Object as a "Container" that holds related data.
 * For example, a "Car" object can have a brand, model, and color.
 */

// ==========================================
// 1. CREATING AN OBJECT
// ==========================================
let car = {
  brand: "Tesla",
  model: "Model S",
  year: 2023,
  // Objects can even have functions (Methods!)
  start: function () {
    console.log(this.brand + " is starting...");
  },
};

// ==========================================
// 2. ACCESSING DATA (Two ways)
// ==========================================
// Dot notation (Most common)
console.log("Brand:", car.brand);

// Bracket notation (Great for dynamic keys)
let findWhat = "year";
console.log("Year:", car[findWhat]);

// ==========================================
// 3. ADDING & UPDATING
// ==========================================
car.color = "Red"; // Added new property
car.year = 2024; // Updated existing property

// ==========================================
// 4. THE "THIS" KEYWORD & BINDING
// Sometimes we want to "borrow" a function from another object.
// ==========================================
let user1 = {
  name: "Vikas",
  sayHi: function () {
    console.log("Hi, my name is " + this.name);
  },
};

let user2 = { name: "Akash" };

// Borrowing sayHi for user2:
user1.sayHi.call(user2); // "Hi, my name is Akash"

// ==========================================
// 5. CLONING (Copying)
// WARNING: Objects are passed by reference. If you do `a = b`, changing `a` changes `b`.
// ==========================================

// Shallow Copy (Only top level)
let copy1 = { ...user1 };

// Deep Copy (Best way!) - Copies everything, even nested folders.
let deepCopy = structuredClone(car);

// ==========================================
// 6. DESTRUCTURING (The "Extractor")
// A quick way to pull values out of an object.
// ==========================================
const { brand, model } = car;
console.log("Extracted:", brand, model);

// ==========================================
// 7. OBJECT METHODS (Helping Tools)
// ==========================================
console.log("All Keys:", Object.keys(car)); // [brand, model, year, start, color]
console.log("All Values:", Object.values(car)); // [Tesla, Model S, 2024, f, Red]

// ==========================================
// 8. OPTIONAL CHAINING (?.)
// Use this so your code doesn't crash if a property is missing!
// ==========================================
console.log("Checking owner:", car.owner?.name); // Returns undefined, no error!
