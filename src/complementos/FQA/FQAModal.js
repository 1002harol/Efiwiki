import React from 'react';
import Modal from 'react-modal';
import '../FQA/FQAModal.css';

Modal.setAppElement('#root');

const FQAModal = ({ isOpen, onClose, onSubmit, modalType, currentProblem }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const problemData = {
      app: formData.get('app'),
      description: formData.get('description'),
      solution: formData.get('solution'),
    };
    onSubmit(problemData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Gestionar Problema"
      className="faqModal"
      overlayClassName="faqOverlay"
    >
      <div className="faqContent">
        <h2>{modalType === 'newProblem' ? 'Nuevo Problema' : 'Editar Problema'}</h2>
        <button onClick={onClose}>Cerrar</button>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="newApp">Nombre aplicativo:</label>
            <input
              type="text"
              id="newApp"
              name="app"
              required
              defaultValue={currentProblem?.app || ''}
            />
          </div>
          <div>
            <label htmlFor="newProblemDescription">Descripción del Problema:</label>
            <textarea
              id="newProblemDescription"
              name="description"
              required
              defaultValue={currentProblem?.description || ''}
            ></textarea>
          </div>
          <div>
            <label htmlFor="newSolution">Solución:</label>
            <textarea
              id="newSolution"
              name="solution"
              required
              defaultValue={currentProblem?.solution || ''}
            ></textarea>
          </div>
          <button type="submit">
            {modalType === 'newProblem' ? 'Guardar Problema' : 'Actualizar Problema'}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default FQAModal;