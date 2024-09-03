import React, { useState, useEffect } from 'react';
import './stylesP/MainContent.css';
import { FaBook, FaHeadphones, FaCommentAlt } from 'react-icons/fa';


const MainContent = ({ openModal }) => {
  const [hoveredButton, setHoveredButton] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  // const [notificationHistory, setNotificationHistory] = useState([]);
  // const { user } = useAuth();

  useEffect(() => {
    let timer;
    if (hoveredButton) {
      timer = setTimeout(() => {
        setShowTooltip(true);
      }, 1000); // 1 segundo
    } else {
      setShowTooltip(false);
    }
    return () => clearTimeout(timer);
  }, [hoveredButton]);

  const handleMouseEnter = (buttonName) => {
    setHoveredButton(buttonName);
  };

  const handleMouseLeave = () => {
    setHoveredButton(null);
  };

  

  const tooltipContent = {
    Manuales: 'PDFs de Manuales de uso CORS',
    FQA: 'Problemas frecuentes de los aplicativos',
    Comunicados: 'Subida y visualización de Comunicados',
  };

  return (
    <div className="main-content">
      <div className="main-buttons">
          <button 
            className='Manual-button'
            onClick={() => openModal('Manuales')}
            onMouseEnter={() => handleMouseEnter('Manuales')}
            onMouseLeave={handleMouseLeave}
          >
            <FaBook />
            {showTooltip && hoveredButton === 'Manuales' && (
              <div className="tooltip">{tooltipContent.Manuales}</div>
            )}
          </button>
          <button 
            className='FQA-button'
            onClick={() => openModal('FQA')}
            onMouseEnter={() => handleMouseEnter('FQA')}
            onMouseLeave={handleMouseLeave}
          >
            <FaHeadphones />
            {showTooltip && hoveredButton === 'FQA' && (
              <div className="tooltip">{tooltipContent.FQA}</div>
            )}
          </button>
          <button 
             className='Comunicados-button'
            onClick={() => openModal('Comunicados')}
            onMouseEnter={() => handleMouseEnter('Comunicados')}
            onMouseLeave={handleMouseLeave}
          >
            <FaCommentAlt />
            {showTooltip && hoveredButton === 'Comunicados' && (
              <div className="tooltip">{tooltipContent.Comunicados}</div>
            )}
          </button>
        </div>

      </div>
  );
};

export default MainContent;