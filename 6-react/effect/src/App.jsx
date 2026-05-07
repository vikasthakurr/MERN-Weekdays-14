import { useEffect, useState } from "react";
const App = () => {
  console.log("value rendered");
  const [count, setCount] = useState(0);
  // useEffect(() => {
  //   console.log("first");
  // }, []);
  // useLayoutEffect(() => {}, []);
  useEffect(() => {
    console.log("component mounted");
  });

  useEffect(() => {
    console.log("component updated");
  }, [count]);

  useEffect(() => {
    // console.log("component unmounted");
    return () => {
      console.log("component unmounted");
    };
  }, []);

  const handleChange = () => {
    setCount(count + 1);
  };
  return (
    <div>
      <h1>App</h1>
      <h2>{count}</h2>
      <button onClick={handleChange}>change</button>
    </div>
  );
};

export default App;
