import React, { useState, useEffect } from 'react';
import './stylesP/MainContent.css';
import { FaBook, FaHeadphones, FaCommentAlt } from 'react-icons/fa';
import smallBackground from '../src/Imagenes/Efiwiki-small.webp';
import mediumBackground from '../src/Imagenes/Efiwiki-medium.webp';
import largeBackground from '../src/Imagenes/Efiwiki-large.webp';
import defaultBackground from '../src/Imagenes/Efiwiki.webp';

const MainContent = ({ openModal }) => {
  const [hoveredButton, setHoveredButton] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(defaultBackground);
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

 // transformador de  imagen de fondo
 useEffect(() => {
  const preloadImages = [
    smallBackground,
    mediumBackground,
    largeBackground,
    defaultBackground,
  ];

  preloadImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  const updateBackgroundImage = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 480) {
      setBackgroundImage(smallBackground);
    } else if (screenWidth <= 768) {
      setBackgroundImage(mediumBackground);
    } else if (screenWidth <= 1024) {
      setBackgroundImage(largeBackground);
    } else {
      setBackgroundImage(defaultBackground);
    }
  };

  updateBackgroundImage();
  window.addEventListener('resize', updateBackgroundImage);

  return () => {
    window.removeEventListener('resize', updateBackgroundImage);
  };
}, []);


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
    <div className="main-content-wrapper" style={{ backgroundImage: `url(${backgroundImage})`}}>
    <div className="main-content" >
      <div className="main-buttons">
          <button 
            className='Manual-button'
            onClick={() => openModal('Manuales')}
            onMouseEnter={() => handleMouseEnter('Manuales')}
            onMouseLeave={handleMouseLeave}
            aria-label="Manuales de uso"
          >
            <FaBook />
            {showTooltip && hoveredButton === 'Manuales' && (
              <div className="tooltip">{tooltipContent.Manuales}</div>
            )}
             <i className="icono-manual"></i>
          </button>
          <button 
            className='FQA-button'
            onClick={() => openModal('FQA')}
            onMouseEnter={() => handleMouseEnter('FQA')}
            onMouseLeave={handleMouseLeave}
            aria-label="Preguntas frecuentes"
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
            aria-label="Comunicados"
          >
            <FaCommentAlt />
            {showTooltip && hoveredButton === 'Comunicados' && (
              <div className="tooltip">{tooltipContent.Comunicados}</div>
            )}
          </button>
        </div>

      </div>
     </div> 
  );
};

export default MainContent;