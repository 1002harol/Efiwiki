import React, { useState, useEffect } from 'react';
import FQAModal from './FQAModal';
import './FQAModal.css';
import { fetchProblems, addProblem, updateProblem, deleteProblem } from './FQAAPI';

const FAQ = () => {
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState('newProblem');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentProblem, setCurrentProblem] = useState(null);

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      const data = await fetchProblems();
      setProblems(data);
    } catch (err) {
      setError('Error al cargar los problemas. Intenta de nuevo más tarde.');
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Implementa la lógica de búsqueda aquí
  };

  const openModal = (type, problem = null) => {
    setModalType(type);
    setCurrentProblem(problem);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentProblem(null);
  };

  const handleSubmit = async (problemData) => {
    try {
      if (modalType === 'newProblem') {
        await addProblem(problemData);
      } else if (modalType === 'editProblem') {
        await updateProblem(currentProblem.id, problemData);
      }
      loadProblems();
      closeModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProblem(id);
      loadProblems();
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="faq-container">
      <header className="faq-header">
        <h1>FQA</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar por aplicativo..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </header>

      <main className="faq-main">
        <section className="action-buttons">
          <button onClick={() => openModal('newProblem')} className="add-problem-button">
            Agregar Nuevo Problema
          </button>
        </section>

        <section className="accordion-container">
          <ul>
            {problems.map((problem) => (
              <div key={problem.id} className="accordion-item">
                <h3>{problem.app}</h3>
                <p>{problem.description}</p>
                <button onClick={() => openModal('editProblem', problem)}>Editar</button>
                <button onClick={() => handleDelete(problem.id)}>Eliminar</button>
              </div>
            ))}
          </ul>
        </section>
      </main>

      <FQAModal
        isOpen={modalIsOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        modalType={modalType}
        currentProblem={currentProblem}
      />
    </div>
  );
};

export default FAQ;