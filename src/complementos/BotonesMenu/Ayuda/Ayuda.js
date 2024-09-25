import React from "react";
import ModalMenu from "../ModalMenu";
import '../../../stylesP/App.css';

const Ayuda = ({ isOpen, onClose }) => {
    if(!isOpen) return null;

  const handleEmailClick = (e) => {
    e.preventDefault();
    window.location.href = "mailto:mesi@efigas.com.co";
  }

return(
  <ModalMenu isOpen={isOpen} onClose={onClose} title="Ayuda">
  <p className="text-gray-700 mb-4">
    Si necesitas asistencia, puedes contactarte con nuestro equipo de soporte técnico 
    de TI ala siguiente plataforma JIRA la cual puedes encontrar su vinculo en el pie de pagina   o en otro caso remite un correo a {''}
  <a
    href="mailto:mesi@efigas.com.co"
    onClick={handleEmailClick}
    className="text-blue-600 hover:underline"
  >
    mesi@efigas.com.co
  </a>
  </p>

  <button
    className="w-full bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 transition duration-300"
    onClick={onClose}
  >
    Cerrar
  </button>
</ModalMenu>
  );
};


export default Ayuda;