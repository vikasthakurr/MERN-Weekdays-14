/**
 *
 * 1. What is Prop Drilling?
 *    - Prop Drilling is the process of passing data (props) from a top-level component
 *      down through several layers of intermediate components to reach a deeply nested component.
 *    - The Problem: The intermediate components don't actually need the data; they are
 *      just acting as "mailmen" to pass it along.
 *    - Visual: Parent -> Child (not needed) -> GrandChild (not needed) -> GreatGrandChild (needed!)
 *
 * 2. What is Lifting State Up?
 *    - In React, data flows down (one-way). If two sibling components need to share the
 *      same data or change the same state, that state must be moved (lifted) to their
 *      closest common parent.
 *    - The parent then passes the state down to both siblings as props.
 *
 * 3. How to Lift State (Step-by-Step)
 *    - Step 1: Identify the components that need the state.
 *    - Step 2: Find their common parent.
 *    - Step 3: Move the `useState` hook into that parent component.
 *    - Step 4: Pass the state value to the components that need to display it.
 *    - Step 5: Pass the state setter function (e.g., `setCount`) to the components that need to update it.
 *
 * 4. Example Code Structure:
 *
 *    // Parent Component
 *    const Parent = () => {
 *      const [message, setMessage] = useState("Hello"); // State is here
 *
 *      return (
 *        <>
 *          <ChildA message={message} />           // Receiving data
 *          <ChildB setMessage={setMessage} />    // Receiving function to change data
 *        </>
 *      );
 *    };
 *
 * 5. When to Avoid Prop Drilling?
 *    - If you find yourself passing a prop through more than 3-4 levels, consider:
 *      a) Component Composition (Passing components as props).
 *      b) React Context API (Global state).
 *      c) State management libraries like Redux or Zustand.
 */

import { useState } from "react";

const DrillingNotes = () => {
  const [data, setData] = useState("Initial Data");

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1 style={{ color: "#2ecc71" }}>Prop Drilling & Lifting State</h1>

      <section
        style={{
          marginBottom: "30px",
          borderLeft: "5px solid #3498db",
          paddingLeft: "15px",
        }}
      >
        <h3>Concepts Explained:</h3>
        <ul>
          <li>
            <strong>Prop Drilling:</strong> Passing data through components that
            don't need it.
          </li>
          <li>
            <strong>Lifting State:</strong> Moving state to the nearest common
            ancestor so siblings can communicate.
          </li>
        </ul>
      </section>

      <div
        style={{
          background: "#2c3e50",
          color: "white",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h4>Live Demo Component:</h4>
        <p>
          Parent State: <strong>{data}</strong>
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          {/* Simulation of Child Components */}
          <button
            onClick={() => setData("Updated by Button A")}
            style={{ cursor: "pointer", padding: "5px 10px" }}
          >
            Update from A
          </button>
          <button
            onClick={() => setData("Updated by Button B")}
            style={{ cursor: "pointer", padding: "5px 10px" }}
          >
            Update from B
          </button>
        </div>
      </div>

      <p style={{ marginTop: "20px", fontStyle: "italic" }}>
        Check the source code comments for the full theoretical notes.
      </p>
    </div>
  );
};

export default DrillingNotes;
