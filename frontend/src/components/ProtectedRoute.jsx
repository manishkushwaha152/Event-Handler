import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const location = useLocation();
  const role = localStorage.getItem("role");

  // 🔑 Tokens alag store kiye gaye
  const userToken = localStorage.getItem("userToken");
  const ownerToken = localStorage.getItem("ownerToken");

  let token = null;
  if (role === "user") token = userToken;
  if (role === "owner") token = ownerToken;

  //  Token missing → redirect to correct login
  if (!token) {
    if (allowedRoles.includes("owner")) {
      return <Navigate to="/owner/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  //  Wrong role → unauthorized
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Access allowed
  return <Outlet />;
};

export default ProtectedRoute;
