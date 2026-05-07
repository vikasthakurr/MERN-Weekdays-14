import Custom from "./Custom";
const App = () => {
  const [data] = Custom("https://dummyjson.com/products");
  console.log(data);
  return <div></div>;
};

export default App;
