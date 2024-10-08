
import React, { useState,lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//contextos y hooks
import { AuthProvider } from './Login/AuthContext';
import { QueryClient,QueryClientProvider } from 'react-query';
import { ReactQueryDevtools} from 'react-query/devtools';
//Estilos
import './stylesP/App.css';
import './complementos/FQA/stylesF/FQA.css';
import './stylesP/index.css';
import './complementos/Manuales/stylesM/Manuales.css';

//componente
import PrivateRoute from './PrivateRoute';
// componentes con lazy loading
const Login = lazy (() => import('./Login/Login'));
const ProtectedApp = lazy (() => import ('./ProtectedApp'));
const Register = lazy (() => import('./Login/register'));
const ForgotPassword = lazy (()=> import ('./Login/ForgotPassword'));



const queryClient = new QueryClient();
// Componente principal de la aplicación
function App() {
  const [currentModal, setCurrentModal] = useState(null);
   
  const closeModal = () => setCurrentModal(null);
  const openModal = (modalType) => setCurrentModal(modalType);
  
  
  return (
   <Router>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Suspense fallback={<div>Cargando..</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route
            path="/*"
            element={
              <PrivateRoute
                element={
                  <ProtectedApp
                    openModal={openModal}
                    closeModal={closeModal}
                    currentModal={currentModal}
                  />
                }
                roles={['admin', 'user']}
              />
            }
          />
        </Routes>
        </Suspense>
      </AuthProvider>
     <ReactQueryDevtools initialIsOpen={false}/>
   </QueryClientProvider>  
  </Router> 
  );
}

export default App;