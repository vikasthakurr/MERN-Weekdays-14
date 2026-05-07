// import React from 'react'
import Nav from "./Nav";
import Home from "./Home";
import Contact from "./Contact";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
};

export default App;
