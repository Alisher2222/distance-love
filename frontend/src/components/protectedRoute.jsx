import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const isAuthorized = useSelector((state) => state.auth.isAuthorized);

  return isAuthorized ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
