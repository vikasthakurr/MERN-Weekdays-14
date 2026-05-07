/**
 * REACT useRef HOOK NOTES
 * 
 * 1. What is useRef?
 *    The `useRef` Hook returns a mutable ref object whose `.current` property is 
 *    initialized with the passed argument (`initialValue`). The returned object 
 *    will persist for the full lifetime of the component.
 * 
 * 2. Why do we use it?
 *    - Direct DOM Access: To interact with a DOM element (e.g., focus an input, 
 *      measure an element's size, integrate with 3rd party DOM libraries).
 *    - Storing Mutable Values: To keep a value that persists between renders 
 *      BUT does NOT trigger a re-render when it changes.
 * 
 * 3. Key Characteristics:
 *    - Changing `ref.current` does NOT trigger a component re-render.
 *    - The value is "remembered" across renders.
 *    - Accessing DOM: `<div ref={myRef}>` automatically sets `myRef.current` to the DOM node.
 * 
 * 4. Implementation Steps:
 *    - Create: `const myRef = useRef(initialValue);`
 *    - Attach (if DOM): `<input ref={myRef} />`
 *    - Access: `console.log(myRef.current.value);`
 * 
 * 5. State vs. Ref:
 *    - React State (useState):
 *      - Updating state TRIGGERS a re-render.
 *      - Use for data that should update the UI.
 *    - React Ref (useRef):
 *      - Updating ref.current DOES NOT trigger a re-render.
 *      - Use for data that doesn't need to be displayed (or for DOM access).
 * 
 * 6. Do's:
 *    - Use for focusing, text selection, or media playback.
 *    - Use for triggering imperative animations.
 *    - Use for storing "previous" props or state values.
 *    - Use for timers/intervals (storing the ID to clear it later).
 * 
 * 7. Don'ts:
 *    - Don't use Refs for anything that can be done declaratively (e.g., instead 
 *      of `ref.current.style.color = 'red'`, use state-driven styling).
 *    - Don't read or write `ref.current` during the rendering phase of a 
 *      component (do it in `useEffect` or event handlers).
 *    - Don't forget that `ref.current` is null initially (until the component mounts).
 * 
 * 8. Common Use Cases:
 *    - `myInputRef.current.focus()`
 *    - `setInterval` and `clearInterval` management.
 *    - Tracking if a component is "mounted".
 *    - Accessing child component methods (via `useImperativeHandle`).
 */
