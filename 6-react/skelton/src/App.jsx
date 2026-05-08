// import React from 'react'

import { useState } from "react";
import { lazy, Suspense } from "react";
// import Card from "./Card";
// import Skelton from "./Skelton";
const Home = lazy(() => import("./Home"));

const Card = lazy(() => import("./Card"));
const Skelton = lazy(() => import("./Skelton"));

import { useEffect } from "react";

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 4000);
  }, []);

  return (
    <>
      <div>{loading ? <Skelton /> : <Card />}</div>;
      <Suspense fallback={<div>Loading...</div>}>
        <Home />
      </Suspense>
    </>
  );
};

export default App;
