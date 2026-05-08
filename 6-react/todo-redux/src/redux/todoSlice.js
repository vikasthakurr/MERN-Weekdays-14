import { createSlice, nanoid } from "@reduxjs/toolkit";

export const todoSlice = createSlice({
  name: "todos",
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      const newTodo = {
        id: nanoid(),
        text: action.payload.text,
        isCompleted: false,
      };
      state.push(newTodo);
    },
    //TODO
    removeTodo: () => {},
    //TODO
    editTodo: () => {},
    deleteAll: () => {
      return [];
    },
  },
});

export const { addTodo, removeTodo, editTodo, deleteAll } = todoSlice.actions;

export default todoSlice.reducer;
