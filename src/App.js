// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import NavigationBar from './NavegationBar';
// import Maincontent from './Maincontent';
// import Footer from './Footer';
// import Manuales from './complementos/Manuales/Manuales.js';
// import FQAModal from './complementos/FQA/FQAModal.js';
// import Comunicados from './complementos/Comunicados/Comunicados.js';
// import logo from './logo.jpg';
// import './App.css';
// import '../src/complementos/Comunicados/PowerPointModal.css';
// import './index.css';

 



// function App() {
//   return (
//     <Router>
//       <div className="app-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
//         <header>
//           <NavigationBar />
//         </header>
//         <div className="logo-wrapper">
//           <img src={logo} alt="Efiwiki" />
//         </div>
//         <div className="ReactModal__Content ">
//           <Routes>
//             <Route path="/" element={<Maincontent />} />
//             <Route path="/Manuales" element={<Manuales />} />
//             <Route path="/FQA" element={<FQAModal />} />
//             <Route path="/Comunicados" element={<Comunicados/>} />
//           </Routes>
//         </div>
//         <footer style={{ flexShrink: 0 }}>
//           <Footer />
//         </footer>
//       </div>
//     </Router>
//   );
// }

// export default App;
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './NavegationBar';
import Maincontent from './Maincontent';
import Footer from './Footer';
import Manuales from './complementos/Manuales/Manuales.js';
import FQAModal from './complementos/FQA/FQAModal.js';
import Comunicados from './complementos/Comunicados/Comunicados.js';
import logo from './logo.jpg';
import './App.css';
import '../src/complementos/Comunicados/PowerPointModal.css';
import './index.css';

function App() {
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isFQAModalOpen, setIsFQAModalOpen] = useState(false);
  const [isComunicadosModalOpen, setIsComunicadosModalOpen] = useState(false);

  const closeAllModals = () => {
    setIsManualModalOpen(false);
    setIsFQAModalOpen(false);
    setIsComunicadosModalOpen(false);
  };

  const openModal = (modalType) => {
    closeAllModals();
    switch(modalType) {
      case 'Manuales-de-uso':
        setIsManualModalOpen(true);
        break;
      case 'fqa':
        setIsFQAModalOpen(true);
        break;
      case 'comunicados':
        setIsComunicadosModalOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <Router>
      <div className="app-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header>
          <NavigationBar openModal={openModal} />
        </header>
        <div className="logo-wrapper">
          <img src={logo} alt="Efiwiki" />
        </div>
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<Maincontent />} />
            <Route path="/Manuales" element={
              <Manuales 
                isOpen={isManualModalOpen} 
                onClose={() => setIsManualModalOpen(false)} 
              />
            } />
            <Route path="/FQA" element={
              <FQAModal 
                isOpen={isFQAModalOpen} 
                onClose={() => setIsFQAModalOpen(false)} 
              />
            } />
            <Route path="/Comunicados" element={
              <Comunicados 
                isOpen={isComunicadosModalOpen} 
                onClose={() => setIsComunicadosModalOpen(false)} 
              />
            } />
          </Routes>
        </div>
        <footer style={{ flexShrink: 0 }}>
          <Footer />
        </footer>
      </div>
    </Router>
  );
}

export default App;