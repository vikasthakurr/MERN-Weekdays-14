// import React from 'react'

import { useContext } from "react";
import { postman } from "./App";

const Child2 = () => {
  let value = useContext(postman);
  console.log(value);
  return <div>Child2</div>;
};

export default Child2;
