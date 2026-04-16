/**
 * HISTORY OF JAVASCRIPT
 * 
 * 1995: Created by Brendan Eich at Netscape Communications.
 *       - Developed in just 10 days for Netscape Navigator 2.0.
 *       - Original names: Mocha, then LiveScript, finally JavaScript.
 * 
 * 1996: Microsoft released JScript (Reverse-engineered version for IE3).
 *       - Netscape submitted JS to ECMA International for standardization.
 * 
 * 1997: ECMAScript 1 (ES1) was released as the official standard.
 * 
 * 1999: ES3 was released (Intro to Regex, Try/Catch, etc.).
 *       - Became the baseline for modern JS for a decade.
 * 
 * 2005: Rise of AJAX (Asynchronous JavaScript and XML).
 *       - Made Single Page Applications (SPAs) possible (Gmail, Google Maps).
 * 
 * 2008: Google released the V8 Engine (Chrome).
 *       - Drastically improved JS execution speed via JIT compilation.
 * 
 * 2009: ES5 was released (Strict mode, JSON support, Array methods).
 *       - Node.js was created by Ryan Dahl, bringing JS to the server.
 * 
 * 2015: ECMAScript 2015 (ES6) - A Major Milestone.
 *       - Introduced: let/const, arrow functions, classes, modules, promises, template literals.
 * 
 * 2016 - Present: Annual release cycle (ES2016, ES2017, etc.).
 *       - Features like Async/Await, Object.entries, Rest/Spread operators, etc.
 * 
 * Today: JavaScript is one of the most popular and versatile programming languages,
 *        powering the web, mobile apps (React Native), and server-side (Node.js).
 */

/**
 * HOW JAVASCRIPT WORKS (THE NUTS & BOLTS)
 * 
 * 1. DEFINITION:
 *    - JavaScript is a high-level, interpreted (or JIT-compiled), 
 *      multi-paradigm, single-threaded, and dynamic language.
 *    - It follows the ECMAScript specification.
 * 
 * 2. JIT COMPILATION (JUST-IN-TIME):
 *    - Modern engines (like V8) don't just interpret code line-by-line.
 *    - They use a "JIT" compiler that compiles source code into machine code 
 *      during runtime.
 *    - Workflow: 
 *        A. Parsing (Source Code -> AST)
 *        B. Interpretation (Ignition): Fast startup, produces Bytecode.
 *        C. Profiling: The engine monitors "hot" code (frequently run).
 *        D. Optimization (TurboFan): Compiles hot code into highly optimized 
 *           machine code.
 *        E. Deoptimization: If assumptions about types change, it reverts to 
 *           bytecode.
 * 
 * 3. SINGLE-THREADED VS. MULTI-THREADED:
 *    - JS is technically single-threaded (one Call Stack). 
 *    - However, it handles concurrency using the EVENT LOOP.
 *    - Async tasks (timers, fetch, etc.) are offloaded to "Web APIs" 
 *      (provided by the browser/environment).
 *    - Once finished, they enter the Callback Queue (or Microtask Queue) 
 *      and are pushed back to the stack by the Event Loop when it's empty.
 *    - Modern JS has "Worker Threads" (Web Workers) for true parallelism, 
 *      but they share no state with the main thread.
 * 
 * 4. GARBAGE COLLECTION (MEMORY MANAGEMENT):
 *    - JS uses automatic memory management called Garbage Collection (GC).
 *    - The main algorithm is "Mark-and-Sweep":
 *        A. Mark: The GC starts from "roots" (global objects) and marks 
 *           everything reachable.
 *        B. Sweep: Everything not marked is considered unreachable and 
 *           its memory is reclaimed.
 *    - Orinoco (in V8) uses Generational GC:
 *        - Young Generation: Objects that die young (frequent GC).
 *        - Old Generation: Long-lived objects (less frequent GC).
 */

/**
 * THE PARSING PROCESS & PARSER BLOCKING
 * 
 * 1. TOKENIZATION (LEXICAL ANALYSIS):
 *    - The engine's "Scanner" reads the raw source code character-by-character.
 *    - It breaks the code into "Tokens" (smallest meaningful units).
 *    - Examples: Keywords (function, let), Identifiers (variable names), 
 *      Operators (+, =), and Punctuators ({, }, ;).
 * 
 * 2. SYNTAX ANALYSIS (PARSING):
 *    - The "Parser" takes the stream of tokens and turns them into an 
 *      ABSTRACT SYNTAX TREE (AST).
 *    - The AST is a tree representation of the structural relationships 
 *      between tokens.
 *    - If the code violates language rules (e.g., "let = 5;"), the parser 
 *      throws a "Syntax Error" during this phase.
 * 
 * 3. PARSER-BLOCKING NATURE:
 *    - Browsers parse HTML from top to bottom.
 *    - When the HTML parser hits a `<script>` tag:
 *        A. It MUST stop parsing the HTML.
 *        B. It must download the script (if external).
 *        C. It must execute the script.
 *    - This "blocks" the rendering of the rest of the page, which can 
 *      lead to a slow user experience (white screen).
 * 
 * 4. SOLUTIONS TO PARSER BLOCKING:
 * 
 *    A. Async attribute (`<script async>`):
 *       - Downloads the script in the background (non-blocking).
 *       - But as soon as it's downloaded, it pauses HTML parsing to execute.
 *       - Execution order is NOT guaranteed.
 * 
 *    B. Defer attribute (`<script defer>`):
 *       - Downloads the script in the background.
 *       - Only executes AFTER the HTML parsing is fully complete.
 *       - Maintains execution order (scripts run in the order they appear).
 *       - Best for performance in most modern web apps.
 */
