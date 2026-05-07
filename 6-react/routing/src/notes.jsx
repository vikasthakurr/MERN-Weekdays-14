/**
 * REACT ROUTER DOM NOTES
 * 
 * 1. What is React Router?
 *    React Router is the standard library for routing in React. It enables 
 *    navigation between different components in a Single Page Application (SPA) 
 *    without refreshing the page.
 * 
 * 2. Why do we use it?
 *    - To create multi-page feel in a Single Page App.
 *    - To keep the UI in sync with the URL.
 *    - To handle bookmarking and browser history (back/forward buttons).
 * 
 * 3. Core Components:
 *    - BrowserRouter: The parent component that stores the routing history. 
 *      (Usually wraps the entire App in `main.jsx`).
 *    - Routes: A container for all your individual `Route` definitions.
 *    - Route: Defines a mapping between a `path` and a `component` (element).
 *    - Link: Used to navigate to different routes. Similar to `<a>` but 
 *      prevents page refresh.
 *    - NavLink: A special version of `Link` that adds an "active" class to 
 *      the element when the route matches.
 * 
 * 4. Important Hooks:
 *    - useNavigate(): Returns a function that lets you navigate programmatically 
 *      (e.g., `navigate('/home')` after a form submit).
 *    - useParams(): Lets you access dynamic parameters from the URL 
 *      (e.g., matching `/profile/:id`).
 *    - useLocation(): Returns the current location object (contains path, search params, etc.).
 */