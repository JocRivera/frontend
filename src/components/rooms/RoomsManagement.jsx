import React, { useState } from 'react';
import { Button, Card, Modal, Form, Row, Col } from 'react-bootstrap';
import TableComodidad from '../cabins/ComodidadTable'; 
import Swal from 'sweetalert2'; 
import '../cabins/Cabins.css'; 

// Componente para gestionar Habitaciones
const RoomsManagement = () => {
  const [roomList, setRoomList] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

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
    if (!formValues.nombre) newErrors.nombre = "Nombre es obligatorio";
    if (!formValues.capacidad) newErrors.capacidad = "Capacidad es obligatoria";
    if (formValues.capacidad < 3 || formValues.capacidad > 7)
      newErrors.capacidad = "Capacidad debe estar entre 3 y 7";
    if (!formValues.descripcion)
      newErrors.descripcion = "Descripción es obligatoria";
    if (!formValues.imagen) newErrors.imagen = "Imagen es obligatoria";
    if (formValues.comodidades.length === 0)
      newErrors.comodidades = "Debe agregar al menos una comodidad";

    setErrors(newErrors);

    // Si hay errores, mostrar la alerta
    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        title: "Errores en el formulario",
        html: Object.values(newErrors).join("<br>"), // Muestra todos los errores en líneas separadas
        icon: "error",
        confirmButtonText: "Ok",
      });
      return false;
    }

    return true;
  };

  const handleSaveRoom = () => {
    if (!validateForm()) return;
    if (selectedRoom) {
      // Editar habitación existente
      setRoomList(
        roomList.map((item) =>
          item.id === formValues.id ? { ...item, ...formValues } : item
        )
      );
      Swal.fire({
        title: "Habitación editada con éxito",
        text: "La habitación ha sido editada con éxito.",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });
    } else {
      // Agregar nueva habitación
      setRoomList([...roomList, { ...formValues, id: Date.now() }]);
      Swal.fire({
        title: "Habitación agregada con éxito",
        text: "La habitación ha sido agregada con éxito.",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });
    }
    setShowRoomForm(false);
    setSelectedRoom(null); // Resetear habitación seleccionada
    setFormValues({
      nombre: "",
      capacidad: "",
      estado: "Disponible",
      descripcion: "",
      comodidades: [],
      imagen: null,
    });
  };

  const validateField = (name, value) => {
    switch (name) {
      case "nombre":
        return value.length < 4
          ? "El nombre debe tener al menos 4 caracteres"
          : "";
      case "capacidad":
        if (!value) return "Capacidad es obligatoria";
        if (value < 3 || value > 7) return "Capacidad debe estar entre 3 y 7";
        return "";
      case "descripcion":
        return value.length < 6
          ? "Descripción es obligatoria, mínimo 6 caracteres"
          : "";
      case "imagen":
        return !value ? "Imagen es obligatoria" : "";
      case "comodidades":
        return value.length === 0 ? "Debe agregar al menos una comodidad" : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Obtener el primer archivo del array de archivos
    const error = validateField("imagen", file);
    setErrors({ ...errors, imagen: error });
    setFormValues({ ...formValues, imagen: file });
  }

  const handleComodidadesChange = (newComodidades) => {
    const error = validateField("comodidades", newComodidades);
    setErrors({ ...errors, comodidades: error });
    setFormValues({ ...formValues, comodidades: newComodidades });
  };

  const handleEditRoom = (room) => {
    Swal.fire({
      title: "¿Estás seguro de editar esta habitación?",
      text: "Los cambios no podrán ser revertidos.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, editar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
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
      }
    });
  };

  const handleAddRoom = () => {
    setSelectedRoom(null);
    setShowRoomForm(true);
  };

  const handleViewDetails = (room) => {
    setSelectedRoom(room);
    setShowDetailModal(true);
  };

  const handleDeleteRoom = (room) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setRoomList(roomList.filter((u) => u.id !== room.id));
        Swal.fire({
          title: "Habitación eliminada con éxito",
          text: "La habitación ha sido eliminada con éxito.",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    });
  };

  const filteredRoomList = roomList.filter((room) =>
    room.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="container col p-5 mt-3 "
      style={{ minHeight: "100vh", marginRight : "850px", marginTop  : "50px"}}
    >
      <h1>Lista de Habitaciones</h1>
      <div
        className="d-flex justify-content-start align-items-center mb-2"
        style={{ gap: "750px" }}
      >
        <Form.Control
          style={{ maxWidth: "300px", marginRight: "20px" }}
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="me-2"
        />
        <Button variant="primary" onClick={handleAddRoom}>
          Añadir Habitación
        </Button>
      </div>

      <Row>
        {filteredRoomList.length > 0 ? (
          filteredRoomList.map((room) => (
            <Col md={4} key={room.id} className="mb-3">
              <Card>
                {room.imagen && (
                  <Card.Img
                    variant="top"
                    src={URL.createObjectURL(room.imagen)}
                  />
                )}
                <Card.Body>
                  <Card.Title>{room.nombre}</Card.Title>
                  <Card.Text>
                    Comodidades:{" "}
                    {room.comodidades.map((c) => c.articulos).join(", ")}
                  </Card.Text>
                  <Card.Text>Capacidad: {room.capacidad}</Card.Text>
                  <Card.Text>Estado: {room.estado}</Card.Text>
                  <Card.Text>Descripción: {room.descripcion}</Card.Text>
                  <Button
                    variant="info"
                    onClick={() => handleEditRoom(room)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleViewDetails(room)}
                  >
                    Ver Detalle
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteRoom(room)}
                  >
                    Eliminar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No se encontraron habitaciones.</p>
        )}
      </Row>

      {showRoomForm && (
        <Modal
          show={showRoomForm}
          onHide={() => setShowRoomForm(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedRoom ? "Editar Habitación" : "Agregar Habitación"}
            </Modal.Title>
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
                  <div className="text-danger">{errors.comodidades}</div>
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
                    style={{ width: "100%", marginTop: "10px" }}
                  />
                )}
                <Form.Control.Feedback type="invalid">
                  {errors.imagen}
                </Form.Control.Feedback>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowRoomForm(false)}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSaveRoom}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {showDetailModal && (
        <Modal
          show={showDetailModal}
          onHide={() => setShowDetailModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Detalles de la Habitación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card>
              {selectedRoom.imagen && (
                <Card.Img
                  variant="top"
                  src={URL.createObjectURL(selectedRoom.imagen)}
                />
              )}
              <Card.Body>
                <Card.Title>{selectedRoom.nombre}</Card.Title>
                <Card.Text>
                  Comodidades:{" "}
                  {selectedRoom.comodidades
                    .map((c) => c.articulos)
                    .join(", ")}
                </Card.Text>
                <Card.Text>Capacidad: {selectedRoom.capacidad}</Card.Text>
                <Card.Text>Estado: {selectedRoom.estado}</Card.Text>
                <Card.Text>Descripción: {selectedRoom.descripcion}</Card.Text>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDetailModal(false)}
            >
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default RoomsManagement; 