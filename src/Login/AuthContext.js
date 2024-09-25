
import React,{ createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

 // Función para generar un token simulado en formato JWT
  const generateToken = (username, role) => {
    // Generar un token JWT válido
    const payload = {
      username,
      role,
      exp: Math.floor(Date.now() / 1000) + 4 * 60 * 60, // Expiración de 8 horas
    };
    return `header.${btoa(JSON.stringify(payload))}.signature`; // Token simulado
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica el token
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp > currentTime) {
          setUser({ username: payload.username, role: payload.role });
        } else {
          console.log('Token expirado');
          localStorage.removeItem('authToken');
          sessionStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('Error al leer el token: ' + error);
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
      }
    }
  }, []);

  const login = (username, password, rememberMe) => {
    // Simula autenticación y guarda el usuario con el rol adecuado
   let role = null;
   if(username === 'admin' && password === '1234') {
    role = 'admin';
   }else if (username === 'user' && password === '123'){
    role = 'user';
   }else{
     throw new Error ('Credenciales invalidas');
   }
    
    const token = generateToken(username,role);
    setUser({ username , role});

    if(rememberMe){
      localStorage.setItem('authToken', token);
    }else{
      sessionStorage.setItem('authToken',token);
    }
    console.log('usuario autenticado',{username , role})
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  };



  return (
    <AuthContext.Provider value={{ user,  login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

