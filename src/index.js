import React from 'react';
import'normalize.css';
import { createRoot } from 'react-dom/client';
import './stylesP/index.css'; // Estilos globales
import App from './App';



const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);


if('serviceWorker' in navigator){

  window.addEventListener('load' , () => {

    navigator.serviceWorker.register('./service-Worker.js')
    .then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
});
}
 