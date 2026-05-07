/**
 * REACT CUSTOM HOOKS NOTES
 * 
 * 1. What is a Custom Hook?
 *    A custom hook is a JavaScript function whose name starts with "use" and that may 
 *    call other hooks. It's a way to extract component logic into reusable functions.
 * 
 * 2. Why do we use Custom Hooks?
 *    - Reusability: Share logic between multiple components without duplicating code.
 *    - Separation of Concerns: Move complex logic out of components to keep them clean 
 *      and focused on the UI.
 *    - Testing: Business logic in custom hooks is easier to test in isolation.
 *    - DRY (Don't Repeat Yourself): Abstract common patterns (fetching, forms, auth).
 * 
 * 3. Rules of Custom Hooks:
 *    - Must start with the prefix "use" (e.g., useFetch, useAuth, useForm).
 *    - They can call other built-in Hooks (useState, useEffect, etc.).
 *    - They follow the "Rules of Hooks": Only call them at the top level, and only 
 *      from React functions.
 * 
 * 4. Implementation Pattern:
 *    function useMyCustomLogic() {
 *      const [state, setState] = useState(initialValue);
 *      // logic using useEffect, etc.
 *      return [state, someFunction]; // or return { state, someFunction }
 *    }
 * 
 * 5. Do's:
 *    - Use them to extract logic that is shared by two or more components.
 *    - Return exactly what the component needs (variables, functions, or both).
 *    - Keep them focused on a single responsibility (e.g., useLocalStorage).
 * 
 * 6. Don'ts:
 *    - Don't return JSX from a custom hook; it's for logic, not UI. (If it returns JSX, 
 *      it's likely a component).
 *    - Don't name them without the "use" prefix; React's linter won't be able to 
 *      check for hook violations.
 *    - Don't use them for static utility functions that don't use any React hooks.
 * 
 * 7. Common Use Cases:
 *    - API data fetching (useFetch)
 *    - Form handling (useForm)
 *    - Device detection (useWindowSize)
 *    - Local storage sync (useLocalStorage)
 *    - Authentication state (useAuth)
 */
