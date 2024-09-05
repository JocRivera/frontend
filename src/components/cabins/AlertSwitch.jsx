import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const AlertSwitch = ({ show, handleClose, title, message, onConfirm, onCancel }) => {
  const handleConfirm = () => {
    onConfirm();
    handleClose(); // Cierra el modal después de confirmar
  };

  const handleCancel = () => {
    onCancel();
    handleClose(); // Cierra el modal después de cancelar
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>Cancelar</Button>
        <Button variant="danger" onClick={handleConfirm}>Confirmar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AlertSwitch;
