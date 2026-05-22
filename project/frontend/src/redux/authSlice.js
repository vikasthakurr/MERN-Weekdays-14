import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null, // { name, email, role, avatar }
  },
  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload;
      // Persist token for Bearer auth on API calls
      if (action.payload.token) {
        localStorage.setItem("token", action.payload.token);
      }
    },
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem("token");
    },
    updateUser: (state, action) => {
      if (state.user) state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { loginUser, logoutUser, updateUser } = authSlice.actions;

export const selectUser      = (state) => state.auth.user;
export const selectIsLoggedIn = (state) => !!state.auth.user;
export const selectIsAdmin   = (state) => state.auth.user?.role === "admin";

export default authSlice.reducer;
