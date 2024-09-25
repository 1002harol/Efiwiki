// __mocks__/react-modal.js
import React from 'react';

const Modal = ({ isOpen, onRequestClose, children }) => (
  isOpen ? <div>{children}</div> : null
);

Modal.setAppElement = jest.fn();

export default Modal;