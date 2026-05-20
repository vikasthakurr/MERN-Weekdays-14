import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./components/ProtectedRoute";

// Layouts
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import { Footer } from "./pages/Home";

// User pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Categories from "./pages/Categories";
import ProductDetail from "./pages/ProductDetail";
import AdminPage from "./admin/AdminPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin — standalone, no Navbar/Footer */}
        <Route path="/admin/*" element={<AdminPage />} />

        <Route
          path="/*"
          element={
            <div className="min-h-screen bg-[#F6F6F6] text-[#1A1A1A] font-sans flex flex-col">
              <Navbar />
              <main className="flex-grow pb-16 lg:pb-0">
                <Routes>
                  <Route path="/"                     element={<Home />} />
                  <Route path="/login"                element={<Login />} />
                  <Route path="/signup"               element={<Signup />} />
                  <Route path="/profile"              element={<PrivateRoute><Profile /></PrivateRoute>} />
                  <Route path="/cart"                 element={<PrivateRoute><Cart /></PrivateRoute>} />
                  <Route path="/orders"               element={<PrivateRoute><Orders /></PrivateRoute>} />
                  <Route path="/categories"           element={<Categories />} />
                  <Route path="/categories/:category" element={<Categories />} />
                  <Route path="/product/:id"          element={<ProductDetail />} />
                </Routes>
              </main>
              <Footer />
              <BottomNav />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
