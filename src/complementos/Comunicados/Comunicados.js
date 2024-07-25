import React, { useState, useEffect } from 'react';
import PowerPointModal from './PowerPointModal';
import { fetchComunicadosContent } from './comunicadosApi';


const Comunicados = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const getComunicadosContent = async () => {
      try {
        const content = await fetchComunicadosContent();
        setHtmlContent(content);
      } catch (err) {
        setError(err.message);
      }
    };
    getComunicadosContent();
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFileUploaded = (file) => {
    setSelectedFile(file);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError('Por favor, selecciona un archivo');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setIsUploading(true);
    setUploadProgress(0);
    setUploadMessage('');
    setError(null);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        onUploadProgress: (event) => {
          const progress = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(progress);
        }
      });

      if (!response.ok) {
        throw new Error('Error al subir el archivo');
      }

      setUploadMessage('Archivo subido exitosamente');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="comunicados-container">
      <h2>Comunicados</h2>
      <button onClick={handleOpenModal} className="upload-button">
        Subir Archivo PowerPoint
      </button>
      <PowerPointModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onFileUploaded={handleFileUploaded}
        onSubmit={handleSubmit}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        uploadMessage={uploadMessage}
        error={error}
      />
      {htmlContent && (
        <div
          className="comunicados-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      )}
    </div>
  );
};

export default Comunicados;