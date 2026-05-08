// import React from 'react'
import { memo } from "react";

const Child = () => {
  console.log("child called again");
  return <div>Child</div>;
};

export default memo(Child);
