/**
 * React Props - Study Notes
 * 
 * 1. What are Props?
 *    - "Props" stands for "Properties".
 *    - They are read-only inputs passed from a parent component to a child component.
 *    - Props allow components to be dynamic and reusable by letting them receive different data.
 *    - They are similar to function arguments in JavaScript or attributes in HTML.
 * 
 * 2. Why do we use Props?
 *    - Communication: To pass data from a parent to a child (Uni-directional data flow).
 *    - Reusability: To create a single component template that can display different information (e.g., a 'Button' component with different labels).
 *    - Configuration: To customize the behavior or appearance of a component.
 * 
 * 3. How to Pass Props (Parent Component)
 *    - Props are passed like HTML attributes.
 *    - Example:
 *      <UserProfile name="John Doe" age={25} isAdmin={true} />
 *    - Use curly braces {} to pass non-string values (numbers, booleans, arrays, objects, functions).
 * 
 * 4. How to Handle Props (Child Component)
 *    - Method A: Using the 'props' object
 *      const Child = (props) => {
 *        return <h1>Hello, {props.name}</h1>;
 *      }
 * 
 *    - Method B: Destructuring (Most Common)
 *      const Child = ({ name, age }) => {
 *        return <h1>Hello, {name}. You are {age} years old.</h1>;
 *      }
 * 
 * 5. Important Rules
 *    - Immutability: Props are read-only. A child component should never modify the props it receives.
 *    - One-Way Data Flow: Data travels from Parent -> Child. To pass data back up, you must pass a function as a prop.
 *    - Default Props: You can provide default values if a prop isn't passed.
 *      const Child = ({ name = "Guest" }) => { ... }
 */


const PropsNotes = () => {
  return (
    <div style={{ padding: '20px', lineHeight: '1.6', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#61dafb' }}>React Props (Properties)</h1>
      <p>Check the comments in <code>Notes.jsx</code> for detailed documentation on passing and handling props.</p>
      
      <hr />
      
      <h3>Quick Example:</h3>
      <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
{`// Parent
<Card title="React Pro" price={99} />

// Child
const Card = ({ title, price }) => (
  <div>
    <h2>{title}</h2>
    <p>Price: \${price}</p>
  </div>
);`}
      </pre>
    </div>
  );
};

export default PropsNotes;
