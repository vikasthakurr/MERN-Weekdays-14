/**
 * REACT SKELETON LOADING NOTES
 * 
 * 1. What is a Skeleton Screen?
 *    A skeleton screen is a placeholder version of your UI that mimics the layout 
 *    of the content while it's still loading. It provides a visual cue that 
 *    content is coming.
 * 
 * 2. Why do we use Skeleton Screens?
 *    - Better UX: It feels faster than a blank screen or a simple loading spinner.
 *    - Reduced Perceived Wait Time: Users feel progress is being made.
 *    - Prevents Layout Shift: By reserving space for content, it prevents the page 
 *      from "jumping" when the data finally arrives (CLP - Cumulative Layout Shift).
 * 
 * 3. Implementation Methods:
 *    - CSS-based: Using divs with background gradients and shimmer animations.
 *    - Library-based: Using packages like `react-loading-skeleton` or `MUI Skeleton`.
 *    - Component-based: Creating a "Skeleton" version of your actual component.
 * 
 * 4. Key Design Elements:
 *    - Shape: Should match the final content (circles for avatars, rectangles for text).
 *    - Animation: Usually a subtle "shimmer" effect (moving gradient from left to right).
 *    - Color: Neutral, light gray colors that don't distract.
 * 
 * 5. Do's:
 *    - Match the structure of the real content as closely as possible.
 *    - Use subtle animations to indicate the app hasn't frozen.
 *    - Show skeletons for primary content that takes time to fetch.
 * 
 * 6. Don'ts:
 *    - Don't use skeletons for very fast interactions (less than 300ms); the 
 *      flicker can be annoying.
 *    - Don't use vibrant or high-contrast colors.
 *    - Don't make the shimmer animation too fast or distracting.
 * 
 * 7. Skeleton vs. Spinner:
 *    - Spinner: Best for small, quick actions (submitting a form, button loading).
 *    - Skeleton: Best for initial page loads or large content blocks (product lists, profiles).
 * 
 * 8. Lazy Loading & Suspense:
 *    - React.lazy(): A function that lets you render a dynamic import as a 
 *      regular component. This enables "Code Splitting".
 *    - Suspense: A component used to wrap lazy components. It allows you to 
 *      display a fallback UI (like a Skeleton) while the component is loading.
 *    - Usage Example:
 *      const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
 *      
 *      function App() {
 *        return (
 *          <Suspense fallback={<MySkeleton />}>
 *            <HeavyComponent />
 *          </Suspense>
 *        );
 *      }
 *    - Benefit: Reduces the initial bundle size, making the first page load faster.
 */
