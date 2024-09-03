import React from 'react';
import ReactDOM from 'react-dom';
import './stylesConfirm/ConfirmationModal.css'

const ConfirmationModal = ({ 
    isOpen, 
    onConfirm, 
    onCancel, 
    message, 
    descripcion, 
    solucion, 
    className, 
    overlayClassName 
}) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className={`confirmation-modal-overlay ${overlayClassName}`}>
            <div className={`confirmation-modal ${className}`}>
                <h2>Confirmar Acción</h2>
                <p>{message}</p>

                {descripcion && (
                    <div className="modal-preview">
                        <h3>Descripción:</h3>
                        <p>{descripcion}</p>
                    </div>
                )}

                {solucion && (
                    <div className="modal-preview">
                        <h3>Solución:</h3>
                        <p>{solucion}</p>
                    </div>
                )}

                <div className="modal-actions">
                    <button onClick={onConfirm} className="btn btn-confirm">Aceptar</button>
                    <button onClick={onCancel} className="btn btn-cancel">Cancelar</button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmationModal;