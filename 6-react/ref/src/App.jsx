// import React from 'react'

import { useEffect } from "react";
import { useState, useRef } from "react";

const App = () => {
  const [count, setCount] = useState(0);
  const value = useRef(0);
  const ref1 = useRef();
  // console.log(ref1);

  // console.log(value);
  useEffect(() => {
    ref1.current.style.color = "red";
    ref1.current.style.backgroundColor = "green";
  });

  // let value = 0;
  const handleChange = () => {
    setCount(count + 1);
    // value = value + 1;
    value.current = value.current + 1;
    console.log(value);
    console.log(value.current);
  };
  return (
    <div>
      <h1 ref={ref1}>value of count is:{count}</h1>

      <button onClick={handleChange}>change</button>
    </div>
  );
};

export default App;
