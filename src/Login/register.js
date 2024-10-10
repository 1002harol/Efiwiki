import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Aquí implementas la lógica para registrar al usuario
    console.log('Registro exitoso');
    // Después del registro exitoso, redirige al login
    navigate('/login');
  };

  return (
    <div className="login-container">
      <form onSubmit={handleRegister}
        className="bg-white p-8 rounded shadow-md w-96"
      > 
        <h2 className="text-2xl font-bold mb-6 text-center">Registrarse</h2>
        <div className="form-group  mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre de Usuario</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
             className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="form-group mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <button 
          type="submit"
          className=" w-full bg-[#00aaff] text-white font-bold py-2 rounded transition duration-300 hover:bg-[#a1cc5c]"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Register;