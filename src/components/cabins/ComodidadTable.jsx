import React, { useState } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';

// Componente para gestionar Comodidades dentro del formulario de Cabaña
const TableComodidad = ({ comodidades, onUpdateComodidades }) => {
  const [selectedComodidad, setSelectedComodidad] = useState(null);
  const [showComodidadModal, setShowComodidadModal] = useState(false);

  const handleAddComodidad = () => {
    setSelectedComodidad(null);
    setShowComodidadModal(true);
  };

  const handleSaveComodidad = (comodidad) => {
    if (selectedComodidad) {
      onUpdateComodidades(comodidades.map((item) => (item.id === comodidad.id ? comodidad : item)));
    } else {
      onUpdateComodidades([...comodidades, { ...comodidad, id: Date.now() }]);
    }
    setShowComodidadModal(false);
  };

  const handleEditComodidad = (comodidad) => {
    setSelectedComodidad(comodidad);
    setShowComodidadModal(true);
  };

  const handleDeleteComodidad = (id) => {
    onUpdateComodidades(comodidades.filter((item) => item.id !== id));
  };

  return (
    <div>
      <Button onClick={handleAddComodidad}>Agregar Comodidad</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Artículos</th>
            <th>Observación</th>
            <th>Fecha de Ingreso</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {comodidades.map((comodidad) => (
            <tr key={comodidad.id}>
              <td>{comodidad.id}</td>
              <td>{comodidad.articulos}</td>
              <td>{comodidad.observacion}</td>
              <td>{new Date(comodidad.fechaIngreso).toLocaleDateString()}</td>
              <td>{comodidad.estado}</td>
              <td>
                <Button variant="info" onClick={() => handleEditComodidad(comodidad)}>Editar</Button>
                <Button variant="danger" onClick={() => handleDeleteComodidad(comodidad.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showComodidadModal && (
        <ModalComodidad
          show={showComodidadModal}
          onHide={() => setShowComodidadModal(false)}
          comodidad={selectedComodidad}
          onSave={handleSaveComodidad}
        />
      )}
    </div>
  );
};

// Modal para agregar/editar Comodidades
const ModalComodidad = ({ show, onHide, comodidad, onSave }) => {
  const [articulos, setArticulos] = useState(comodidad?.articulos || '');
  const [observacion, setObservacion] = useState(comodidad?.observacion || '');
  const [fechaIngreso, setFechaIngreso] = useState(comodidad?.fechaIngreso || '');
  const [estado, setEstado] = useState(comodidad?.estado || 'Disponible');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!articulos.trim()) newErrors.articulos = 'El campo Artículos es obligatorio';
    if (!observacion.trim()) newErrors.observacion = 'El campo Observación es obligatorio';
    if (!fechaIngreso) newErrors.fechaIngreso = 'El campo Fecha de Ingreso es obligatorio';
    if (isNaN(new Date(fechaIngreso).getTime())) newErrors.fechaIngreso = 'Fecha de Ingreso inválida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    onSave({ ...comodidad, articulos, observacion, fechaIngreso, estado });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{comodidad ? 'Editar Comodidad' : 'Agregar Comodidad'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Artículos</Form.Label>
            <Form.Control
              type="text"
              value={articulos}
              onChange={(e) => setArticulos(e.target.value)}
              isInvalid={!!errors.articulos}
            />
            <Form.Control.Feedback type="invalid">
              {errors.articulos}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Observación</Form.Label>
            <Form.Control
              type="text"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              isInvalid={!!errors.observacion}
            />
            <Form.Control.Feedback type="invalid">
              {errors.observacion}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Fecha de Ingreso</Form.Label>
            <Form.Control
              type="date"
              value={fechaIngreso}
              onChange={(e) => setFechaIngreso(e.target.value)}
              isInvalid={!!errors.fechaIngreso}
            />
            <Form.Control.Feedback type="invalid">
              {errors.fechaIngreso}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Estado</Form.Label>
            <Form.Control
              as="select"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option>Disponible</option>
              <option>En reparación</option>
              <option>No disponible</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TableComodidad;
