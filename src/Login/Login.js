import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import'./StylesL/Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials.username, credentials.password);
      // Redirige al usuario a la aplicación principal después del login
      navigate('/app');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container ">
    <form  className="login-form" onSubmit={handleSubmit}>
      <h2> Efiwiki</h2>
      <label>
        Usuario:
        <input
          type="text"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          required
        />
      </label>
      <label>
        Contraseña:
        <input
          type="password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          required
        />
      </label>
      <button className="login-form button" type="submit">Iniciar Sesión</button>
      {error && <div className="error">{error}</div>}
    </form>
    </div>
  );
};

export default Login;