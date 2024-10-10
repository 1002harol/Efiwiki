// import React, { useState, useEffect } from 'react';
// import { useAuth } from './AuthContext';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './StylesL/Login.css';

// const Login = () => {
//   const [credentials, setCredentials] = useState({ username: '', password: '' });
//   const [error, setError] = useState(null);
//   const [rememberMe, setRememberMe] = useState(false);
//   const { login, user } = useAuth();
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
//       // Llamada a la API de inicio de sesión en el backend
//       const response = await fetch('http://localhost:3000/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(credentials),
//       });

//       if (!response.ok) {
//         throw new Error('Credenciales inválidas');
//       }

//       const data = await response.json();
//       login(data.token, rememberMe); // Aquí pasamos el token JWT devuelto por el backend
//       navigate('/');
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
//         <div className="remember-me-container">
//           <label className="remember-me-label flex items-center">
//             <input
//               type="checkbox"
//               className="form-checkbox"
//               checked={rememberMe}
//               onChange={(e) => setRememberMe(e.target.checked)}
//             />
//             <span className="text-sm">Recordarme</span>
//           </label>
//         </div>
//         <button className="login-form button" type="submit">
//           Iniciar Sesión
//         </button>
//         {error && <div className="error">{error}</div>}
//       </form>
//     </div>
//   );
// };

// export default Login;


import React, { useState, useEffect ,useCallback} from 'react';
import { useAuth } from './AuthContext';
import {useLocation, useNavigate, } from 'react-router-dom';
import'./StylesL/Login.css';
import{ motion }  from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [rememberMe,setRememberMe] =useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation ();
  const recaptchaRef = React.createRef(); 

  
   useEffect(() => {
    if(user){
      const from = location.state?.from?.pathname || '/';
      navigate(from, {replace : true});
    }
   }, [user, navigate , location]);


   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await recaptchaRef.current.executeAsync();
      await login(credentials.username, credentials.password, rememberMe, token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error en la verificación del reCAPTCHA. Intenta de nuevo.');
    }
  };


  const toggleRememberMe = useCallback(() => {
    setRememberMe(prev => !prev);
  }, []);


  const handleRegister = (e) => {
    e.preventDefault();
    navigate('/register');
  }

  const handleForgotPassword = (e) => {
    e.preventDefault();
    navigate('/forgot-password');
  }
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
      
      <div className="flex justify-between items-center mb-4">
          <button
            className="text-red-500 font-bold transition duration-300 hover:text-red-600 transform hover:-translate-y-1 active:text-red-700 active:translate-y-0 underline"
            onClick={handleForgotPassword}
          >
            ¿Olvidé mi contraseña?
          </button>
          <div className="flex items-center space-x-3 cursor-pointer" onClick={toggleRememberMe}>
            <div className="relative">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: rememberMe ? '#3B82F6' : '#E5E7EB',
                }}
                className="w-14 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out"
              >
                <motion.div
                  initial={false}
                  animate={{
                    x: rememberMe ? 24 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-6 h-6 bg-white rounded-full shadow-md"
                />
              </motion.div>
            </div>
            <span className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200">
              Recordarme
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center mb-4">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6LfFzlsqAAAAAEf69UQr0T_AbCE6hE4KxsBRYL34"
            size="invisible"
          />
        </div>

        <button
         className="login-form button" 
         type="submit"
         >
          Iniciar Sesión
        </button>

        {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}

        <div className="mt-6 text-center ">
        <button
            className="text-[#a1cc5c] font-bold transition duration-300 hover:text-[#a1cc5c] transform hover:-translate-y-1 active:text-[#a1cc5c] active:translate-y-0 underline"
            onClick={handleRegister}
          >
            Registrate
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;