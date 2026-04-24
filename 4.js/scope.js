/**
 * 🔍 SCOPE & LEXICAL ENVIRONMENT: A STUDENT-FRIENDLY GUIDE
 *
 * What is Scope?
 * Scope is like a "Boundary". It decides where you can see and use your variables.
 */

// ==========================================
// 1. GLOBAL SCOPE
// Variables defined outside any function. They are visible EVERYWHERE.
// ==========================================
let globalMessage = "I am Global!";

// ==========================================
// 2. BLOCK SCOPE
// Created by { }. Only 'let' and 'const' care about block scope.
// ==========================================
{
  let blockVar = "I am trapped in this block";
  var oldVar = "I can escape blocks!"; // 'var' doesn't respect blocks!
}
// console.log(blockVar); // Error!
console.log(oldVar); // Works! (But avoid using 'var')

// ==========================================
// 3. LEXICAL ENVIRONMENT & SCOPE CHAIN
// Lexical Environment = Local Space + Reference to Parent's Space.
// If JS can't find a variable locally, it goes UP to the parent.
// ==========================================

function grandfather() {
  let money = 1000;

  function father() {
    // father() can see 'money' because he is inside grandfather()

    function son() {
      // son() can see everything above him!
      console.log("Son accessing grandfather's money:", money);
    }
    son();
  }
  father();
}

grandfather(); // This search process is called "Scope Chaining"

// ==========================================
// 4. CLOSURES (The "Memory" function)
// A function that remembers the variables of its parent,
// even after the parent function has finished!
// ==========================================

function createCounter() {
  let count = 0;
  return function () {
    count++;
    console.log("Current Count:", count);
  };
}

const myCounter = createCounter();
myCounter(); // 1
myCounter(); // 2 (It remembers 'count'!)
