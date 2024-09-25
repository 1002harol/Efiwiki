import React from "react";
import Modalmenu from "../ModalMenu";

const AcercaDe =({ isOpen, onClose }) =>{
  if(!isOpen) return null;


return (
  <Modalmenu isOpen={isOpen} onClose={onClose} title="Acerca de EFIWIKI">
  <p className="text-gray-700 mb-4">
    EFIWIKI es una plataforma diseñada para proporcionar información y asistencia técnica relacionada con los servicios ofrecidos por Efigas. Aquí encontrarás recursos útiles, preguntas frecuentes y manuales de uso para solucionar problemas de manera rápida y efectiva.
  </p>
  <button
    className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
    onClick={onClose}
  >
    Cerrar
  </button>
</Modalmenu>
);
};



export default AcercaDe;