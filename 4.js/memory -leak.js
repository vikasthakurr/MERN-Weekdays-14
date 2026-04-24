/**
 * MEMORY LEAKS IN JAVASCRIPT
 *
 * 1. WHAT IS A MEMORY LEAK?
 *    - A memory leak occurs when a piece of memory that is no longer needed
 *      by the application is not returned to the operating system or the
 *      pool of free memory.
 *    - In JS, it happens when objects that should be garbage collected are
 *      still reachable via some reference.
 *
 * 2. COMMON CAUSES OF MEMORY LEAKS:
 *
 *    A. Accidental Global Variables:
 *       - Assigning a value to an undeclared variable creates a property on
 *         the global object (window in browsers).
 *       - Example: function leak() { out = "I am a leak"; } // 'out' is global
 *
 *    B. Forgotten Timers or Callbacks:
 *       - setInterval or setTimeout whose callbacks reference large objects
 *         but are never cleared (clearInterval/clearTimeout).
 *       - The closure in the timer will keep the referenced objects alive.
 *
 *    C. Closures:
 *       - While closures are a feature, they can leak memory if they
 *         unintentionally hold onto large variables after they are needed.
 *
 *    D. Out of DOM References (Detached DOM Nodes):
 *       - Keeping a reference to a DOM element in a JS variable after the
 *         element has been removed from the DOM tree.
 *       - The entire subtree of that node will stay in memory.
 *
 *    E. Event Listeners:
 *       - Adding event listeners to elements (especially in SPAs) without
 *         removing them when the component or element is destroyed.
 *
 * 3. HOW IT IS HANDLED BY THE ENGINE:
 *
 *    - Garbage Collection (GC): Automated via the "Mark-and-Sweep" algorithm.
 *    - The engine starts from "roots" (global variables, current stack) and
 *      finds all objects that are "reachable".
 *    - Any object NOT reachable from the roots is marked for collection
 *      and its memory is reclaimed.
 *
 * 4. HOW TO PREVENT / FIX MEMORY LEAKS:
 *
 *    - Use 'use strict': Prevents accidental global variables.
 *    - Manual Nulling: Set variables to 'null' when they are no longer needed
 *      (e.g., large data sets).
 *    - Clear Intervals/Timeouts: Always clear timers in cleanup functions.
 *    - Remove Event Listeners: Use removeEventListener when an element is
 *      about to be removed.
 *    - Use WeakMap and WeakSet: These provide "weak" references that don't
 *      prevent garbage collection.
 */
