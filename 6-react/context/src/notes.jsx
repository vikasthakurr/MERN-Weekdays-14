/**
 * REACT CONTEXT API NOTES
 * 
 * 1. What is Context API?
 *    Context provides a way to pass data through the component tree without having to 
 *    pass props down manually at every level (Prop Drilling).
 * 
 * 2. Why do we use it?
 *    - To solve "Prop Drilling": Passing props through components that don't need them 
 *      just to reach a deeply nested child.
 *    - To share "Global" data: Themes, Current User Info, Language/Locale, UI state (Sidebar open/close).
 * 
 * 3. Core Components of Context API:
 *    a. createContext(): Creates the context object.
 *    b. Provider: A component that wraps the part of the tree where data is needed. 
 *       It accepts a `value` prop.
 *    c. useContext(): A hook to consume the data in any functional component.
 * 
 * 4. Implementation Steps:
 *    - Create: const MyContext = React.createContext();
 *    - Provide: <MyContext.Provider value={data}> ...children </MyContext.Provider>
 *    - Consume: const data = useContext(MyContext);
 * 
 * 5. Do's:
 *    - Use for data that is truly "Global" or "App-wide".
 *    - Keep Contexts small and specialized (e.g., AuthContext, ThemeContext) rather than 
 *      one giant context for everything.
 *    - Wrap only the parts of the app that actually need the data.
 * 
 * 6. Don'ts:
 *    - Don't use Context just to avoid passing props down 1 or 2 levels.
 *    - Don't use Context for high-frequency updates (like mouse coordinates or 
 *      rapid text input) because it triggers a re-render for all consumers.
 *    - Don't forget to provide a default value in `createContext()` if needed for testing.
 * 
 * 7. Context vs. Redux:
 *    - Context is built-in, great for simple global state.
 *    - Redux is an external library, better for complex state logic, middleware, 
 *      and large-scale applications with frequent state changes.
 */

