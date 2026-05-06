/**
 *
 * 1. What is useState?
 *    - `useState` is a React Hook that lets you add state to functional components.
 *    - It returns an array with two values: the current state and a function to update it.
 *    - Syntax: const [state, setState] = useState(initialValue);
 *
 * 2. Key Benefits
 *    - Reactive UI: Automatically re-renders the component whenever the state changes.
 *    - Simplicity: Much easier to use than the old class-based `this.state` and `this.setState`.
 *    - Local Encapsulation: Each component can manage its own private data.
 *    - Functional Updates: Allows updating state based on the previous value safely:
 *      setState(prevState => prevState + 1);
 *
 * 3. Common Uses
 *    - Handling Form Inputs (controlled components).
 *    - Toggling UI elements (Modals, Dropdowns, Dark Mode).
 *    - Storing data fetched from an API.
 *    - Managing counters or simple lists.
 *
 * 4. Drawbacks & Gotchas
 *    - Asynchronous Nature: State updates don't happen immediately. If you log the state
 *      right after calling `setState`, you will still see the old value.
 *    - Over-rendering: Every state change triggers a full re-render of that component
 *      and its children (unless optimized).
 *    - Object/Array Mutations: You must NOT mutate state directly. You must always
 *      pass a NEW object or array to the setter.
 *    - Stale Closures: If used inside `setTimeout` or `useEffect` incorrectly, it
 *      might capture an old version of the state.
 *
 * 5. Best Practices
 *    - Keep state local unless it needs to be shared.
 *    - Don't put everything in state; if a value can be calculated from props or other
 *      state, don't make it a separate state.
 *    - Group related state only if they always change together; otherwise, use multiple `useState` calls.
 */

