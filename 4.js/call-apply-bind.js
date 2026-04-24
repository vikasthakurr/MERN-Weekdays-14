/*
 * ============================================================================
 * THE MAGIC OF CALL, APPLY, AND BIND! ✨
 * ============================================================================
 *
 * Think of `this` in JavaScript like the word "my" or "mine".
 * If I say "my car", it means something different depending on who is speaking!
 *
 * `call`, `apply`, and `bind` are tools that let us FORCE JavaScript to
 * understand exactly WHO "my" refers to.
 *
 * 1. WHAT ARE THEY?
 * - They are built-in tools (methods) that exist on every JavaScript function.
 * - They help us control the `this` keyword.
 *
 * 2. WHY DO WE USE THEM? (The "Borrowing" Concept)
 * - Imagine your friend has a great video game console (a method/function).
 * - You want to play a game on it, but using YOUR saved game profile (your data/object).
 * - Instead of buying your own console (copying the function), you just borrow theirs for a moment!
 *
 * 3. WHEN TO USE WHICH? (The Cheat Sheet)
 *
 * - 📞 call(): "Call it RIGHT NOW with these specific items."
 *      Use when you want to run the function immediately and pass arguments one by one.
 *
 * - 📦 apply(): "Apply it RIGHT NOW with this box (array) of items."
 *      Use when you want to run the function immediately, but you have your arguments inside an array.
 *      (Hint: Apply and Array both start with 'A'!)
 *
 * - 📎 bind(): "Bind this for LATER."
 *      Use when you DON'T want to run it right now. It gives you a brand NEW copy of the function
 *      that remembers who `this` is forever. Great for event listeners (like clicking buttons).
 *
 * ----------------------------------------------------------------------------
 * 4. PRACTICAL EXAMPLES (Let's see some code!)
 * ----------------------------------------------------------------------------
 */

// Let's create two students
const student1 = {
  name: "Rahul",
  introduce: function (hobby, favoriteSubject) {
    console.log(
      `Hi, I am ${this.name}! I love ${hobby} and my favorite subject is ${favoriteSubject}.`,
    );
  },
};

const student2 = {
  name: "Priya",
  // Notice Priya doesn't have an introduce method! Oh no!
};

// --- CALL ---
console.log("--- Using CALL ---");
// student1 uses their own method normally
student1.introduce("cricket", "Math");

// Now, Priya borrows Rahul's introduce method using `call`.
// We say: "Use student1's introduce, but pretend 'this' is student2."
// Arguments are passed normally separated by commas.
student1.introduce.call(student2, "reading", "Science");
// Output: Hi, I am Priya! I love reading and my favorite subject is Science.

// --- APPLY ---
console.log("\n--- Using APPLY ---");
// Exactly the same as call, but we pass the extra info in an Array [ ]
const priyaDetails = ["painting", "History"];

student1.introduce.apply(student2, priyaDetails);
// Output: Hi, I am Priya! I love painting and my favorite subject is History.

// Real world Apply trick: Finding the highest score in an array
const testScores = [85, 92, 78, 99, 88];
// Math.max normally takes numbers like (85, 92...), NOT an array.
// `apply` fixes this by unpacking the array for us!
const highestScore = Math.max.apply(null, testScores);
console.log(`Highest Score: ${highestScore}`); // Output: 99

// --- BIND ---
console.log("\n--- Using BIND ---");
// Bind does NOT run the function immediately. It creates a new function.
// Imagine Priya wants to save this introduction to use on her portfolio website later.
const priyaIntroForLater = student1.introduce.bind(
  student2,
  "coding",
  "Computers",
);

// ... later on in the code ...
console.log("... Running the bound function later ...");
priyaIntroForLater();
// Output: Hi, I am Priya! I love coding and my favorite subject is Computers.

/*
 * ----------------------------------------------------------------------------
 * 5. DOS AND DON'TS (Tips for Students)
 * ----------------------------------------------------------------------------
 *
 * ✅ DO use `bind` when working with `setTimeout` or clicking buttons if you are
 *    losing track of `this`.
 *
 * ✅ DO remember the shortcut: "A is for Array, A is for Apply".
 *    Call is for Commas (comma-separated arguments).
 *
 * ❌ DON'T worry about these TOO much if you are just starting out.
 *    Modern JavaScript gave us Arrow Functions ( => ) which often solve the `this`
 *    problem automatically without needing bind!
 *
 * ❌ DON'T try to use `bind`, `call`, or `apply` on an Arrow Function.
 *    Arrow functions are stubborn; their `this` can never be changed!
 */

class createUser {
  constructor(fname, age) {
    this.fname = fname;
    this.age = age;
  }
}

const user1 = new createUser("john", 25);
