import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Login from "../pages/Login";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Login />;
  }

  return children;
};

export default ProtectedRoute;
