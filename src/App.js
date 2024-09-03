
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import Maincontent from './Maincontent';
import Footer from './Footer';
import './stylesP/App.css';
import './complementos/FQA/stylesF/FQA.css';
import './stylesP/index.css';
import './complementos/Manuales/stylesM/Manuales.css';
import ManagerModal from './ManagerModal';
import { AuthProvider } from './Login/AuthContext';
import Login from './Login/Login';
// import PrivateRoute from './Login/PrivateRoute';
import AdminDashboard from './Login/AdminDashboard';
import UserDashboard from './Login/UserDashboard';
import { useAuth } from './Login/AuthContext';

const PrivateRoute = ({ element, roles }) => {
  const { user } = useAuth();

  if (!user) {
    // Redirige a la página de login si no está autenticado
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    // Redirige a la página principal si el usuario no tiene el rol requerido
    return <Navigate to="/" />;
  }

  return element;
};

function ProtectedApp({ openModal, closeModal, currentModal }) {
 // Función desde navigationbar  para recargar la página desde el title

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="logo-wrapper">
        </div>
        <NavigationBar  openModal={openModal} />
      </header>
      <main className="content-wrapper">
        <Routes>
          <Route
            path="/admin"
            element={
              <PrivateRoute
                element={<AdminDashboard />}
                roles={['admin']}
              />
            }
          />
          <Route
            path="/user"
            element={
              <PrivateRoute
                element={<UserDashboard />}
                roles={['user']}
              />
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute
                element={<Maincontent  openModal={openModal}/>}
                roles={['admin', 'user']}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="app-footer">
        <Footer />
      </footer>
      <ManagerModal
        modalType={currentModal}
        isOpen={currentModal !== null}
        onClose={closeModal}
      />
    </div>
  );
}

// Componente principal de la aplicación
function App() {
  const [currentModal, setCurrentModal] = useState(null);

  const closeModal = () => setCurrentModal(null);

  const openModal = (modalType, data = {}) => {
    setCurrentModal(modalType);
  };

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <PrivateRoute
                element={<ProtectedApp 
                openModal={openModal} 
                closeModal={closeModal} 
                currentModal={currentModal} />}
                roles={['admin', 'user']}
              />
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;