import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../Manuales/stylesM/Manuales.css';

if (process.env.NODE_ENV !== 'test') {
  Modal.setAppElement('#root');
}

const Manuales = ({ isOpen, onClose }) => {
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetch('./Manuales.html')
        .then(response => response.text())
        .then(data => {
          setHtmlContent(data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching the manuals:', error);
          setIsLoading(false);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (htmlContent) {
      const searchBar = document.getElementById('searchBar');
      const manualsContainer = document.getElementById('manualsContainer');
      if (searchBar && manualsContainer) {
        searchBar.addEventListener('keyup', () => {
          searchManuals(searchBar.value, manualsContainer.getElementsByClassName('manual'));
        });
      }
    }
  }, [htmlContent]);

  const searchManuals = (searchQuery, manuals) => {
    for (let i = 0; i < manuals.length; i++) {
      let title = manuals[i].getElementsByTagName('h2')[0].innerText.toLowerCase();
      if (title.includes(searchQuery.toLowerCase())) {
        manuals[i].style.display = 'block';
      } else {
        manuals[i].style.display = 'none';
      }
    }
  };

  const handlePdfClick = (event) => {
    if (event.target.tagName === 'A' && event.target.href.endsWith('.pdf')) {
      event.preventDefault();
      window.open(event.target.href, '_blank');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Visualizador de Documentos"
      className="manuales-modal-content"
      overlayClassName="manuales-modal-overlay"
    >
      <div className="manuales-modal-header">
        <h2>Manuales de Uso</h2>
        <button className="manuales-close-button" onClick={onClose}>X</button>
      </div>
      <div className='manuales-modal-body'>
        {isLoading ? (
          <p>Cargando manuales...</p>
        ) : (
          <div 
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
            onClick={handlePdfClick}
          />
        )}
      </div>
    </Modal>
  );
};

export default Manuales;