// RoomsManagement.js
import React, { useState } from 'react';
import { Button, Card, Modal, Form, Row, Col } from 'react-bootstrap';
import TableComodidad from '../cabins/ComodidadTable'; // Asegúrate de que este componente esté importado correctamente
import AlertSwitch from '../cabins/AlertSwitch'; // Importar el componente de alertas
import '../cabins/Cabins.css'; // Cambiar el nombre del archivo CSS si es necesario

// Componente para gestionar Habitaciones
const RoomsManagement = () => {
  const [roomList, setRoomList] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // Estado para la alerta
  const [alertType, setAlertType] = useState(''); // Tipo de alerta: 'error' o 'success'
  const [showConfirmDelete, setShowConfirmDelete] = useState(false); // Estado para confirmar eliminación
  const [formValues, setFormValues] = useState({
    nombre: '',
    capacidad: '',
    estado: 'Disponible',
    descripcion: '',
    comodidades: [],
    imagen: null,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formValues.nombre) newErrors.nombre = 'Nombre es obligatorio';
    if (!formValues.capacidad) newErrors.capacidad = 'Capacidad es obligatoria';
    if (formValues.capacidad < 1 || formValues.capacidad > 10) newErrors.capacidad = 'Capacidad debe estar entre 1 y 10';
    if (!formValues.descripcion) newErrors.descripcion = 'Descripción es obligatoria';
    if (!formValues.imagen) newErrors.imagen = 'Imagen es obligatoria';
    if (formValues.comodidades.length === 0) newErrors.comodidades = 'Debe agregar al menos una comodidad';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveRoom = () => {
    if (!validateForm()) return;
    if (selectedRoom) {
      // Editar habitación existente
      setRoomList(roomList.map((item) =>
        item.id === formValues.id ? { ...item, ...formValues } : item
      ));
      setAlertType('success');
      setShowAlert(true);
    } else {
      // Agregar nueva habitación
      setRoomList([...roomList, { ...formValues, id: Date.now() }]);
      setAlertType('success');
      setShowAlert(true);
    }
    setShowRoomForm(false);
    setSelectedRoom(null); // Resetear habitación seleccionada
    setFormValues({
      nombre: '',
      capacidad: '',
      estado: 'Disponible',
      descripcion: '',
      comodidades: [],
      imagen: null,
    });
  };

  const handleEditRoom = (room) => {
    setSelectedRoom(room);
    setFormValues({
      nombre: room.nombre,
      capacidad: room.capacidad,
      estado: room.estado,
      descripcion: room.descripcion,
      comodidades: room.comodidades,
      imagen: room.imagen,
      id: room.id, // Necesario para identificar la habitación al editar
    });
    setShowRoomForm(true);
  };

  const handleAddRoom = () => {
    setSelectedRoom(null);
    setShowRoomForm(true);
  };

  const handleViewDetails = (room) => {
    setSelectedRoom(room);
    setShowDetailModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormValues({ ...formValues, imagen: e.target.files[0] });
  };

  const handleComodidadesChange = (newComodidades) => {
    setFormValues({ ...formValues, comodidades: newComodidades });
  };

  const handleConfirmDelete = (room) => {
    setSelectedRoom(room);
    setShowConfirmDelete(true);
  };

  const handleDeleteRoom = () => {
    setRoomList(prevList => prevList.filter(room => room.id !== selectedRoom.id));
    setAlertType('success');
    setShowAlert(true);
    setShowConfirmDelete(false);
    setSelectedRoom(null);
  };

  const filteredRoomList = roomList.filter(room =>
    room.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='container col p-5'>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Control
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="me-2"
        />
      </div>
      <Button variant="primary" onClick={handleAddRoom}>
        Añadir Habitación
      </Button>

      <Row>
        {filteredRoomList.length > 0 ? (
          filteredRoomList.map((room) => (
            <Col md={4} key={room.id} className="mb-3">
              <Card>
                {room.imagen && (
                  <Card.Img variant="top" src={URL.createObjectURL(room.imagen)} />
                )}
                <Card.Body>
                  <Card.Title>{room.nombre}</Card.Title>
                  <Card.Text>Comodidades: {room.comodidades.map(c => c.articulos).join(', ')}</Card.Text>
                  <Card.Text>Capacidad: {room.capacidad}</Card.Text>
                  <Card.Text>Estado: {room.estado}</Card.Text>
                  <Card.Text>Descripción: {room.descripcion}</Card.Text>
                  <Button variant="info" onClick={() => handleEditRoom(room)}>Editar</Button>
                  <Button variant="primary" onClick={() => handleViewDetails(room)}>Ver Detalle</Button>
                  <Button variant="danger" onClick={() => handleConfirmDelete(room)}>Eliminar</Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No se encontraron habitaciones.</p>
        )}
      </Row>

      {showRoomForm && (
        <Modal show={showRoomForm} onHide={() => setShowRoomForm(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{selectedRoom ? 'Editar Habitación' : 'Agregar Habitación'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formValues.nombre}
                  onChange={handleChange}
                  isInvalid={!!errors.nombre}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.nombre}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Capacidad</Form.Label>
                <Form.Control
                  type="number"
                  name="capacidad"
                  value={formValues.capacidad}
                  onChange={handleChange}
                  isInvalid={!!errors.capacidad}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.capacidad}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={formValues.estado}
                  onChange={handleChange}
                >
                  <option>Disponible</option>
                  <option>En mantenimiento</option>
                  <option>Reservada</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  name="descripcion"
                  value={formValues.descripcion}
                  onChange={handleChange}
                  isInvalid={!!errors.descripcion}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.descripcion}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Comodidades</Form.Label>
                <TableComodidad
                  comodidades={formValues.comodidades}
                  onUpdateComodidades={handleComodidadesChange}
                />
                {errors.comodidades && (
                  <div className="text-danger">
                    {errors.comodidades}
                  </div>
                )}
              </Form.Group>
              <Form.Group>
                <Form.Label>Imagen</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleFileChange}
                  isInvalid={!!errors.imagen}
                />
                {formValues.imagen && (
                  <img
                    src={URL.createObjectURL(formValues.imagen)}
                    alt="Vista previa"
                    style={{ width: '100%', marginTop: '10px' }}
                  />
                )}
                <Form.Control.Feedback type="invalid">
                  {errors.imagen}
                </Form.Control.Feedback>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRoomForm(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSaveRoom}>
              {selectedRoom ? 'Actualizar' : 'Guardar'}
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {showDetailModal && (
        <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Detalles de la Habitación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>{selectedRoom?.nombre}</h4>
            {selectedRoom?.imagen && (
              <img
                src={URL.createObjectURL(selectedRoom.imagen)}
                alt="Imagen de habitación"
                style={{ width: '100%', marginBottom: '15px' }}
              />
            )}
            <p><strong>Capacidad:</strong> {selectedRoom?.capacidad}</p>
            <p><strong>Estado:</strong> {selectedRoom?.estado}</p>
            <p><strong>Descripción:</strong> {selectedRoom?.descripcion}</p>
            <p><strong>Comodidades:</strong> {selectedRoom?.comodidades.map(c => c.articulos).join(', ')}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {showAlert && (
        <AlertSwitch
          show={showAlert}
          handleClose={() => setShowAlert(false)}
          title={alertType === 'success' ? 'Éxito' : 'Error'}
          message={alertType === 'success' ? 'Operación realizada con éxito.' : 'Se ha producido un error.'}
          onConfirm={() => setShowAlert(false)}
        />
      )}

      {/* Modal de confirmación para eliminar habitación */}
      <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar la habitación {selectedRoom?.nombre}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDeleteRoom}>Eliminar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RoomsManagement;
