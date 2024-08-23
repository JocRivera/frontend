import React, { useState } from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import CabanaList from './CabanaList';
import RegistroCabanaForm from './RegitroCabanaForm';

const CabinsPage = () => {
  const [cabanas, setCabanas] = useState([]);
  const [cabanaEnEdicion, setCabanaEnEdicion] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleAddCabana = (nuevaCabana) => {
    if (cabanaEnEdicion) {
      setCabanas(
        cabanas.map((cabana) =>
          cabana.id === cabanaEnEdicion.id ? { ...nuevaCabana, id: cabanaEnEdicion.id } : cabana
        )
      );
      setCabanaEnEdicion(null);
    } else {
      setCabanas([...cabanas, { ...nuevaCabana, id: cabanas.length + 1 }]);
    }
    setShowModal(false);
  };

  const handleEditCabana = (cabana) => {
    setCabanaEnEdicion(cabana);
    setShowModal(true);
  };

  const handleRemoveCabana = (id) => {
    setCabanas(cabanas.filter(cabana => cabana.id !== id));
  };

  const handleCloseModal = () => {
    setCabanaEnEdicion(null);
    setShowModal(false);
  };

  return (
    <div className='container col p-5'>
      <Button variant="primary" onClick={() => setShowModal(true)}>Agregar Nueva Cabaña</Button>
      <CabanaList cabanas={cabanas} onEdit={handleEditCabana} onRemove={handleRemoveCabana} />
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{cabanaEnEdicion ? 'Editar Cabaña' : 'Registrar Nueva Cabaña'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RegistroCabanaForm onAddCabana={handleAddCabana} cabanaEnEdicion={cabanaEnEdicion} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CabinsPage;
