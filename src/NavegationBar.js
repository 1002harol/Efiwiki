import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PowerPointModal from './complementos/Comunicados/PowerPointModal';
import ManualesModal from './complementos/Manuales/Manuales';
import Modal from 'react-modal';
// import '../src/styles/NavegationBar.css';
import FQA from './complementos/FQA/FQA';
import Comunicados from './complementos/Comunicados/Comunicados';
import ReactModal from 'react-modal';

Modal.setAppElement('#root');

const NavigationBar = () => {
  const [isPPTModalOpen, setIsPPTModalOpen] = useState(false);
  const [isManualesModalOpen, setIsManualesModalOpen] = useState(false);
  const [isFQAModalOpen, setIsFQAModalOpen] = useState(false);

  const handlePPTClick = (e) => {
    e.preventDefault();
    setIsPPTModalOpen(true);
  };

  const handleManualesClick = (e) => {
    e.preventDefault();
    setIsManualesModalOpen(true);
  };

  const handleFQAButtonClick = () => {
    setIsFQAModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsPPTModalOpen(false);
  };

  const handleCloseManualesModal = () => {
    setIsManualesModalOpen(false);
  };

  const handleCloseFQAModal = () => {
    setIsFQAModalOpen(false);
  };

  const handleFileUploaded = (file) => {
    console.log('Archivo subido:', file);
  };

  const customModalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '90%',
      maxHeight: '90%',
      overflow: 'auto',
      padding: '20px',
      borderRadius: '8px',
      backgroundColor: 'white',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
  };

  return (
    <nav className="navigation-bar">
      <ul>
        <li>
          <Link to="#" onClick={handleManualesClick}>Manuales de Uso</Link>
        </li>
        <li>
          <button onClick={handleFQAButtonClick}>FQA</button>
        </li>
        <li>
          <Link to="#" onClick={handlePPTClick}>Comunicados</Link>
        </li>
      </ul>
      
      <Modal
        isOpen={isPPTModalOpen}
        onRequestClose={handleCloseModal}
        // style={customModalStyles}
      >
        {/* <button onClick={handleCloseModal} className="close-modal">Cerrar</button> */}
        <PowerPointModal
          isOpen={isPPTModalOpen}
          onClose={handleCloseModal}
          onFileUploaded={handleFileUploaded}
        />
      </Modal>

      <Modal
        isOpen={isManualesModalOpen}
        onRequestClose={handleCloseManualesModal}
      >
        {/* <button onClick={handleCloseManualesModal} className="close-modal">Cerrar</button> */}
        <ManualesModal
          isOpen={isManualesModalOpen}
          onClose={handleCloseManualesModal}
          style={customModalStyles}
        />
      </Modal>

      <Modal
        isOpen={isFQAModalOpen}
        onRequestClose={handleCloseFQAModal}
        style={customModalStyles}
        contentLabel="FAQ Modal"
      >
        <button onClick={handleCloseFQAModal} className="close-modal">Cerrar</button>
        <FQA />
      </Modal>
    </nav>
  );
};

export default NavigationBar;