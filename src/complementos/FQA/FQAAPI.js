import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

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
    const response = await axios.post(`${API_BASE_URL}/problems`, problemData);
    return response.data;
  } catch (error) {
    console.error('Error al agregar el problema:', error);
    throw new Error('Error al agregar el problema. Por favor, intenta de nuevo.');
  }
};

export const updateProblem = async (id, problemData) => {
  try {
    // Eliminar el id del cuerpo de la solicitud si está presente
    const { id:_,activo:__, ...dataToSend } = problemData;

    // console.log(`Enviando solicitud PUT a ${API_BASE_URL}/problems/${id}`);
    // console.log('Datos enviados:', dataToSend);

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
    throw new Error('Error al eliminar el problema. Por favor, intenta de nuevo.');
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





