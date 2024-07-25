import React, { useState } from 'react';
import './styles/Maincontent.css'

const Maincontent = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
      setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };
  
    return (
      <main className="main-container">
        <p className="scrolling-text">
          Bienvenido a  EFIWIKI, una herramienta para la manipúlacion de errores.
          <button onClick={handleOpenModal} className="help-button">Ayuda</button>
        </p>
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-button" onClick={handleCloseModal}>&times;</span>
              <h2>Acerca de Efiwiki</h2>
              <ul>
                <li>Manual de uso : Es un documento de comunicación técnica destinado a dar asistencia para el uso de aplicativos</li>
                <li>FAQ: Es un listado de problemas y soluciones mas comunes de los aplicativos</li>
                <li>Comunicados: Aqui encontraras  diapositivas infomativas acerca de los Proyectos que se lanzan por mes</li>
                <li>Desarrollador: Aprendiz(Sena) harol steven   para efigas.</li>
                <li>Version: 1.01.</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    );
  };

  export default Maincontent;