import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, admin = false }) => {
  const { user } = useAuth();

  if (!user) {
    // Redirige a la página de login si no está autenticado
    return <Navigate to="/" />;
  }

  if (admin && user.role !== 'admin') {
    // Redirige a la aplicación principal si el usuario no es admin
    return <Navigate to="/app" />;
  }

  return children;
};

export default ProtectedRoute;