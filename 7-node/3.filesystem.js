import fs from "fs";

/**
 * NODE.JS FILE SYSTEM (fs) MODULE
 * 
 * The 'fs' module allows you to work with the file system on your computer.
 * Common uses for the File System module:
 * - Read files
 * - Create files
 * - Update files
 * - Delete files
 * - Rename files
 */

// ==========================================
// 1. SYNCHRONOUS OPERATIONS (Blocking)
// ==========================================
/**
 * - Blocks the execution of the next lines of code until the operation is complete.
 * - Simpler to write but can slow down the application if used for large files or many operations.
 * - Usually used in CLI tools or startup scripts.
 */

// CREATE/WRITE: Overwrites file if it exists, creates it if it doesn't.
// fs.writeFileSync("./test.txt", "This is synchronous content.");

// READ: Returns the content. Use 'utf-8' to get string instead of Buffer.
// const syncData = fs.readFileSync("./test.txt", "utf-8");
// console.log("Sync Read:", syncData);

// APPEND: Adds content to the end of the file.
// fs.appendFileSync("./test.txt", "\nAdding more sync content.");

// DELETE: Removes the file.
// fs.unlinkSync("./test.txt");


// ==========================================
// 2. ASYNCHRONOUS OPERATIONS (Non-Blocking)
// ==========================================
/**
 * - Does not block the execution. Code continues to run while the file operation happens in the background.
 * - Requires a callback function to handle the result or error.
 * - Recommended for performance-critical applications like web servers.
 */

// CREATE/WRITE
// fs.writeFile("./async_test.txt", "This is asynchronous content.", (err) => {
//     if (err) throw err;
//     console.log("Async Write: File saved!");
// });

// READ
// fs.readFile("./async_test.txt", "utf-8", (err, data) => {
//     if (err) {
//         console.log("Error reading file:", err);
//         return;
//     }
//     console.log("Async Read:", data);
// });

// APPEND
// fs.appendFile("./async_test.txt", "\nAdding more async content.", (err) => {
//     if (err) throw err;
//     console.log("Async Append: Content added!");
// });

// DELETE
// fs.unlink("./async_test.txt", (err) => {
//     if (err) throw err;
//     console.log("Async Delete: File deleted!");
// });
