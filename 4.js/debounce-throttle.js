/*
 * ========================================================
 * DEBOUNCING & THROTTLING IN JAVASCRIPT
 * ========================================================
 *
 * Both Debouncing and Throttling are techniques used to optimize performance 
 * by limiting the rate at which a function is executed. They are commonly used 
 * for event listeners that fire frequently (e.g., scroll, resize, keyup, mousemove).
 *
 * 1. DEBOUNCING:
 * - What it does: Ensures that a function is not called again until a certain 
 *   amount of time has passed without it being called. 
 * - Analogy: Like an elevator door. It waits for people to board, and resets the timer 
 *   every time a new person enters. It only closes when no one has entered for a few seconds.
 * - Use cases: Search bar suggestions (wait until the user stops typing to fetch API),
 *   form validation, window resizing.
 *
 * 2. THROTTLING:
 * - What it does: Ensures that a function is called at most once in a specified 
 *   time period, no matter how many times the event fires.
 * - Analogy: Like a turnstile. It lets people through at a fixed, steady rate, 
 *   regardless of how many people are pushing from behind.
 * - Use cases: Infinite scrolling (checking scroll position at regular intervals),
 *   button double-click prevention, tracking mouse movement continuously.
 */

// function searchWithDebounce(fn, delay) {
//   let timer;
//   return function (...args) {
//     clearTimeout(timer);
//     timer = setTimeout(() => {
//       fn(...args);
//     }, delay);
//   };
// }

//throttle....

function searchWithThrottle(fn, delay) {
  let Lastcall = 0;
  return function (...args) {
    let currentCall = Date.now();
    if (currentCall - Lastcall >= delay) {
      fn(...args);
      Lastcall = currentCall;
    }
  };
}
function googleSearch(name) {
  console.log(`searching of ${name}`);
}

let googleSearchwithDebounce = searchWithThrottle(googleSearch, 300);
googleSearchwithDebounce("vikas");
googleSearchwithDebounce("vikas thakur");
googleSearchwithDebounce("vikas kumar thakur");

// googleSearch("vikas");
// googleSearch("vikas thakur");
// googleSearch("vikas kumar thakur");
