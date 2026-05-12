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
    removeTodo: (state, action) => {
      return state.filter((todo) => todo.id !== action.payload.id);
    },
    //TODO
    editTodo: (state, action) => {
      const { id, text } = action.payload;
      const todo = state.find((todo) => todo.id === id);
      if (todo) {
        todo.text = text;
      }
    },
    deleteAll: () => {
      return [];
    },
  },
});

export const { addTodo, removeTodo, editTodo, deleteAll } = todoSlice.actions;

export default todoSlice.reducer;
