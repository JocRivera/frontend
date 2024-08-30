// AlertSwitch.js
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './Cabins.css'

const AlertSwitch = ({ show, handleClose, title, message, onConfirm, onCancel }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button variant="danger" onClick={onConfirm}>Confirmar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AlertSwitch;
