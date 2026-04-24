/*
 * ============================================================================
 * THE MAGIC OF CURRYING! 🍛✨
 * ============================================================================
 * 
 * Think of a normal JavaScript function like ordering a combo meal at a fast-food drive-thru. 
 * You have to give them all your choices at once: 
 * "I want a Burger, Fries, and a Coke!" -> orderMeal("Burger", "Fries", "Coke");
 * 
 * Currying is like building a custom sandwich at Subway. 
 * You make one choice at a time, and they wait for you before moving to the next step:
 * 1. "I want Italian bread..." -> (They grab the bread and wait)
 * 2. "I want Turkey..." -> (They add turkey and wait)
 * 3. "I want Mayo..." -> (Sandwich complete!) 
 * -> makeSandwich("Italian")("Turkey")("Mayo");
 * 
 * 1. WHAT IS IT?
 * - Currying is taking a function that needs multiple arguments (A, B, C) 
 *   and chopping it up into smaller functions that only take ONE argument at a time.
 * - Instead of f(a, b, c), it becomes f(a)(b)(c).
 * 
 * 2. WHY DO WE USE IT? (The "Save for Later" trick)
 * - It lets us create "specialized" versions of a function by answering the first 
 *   few questions early, and saving the rest of the questions for later!
 * 
 * ----------------------------------------------------------------------------
 * 3. PRACTICAL EXAMPLES (Let's see some code!)
 * ----------------------------------------------------------------------------
 */

// 🍔 NORMAL FUNCTION (All at once)
function addThreeNumbersNormal(a, b, c) {
  return a + b + c;
}
console.log("Normal way:", addThreeNumbersNormal(10, 20, 30)); // Output: 60

// 🍛 CURRIED FUNCTION (Step by step)
function addThreeNumbersCurried(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    }
  }
}
// You call it by giving one number at a time!
console.log("Curried way:", addThreeNumbersCurried(10)(20)(30)); // Output: 60


// --- MODERN ARROW SYNTAX ---
// Writing all those 'return functions' gets messy. Arrow functions make currying look super clean!
const easyMultiply = a => b => c => a * b * c;
console.log("Modern Currying:", easyMultiply(2)(3)(4)); // Output: 24


/*
 * ============================================================================
 * 4. REAL WORLD SUPERPOWER: PARTIAL APPLICATION 🦸‍♂️
 * ============================================================================
 * 
 * This is where currying actually becomes useful. We can lock in the first argument 
 * to create brand new, smaller tools!
 */

// Let's create a generic Logger function for a website.
// It needs a Type (like ERROR or WARNING) and a Message.
const logger = (type) => (message) => `[${type}] ${message}`;

// Let's lock in the "ERROR" part to create a specialized Error Logger!
const logError = logger("ERROR"); 
// Let's lock in the "INFO" part to create a specialized Info Logger!
const logInfo = logger("INFO");

// Now we can use these specialized tools anywhere without repeating "ERROR" or "INFO" every time!
console.log(logError("Oh no! The database crashed!"));
// Output: [ERROR] Oh no! The database crashed!

console.log(logInfo("User 'Priya' just logged in."));
// Output: [INFO] User 'Priya' just logged in.


/*
 * ----------------------------------------------------------------------------
 * 5. DOS AND DON'TS (Tips for Students)
 * ----------------------------------------------------------------------------
 * 
 * ✅ DO use currying when you find yourself calling the same function over and 
 *    over with the same FIRST argument (like our logger example!).
 * 
 * ✅ DO use modern Arrow Functions (=>) if you want to write a curried function, 
 *    it saves a lot of typing!
 * 
 * ❌ DON'T use currying for every single function. If a function is simple 
 *    and always needs all its data at once, just use a normal function!
 * 
 * ❌ DON'T get overwhelmed! It looks weird at first `function()()()`, but 
 *    just remember: it's just a function returning a function returning a function!
 */
