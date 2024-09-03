// import React, { useState, useEffect, useRef } from 'react';
// import './stylesP/NavegationBar.css';
// import LogoEfigasAhiSiempre from './Imagenes/LogoEfigasAhiSiempre.png';
// import { useAuth } from '../src/Login/AuthContext'; // Asegúrate de importar useAuth
// import  {FaBars,FaBook, FaHeadphones, FaCommentAlt,} from 'react-icons/fa';
// // import NotificationTray from './complementos/NotificationTray/NotificationTray';

// const NavigationBar = ({ openModal }) => {
//   const [hoveredButton, setHoveredButton] = useState(null);
//   const [showTooltip, setShowTooltip] = useState(false);
//   const { user, logout } = useAuth(); // Obtén user y logout del contexto
//   const [showMenu,setShowMenu] =useState(false);
//   const menuRef=useRef(null);

//   useEffect(() => {
//     let timer;
//     if (hoveredButton) {
//       timer = setTimeout(() => {
//         setShowTooltip(true);
//       }, 1000); // 1 segundo
//     } else {
//       setShowTooltip(false);
//     }
//     return () => clearTimeout(timer);
//   }, [hoveredButton]);
  

//   const handleMouseEnter = (buttonName) => {
//     setHoveredButton(buttonName);
//   };

//   const handleMouseLeave = () => {
//     setHoveredButton(null);
//   };

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setShowMenu(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [menuRef]);

//   const tooltipContent = {
//     Manuales: 'PDFs de Manuales de uso CORS',
//     FQA: 'Problemas frecuentes de los aplicativos',
//     Comunicados: 'Subida y visualización de Comunicados',
//   };

//   const toggleMenu = () => {
//     setShowMenu(!showMenu);
//   }

//   return (
//     <div className="navigation-bar">
//       <div className="header">
//       <div className="logo-title">
//         <img src={LogoEfigasAhiSiempre} alt="Logo Efigas" className="logo-icon" />
//         <h1>EFIWIKI</h1>
//         </div>
//         <div className="icon-container-hamburguesa" ref={menuRef}>
//           <FaBars className="menu-icon" onClick={toggleMenu} />
//           {showMenu && (
//             <div className={`menu-overlay ${showMenu ? 'show-menu' : ''}`}>
//               <button className="Acerca-button" onClick={() => {}}>Acerca de</button>
//               <button className="Ayuda-button" onClick={() => {}}>Ayuda</button>
//               {user && <button className="logout-button" onClick={logout}>Cerrar Sesión</button>}
//             </div>
//           )}
//         </div>
//       </div>
//       <div className="main-buttons">
//           <button 
//             onClick={() => openModal('Manuales')}
//             onMouseEnter={() => handleMouseEnter('Manuales')}
//             onMouseLeave={handleMouseLeave}
//           >
//             <FaBook />
//             {showTooltip && hoveredButton === 'Manuales' && (
//               <div className="tooltip">{tooltipContent.Manuales}</div>
//             )}
//           </button>
//           <button 
//             onClick={() => openModal('FQA')}
//             onMouseEnter={() => handleMouseEnter('FQA')}
//             onMouseLeave={handleMouseLeave}
//           >
//             <FaHeadphones />
//             {showTooltip && hoveredButton === 'FQA' && (
//               <div className="tooltip">{tooltipContent.FQA}</div>
//             )}
//           </button>
//           <button 
//             onClick={() => openModal('Comunicados')}
//             onMouseEnter={() => handleMouseEnter('Comunicados')}
//             onMouseLeave={handleMouseLeave}
//           >
//             <FaCommentAlt />
//             {showTooltip && hoveredButton === 'Comunicados' && (
//               <div className="tooltip">{tooltipContent.Comunicados}</div>
//             )}
//           </button>
//         </div>
//         {/* <div className="social-media">
//           <a href="#"><FaInstagram /></a>
//           <a href="#"><FaFacebook /></a>
//           <a href="#"><FaTwitter /></a>
//         </div> */}
//       </div>
//   );
// };

// export default NavigationBar;
import React, { useState, useEffect, useRef } from 'react';
import './stylesP/NavegationBar.css';
import LogoEfigasAhiSiempre from './Imagenes/LogoEfigasAhiSiempre.png';
import { FaBars } from 'react-icons/fa';
import { useAuth } from '../src/Login/AuthContext';
import NotificationTray from './complementos/NotificationTray/NotificationTray';

const NavigationBar = () => {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // const handleTitleClick = () => {
  //     window.location.reload();
  //   };

  return (
    <div className="navigation-bar">
        <div className="logo-container">
          <img src={LogoEfigasAhiSiempre} alt="Logo Efigas" className="logo-icon" />
          <h1  className="title"  >EFIWIKI</h1>
        </div>
        <div className="menu-container" ref={menuRef}>
          <FaBars className="menu-icon" onClick={toggleMenu} />
          {showMenu && (
            <div className={`menu-overlay ${showMenu ? 'show-menu' : ''}`}>
              <div class="dropdown-content">
              <button className="menu-button" onClick={() => {}}>Acerca de</button>
              <button className="menu-button" onClick={() => {}}>Ayuda</button>
              {user && <button className="menu-button-logout-button" onClick={logout}>Cerrar Sesión</button>}
              </div>
            </div>
          )}
        </div>
        <NotificationTray/>
      </div>
  );
};

export default NavigationBar;