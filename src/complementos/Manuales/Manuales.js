import React ,{useState,useEffect} from 'react';
import Modal from 'react-modal';
import '../Manuales/ManualesModal.css';

Modal.setAppElement('#root');

const searchManuals = (searchQuery,manuals) => {

  // Recorrer todos los manuales y mostrar/ocultar según corresponda
  for (let i = 0; i < manuals.length; i++) {
      let title = manuals[i].getElementsByTagName('h2')[0].innerText.toLowerCase();
      if (title.includes(searchQuery.toLowerCase())) {
          manuals[i].style.display = 'block'; // Mostrar manual si coincide
      } else {
          manuals[i].style.display = 'none'; // Ocultar manual si no coincide
      }
  }
}

const Manuales = ({ isOpen, onClose, }) => {
  const [htmlContent,setHtmlContent]= useState('');


  useEffect(() => {
    if (isOpen) {
      fetch('./Manuales.html')  // Ruta a tu archivo Manuales.html
        .then(response => response.text())
        .then(data => setHtmlContent(data));
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

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Visualizador de Documentos"
      className="modal"
      overlayClassName="overlay"
    >
      <button  className="close-manual"onClick={onClose} >X</button>
      <div className='content'>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </Modal>
  );
};

export default Manuales;