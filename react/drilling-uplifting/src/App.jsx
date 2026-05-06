// import React from 'react'
import Child1 from "./Child1";
import { useState } from "react";

const App = () => {
  const [input, setInput] = useState("");
  return (
    <div>
      <Child1 setInput={setInput} input={input} />
      <h1>the value of username coming from child:{input}</h1>
    </div>
  );
};

export default App;
