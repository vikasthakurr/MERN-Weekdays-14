/*
 * ============================================================================
 * SHALLOW VS DEEP COPY IN JAVASCRIPT
 * ============================================================================
 *
 * In JavaScript, copying primitive values (like numbers or strings) is straightforward.
 * However, when you copy an Object or an Array, the behavior changes because they
 * are stored by "Reference".
 *
 * Think of an Object as a physical location, like a house.
 * - If you write down the address of the house on a piece of paper, you haven't
 *   built a new house. You just have two pieces of paper pointing to the same house.
 * - If someone goes to that address and paints the house red, anyone with that
 *   address will see a red house.
 *
 * 1. THE PROBLEM: COPYING BY REFERENCE
 * ----------------------------------------------------------------------------
 */

const person1 = { name: "Rahul", age: 20 };
// This does not create a new object; it simply shares the reference (the "address").
const person2 = person1;

person2.age = 25; // Modifying the object through the second variable...

console.log("Person 1:", person1.age); // Output: 25 (Person 1's age changed as well!)
console.log("Person 2:", person2.age); // Output: 25

/*
 * Because both variables share the same memory address, changing one affects both.
 * To prevent this, we must create an actual copy of the object.
 *
 * ============================================================================
 * 2. SHALLOW COPY
 * ============================================================================
 *
 * A Shallow Copy creates a new top-level object.
 * Analogy: You built a new house, but both houses share the exact same security system.
 *
 * Common Methods:
 * - Spread Operator (...) (Most recommended for shallow copies)
 * - Object.assign()
 */

const student = {
  name: "Priya",
  scores: { math: 90, science: 85 }, // This is a nested object.
};

// Shallow Copy using the Spread Operator
const shallowStudent = { ...student };

shallowStudent.name = "Aisha"; // Changing a top-level property works as expected.
console.log(student.name); // Output: Priya (Original is safe)
console.log(shallowStudent.name); // Output: Aisha

// THE DANGER OF SHALLOW COPY
// Let's modify the nested object (the scores)
shallowStudent.scores.math = 100;

console.log(student.scores.math); // Output: 100 (The original student's score changed!)
/*
 * Explanation: A shallow copy only copies the first level of properties.
 * Any nested objects or arrays inside still share the same memory reference!
 */

/*
 * ============================================================================
 * 3. DEEP COPY
 * ============================================================================
 *
 * A Deep Copy creates a completely independent object, including all nested
 * objects and arrays within it.
 * Analogy: You built a new house with its own independent security system.
 *
 * Common Methods:
 * - structuredClone(obj) (The modern, recommended approach)
 * - JSON.parse(JSON.stringify(obj)) (The legacy approach)
 */

const employee = {
  name: "Amit",
  details: { department: "IT", role: "Developer" },
};

// Deep Copy using structuredClone (Modern JavaScript)
const deepEmployee = structuredClone(employee);

// Let's modify the nested object
deepEmployee.details.role = "Manager";

console.log(employee.details.role); // Output: Developer (Original is safe)
console.log(deepEmployee.details.role); // Output: Manager (Only the clone changed)

/*
 * ----------------------------------------------------------------------------
 * 4. DOS AND DON'TS
 * ----------------------------------------------------------------------------
 *
 * - DO use the Spread Operator ({ ...obj } or [ ...arr ]) for flat objects.
 *   If your object does not contain nested objects, a shallow copy is efficient and sufficient.
 *
 * - DO use structuredClone(obj) when working with deeply nested objects or arrays
 *   that require complete separation.
 *
 * - DON'T rely on JSON.parse(JSON.stringify()) unless you must support very old
 *   environments. It has limitations, such as stripping out Functions, Dates, and undefined values.
 *
 * - DON'T forget that Arrays are Objects too. Assigning an array directly
 *   (const newArr = arr) copies by reference. Using the spread operator
 *   (const newArr = [...arr]) creates a shallow copy.
 */

//deep copy using prototyping

let obj1 = {
  fname: "vikas",
};

let obj2 = Object.create(obj1);
console.log(obj2); // Output: {} -->Because its in prototype not in direct object
console.log(obj2.fname); // Output: vikas
