import { useSelector } from "react-redux";

const ViewTodo = () => {
  const todo = useSelector((state) => state.todos);
  console.log(todo);
  return <div>ViewTodo</div>;
};

export default ViewTodo;
