const API_URL = process.env.REACT_APP_API_URL;
// const SAS_TOKEN = process.env.REACT_APP_SAS_TOKEN; // Token SAS para autenticación

// Obtener todos los blobs en un contenedor
export const fetchBlobs = async () => {
  const response = await fetch(`${API_URL}?restype=container&comp=list&${SAS_TOKEN}`, {
    method: 'GET',
    headers: {
      'x-ms-version': '2020-10-02', // O la versión de la API que estés usando
    },
  });
  if (!response.ok) {
    throw new Error('Fallo al obtener blobs');
  }
  return await response.text(); // Devuelve XML que necesitarás procesar
};

// Obtener un blob específico por URL
export const fetchBlobById = async (blobUrl) => {
  const response = await fetch(`${blobUrl}?${SAS_TOKEN}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${SAS_TOKEN}`, // Usar SAS Token si es necesario
    },
  });
  if (!response.ok) {
    throw new Error('Fallo al obtener blob');
  }
  return await response.blob(); // Devuelve el blob
};

// Crear un nuevo blob (subir un archivo)
export const createBlob = async (containerName, blobName, file) => {
  const blobUrl = `${API_URL}/${containerName}/${blobName}?${SAS_TOKEN}`;
  const response = await fetch(blobUrl, {
    method: 'PUT',
    headers: {
      'x-ms-blob-type': 'BlockBlob', // O el tipo adecuado para el blob
    },
    body: file,
  });
  if (!response.ok) {
    throw new Error('Fallo al crear blob');
  }
  return await response.json(); // Ajustar según la respuesta del servicio
};

// Actualizar un blob existente (usualmente se usa la misma función que para crear)
export const updateBlob = async (containerName, blobName, file) => {
  return await createBlob(containerName, blobName, file); // Usar la misma función de subir
};

// Eliminar un blob
export const deleteBlob = async (containerName, blobName) => {
  const blobUrl = `${API_URL}/${containerName}/${blobName}?${SAS_TOKEN}`;
  const response = await fetch(blobUrl, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${SAS_TOKEN}`, // Usar SAS Token si es necesario
    },
  });
  if (!response.ok) {
    throw new Error('Fallo al eliminar blob');
  }
  return await response.json(); // Ajustar según la respuesta del servicio
};

// Agregar un like o dislike a un comunicado (esto se asume que se maneja en otro servicio)
export const addLikeOrDislike = async (comunicadoId, userId, tipo) => {
  const response = await fetch(`${API_URL}/comunicados/${comunicadoId}/like-dislike`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, tipo }),
  });

  if (!response.ok) {
    throw new Error(`Failed to add ${tipo} to comunicado with ID ${comunicadoId}`);
  }
  return await response.json();
};

// Obtener los likes y dislikes de un comunicado (esto se asume que se maneja en otro servicio)
export const fetchLikesDislikes = async (comunicadoId) => {
  const response = await fetch(`${API_URL}/comunicados/${comunicadoId}/likes-dislikes`);
  if (!response.ok) {
    throw new Error(`Failed to fetch likes and dislikes for comunicado with ID ${comunicadoId}`);
  }
  return await response.json();
};

// Agregar un comentario a un comunicado (esto se asume que se maneja en otro servicio)
export const addComment = async (comunicadoId, userId, commentText) => {
  const response = await fetch(`${API_URL}/comunicados/${comunicadoId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, text: commentText }),
  });

  if (!response.ok) {
    throw new Error(`Failed to add comment to comunicado with ID ${comunicadoId}`);
  }
  return await response.json();
};

// Obtener todos los comentarios de un comunicado (esto se asume que se maneja en otro servicio)
export const fetchComments = async (comunicadoId) => {
  const response = await fetch(`${API_URL}/comunicados/${comunicadoId}/comments`);
  if (!response.ok) {
    throw new Error(`Failed to fetch comments for comunicado with ID ${comunicadoId}`);
  }
  return await response.json();
};

