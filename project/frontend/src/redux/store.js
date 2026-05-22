import { configureStore, combineReducers } from "@reduxjs/toolkit";

import { persistStore, persistReducer } from "redux-persist";
import cartReducer  from "./cartSlice";
import authReducer  from "./authSlice";
import themeReducer from "./themeSlice";

// Direct localStorage storage engine (avoids ESM resolution issues with redux-persist/lib/storage)
const localStorageEngine = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
};

const persistConfig = {
  key: "root",
  storage: localStorageEngine,
  whitelist: ["cart", "auth", "theme"],
};

const rootReducer = combineReducers({
  cart:  cartReducer,
  auth:  authReducer,
  theme: themeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist dispatches non-serializable actions internally
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
