/**
 * React.js Study Notes
 * 
 * 1. History of React
 *    - Created by Jordan Walke, a software engineer at Facebook.
 *    - Initially released in 2013 (open-sourced at JSConf US).
 *    - Inspired by XHP (an HTML component library for PHP).
 *    - Created to solve the problem of complex UI updates in Facebook's news feed and Instagram's web interface.
 *    - Evolution: Class Components -> Functional Components -> React Hooks (v16.8) -> Server Components.
 * 
 * 2. Introduction to Folder Structure (Vite/React)
 *    - node_modules/: Contains all the project dependencies installed via npm/yarn.
 *    - public/: Contains static assets like favicons or files that don't need processing by the build tool.
 *    - src/: The main source directory where the code lives.
 *        - assets/: Images, fonts, and global styles.
 *        - components/: Small, reusable UI blocks (Buttons, Inputs, Navbar).
 *        - pages/screens/: Larger components that represent a full view or route (Home, Profile, Login).
 *        - App.jsx: The root component of the application.
 *        - main.jsx: The entry point that renders the App into the HTML DOM.
 *    - package.json: Lists dependencies, scripts, and project metadata.
 *    - vite.config.js / tailwind.config.js: Configuration files for the build tools and styling.
 * 
 * 3. Components, Screens, and Pages
 *    - Components: The building blocks of a React app. They are small, focused, and reusable pieces of UI.
 *    - Pages: Components that represent a specific URL or route in the application (e.g., 'Contact Us' page).
 *    - Screens: Often used interchangeably with 'Pages', but common in mobile development (React Native) to represent a full screen of content.
 *    - Hierarchy: A Page/Screen is composed of multiple Components.
 * 
 * 4. The Role of a Component
 *    - Reusability: Write once, use everywhere (DRY principle).
 *    - Encapsulation: Each component manages its own logic, state, and styles.
 *    - Composability: Components can be nested inside other components to build complex UIs.
 *    - State & Props: 
 *        - Props (Properties): Data passed from a parent to a child (read-only).
 *        - State: Data managed within the component that can change over time, triggering a re-render.
 *    - Declarative UI: You describe *what* the UI should look like for a given state, and React handles *how* to update the DOM.
 */


const Notes = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>React Fundamentals</h1>
      <p>Check the source code comments for detailed notes on React history, structure, and components.</p>
    </div>
  );
};

export default Notes;
