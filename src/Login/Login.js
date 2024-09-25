
// import React, { useState, useEffect } from 'react';
// import { useAuth } from './AuthContext';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './StylesL/Login.css';
// import { login } from './api/authService';

// const Login = () => {
//   const [credentials, setCredentials] = useState({ username: '', password: '' });
//   const [error, setError] = useState(null);
//   const [rememberMe, setRememberMe] = useState(false);
//   const { setUser } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     if (user) {
//       const from = location.state?.from?.pathname || '/';
//       navigate(from, { replace: true });
//     }
//   }, [user, navigate, location]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const userData = await login(credentials.username, credentials.password);
//       setUser(userData);
//       if (rememberMe) {
//         localStorage.setItem('user', JSON.stringify(userData));
//       }
//       const from = location.state?.from?.pathname || '/';
//       navigate(from, { replace: true });
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="login-container">
//       <form className="login-form" onSubmit={handleSubmit}>
//         <h2>Efiwiki</h2>
//         <label>
//           Usuario:
//           <input
//             type="text"
//             value={credentials.username}
//             onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
//             required
//           />
//         </label>
//         <label>
//           Contraseña:
//           <input
//             type="password"
//             value={credentials.password}
//             onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
//             required
//           />
//         </label>
//         <label>
//           <input
//             type="checkbox"
//             checked={rememberMe}
//             onChange={(e) => setRememberMe(e.target.checked)}
//           />
//           Recordarme
//         </label>
//         <button className="login-form button" type="submit">
//           Iniciar Sesión
//         </button>
//         {error && <div className="error">{error}</div>}
//       </form>
//     </div>
//   );
// };

// export default Login;



import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import'./StylesL/Login.css';


const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [rememberMe,setRememberMe] =useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation ();

   useEffect(() => {
    if(user){
      const from = location.state?.from?.pathname || '/';
      navigate(from, {replace : true});
    }
   }, [user, navigate , location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      login(credentials.username, credentials.password, rememberMe); // constanete que dependiendo si el usuario le da recordarme lo dejara dezplasarse entre rutas sin volver a pedir el login de lo contrario si//
      // Redirige al usuario a la aplicación principal después del login
      // navigate('/');
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
      <div className="remember-me-container ">
          <label className="remember-me-label flex items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className="text-sm">Recordarme</span>
          </label>
        </div>
      <button className="login-form button" type="submit">Iniciar Sesión</button>

      {error && <div className="error">{error}</div>}
    </form>
    </div>
  );
};

export default Login;