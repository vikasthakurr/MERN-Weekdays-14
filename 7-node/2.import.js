/**
 * MODULES IN NODE.JS
 * 
 * A module is a reusable block of code whose functionality is isolated to that file.
 * Node.js has three types of modules:
 * 
 * 1. Built-in Modules:
 *    - Modules provided by Node.js out of the box.
 *    - Example: fs, path, http, os, crypto.
 *    - Usage: import fs from "fs";
 * 
 * 2. Third-Party Modules:
 *    - Modules installed via npm (Node Package Manager).
 *    - Example: express, mongoose, lodash, colors.
 *    - Usage: npm install <module_name> -> import module from "module";
 * 
 * 3. Custom Modules:
 *    - Modules created by the developer in the project.
 *    - Usage: import myModule from "./myModule.js"; (Relative path is required)
 * 
 * ---------------------------------------------------------
 * NAMED EXPORT vs DEFAULT EXPORT (ES Modules)
 * ---------------------------------------------------------
 * 
 * 1. Named Export:
 *    - Allows exporting multiple items from a single file.
 *    - Must be imported using exact names inside curly braces {}.
 *    - Export: export const sum = (a, b) => a + b;
 *    - Import: import { sum } from "./index.js";
 * 
 * 2. Default Export:
 *    - Allows exporting only ONE item as the default from a file.
 *    - Can be imported with ANY name (no curly braces).
 *    - Export: export default someValue;
 *    - Import: import anyName from "./index.js";
 * 
 * Note: You can have multiple named exports but only one default export per file.
 */

// Example of importing a Named Export (commented out)
// import { sum } from "./index.js";

// Example of importing a Default Export (named as 'vikas' here)
import vikas from "./index.js";

// console.log(sum(2, 3));
console.log(vikas);

