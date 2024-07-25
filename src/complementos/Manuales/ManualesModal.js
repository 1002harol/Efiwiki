import React from 'react';
import Modal from 'react-modal';
import styles from'../styles/ManualesModal.css';

Modal.setAppElement('#root');

const ManualesModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Visualizador de Documentos"
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <button className={styles.closeButton} onClick={onClose}>X</button>
      <div className={styles.content}>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </Modal>
  );
};

export default ManualesModal;