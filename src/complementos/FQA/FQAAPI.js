import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const API_AUTH = process.env.REACT_APP_API_AUTH;
const API_AUTHORIZATION = process.env.REACT_APP_API_AUTHORIZATION;


export const fetchProblems = async (selectedApp) => {
  try {
    const response = await axios.get(`${API_URL}?aplicacion=${selectedApp}`, {
      headers: {
        'Content-Type': 'application/json',
        'Auth': API_AUTH,
        'Authorization': `Bearer ${API_AUTHORIZATION}`
      },
    });
    if (response.data && Array.isArray(response.data.data)) {
      // Transformar los datos al formato esperado por el frontend
      const transformedData = response.data.data
      .filter(problem => problem.activo)
      .map(problem => ({
        id:problem._id,
        aplicacion: problem.aplicacion,
        descripcion: problem.descripcion,
        solucion: problem.solucion,
        activo: problem.activo,
      }));

      return transformedData;
    } else {
      throw new Error('Formato de respuesta inesperado');
    }

  } catch (err) {
    console.error('Error al obtener problemas:', err);
    throw new Error('Error al cargar los problemas. Por favor, intenta de nuevo más tarde.');
  }
};



export const addProblem = async (modalData) => {
  if (!API_URL) {
    console.error('API_URL no está definido');
    throw new Error('Error de configuración: URL de API no definida');
  }

  try {
    const config = {
      method: 'post',
      url: `${API_URL}`, // Asegúrate de que la ruta sea correcta
      headers: {
        'Auth': API_AUTH,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_AUTHORIZATION}` // Si estás usando un token JWT
      },
      data: modalData
    };


    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Error detallado en addProblem:', error);
    throw new Error('Error al agregar el problema. Por favor, intenta de nuevo.');
  }
};

export const updateProblem = async (id, problemData) => {
  if (!API_URL) {
    console.error('API_URL no está definido');
    throw new Error('Error de configuración: URL de API no definida');
  }

  try {
    const { aplicacion, descripcion, solucion } = problemData;

    if (!aplicacion || !descripcion || !solucion) {
      throw new Error('Datos incompletos para la actualización');
    }

    const config = {
      method: 'put',
      url: `${API_URL}/${id}`,
      headers: {
        'Auth': API_AUTH,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_AUTHORIZATION}`
      },
      data: { aplicacion, descripcion, solucion }
    };

    const response = await axios(config);

    if (response.data && response.data.data) {
      return {
        ...response.data.data,
        id: response.data.data._id,
        uptadeData: {
          aplicacion: response.data.data.aplicacion,
          descripcion: response.data.data.descripcion,
          solucion: response.data.data.solucion,
        }
      };
    } else {
      throw new Error('La respuesta del servidor no contiene los datos actualizados esperados');
    }
  } catch (error) {
    console.error('Error detallado en updateProblem:', error);
    if (error.response) {
      console.error('Datos de la respuesta:', error.response.data);
      console.error('Estado de la respuesta:', error.response.status);
      console.error('Cabeceras de la respuesta:', error.response.headers);
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor');
    } else {
      console.error('Error de configuración:', error.message);
    }
    throw new Error('Error al actualizar el problema. Por favor, intenta de nuevo.');
  }
};
// Función para eliminar un problema
export const deleteProblem = async (id) => {
  try {
    const response = await axios({
      method: 'delete',
      url: `${API_URL}/${id}`,
      headers: {
        'Auth': API_AUTH,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_AUTHORIZATION}`
      },
      data : { activo : false}
    });
    console.log('Respuesta de eliminación:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error detallado en deleteProblem:', error);
    if (error.response) {
      console.error('Datos de la respuesta:', error.response.data);
      console.error('Estado de la respuesta:', error.response.status);
      console.error('Cabeceras de la respuesta:', error.response.headers);
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor');
    } else {
      console.error('Error de configuración:', error.message);
    }
    throw new Error('Error al eliminar el problema. Por favor, intenta de nuevo.');
  }
};

// Función para cargar contenido HTML
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





