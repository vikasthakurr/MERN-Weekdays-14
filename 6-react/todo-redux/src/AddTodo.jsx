import { useDispatch } from "react-redux";
import { addTodo } from "./redux/todoSlice";
import { useState } from "react";
const AddTodo = () => {
  const dispatch = useDispatch();
  const [inputText, setInputText] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (inputText == "") return;
    dispatch(addTodo({ text: inputText }));
  };
  return (
    <div>
      <input
        placeholder="enter task"
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
};

export default AddTodo;
