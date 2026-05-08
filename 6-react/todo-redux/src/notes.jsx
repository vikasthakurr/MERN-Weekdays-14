/**
 * REDUX & REDUX TOOLKIT (RTK) NOTES
 * 
 * 1. What is Redux?
 *    Redux is a pattern and library for managing and updating application state, 
 *    using events called "actions". It serves as a centralized store for state 
 *    that needs to be used across your entire application.
 * 
 * 2. Why do we use Redux?
 *    - Centralized State: One single "Source of Truth" for the whole app.
 *    - Predictability: State changes are predictable (Actions -> Reducers -> New State).
 *    - Debugging: Excellent developer tools (Redux DevTools) to track every state change.
 *    - Ease of Maintenance: Makes it easier to manage state in large, complex apps.
 * 
 * 3. Core Concepts:
 *    - Store: The object that holds the application state.
 *    - Action: A plain JavaScript object that describes what happened (has a `type` and `payload`).
 *    - Reducer: A function that takes current state and an action, and returns the new state.
 *    - Dispatch: The process of sending an action to the store to trigger a state update.
 * 
 * 4. Redux Toolkit (RTK) Implementation:
 *    Modern Redux uses RTK to reduce boilerplate.
 *    - configureStore(): Simplifies store setup and automatically adds middleware.
 *    - createSlice(): A function that accepts an initial state, an object of 
 *      reducer functions, and a "slice name", and automatically generates 
 *      action creators and action types.
 * 
 * 5. Important Hooks (React-Redux):
 *    - useSelector(): To extract data from the Redux store state.
 *    - useDispatch(): To get the dispatch function to send actions to the store.
 * 
 * 6. Implementation Steps:
 *    1. Setup Store: Using `configureStore`.
 *    2. Create Slices: Using `createSlice` for different features (e.g., auth, cart, todos).
 *    3. Provide Store: Wrap the `<App />` with `<Provider store={store}>` in `main.jsx`.
 *    4. Use in Components: Access state with `useSelector` and update with `useDispatch`.
 * 
 * 7. Do's:
 *    - Use Redux for data that is needed in many parts of the app.
 *    - Keep your state "serializable" (plain objects, arrays, primitives).
 *    - Use Redux Toolkit (RTK) for all modern Redux projects.
 * 
 * 8. Don'ts:
 *    - Don't put everything in Redux! Keep local state (like form inputs or 
 *      UI toggles) inside the component using `useState`.
 *    - Don't mutate state directly (RTK's `createSlice` uses Immer internally, 
 *      which allows "mutative" code that is safely converted to immutable updates).
 * 
 * 9. Redux vs Context API:
 *    - Context API: Built-in, great for low-frequency updates (themes, auth).
 *    - Redux: External library, better for high-frequency updates, complex logic, 
 *      and large-scale state management with powerful debugging.
 */
