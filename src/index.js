import React from 'react';
import { createRoot } from 'react-dom/client';
import './stylesP/index.css'; // Estilos globales
import App from './App';
// import './fireBaseConfig';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
