import axios from 'axios';
import DOMPurify from 'dompurify';
// import sanitizeHtml from 'sanitize-html';


const API_BASE_URL = 'http://localhost:8000/api';

// let csrfToken = null;

// Función para sanitizar datos frontend
const sanitizeData = (data) => {
  if (typeof data === 'object' && data !== null) {
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'string') {
        data[key] = DOMPurify.sanitize(data[key]);
      } else if (typeof data[key] === 'object') {
        sanitizeData(data[key]);
      }
    });
  }
  return data;
};
// // Función para sanitizar datos (servidor)
// const serverSanitizeData = (data) => {
//   if (typeof data === 'string') {
//     return sanitizeHtml(data, {
//       allowedTags: ['b', 'i', 'em', 'strong', 'a'],
//       allowedAttributes: {
//         'a': ['href']
//       }
//     });
//   }
//   if (typeof data === 'object' && data !== null) {
//     Object.keys(data).forEach(key => {
//       data[key] = serverSanitizeData(data[key]);
//     });
//   }
//   return data;
// };


// Función para obtener el token CSRF
// const fetchCsrfToken = async () => {
//   if (!csrfToken) {
//     const response = await axios.get(`${API_BASE_URL}/csrf-token`);
//     csrfToken = response.data.csrfToken;
//   }
//   return csrfToken;
// };


// // Configurar interceptor de Axios para sanitizar datos antes de enviar
// axios.interceptors.request.use(async (config) => {
//   if (!csrfToken) {
//     csrfToken = await fetchCsrfToken();
//   }
//   config.headers['X-CSRF-Token'] = csrfToken;
  
//   if (config.data) {
//     config.data = sanitizeData(config.data);
//     config.data = serverSanitizeData(config.data);
//   }
//   return config;
// });

 export const fetchProblems = async (selectedApp) => {
  try {
    if (!selectedApp) {
      throw new Error('Debes seleccionar una aplicación');
    }
    
    const response = await axios.get(`${API_BASE_URL}/problems?aplicacion=${encodeURIComponent(selectedApp)}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener problemas:', error);
    throw error;
  }
};

export const addProblem = async (problemData) => {
  try {
    const sanitizedData = sanitizeData(problemData);
    const response = await axios.post(`${API_BASE_URL}/problems`, sanitizedData);
    return response.data;
  } catch (error) {
    console.error('Error al agregar el problema:', error);
    throw error;
  }
};

export const updateProblem = async (id, problemData) => {
  try {
    // Eliminar el id del cuerpo de la solicitud si está presente
    const { id:_,activo:__, ...dataToSend } = problemData;

    const response = await axios.put(`${API_BASE_URL}/problems/${id}`, dataToSend, {
      headers: {
        'Content-Type': 'application/json'
      }
    });


    console.log('Respuesta completa del servidor:', response);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el problema:', error);
  }
};

export const deleteProblem = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/problems/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el problema:', error);
    throw  error;
  }
};

export const fetchHtmlContent = async () => {
  try {
    const response = await fetch('/FQA.html', {
      method: 'GET',
      headers: {
        'Content-Type': 'text/html',
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const content = await response.text();
    return content;
  } catch (err) {
    console.error('Error al cargar el contenido HTML:', err);
    throw new Error('Error al cargar el contenido HTML. Por favor, intenta de nuevo más tarde.');
  }
};





