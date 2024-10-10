
// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "./Login/AuthContext";

// const PrivateRoute = ({ element, roles }) => {
//   const { user, logout } = useAuth();
//   const location = useLocation();

//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   const token = JSON.parse(localStorage.getItem('authTokens') || sessionStorage.getItem('authTokens'));
//   if (token) {
//     const accessPayload = JSON.parse(atob(token.accessToken.split('.')[1]));
//     const currentTime = Math.floor(Date.now() / 1000);
//     if (accessPayload.exp <= currentTime) {
//       logout();
//       return <Navigate to="/login" state={{ from: location }} replace />;
//     }
//   }

//   if (roles && !roles.includes(user.role)) {
//     return <Navigate to="/" replace />;
//   }

//   return element;
// };

// export default PrivateRoute;

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
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
  