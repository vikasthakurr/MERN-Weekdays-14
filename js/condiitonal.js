/**
 * JAVASCRIPT CONDITIONALS: COMPREHENSIVE GUIDE
 * 
 * Conditionals form the basis of decision-making in JavaScript, allowing the 
 * execution of different code blocks based on specified boolean conditions.
 */

// ==========================================
// 1. EQUALITY OPERATORS (== vs ===)
// ==========================================
/**
 * Definition: Operators used to compare two values for equality.
 * Use Case: Evaluating conditions in loops, if-statements, or variable assignments.
 * 
 * Syntax:
 * value1 == value2  // Loose equality
 * value1 === value2 // Strict equality
 * 
 * Dos and Don'ts:
 * - DO: Always use strict equality (===) to prevent unexpected type coercion.
 * - DON'T: Use loose equality (==) unless you explicitly want to allow type conversion.
 * 
 * Corner Cases:
 * - NaN === NaN is false. Use Number.isNaN() instead.
 * - null == undefined is true, but null === undefined is false.
 */

let ageNumber = 18;
let ageString = "18";

console.log("Strict Equality (18 === '18'):", ageNumber === ageString); // false

// ==========================================
// 2. IF / ELSE IF / ELSE STATEMENTS
// ==========================================
/**
 * Definition: The standard control flow statement for conditional execution.
 * Use Case: Handling multiple, distinct logical branches.
 * 
 * Syntax:
 * if (condition1) { ... } else if (condition2) { ... } else { ... }
 * 
 * Dos and Don'ts:
 * - DO: Use curly braces {} even for single-line statements to maintain readability and avoid bugs during refactoring.
 * - DON'T: Nest if-statements too deeply. Consider returning early (guard clauses) to keep code flat.
 * 
 * Corner Cases:
 * - Falsy values in JS: 0, "", null, undefined, NaN, and false. All other values evaluate to true.
 */

let userAge = 18;

if (userAge > 18) {
  console.log("Status: Adult");
} else if (userAge === 18) {
  console.log("Status: Just became an adult");
} else {
  console.log("Status: Minor");
}

// ==========================================
// 3. TERNARY OPERATOR
// ==========================================
/**
 * Definition: A concise, inline alternative to simple if/else statements.
 * Use Case: Conditional variable assignment or simple inline return statements.
 * 
 * Syntax:
 * condition ? expressionIfTrue : expressionIfFalse
 * 
 * Dos and Don'ts:
 * - DO: Use for simple assignments to reduce verbosity.
 * - DON'T: Nest ternary operators (e.g., a ? b : c ? d : e). It makes code extremely difficult to read.
 */

let isMember = true;
let discount = isMember ? 0.2 : 0;
console.log("Discount Applied:", discount);

// ==========================================
// 4. SWITCH STATEMENT
// ==========================================
/**
 * Definition: A control flow statement that evaluates an expression and matches it against multiple cases.
 * Use Case: When comparing a single variable against many discrete, known values (often better than a long chain of else-ifs).
 * 
 * Syntax:
 * switch(expression) { case x: ... break; default: ... }
 * 
 * Dos and Don'ts:
 * - DO: Always include a 'default' case to handle unexpected values.
 * - DON'T: Forget the 'break' statement unless you intentionally want "fall-through" behavior.
 * 
 * Corner Cases:
 * - Switch uses strict equality (===) behind the scenes. A switch on "1" will not match case 1.
 */

let currentDay = 3; // Wednesday

switch (currentDay) {
  case 1:
  case 2:
  case 3:
  case 4:
  case 5:
    console.log("Status: Weekday");
    break;
  case 6:
  case 7:
    console.log("Status: Weekend");
    break;
  default:
    console.log("Error: Invalid day");
}
