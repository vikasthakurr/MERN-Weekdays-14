import { useState } from "react";
// console.log(useState);
const App = () => {
  const [count, setCount] = useState(0);

  // let count = 0;
  function increase() {
    setCount(count + 1);
    console.log(count);
  }
  // const btn = document.getElementById("btn");
  // console.log(btn);
  // btn.addEventListener("click", () => {
  //   console.log("btn cliked");
  // });
  return (
    <div>
      <h1>the value of count is:{count}</h1>
      <button id="btn" onClick={increase}>
        Increase
      </button>
    </div>
  );
};
export default App;
