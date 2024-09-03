import axios from 'axios';

const API_URL = 'https://tu-api.com/login'; // Reemplaza con la URL de tu API

/**
 * Envía una solicitud de inicio de sesión a la API.
 * @param {string} username - El nombre de usuario del cliente.
 * @param {string} password - La contraseña del cliente.
 * @returns {Promise} - Una promesa que resuelve con los datos de la respuesta de la API.
 * @throws {Error} - Si la solicitud falla o la respuesta indica un error.
 */
export const login = async (username, password) => {
  try {
    const response = await axios.post(API_URL, {
      username,
      password,
    });

    // Verifica si la respuesta fue exitosa
    if (response.status === 200) {
      return response.data; // Devuelve los datos (por ejemplo, token, roles, etc.)
    } else {
      throw new Error('Error en el inicio de sesión');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error de red o servidor');
  }
};