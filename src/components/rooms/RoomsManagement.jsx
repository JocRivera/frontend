import React, { useState } from "react";
import {
  Button,
  Card,
  Modal,
  Form,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import TableComodidad from "../cabins/ComodidadTable";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import { PlusCircle, Edit, Trash, Eye } from "lucide-react";
import "../cabins/Cabins.css";

const RoomsManagement = () => {
  const [roomList, setRoomList] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [formValues, setFormValues] = useState({
    nombre: "",
    capacidad: "",
    estado: "Disponible",
    descripcion: "",
    comodidades: [],
    imagen: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

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
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveRoom = () => {
    if (!validateForm()) return;

    const saveRoom = () => {
      if (selectedRoom) {
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
      setSelectedRoom(null);
      setFormValues({
        nombre: "",
        capacidad: "",
        estado: "Disponible",
        descripcion: "",
        comodidades: [],
        imagen: null,
      });
    };

    if (selectedRoom) {
      Swal.fire({
        title: "¿Estás seguro de guardar los cambios?",
        text: "Los cambios no podrán ser revertidos.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, guardar cambios",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          saveRoom();
        }
      });
    } else {
      saveRoom();
    }
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
      id: room.id,
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

  const paginatedRooms = filteredRoomList.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const getStatusBadgeClass = (estado) => {
    switch (estado) {
      case "Disponible":
        return "bg-success";
      case "En mantenimiento":
        return "bg-warning text-dark";
      case "Reservada":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div
      className="container col p-5 mt-3 "
      style={{ minHeight: "100vh", marginRight: "850px", marginTop: "50px" }}
    >
      <h1 className="mb-4">Lista de Habitaciones</h1>
      <Row className="mb-4">
        <Col md={6}>
          <div className="search-container">
            <Form.Control
              style={{ maxWidth: "300px", marginRight: "20px" }}
              type="text"
              placeholder="Buscar por nombre"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="me-2"
            />
          </div>
        </Col>
        <Col md={6} className="text-md-end">
          <Button
            variant="primary"
            onClick={handleAddRoom}
            className="add-button"
          >
            <PlusCircle size={20} className="me-2" />
            Añadir Habitación
          </Button>
        </Col>
      </Row>
      <Row>
        {paginatedRooms.length > 0 ? (
          paginatedRooms.map((room) => (
            <Col md={6} key={room.id} className="mb-4">
              <Card className="h-100 room-card">
                <Row className="g-0">
                  <Col md={5}>
                    {room.imagen && (
                      <Card.Img
                        src={URL.createObjectURL(room.imagen)}
                        alt={room.nombre}
                        className="room-image"
                      />
                    )}
                  </Col>
                  <Col md={7}>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{room.nombre}</Card.Title>
                      <Card.Text>Capacidad: {room.capacidad}</Card.Text>
                      <Card.Text>Estado: {room.estado}</Card.Text>
                      <Card.Text>
                        Comodidades:{" "}
                        {room.comodidades && room.comodidades.length > 0
                          ? room.comodidades
                              .map((c) => c.nombreArticulo)
                              .join(", ")
                          : "No hay comodidades registradas"}
                      </Card.Text>
                      <div className="mt-auto">
                        <Button
                          variant="outline-primary"
                          onClick={() => handleEditRoom(room)}
                          className="me-2 mb-2"
                        >
                          <Edit size={16} className="me-1" /> Editar
                        </Button>
                        <Button
                          variant="outline-info"
                          onClick={() => handleViewDetails(room)}
                          className="me-2 mb-2"
                        >
                          <Eye size={16} className="me-1" /> Ver Detalle
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={() => handleDeleteRoom(room)}
                          className="mb-2"
                        >
                          <Trash size={16} className="me-1" /> Eliminar
                        </Button>
                      </div>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p>No se encontraron habitaciones.</p>
          </Col>
        )}
      </Row>

      <ReactPaginate
        previousLabel={"Anterior"}
        nextLabel={"Siguiente"}
        breakLabel={"..."}
        pageCount={Math.ceil(filteredRoomList.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination-container"}
        activeClassName={"active"}
      />

      {showRoomForm && (
        <Modal
          show={showRoomForm}
          onHide={() => setShowRoomForm(false)}
          size="lg"
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedRoom ? "Editar Habitación" : "Agregar Habitación"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Container>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        value={formValues.nombre}
                        onChange={(e) =>
                          setFormValues({
                            ...formValues,
                            nombre: e.target.value,
                          })
                        }
                        isInvalid={!!errors.nombre}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.nombre}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Capacidad</Form.Label>
                      <Form.Control
                        type="number"
                        name="capacidad"
                        value={formValues.capacidad}
                        onChange={(e) =>
                          setFormValues({
                            ...formValues,
                            capacidad: e.target.value,
                          })
                        }
                        isInvalid={!!errors.capacidad}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.capacidad}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Estado</Form.Label>
                      <Form.Control
                        as="select"
                        name="estado"
                        value={formValues.estado}
                        onChange={(e) =>
                          setFormValues({
                            ...formValues,
                            estado: e.target.value,
                          })
                        }
                      >
                        <option>Disponible</option>
                        <option>En mantenimiento</option>
                        <option>Reservada</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Descripción</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="descripcion"
                        value={formValues.descripcion}
                        onChange={(e) =>
                          setFormValues({
                            ...formValues,
                            descripcion: e.target.value,
                          })
                        }
                        isInvalid={!!errors.descripcion}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.descripcion}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Imagen</Form.Label>
                      <Form.Control
                        type="file"
                        onChange={(e) =>
                          setFormValues({
                            ...formValues,
                            imagen: e.target.files[0],
                          })
                        }
                        isInvalid={!!errors.imagen}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.imagen}
                      </Form.Control.Feedback>
                    </Form.Group>
                    {formValues.imagen && (
                      <img
                        src={URL.createObjectURL(formValues.imagen)}
                        alt="Vista previa"
                        style={{
                          width: "100%",
                          maxHeight: "150px",
                          objectFit: "cover",
                          marginTop: "10px",
                        }}
                      />
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group className="mt-3">
                      <Form.Label>Comodidades</Form.Label>
                      <TableComodidad
                        comodidades={formValues.comodidades}
                        onUpdateComodidades={(newComodidades) =>
                          setFormValues({
                            ...formValues,
                            comodidades: newComodidades,
                          })
                        }
                      />
                      {errors.comodidades && (
                        <div className="text-danger">{errors.comodidades}</div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
              </Container>
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

{showDetailModal && (
       <Modal
  show={showDetailModal}
  onHide={() => setShowDetailModal(false)}
  size="lg"
  centered
>
  <Modal.Header closeButton className="bg-light">
    <Modal.Title>{selectedRoom.nombre}</Modal.Title>
  </Modal.Header>
  <Modal.Body className="p-0">
    <Row className="g-0">
      <Col md={6}>
        {selectedRoom.imagen && (
          <img
            src={URL.createObjectURL(selectedRoom.imagen)}
            alt={selectedRoom.nombre}
            className="img-fluid rounded-start"
            style={{ objectFit: 'cover', height: '100%', width: '100%' }}
          />
        )}
      </Col>
      <Col md={6}>
        <div className="p-4">
          <h5 className="card-title mb-3">Detalles de la Cabaña</h5>
          <p className="card-text">
            <strong>Capacidad:</strong> {selectedRoom.capacidad} personas
          </p>
          <p className="card-text">
            <strong>Estado:</strong>{' '}
            <span className={`badge ${getStatusBadgeClass(selectedRoom.estado)}`}>
              {selectedRoom.estado}
            </span>
          </p>
          <p className="card-text">
            <strong>Descripción:</strong> {selectedRoom.descripcion}
          </p>
          <div className="mt-4">
            <h6>Comodidades:</h6>
            {selectedRoom.comodidades && selectedRoom.comodidades.length > 0 ? (
              <ul className="list-unstyled">
                {selectedRoom.comodidades.map((c, index) => (
                  <li key={index} className="mb-1">
                    <i className="bi bi-check2-circle me-2 text-success"></i>
                    {c.nombreArticulo}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay comodidades registradas</p>
            )}
          </div>
        </div>
      </Col>
    </Row>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
      Cerrar
    </Button>
  </Modal.Footer>
</Modal>
      )}
    </div>
  );
};

export default RoomsManagement;
