
import React, { useState, useEffect, useRef , lazy ,Suspense } from 'react';
import './stylesP/NavegationBar.css';
import { FaBars } from 'react-icons/fa';
import { useAuth } from '../src/Login/AuthContext';
import LogoEfigasAhiSiempre from  './Imagenes/LogoEfigasAhiSiempre.webp';
import Ayuda from  './complementos/BotonesMenu/Ayuda/Ayuda.js';
import AcercaDe from './complementos/BotonesMenu/Acerda-de/Acerca-de.js';
const NotificationTray = lazy(() => import('./complementos/BotonesMenu/NotificationTray/NotificationTray.js'));

const NavigationBar = () => {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const [isAyudaOpen, setIsAyudaOpen] = useState(false);
  const [isAcercaDeOpen, setIsAcercaDeOpen] = useState(false);

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


  return (
   <>
      <div className="navigation-bar">
        <div className="logo-container">
          <img src={LogoEfigasAhiSiempre} alt="Logo Efigas" className="logo-icon" />
          <h1  className="title" >EFIWIKI</h1>
        </div>
        <div className="menu-container" ref={menuRef}>
          <FaBars className="menu-icon" onClick={toggleMenu} />
          {showMenu && (
            <div className={`menu-overlay ${showMenu ? 'show-menu' : ''}`}>
              <div className="dropdown-content">
              <button className="menu-button" onClick={() => setIsAcercaDeOpen(true)}>Acerca de</button>
              <button className="menu-button" onClick={() => setIsAyudaOpen(true)}>Ayuda</button>
              {user && <button className="menu-button-logout-button" onClick={logout}>Cerrar Sesión</button>}
              </div>
            </div>
          )}
        </div>
        <Suspense fallback={<div>Cargando...</div>}>
          <NotificationTray/>
        </Suspense>
       </div>
      <AcercaDe isOpen={isAcercaDeOpen} onClose={() =>setIsAcercaDeOpen(false)}/>
     <Ayuda isOpen={isAyudaOpen} onClose={() => setIsAyudaOpen(false)} />
   </>
  );
};

export default NavigationBar;