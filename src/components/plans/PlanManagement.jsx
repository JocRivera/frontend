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
import { FaUpload, FaTrash, FaEdit, FaClipboardList } from "react-icons/fa";
import Swal from "sweetalert2";
import "../../../styles/PlanStyle.css";

// Función para generar un ID autoincrementable simple
let nextId = 1;
const generateUniqueId = () => {
  return nextId++;
};
//
// Datos quemados para servicios y alojamientos
const serviciosQuemados = [
  { id: 1, name: "Desayuno", price: 10 },
  { id: 2, name: "Almuerzo", price: 15 },
  { id: 3, name: "Cena", price: 20 },
  { id: 4, name: "Tour guiado", price: 50 },
];

const alojamientosQuemados = [
  { id: 1, name: "Habitación individual", type: "Individual", price: 50, capacity: 1 },
  { id: 2, name: "Habitación doble", type: "Doble", price: 80, capacity: 2 },
  { id: 3, name: "Suite familiar", type: "Familiar", price: 150, capacity: 4 },
];

const PlanManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [showAccommodationsModal, setShowAccommodationsModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceQuantity, setServiceQuantity] = useState(1);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
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
  const [touchedFields, setTouchedFields] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

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
      setTouchedFields({});
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
    if (values.capacity && (parseInt(values.capacity) < 1 || parseInt(values.capacity) > 50)) {
      errors.capacity = "La capacidad debe estar entre 1 y 50";
    }
    if (!values.image) errors.image = "La imagen es requerida";
    // if (values.services.length === 0) errors.services = "Debe agregar al menos un servicio";
    // if (values.accommodations.length === 0) errors.accommodations = "Debe agregar al menos un alojamiento";
    return errors;
  };

  const handleAddService = () => {
    if (selectedService && serviceQuantity > 0) {
      const newService = {
        ...selectedService,
        quantity: serviceQuantity,
        total: selectedService.price * serviceQuantity,
      };
      if (showAddModal) {
        setNewPlan((prevPlan) => ({
          ...prevPlan,
          services: [...prevPlan.services, newService],
        }));
      } else if (showEditModal) {
        setEditPlan((prevPlan) => ({
          ...prevPlan,
          services: [...prevPlan.services, newService],
        }));
      }
      setShowServicesModal(false);
      setSelectedService(null);
      setServiceQuantity(1);
    }
  };

  const handleAddAccommodation = () => {
    if (selectedAccommodation) {
      if (showAddModal) {
        setNewPlan((prevPlan) => ({
          ...prevPlan,
          accommodations: [...prevPlan.accommodations, selectedAccommodation],
        }));
      } else if (showEditModal) {
        setEditPlan((prevPlan) => ({
          ...prevPlan,
          accommodations: [...prevPlan.accommodations, selectedAccommodation],
        }));
      }
      setShowAccommodationsModal(false);
      setSelectedAccommodation(null);
    }
  };

  const handleRemoveService = (index, isEditMode = false) => {
    if (isEditMode) {
      setEditPlan((prevPlan) => ({
        ...prevPlan,
        services: prevPlan.services.filter((_, i) => i !== index),
      }));
    } else {
      setNewPlan((prevPlan) => ({
        ...prevPlan,
        services: prevPlan.services.filter((_, i) => i !== index),
      }));
    }
  };

  const handleRemoveAccommodation = (index, isEditMode = false) => {
    if (isEditMode) {
      setEditPlan((prevPlan) => ({
        ...prevPlan,
        accommodations: prevPlan.accommodations.filter((_, i) => i !== index),
      }));
    } else {
      setNewPlan((prevPlan) => ({
        ...prevPlan,
        accommodations: prevPlan.accommodations.filter((_, i) => i !== index),
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPlan((prevPlan) => ({
      ...prevPlan,
      [name]: value,
    }));
    setTouchedFields((prevFields) => ({
      ...prevFields,
      [name]: true,
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields((prevFields) => ({
      ...prevFields,
      [name]: true,
    }));
  };

  useEffect(() => {
    const validationErrors = validate(newPlan);
    const touchedErrors = Object.keys(touchedFields).reduce((acc, field) => {
      if (touchedFields[field] && validationErrors[field]) {
        acc[field] = validationErrors[field];
      }
      return acc;
    }, {});
    setErrors(touchedErrors);
  }, [newPlan, touchedFields]);

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
  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(newPlan);
    if (Object.keys(validationErrors).length === 0) {
      const planWithId = { ...newPlan, id: generateUniqueId() };
      setPlans((prevPlans) => [...prevPlans, planWithId]);
      Swal.fire({
        title: "Plan agregado con éxito",
        text: "El plan ha sido agregado correctamente.",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });
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
      setTouchedFields({});
      setShowAddModal(false);
    } else {
      setErrors(validationErrors);
      setTouchedFields(
        Object.keys(newPlan).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {})
      );
      Swal.fire({
        title: "Errores en el formulario",
        html: Object.values(validationErrors).join("<br>"),
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(editPlan);
    if (Object.keys(validationErrors).length === 0) {
      setPlans((prevPlans) =>
        prevPlans.map((plan) => (plan.id === editPlan.id ? editPlan : plan))
      );
      Swal.fire({
        title: "Plan editado con éxito",
        text: "El plan ha sido editado correctamente.",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });
      setEditPlan({});
      setShowEditModal(false);
    } else {
      setErrors(validationErrors);
      Swal.fire({
        title: "Errores en el formulario",
        html: Object.values(validationErrors).join("<br>"),
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  // const handleViewDetails = (plan) => {
  //     setEditPlan(plan);
  //     setShowEditModal(true);
  // };

  const handleDelete = (planToDelete) => {
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
        setPlans((prevPlans) =>
          prevPlans.filter((plan) => plan.id !== planToDelete.id)
        );
        Swal.fire({
          title: "Plan eliminado con éxito",
          text: "El plan ha sido eliminado correctamente.",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <div
      className="container col p-5 mt-3"
      style={{ minHeight: "100vh", marginRight: "1550px", marginTop: "50px" }}

    >
      <h1 className="text-right ">Lista de Planes</h1>

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
        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
        >
          Añadir Plan
        </Button>
      </div>
      {/* <Button
        variant="primary"
        className="mb-3"
        onClick={() => setShowAddModal(true)}
      >
        Añadir Plan
      </Button> */}
      <Row>
        {filteredPlans.length > 0 ? (
          filteredPlans.map((plan) => (
            <Col md={4} key={plan.id} className="mb-4">
              <Card style={{ transition: 'none', transform: 'none' }}>
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
          ))
        ) : (
          <p>No se encontraron cabañas.</p>
        )}
      </Row>
      {/* Modal para añadir plan */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        size="xl"
        style={{ overflowY: 'auto' }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Añadir Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto', minHeight: '750px' }}>
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
                    onBlur={handleBlur}
                    isInvalid={!!errors.name && touchedFields.name}
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
                    onBlur={handleBlur}
                    isInvalid={!!errors.description && touchedFields.description}
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
                    onBlur={handleBlur}
                    isInvalid={!!errors.startDate && touchedFields.startDate}
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
                    onBlur={handleBlur}
                    isInvalid={!!errors.endDate && touchedFields.endDate}
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
                    onBlur={handleBlur}
                    isInvalid={!!errors.capacity && touchedFields.capacity}
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
                    onBlur={handleBlur}
                    isInvalid={!!errors.price && touchedFields.price}
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
                    onBlur={handleBlur}
                    isInvalid={!!errors.salePrice && touchedFields.salePrice}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.salePrice}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
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
                            <FaTrash style={{ cursor: "pointer" }} onClick={() => handleRemoveService(index, true)} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <Button
                  variant="primary"
                  onClick={() => setShowServicesModal(true)}
                >
                  Añadir Servicio
                </Button>
              </Col>
              <Col md={6}>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
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
                            <FaTrash style={{ cursor: "pointer" }} onClick={() => handleRemoveAccommodation(index, true)} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
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
        onHide={() => setShowAddModal(false)}
        size="xl"
        style={{ overflowY: 'auto' }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Añadir Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto', minHeight: '750px' }}>
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
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
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
                            <FaTrash style={{ cursor: "pointer" }} onClick={() => handleRemoveService(index, true)} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <Button
                  variant="primary"
                  onClick={() => setShowServicesModal(true)}
                >
                  Añadir Servicio
                </Button>
              </Col>
              <Col md={6}>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
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
                            <FaTrash style={{ cursor: "pointer" }} onClick={() => handleRemoveAccommodation(index, true)} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
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
              <Form.Group className="mb-3" controlId="formStatus">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  value={detailsPlan.status || ""}
                  readOnly
                >
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
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Seleccionar Servicio</Form.Label>
              <Form.Control
                as="select"
                value={selectedService ? selectedService.id : ""}
                onChange={(e) => setSelectedService(serviciosQuemados.find(s => s.id === parseInt(e.target.value)))}
              >
                <option value="">Seleccione un servicio</option>
                {serviciosQuemados.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - ${service.price}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                value={serviceQuantity}
                onChange={(e) => setServiceQuantity(parseInt(e.target.value))}
                min="1"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowServicesModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddService}>
            Añadir Servicio
          </Button>
        </Modal.Footer>
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
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Seleccionar Alojamiento</Form.Label>
              <Form.Control
                as="select"
                value={selectedAccommodation ? selectedAccommodation.id : ""}
                onChange={(e) => setSelectedAccommodation(alojamientosQuemados.find(a => a.id === parseInt(e.target.value)))}
              >
                <option value="">Seleccione un alojamiento</option>
                {alojamientosQuemados.map((accommodation) => (
                  <option key={accommodation.id} value={accommodation.id}>
                    {accommodation.name} - ${accommodation.price} - Capacidad: {accommodation.capacity}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAccommodationsModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddAccommodation}>
            Añadir Alojamiento
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PlanManagement;