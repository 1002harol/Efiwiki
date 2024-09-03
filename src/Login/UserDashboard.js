
import React from 'react';
import { useAuth } from './AuthContext';
// import './stylesP/UserDashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="user-dashboard">
      <h1>Panel de Usuario</h1>
      <p>Bienvenido, {user.username}</p>
      {/* Agrega aquí la funcionalidad que los usuarios normales pueden realizar */}
      <p>Aquí solo puedes ver los problemas, no modificar.</p>
    </div>
  );
};

export default UserDashboard;