// import React from 'react'

import { createContext } from "react";
import Child1 from "./Child1";

// eslint-disable-next-line react-refresh/only-export-components
export const postman = createContext();

const App = () => {
  let data = {
    fullname: "vikas",
    age: 22,
  };
  return (
    <postman.Provider value={data}>
      <Child1 />
    </postman.Provider>
  );
};

export default App;
