import React from "react";
import { Modal, Button } from "react-bootstrap";

const EliminarModal =({show,handleClose,handleConfirm ,itemName}) => {
    
    return (
    
        <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmación de Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de que deseas eliminar {itemName}?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
        <Button variant="danger" onClick={handleConfirm}>Eliminar</Button>
      </Modal.Footer>
    </Modal>

    )
}

export default EliminarModal