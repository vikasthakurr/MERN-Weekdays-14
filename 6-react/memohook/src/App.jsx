import { useState, useMemo } from "react";
import Child from "./Child";
const App = () => {
  const [count, setCount] = useState(0);
  const [count1, setCount1] = useState(0);
  const handleClick = () => {
    setCount(count + 1);
  };

  const handleClick2 = () => {
    setCount1(count1 + 1);
  };
  function sum() {
    console.log("function called again");
    let total = 0;
    for (let i = 0; i < 1000000000; i++) {
      total += i;
    }
    return total;
  }
  let result = useMemo(() => sum(), []);

  function sayHi() {
    console.log("hi");
  }
  // let result1 = sayHi();
  return (
    <div>
      <h2>the value of sum is :{result}</h2>

      <h1>the value of count is:{count}</h1>
      <button onClick={handleClick}>increase {count}</button>
      <p>{count}</p>

      <br />
      <br />

      <button onClick={handleClick2}>Increase of child</button>
      <h2>value of count in child:{count1}</h2>
      <Child count1={count1} sayHi={sayHi} />
    </div>
  );
};

export default App;
