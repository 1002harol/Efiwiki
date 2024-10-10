import axios from 'axios';

const API_URL = 'https://tu-api.com'; // Reemplaza con la URL de tu API


app.post('/login', async (req, res) => {
  const { username, password, captcha } = req.body;

  // Verifica el token de reCAPTCHA
  const secretKey = 'TU_CLAVE_SECRETA'; // Reemplaza con tu clave secreta
  const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
    params: {
      secret: secretKey,
      response: captcha,
    },
  });

  const { success } = response.data;

  if (!success) {
    return res.status(400).json({ message: 'Captcha no válido' });
  }

});

// Función para iniciar sesión
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });
    
    if (response.status === 200) {
      return response.data; // Devuelve los datos (por ejemplo, token, roles, etc.)
    } else {
      throw new Error('Error en el inicio de sesión');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error de red o servidor');
  }
};

// Función para cambiar contraseña
export const changePassword = async (oldPassword, newPassword) => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  try {
    const response = await axios.put(`${API_URL}/change-password`, {
      oldPassword,
      newPassword,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (response.status === 200) {
      return response.data; // Devuelve cualquier dato necesario
    } else {
      throw new Error('Error al cambiar la contraseña');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error de red o servidor');
  }
};

// Función para registrar un nuevo usuario
export const register = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      password,
    });
    
    if (response.status === 201) {
      return response.data; // Devuelve datos del nuevo usuario o mensaje de éxito
    } else {
      throw new Error('Error al registrar el usuario');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error de red o servidor');
  }
};