/**
 * JAVASCRIPT INTERNAL WORKINGS & HISTORY: COMPREHENSIVE GUIDE
 * 
 * Understanding the history and engine mechanics of JavaScript is crucial for writing performant code.
 */

// ==========================================
// 1. HISTORY AND EVOLUTION
// ==========================================
/**
 * Definition: The timeline of JavaScript's development.
 * 
 * Key Milestones:
 * - 1995: Created by Brendan Eich at Netscape (originally Mocha/LiveScript).
 * - 1997: Standardized as ECMAScript 1 (ES1).
 * - 2008: Google introduces the V8 Engine, revolutionizing execution speed.
 * - 2009: Node.js released, bringing JS to backend servers.
 * - 2015: ES6 (ECMAScript 2015) released, a massive update (let/const, arrows, classes).
 * - Present: Annual release cycles ensuring constant modernization.
 * 
 * Use Case: Contextualizing why certain "legacy" features (like 'var' or type coercion quirks) exist alongside modern syntax.
 */

// ==========================================
// 2. JIT COMPILATION (How Code Runs)
// ==========================================
/**
 * Definition: JavaScript is Just-In-Time compiled. Modern engines (like V8) do not purely interpret code.
 * 
 * Process:
 * 1. Parsing: Source code is converted into an Abstract Syntax Tree (AST).
 * 2. Interpretation: The Ignition interpreter quickly generates unoptimized Bytecode to start execution immediately.
 * 3. Profiling & Optimization: The TurboFan compiler monitors running code. "Hot" (frequently used) code is compiled into highly optimized Machine Code.
 * 4. Deoptimization: If dynamic types change unexpectedly, the engine throws away the machine code and reverts to slower Bytecode.
 * 
 * Dos and Don'ts:
 * - DO: Write predictable code (e.g., keep object structures uniform, don't change variable types) to help the engine keep code optimized.
 */

// ==========================================
// 3. EVENT LOOP & CONCURRENCY
// ==========================================
/**
 * Definition: JavaScript is single-threaded (one Call Stack) but handles asynchronous operations via the Event Loop.
 * 
 * Process:
 * - Synchronous code executes immediately on the Call Stack.
 * - Asynchronous tasks (setTimeout, fetch) are offloaded to Web APIs (browser).
 * - Once complete, callbacks are pushed to the Task Queue (or Microtask Queue for Promises).
 * - The Event Loop constantly checks: If the Call Stack is empty, it pushes the next item from the Queue onto the Stack.
 * 
 * Dos and Don'ts:
 * - DON'T: Write heavy, synchronous computational loops. They will block the Call Stack and freeze the browser UI.
 */

// ==========================================
// 4. PARSER BLOCKING
// ==========================================
/**
 * Definition: When the browser's HTML parser encounters a `<script>` tag, it stops parsing HTML to download and execute the JS.
 * Use Case: Optimizing page load speeds.
 * 
 * Dos and Don'ts:
 * - DO: Use the 'defer' attribute (`<script defer src="...">`) in modern HTML. It downloads the script in the background and executes it only after the HTML is fully parsed, maintaining order.
 * - DON'T: Place heavy synchronous scripts in the `<head>` without 'defer' or 'async', as this causes a "white screen" delay for users.
 * 
 * Corner Cases:
 * - 'async' executes the script as soon as it downloads, which can break execution order if multiple scripts depend on each other. 'defer' guarantees execution order.
 */
