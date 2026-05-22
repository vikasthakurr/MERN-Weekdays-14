import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store.js";
import { SearchProvider } from "./context/Searchcontext.jsx";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      {/* PersistGate delays render until rehydration from localStorage is complete */}
      <PersistGate loading={null} persistor={persistor}>
        <SearchProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              style: { borderRadius: "16px", fontWeight: 700, fontSize: "13px" },
              success: { iconTheme: { primary: "#000", secondary: "#fff" } },
            }}
          />
        </SearchProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
