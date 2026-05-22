import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store.js";
import { SearchProvider } from "./context/Searchcontext.jsx";
import { selectDark } from "./redux/themeSlice.js";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App.jsx";

// Syncs the Redux dark state to the <html> class after rehydration
function ThemeSync() {
  const dark = useSelector(selectDark);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return null;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SearchProvider>
          <ThemeSync />
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
