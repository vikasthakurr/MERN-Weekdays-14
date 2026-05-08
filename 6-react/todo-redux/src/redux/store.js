import { configureStore } from "@reduxjs/toolkit";
import todoSlice from "../redux/todoSlice.js";

export const store = configureStore({
  reducer: {
    todos: todoSlice,
  },
});
