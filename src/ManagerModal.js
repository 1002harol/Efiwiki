import React from 'react';
import Modal from 'react-modal';
import { useAuth } from '../src/Login/AuthContext'; // Asegúrate de importar useAuth
import Manuales from './complementos/Manuales/Manuales';
import FQA from './complementos/FQA/FQA';
import Comunicados from './complementos/Comunicados/Comunicados';

Modal.setAppElement('#root');

const ManagerModal = ({ modalType, isOpen, onClose }) => {
  const { user } = useAuth(); // Obtén el usuario autenticado

  const renderModalContent = () => {
    switch (modalType) {
      case 'Manuales':
        return <Manuales isOpen={isOpen} onClose={onClose} />;
      case 'FQA':
        return <FQA isOpen={isOpen} onClose={onClose} />;
      case 'Comunicados':
        return (
          <Comunicados
            isOpen={isOpen}
            onClose={onClose}
            userRole={user?.role} // Pasa el rol del usuario al modal
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={modalType}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="modal-header">
      </div>
      {renderModalContent()}
    </Modal>
  );
};

export default ManagerModal;