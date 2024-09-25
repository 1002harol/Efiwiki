
import React from "react";
import { Navigate,useLocation } from "react-router-dom";
import { useAuth } from "./Login/AuthContext";

const PrivateRoute = ({ element, roles }) => {
    const { user } = useAuth();
    const location = useLocation();
  
  
    if (!user) {
      return <Navigate to="/login" state={{ from: location}} replace/>;
    }
  
    if (roles && !roles.includes(user.role)) {
      return <Navigate to="/" replace/>;
    }
  
    return element;
  };
  export default PrivateRoute;
  