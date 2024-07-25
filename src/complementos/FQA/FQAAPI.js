export const fetchProblems = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/problems', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error al obtener problemas:', err);
    throw new Error('Error al cargar los problemas. Por favor, intenta de nuevo más tarde.');
  }
};

// Función para agregar un nuevo problema
export const addProblem = async (newProblem) => {
  try {
    const response = await fetch('http://localhost:3000/api/problems', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProblem),
    });
    
    if (!response.ok) {
      throw new Error('Error al agregar nuevo problema');
    }
    return await response.json();
  } catch (err) {
    console.error('Error:', err);
    throw new Error('Error al agregar el problema. Por favor, intenta de nuevo.');
  }
};

// Función para actualizar un problema existente
export const updateProblem = async (id, updatedProblem) => {
  try {
    const response = await fetch(`http://localhost:3000/api/problems/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProblem),
    });
    
    if (!response.ok) {
      throw new Error('Error al actualizar el problema');
    }
    return await response.json();
  } catch (err) {
    console.error('Error:', err);
    throw new Error('Error al actualizar el problema. Por favor, intenta de nuevo.');
  }
};

// Función para eliminar un problema
export const deleteProblem = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/problems/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Error al eliminar el problema');
    }
    return await response.json();
  } catch (err) {
    console.error('Error:', err);
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