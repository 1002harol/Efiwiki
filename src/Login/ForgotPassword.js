import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleChangePassword = (e) => {
    e.preventDefault();
    // Aquí puedes implementar la lógica para cambiar la contraseña
    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    console.log('Cambio de contraseña exitoso');
    // Después de cambiar la contraseña exitosamente, redirige al login
    navigate('/login');
  };

  return (
    <div className="login-container">
      <form 
        onSubmit={handleChangePassword} 
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Cambiar Contraseña</h2>
        
        <div className="form-group mb-4">
          <label 
            htmlFor="current-password" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Contraseña Actual
          </label>
          <input
            type="password"
            id="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        <div className="form-group mb-4">
          <label 
            htmlFor="new-password" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nueva Contraseña
          </label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        <div className="form-group mb-4">
          <label 
            htmlFor="confirm-password" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirmar Nueva Contraseña
          </label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-[#00aaff] text-white font-bold py-2 rounded transition duration-300 hover:bg-[#a1cc5c]"
        >
          Cambiar Contraseña
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;