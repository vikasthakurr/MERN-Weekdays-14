/**
 * REACT MEMOIZATION NOTES (useMemo, useCallback, React.memo)
 * 
 * 1. What is Memoization?
 *    Memoization is an optimization technique that caches the results of expensive 
 *    function calls and returns the cached result when the same inputs occur again.
 * 
 * 2. React.memo (Higher Order Component)
 *    - Purpose: Prevents a functional component from re-rendering if its PROPS 
 *      haven't changed.
 *    - Usage: `const MemoizedChild = React.memo(ChildComponent);`
 *    - Best for: Pure components that render often with the same props.
 * 
 * 3. useMemo (Hook)
 *    - Purpose: Memoizes the RESULT of a calculation/function.
 *    - Usage: `const result = useMemo(() => expensiveTask(a, b), [a, b]);`
 *    - When to use: When you have expensive calculations that you don't want 
 *      to re-run on every render unless specific dependencies change.
 * 
 * 4. useCallback (Hook)
 *    - Purpose: Memoizes the FUNCTION definition itself.
 *    - Usage: `const handler = useCallback(() => { ... }, [deps]);`
 *    - When to use: To prevent function recreation on every render, especially 
 *      when passing functions as props to `React.memo` child components (which 
 *      would otherwise see a "new" function and re-render).
 * 
 * 5. useMemo vs useCallback:
 *    - `useMemo`: Returns the VALUE returned by the function.
 *    - `useCallback`: Returns the FUNCTION itself.
 *    - `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`.
 * 
 * 6. Do's:
 *    - Use memoization for heavy computations (e.g., sorting large arrays).
 *    - Use `useCallback` when passing functions to memoized children.
 *    - Profile your app to ensure memoization actually improves performance.
 * 
 * 7. Don'ts:
 *    - Don't memoize everything! It adds overhead (memory for cache, dependency checks).
 *    - Don't use it for cheap operations (like simple math or string concatenation).
 *    - Don't forget the dependency array, or you might get stale data.
 * 
 * 8. Summary Checklist:
 *    - Need to prevent component re-render? -> `React.memo`
 *    - Need to cache an expensive value? -> `useMemo`
 *    - Need to keep a function reference stable? -> `useCallback`
 */
