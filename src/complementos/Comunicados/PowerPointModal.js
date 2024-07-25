import React, { useState } from 'react';
import Modal from 'react-modal';
import'../Comunicados/PowerPointModal.css'

const PowerPointModal = ({ 
  isOpen, 
  onClose, 
  onFileUploaded, 
  onSubmit, 
  isUploading, 
  uploadProgress, 
  uploadMessage, 
  error 
}) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      onFileUploaded(file);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onClose} 
      contentLabel="PowerPoint Modal"
      className="powerpoint-modal"
    >
      <h2>Subir Archivo PowerPoint</h2>
      <form onSubmit={onSubmit}>
        <input 
          type="file" 
          accept=".ppt,.pptx" 
          onChange={handleFileChange} 
        />
        {selectedFile && <p>Archivo seleccionado: {selectedFile.name}</p>}
        <button type="submit" disabled={isUploading || !selectedFile}>
          {isUploading ? 'Subiendo...' : 'Subir'}
        </button>
      </form>
      {isUploading && (
        <div className="upload-progress">
          Progreso: {uploadProgress}%
        </div>
      )}
      {uploadMessage && <div className="upload-message">{uploadMessage}</div>}
      {error && <div className="error">{error}</div>}
      <button onClick={onClose} className="close-button">Cerrar</button>
    </Modal>
  );
};

export default PowerPointModal;