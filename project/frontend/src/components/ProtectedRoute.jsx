import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn, selectIsAdmin } from "../redux/authSlice";

export const PrivateRoute = ({ children }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const location   = useLocation();
  if (!isLoggedIn) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

export const AdminRoute = ({ children }) => {
  const isAdmin = useSelector(selectIsAdmin);
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};
