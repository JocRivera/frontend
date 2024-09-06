import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Card,
  Container,
  Row,
  Col,
  Table,
} from "react-bootstrap";
import { FaUpload, FaTrash, FaEdit, FaClipboardList } from "react-icons/fa"; // Importación de iconos
import "../../../styles/PlanStyle.css";

// Función para generar un ID autoincrementable simple
let nextId = 1;
const generateUniqueId = () => {
  return nextId++;
};
//

const PlanManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [showAccommodationsModal, setShowAccommodationsModal] = useState(false);
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    price: "",
    salePrice: "",
    capacity: "",
    status: "disponible",
    image: null,
    services: [],
    accommodations: [],
  });
  const [editPlan, setEditPlan] = useState({});
  const [errors, setErrors] = useState({});

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsPlan, setDetailsPlan] = useState({});

  useEffect(() => {
    if (showAddModal) {
      // Resetear el estado newPlan al abrir el modal
      setNewPlan({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        price: "",
        salePrice: "",
        capacity: "",
        status: "disponible",
        image: null,
        services: [],
        accommodations: [],
      });
      setErrors({});
    }
  }, [showAddModal]);

  const validate = (values) => {
    const errors = {};
    if (!values.name) errors.name = "El nombre es requerido";
    if (!values.description) errors.description = "La descripción es requerida";
    if (!values.startDate) errors.startDate = "La fecha de inicio es requerida";
    if (!values.endDate) errors.endDate = "La fecha de fin es requerida";
    if (!values.price) errors.price = "El precio es requerido";
    if (!values.salePrice) errors.salePrice = "El precio de venta es requerido";
    if (!values.capacity) errors.capacity = "La capacidad es requerida";
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPlan((prevPlan) => ({
      ...prevPlan,
      [name]: value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditPlan((prevPlan) => ({
      ...prevPlan,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPlan((prevPlan) => ({
          ...prevPlan,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPlan((prevPlan) => ({
          ...prevPlan,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(newPlan);
    if (Object.keys(validationErrors).length === 0) {
      const planWithId = { ...newPlan, id: generateUniqueId() };
      setPlans((prevPlans) => [...prevPlans, planWithId]);
      console.log("Plan added:", planWithId); // Para depurar
      setNewPlan({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        price: "",
        salePrice: "",
        capacity: "",
        status: "disponible",
        image: null,
        services: [],
        accommodations: [],
      });
      setErrors({});
      setShowAddModal(false);
    } else {
      setErrors(validationErrors);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(editPlan);
    if (Object.keys(validationErrors).length === 0) {
      setPlans((prevPlans) =>
        prevPlans.map((plan) => (plan.id === editPlan.id ? editPlan : plan))
      );
      setEditPlan({});
      setShowEditModal(false);
    } else {
      setErrors(validationErrors);
    }
  };

  // const handleViewDetails = (plan) => {
  //     setEditPlan(plan);
  //     setShowEditModal(true);
  // };

  const handleDelete = (planToDelete) => {
    setPlans((prevPlans) =>
      prevPlans.filter((plan) => plan.id !== planToDelete.id)
    );
  };

  return (
    <div className="container mt-5">
      <Button
        variant="primary"
        className="mb-3"
        onClick={() => setShowAddModal(true)}
      >
        Añadir Plan
      </Button>

      <Row>
        {plans.map((plan) => (
          <Col md={4} key={plan.id} className="mb-4">
            <Card>
              <Card.Body className="d-flex flex-column justify-content-between">
                <Card.Title className="text-center text-uppercase">
                  {plan.name}
                </Card.Title>
                {plan.image && (
                  <div className="text-center mb-3">
                    <img
                      src={plan.image}
                      alt={plan.name}
                      style={{
                        maxWidth: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}
                <div>
                  <Card.Text>
                    <strong>Descripción:</strong> {plan.description}
                  </Card.Text>
                  <Card.Text>
                    <strong>Fecha de Inicio:</strong> {plan.startDate}
                  </Card.Text>
                  <Card.Text>
                    <strong>Fecha Fin:</strong> {plan.endDate}
                  </Card.Text>
                  <Card.Text>
                    <strong>Precio:</strong> {plan.price}
                  </Card.Text>
                  <Card.Text>
                    <strong>Precio de Venta:</strong> {plan.salePrice}
                  </Card.Text>
                  <Card.Text>
                    <strong>Capacidad:</strong> {plan.capacity}
                  </Card.Text>
                  <Card.Text>
                    <strong>Estado:</strong> {plan.status}
                  </Card.Text>
                </div>

                {/* Raya con sombra */}
                <div className="divider"></div>

                <div className="d-flex justify-content-between mt-2">
                  <Button
                    variant="primary"
                    className="btn-lg"
                    onClick={() => {
                      setDetailsPlan(plan);
                      setShowDetailsModal(true);
                    }}
                  >
                    <FaClipboardList className="custom-icon" />
                  </Button>
                  <Button
                    variant="warning"
                    className="btn-lg"
                    onClick={() => {
                      setEditPlan(plan);
                      setShowEditModal(true);
                    }}
                  >
                    <FaEdit className="custom-icon" />
                  </Button>
                  <Button
                    variant="danger"
                    className="btn-lg"
                    onClick={() => handleDelete(plan)}
                  >
                    <FaTrash className="custom-icon" />
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal para añadir plan */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Añadir Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={newPlan.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formDescription">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    value={newPlan.description}
                    onChange={handleChange}
                    isInvalid={!!errors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formStartDate">
                  <Form.Label>Fecha de Inicio</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={newPlan.startDate}
                    onChange={handleChange}
                    isInvalid={!!errors.startDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.startDate}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formEndDate">
                  <Form.Label>Fecha Fin</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={newPlan.endDate}
                    onChange={handleChange}
                    isInvalid={!!errors.endDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.endDate}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formCapacity">
                  <Form.Label>Capacidad</Form.Label>
                  <Form.Control
                    type="text"
                    name="capacity"
                    value={newPlan.capacity}
                    onChange={handleChange}
                    isInvalid={!!errors.capacity}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.capacity}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formStatus">
                  <Form.Label>Estado</Form.Label>
                  <Form.Control
                    as="select"
                    name="status"
                    value={newPlan.status}
                    onChange={handleChange}
                  >
                    <option value="disponible">Disponible</option>
                    <option value="copado">Copado</option>
                    <option value="en pausa">En Pausa</option>
                    <option value="cerrado">Cerrado</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <div className="d-flex flex-column align-items-center mb-3">
                  <div
                    className="mb-2"
                    style={{
                      width: "100%",
                      height: "200px",
                      border: "1px solid #ddd",
                    }}
                  >
                    {newPlan.image ? (
                      <img
                        src={newPlan.image}
                        alt="Imagen"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div className="d-flex justify-content-center align-items-center h-100">
                        No hay imagen
                      </div>
                    )}
                  </div>
                  <Form.Group className="mb-3">
                    <Form.Label>Imagen</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Form.Group>
                </div>
                <Form.Group className="mb-3" controlId="formPrice">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control
                    type="text"
                    name="price"
                    value={newPlan.price}
                    onChange={handleChange}
                    isInvalid={!!errors.price}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.price}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formSalePrice">
                  <Form.Label>Precio de Venta</Form.Label>
                  <Form.Control
                    type="text"
                    name="salePrice"
                    value={newPlan.salePrice}
                    onChange={handleChange}
                    isInvalid={!!errors.salePrice}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.salePrice}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Table bordered>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Cantidad</th>
                      <th>Precio</th>
                      <th>Total</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newPlan.services.map((service, index) => (
                      <tr key={index}>
                        <td>{service.name}</td>
                        <td>{service.quantity}</td>
                        <td>{service.price}</td>
                        <td>{service.total}</td>
                        <td>
                          <FaTrash style={{ cursor: "pointer" }} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Button
                  variant="primary"
                  onClick={() => setShowServicesModal(true)}
                >
                  Añadir Servicio
                </Button>
              </Col>
              <Col md={6}>
                <Table bordered>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Tipo</th>
                      <th>Precio</th>
                      <th>Capacidad</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newPlan.accommodations.map((accommodation, index) => (
                      <tr key={index}>
                        <td>{accommodation.name}</td>
                        <td>{accommodation.type}</td>
                        <td>{accommodation.price}</td>
                        <td>{accommodation.capacity}</td>
                        <td>
                          <FaTrash style={{ cursor: "pointer" }} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Button
                  variant="primary"
                  onClick={() => setShowAccommodationsModal(true)}
                >
                  Añadir Alojamiento
                </Button>
              </Col>
            </Row>
            <br />
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal para editar plan */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={editPlan.name || ""}
                    onChange={handleEditChange}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formDescription">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    value={editPlan.description || ""}
                    onChange={handleEditChange}
                    isInvalid={!!errors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formStartDate">
                  <Form.Label>Fecha de Inicio</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={editPlan.startDate || ""}
                    onChange={handleEditChange}
                    isInvalid={!!errors.startDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.startDate}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formEndDate">
                  <Form.Label>Fecha Fin</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={editPlan.endDate || ""}
                    onChange={handleEditChange}
                    isInvalid={!!errors.endDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.endDate}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formCapacity">
                  <Form.Label>Capacidad</Form.Label>
                  <Form.Control
                    type="text"
                    name="capacity"
                    value={editPlan.capacity || ""}
                    onChange={handleEditChange}
                    isInvalid={!!errors.capacity}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.capacity}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formStatus">
                  <Form.Label>Estado</Form.Label>
                  <Form.Control
                    as="select"
                    name="status"
                    value={editPlan.status || "disponible"}
                    onChange={handleEditChange}
                  >
                    <option value="disponible">Disponible</option>
                    <option value="copado">Copado</option>
                    <option value="en pausa">En Pausa</option>
                    <option value="cerrado">Cerrado</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <div className="d-flex flex-column align-items-center mb-3">
                  <div
                    className="mb-2"
                    style={{
                      width: "100%",
                      height: "200px",
                      border: "1px solid #ddd",
                    }}
                  >
                    {editPlan.image ? (
                      <img
                        src={editPlan.image}
                        alt="Imagen"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div className="d-flex justify-content-center align-items-center h-100">
                        No hay imagen
                      </div>
                    )}
                  </div>
                  <Form.Group className="mb-3">
                    <Form.Label>Imagen</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageChange}
                    />
                  </Form.Group>
                </div>
                <Form.Group className="mb-3" controlId="formPrice">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control
                    type="text"
                    name="price"
                    value={editPlan.price || ""}
                    onChange={handleEditChange}
                    isInvalid={!!errors.price}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.price}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formSalePrice">
                  <Form.Label>Precio de Venta</Form.Label>
                  <Form.Control
                    type="text"
                    name="salePrice"
                    value={editPlan.salePrice || ""}
                    onChange={handleEditChange}
                    isInvalid={!!errors.salePrice}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.salePrice}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Table bordered>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Cantidad</th>
                      <th>Precio</th>
                      <th>Total</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editPlan.services?.map((service, index) => (
                      <tr key={index}>
                        <td>{service.name}</td>
                        <td>{service.quantity}</td>
                        <td>{service.price}</td>
                        <td>{service.total}</td>
                        <td>
                          <FaTrash style={{ cursor: "pointer" }} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Button
                  variant="primary"
                  onClick={() => setShowServicesModal(true)}
                >
                  Añadir Servicio
                </Button>
              </Col>
              <Col md={6}>
                <Table bordered>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Tipo</th>
                      <th>Precio</th>
                      <th>Capacidad</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editPlan.accommodations?.map((accommodation, index) => (
                      <tr key={index}>
                        <td>{accommodation.name}</td>
                        <td>{accommodation.type}</td>
                        <td>{accommodation.price}</td>
                        <td>{accommodation.capacity}</td>
                        <td>
                          <FaTrash style={{ cursor: "pointer" }} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Button
                  variant="primary"
                  onClick={() => setShowAccommodationsModal(true)}
                >
                  Añadir Alojamiento
                </Button>
              </Col>
            </Row>
            <br />
            <Button variant="primary" type="submit">
              Guardar Cambios
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      {/* Modal para detalles del plan */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={detailsPlan.name || ""}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  value={detailsPlan.description || ""}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fecha de Inicio</Form.Label>
                <Form.Control
                  type="date"
                  value={detailsPlan.startDate || ""}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fecha Fin</Form.Label>
                <Form.Control
                  type="date"
                  value={detailsPlan.endDate || ""}
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <div className="d-flex flex-column align-items-center mb-3">
                <div
                  className="mb-2"
                  style={{
                    width: "100%",
                    height: "200px",
                    border: "1px solid #ddd",
                  }}
                >
                  {detailsPlan.image ? (
                    <img
                      src={detailsPlan.image}
                      alt="Imagen"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{ height: "100%" }}
                    >
                      <FaUpload size={50} />
                      <p className="text-muted mt-2">No hay imagen</p>
                    </div>
                  )}
                </div>
              </div>
              <Form.Group className="mb-3" controlId="formPrice">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                  type="text"
                  name="price"
                  value={detailsPlan.price || ""}
                  readOnly
                />
                <Form.Control.Feedback type="invalid">
                  {errors.price}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formSalePrice">
                <Form.Label>Precio de Venta</Form.Label>
                <Form.Control
                  type="text"
                  name="salePrice"
                  value={detailsPlan.salePrice || ""}
                  readOnly
                />
                <Form.Control.Feedback type="invalid">
                  {errors.salePrice}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <h5>Servicios</h5>
              <Table striped bordered hover className="mt-2">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {detailsPlan.services &&
                    detailsPlan.services.map((service, index) => (
                      <tr key={index}>
                        <td>{service.name}</td>
                        <td>{service.quantity}</td>
                        <td>{service.price}</td>
                        <td>{service.total}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Col>
            <Col>
              <h5>Alojamientos</h5>
              <Table striped bordered hover className="mt-2">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Precio</th>
                    <th>Capacidad</th>
                  </tr>
                </thead>
                <tbody>
                  {detailsPlan.accommodations &&
                    detailsPlan.accommodations.map((accommodation, index) => (
                      <tr key={index}>
                        <td>{accommodation.name}</td>
                        <td>{accommodation.type}</td>
                        <td>{accommodation.price}</td>
                        <td>{accommodation.capacity}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDetailsModal(false)}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para añadir servicio */}
      <Modal
        show={showServicesModal}
        onHide={() => setShowServicesModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Añadir Servicio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Implementación de modal de servicios aquí */}
        </Modal.Body>
      </Modal>

      {/* Modal para añadir alojamiento */}
      <Modal
        show={showAccommodationsModal}
        onHide={() => setShowAccommodationsModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Añadir Alojamiento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Implementación de modal de alojamientos aquí */}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PlanManagement;
