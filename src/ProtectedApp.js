
import React,{lazy,Suspense} from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
//complementos
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import ManagerModal from './ManagerModal';
import PrivateRoute from './PrivateRoute';

//lazy loading
const AdminDashboard = lazy (()=> import('./Login/AdminDashboard'));
const UserDashboard = lazy (()=> import ('./Login/UserDashboard'));
const  Maincontent = lazy (()=> import ('./Maincontent'));


function ProtectedApp({ openModal, closeModal, currentModal }) {
  // Función desde navigationbar para recargar la página desde el title

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="logo-wrapper"></div>
        <NavigationBar openModal={openModal} />
      </header>
      <main className="content-wrapper">
       <Suspense fallback={<div>Cargando...</div>}>
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
                element={<Maincontent openModal={openModal} />}
                roles={['admin', 'user']}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
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
export default ProtectedApp;