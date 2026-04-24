/**
 * JAVASCRIPT LOOPS: COMPREHENSIVE GUIDE
 * 
 * Loops provide a mechanism to execute a block of code repeatedly based on a condition.
 */

// ==========================================
// 1. FOR LOOP
// ==========================================
/**
 * Definition: A control flow statement for specifying iteration, which allows code to be executed repeatedly.
 * Use Case: When the exact number of iterations is known before entering the loop.
 * 
 * Syntax:
 * for (initialization; condition; final-expression) { ... }
 * 
 * Dos and Don'ts:
 * - DO: Declare the loop counter with 'let' to ensure it is block-scoped.
 * - DON'T: Modify the loop counter within the loop body unnecessarily, as it can lead to infinite loops or logic errors.
 * 
 * Corner Cases:
 * - All three expressions in the syntax are optional. 'for (;;)' creates an infinite loop.
 */

for (let i = 1; i <= 3; i++) {
  console.log("For Loop Iteration:", i);
}

// ==========================================
// 2. WHILE & DO...WHILE LOOPS
// ==========================================
/**
 * Definition: 
 * - While: Executes its statements as long as a specified condition evaluates to true.
 * - Do...While: Executes its statements at least once, then repeats as long as the condition evaluates to true.
 * Use Case: When the number of iterations is dynamic and depends on a condition evaluated during execution.
 * 
 * Syntax:
 * while (condition) { ... }
 * do { ... } while (condition);
 * 
 * Dos and Don'ts:
 * - DO: Ensure the condition will eventually evaluate to false to prevent infinite loops.
 */

let count = 1;
while (count <= 2) {
  console.log("While Loop Count:", count);
  count++;
}

let doCount = 10;
do {
  console.log("Do...While executed once despite false condition:", doCount);
} while (doCount < 5);

// ==========================================
// 3. FOR...OF LOOP
// ==========================================
/**
 * Definition: Executes a loop that operates on a sequence of values sourced from an iterable object (Array, String, Map, Set).
 * Use Case: Iterating over data structures where the values are the primary concern.
 * 
 * Syntax:
 * for (const variable of iterable) { ... }
 * 
 * Dos and Don'ts:
 * - DO: Use 'const' for the variable if it's not reassigned inside the loop block.
 * - DON'T: Use for...of on plain JavaScript objects (they are not iterable by default).
 */

const colors = ["Red", "Green", "Blue"];
for (const color of colors) {
  console.log("For...Of Color:", color);
}

// ==========================================
// 4. FOR...IN LOOP
// ==========================================
/**
 * Definition: Iterates over all enumerable properties of an object that are keyed by strings.
 * Use Case: Inspecting the properties/keys of an object.
 * 
 * Syntax:
 * for (const variable in object) { ... }
 * 
 * Dos and Don'ts:
 * - DON'T: Use for...in to iterate over Arrays, as it iterates over property names (indices as strings) and inherited properties, leading to unexpected behavior.
 */

const user = { name: "Vikas", role: "Developer" };
for (const key in user) {
  console.log(`For...In ${key}: ${user[key]}`);
}
