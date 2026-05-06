// import React from 'react'
// import Child2 from "./Child2";

const Child1 = (props) => {
  //   console.log(props);
  const handleChange = (e) => {
    props.setInput(e.target.value);
  };
  return (
    <div>
      {/* <Child2 /> */}
      <input
        onChange={handleChange}
        type="text"
        placeholder="enter username"
      ></input>
    </div>
  );
};

export default Child1;
