

import React, { useState, useEffect } from 'react';
import './stylesC/Comunicados.css';
import { useAuth } from '../../Login/AuthContext';

const Comunicados = ({ onClose }) => {
  const { user } = useAuth();
  const [comunicado, setComunicado] = useState({
    id: null,
    titulo: "",
    filePath: "",
    likes: 0,
    dislikes: 0
  });
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [selectedFile,setSelectedFile] = useState(null);

  useEffect(() => {
    // Cargar el comunicado y los comentarios desde la base de datos
    const loadComunicadoAndComments = async () => {
      try {
        const response = await fetch('/api/comunicado'); // Ruta del API para obtener el comunicado
        const data = await response.json();
        setComunicado(data.comunicado);
        setLikes(data.comunicado.likes);
        setDislikes(data.comunicado.dislikes);

        const commentsResponse = await fetch(`/api/comunicado/${data.comunicado.id}/comments`);
        const commentsData = await commentsResponse.json();
        setComments(commentsData);
      } catch (error) {
        console.error("Error al cargar el comunicado y los comentarios:", error);
      }
    };

    loadComunicadoAndComments();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
  
      try {
        // Aquí obtendrás el SAS token desde tu backend
        const sasResponse = await fetch('/api/getSasToken', {
          method: 'GET',
        });
        const { sasToken, blobUrl } = await sasResponse.json();
  
        // Construir la URL completa incluyendo el SAS token
        const uploadUrl = `${blobUrl}?${sasToken}`;
  
        // Realizar la subida del archivo
        const response = await fetch(uploadUrl, {
          method: 'PUT',
          body: selectedFile,
          headers: {
            'x-ms-blob-type': 'BlockBlob',
          },
        });
  
        if (response.ok) {
          console.log('Archivo subido con éxito');
        } else {
          console.error('Error al subir el archivo');
        }
      } catch (error) {
        console.error("Error en la subida del archivo:", error);
      }
    }
  };

  const handleLike = async () => {
    if (!hasInteracted) {
      const updatedComunicado = { ...comunicado, likes: comunicado.likes + 1 };
      setComunicado(updatedComunicado);
      setLikes(updatedComunicado.likes);
      setHasInteracted(true);

      await fetch(`/api/comunicado/${comunicado.id}/like`, {
        method: 'POST',
      });
    }
  };

  const handleDislike = async () => {
    if (!hasInteracted) {
      const updatedComunicado = { ...comunicado, dislikes: comunicado.dislikes + 1 };
      setComunicado(updatedComunicado);
      setDislikes(updatedComunicado.dislikes);
      setHasInteracted(true);

      await fetch(`/api/comunicado/${comunicado.id}/dislike`, {
        method: 'POST',
      });
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (newComment.trim()) {
      const newCommentData = {
        id: Date.now(),
        author: user.name,
        text: newComment,
        timestamp: new Date().toISOString()
      };

      const updatedComments = [...comments, newCommentData];
      setComments(updatedComments);
      setNewComment('');

      await fetch(`/api/comunicado/${comunicado.id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCommentData),
      });
    }
  };

  return (
    <div className="powerpoint-modal-overlay ">
      <div className="powerpoint-modal-content">
        <div className="powerpoint-modal-header">
          <h2>{comunicado.titulo}</h2>
          <button onClick={onClose} className="close-button">X</button>
        </div>

        {user && user.role === 'admin' && (
        <div className='powerpoint-modal-form'>
          <input type ="file" onChange={handleFileChange}/>
          <button onClick={handleFileUpload} className="upload-button">
            Subir comunicado
          </button>
        </div>
        )}

        {comunicado.filePath && (
          <div className="powerpoint-modal-content">
            <iframe
              src={comunicado.filePath}
              width="100%"
              height="600px"
              frameBorder="0"
              title="Vista previa del comunicado"
            ></iframe>
          </div>
        )}

        <div className="interaction-section">
          <button onClick={handleLike} disabled={hasInteracted} className="like-button">
            👍 Like {likes}
          </button>
          <button onClick={handleDislike} disabled={hasInteracted} className="dislike-button">
            👎 Dislike {dislikes}
          </button>
        </div>

        <div className="comments-section">
          <h3>Comentarios</h3>
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
            />
            <button type="submit" disabled={!newComment.trim()}>
              Comentar
            </button>
          </form>
          <div className="upload-progress">
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <strong>{comment.author}:</strong> {comment.text}
                <small>{new Date(comment.timestamp).toLocaleString()}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comunicados;

