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

  const validateField = (name, value) => {
    switch (name) {
      case 'nombre':
        return value.length  < 4 ? 'El nombre debe tener al menos 4 caracteres' : '';
      case 'capacidad':
        if (!value) return 'Capacidad es obligatoria';
        if (value < 4 || value > 7) return 'Capacidad debe estar entre 3 y 7';
        return '';
      case 'descripcion':
       return  value.length <6 ?  'Descripción es obligatoria minimo 6 caracteres' : '';
        // return '';

      case 'imagen':
        return !value ? 'Imagen es obligatoria' : '';
      case 'comodidades':
        return value.length === 0 ? 'Debe agregar al menos una comodidad' : '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const error = validateField('imagen', file);
    setErrors({ ...errors, imagen: error });
    setFormValues({ ...formValues, imagen: file });
  };

  const handleComodidadesChange = (newComodidades) => {
    const error = validateField('comodidades', newComodidades);
    setErrors({ ...errors, comodidades: error });
    setFormValues({ ...formValues, comodidades: newComodidades });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formValues).forEach((key) => {
      const error = validateField(key, formValues[key]);
      if (error) newErrors[key] = error;
    });
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
    <div className='container ' style={ { minHeight: '100vh', paddingTop: '60px' } } >
      <h1>Lista de Habitaciones</h1>
      <div className="d-flex justify-content-start align-items-center mb-2" style={{ gap: '750px' }}>
  <Form.Control 
    size="sm"
    style={{ maxWidth: '300px', marginRight: '20px' }}
    type="text"
    placeholder="Buscar por nombre"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="me-2"
  />
  <Button variant="primary" onClick={handleAddRoom} style={{left : '10px'}}>
    Añadir Habitación
  </Button>
</div>

     

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
            <Button variant="secondary" onClick={() => setShowRoomForm(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSaveRoom}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {selectedRoom && (
        <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size=" sm">
          <Modal.Header closeButton>
            <Modal.Title>Detalles de la Habitación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card>
              {selectedRoom.imagen && (
                <Card.Img variant="top" style={{ width: '50%', height: '300px', }} src={URL.createObjectURL(selectedRoom.imagen)} />

              )}
              <Card.Body>
                <Card.Title>{selectedRoom.nombre}</Card.Title>
                <Card.Text>Capacidad: {selectedRoom.capacidad}</Card.Text>
                <Card.Text>Estado: {selectedRoom.estado}</Card.Text>
                <Card.Text>Descripción: {selectedRoom.descripcion}</Card.Text>
                <Card.Text>Comodidades: {selectedRoom.comodidades.map(c => c.articulos).join(', ')}</Card.Text>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <AlertSwitch showAlert={showAlert} setShowAlert={setShowAlert} alertType={alertType} />

      <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar la habitación {selectedRoom?.nombre}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteRoom}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RoomsManagement;
