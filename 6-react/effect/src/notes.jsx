/**
 * REACT useEffect HOOK NOTES
 * 
 * 1. What is useEffect?
 *    The `useEffect` Hook lets you perform side effects in functional components. 
 *    It serves the same purpose as `componentDidMount`, `componentDidUpdate`, 
 *    and `componentWillUnmount` in React classes.
 * 
 * 2. Why do we use it?
 *    - To perform "Side Effects": Operations that reach outside the functional 
 *      scope of a component (fetching data, manually changing the DOM, setting 
 *      up subscriptions or timers).
 *    - To synchronize a component with an external system.
 * 
 * 3. The Dependency Array:
 *    - No Array: `useEffect(() => { ... })` -> Runs on EVERY render.
 *    - Empty Array: `useEffect(() => { ... }, [])` -> Runs ONLY ONCE after initial mount.
 *    - With Dependencies: `useEffect(() => { ... }, [count])` -> Runs on mount AND 
 *      whenever `count` changes.
 * 
 * 4. The Cleanup Function:
 *    If your effect returns a function, React will run it when it's time to clean up.
 *    - Purpose: To prevent memory leaks (clear timers, unsubscribe from events).
 *    - Execution: Runs before the component unmounts and before the effect re-runs.
 * 
 * 5. Do's:
 *    - Always include all variables from the component scope used inside the effect 
 *      in the dependency array.
 *    - Use multiple `useEffect` hooks to separate unrelated logic.
 *    - Return a cleanup function for any subscriptions or timers.
 *    - Use it for API calls (fetching data).
 * 
 * 6. Don'ts:
 *    - Don't update a state variable inside an effect if that variable is also a 
 *      dependency (causes infinite loops).
 *    - Don't use `useEffect` for logic that can be handled during rendering 
 *      (e.g., transforming data based on props).
 *    - Avoid overusing it; sometimes a simple event handler is better than 
 *      synchronizing through an effect.
 * 
 * 7. Common Use Cases:
 *    - API calls (fetching data from a server).
 *    - Subscriptions (WebSockets, Event listeners).
 *    - Timers (setTimeout, setInterval).
 *    - Synchronizing with 3rd party libraries (Leaflet, D3).
 * 
 * 8. State vs. Ordinary Variables:
 *    - React State (useState):
 *      - Persists its value across re-renders.
 *      - Updating state triggers a component re-render.
 *      - Used for data that the UI needs to react to.
 *    - Ordinary Variables (let, const):
 *      - Are re-initialized on every render.
 *      - Changing their value DOES NOT trigger a re-render.
 *      - Used for temporary data/calculations within a single render cycle.
 */

