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
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import "../../../styles/PlanStyle.css";
import { parseISO, startOfDay, isBefore } from 'date-fns';
import { pl } from "date-fns/locale";

// Función para generar un ID TOTALMENTE ÚNICO
const generateUniqueId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2);
  return timestamp + random;
};
//
// // Datos quemados para servicios y alojamientos
// const serviciosQuemados = [
//   { id: 1, name: "Desayuno", price: 10 },
//   { id: 2, name: "Almuerzo", price: 15 },
//   { id: 3, name: "Cena", price: 20 },
//   { id: 4, name: "Tour guiado", price: 50 },
// ];

// const alojamientosQuemados = [
//   { id: 1, name: "Habitación individual", type: "Individual", price: 50, capacity: 1 },
//   { id: 2, name: "Habitación doble", type: "Doble", price: 80, capacity: 2 },
//   { id: 3, name: "Suite familiar", type: "Familiar", price: 150, capacity: 4 },
// ];

const PlanManagement = () => {
  const [plans, setPlans] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [showAccommodationsModal, setShowAccommodationsModal] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    capacity: "",
    status: "disponible",
    image: null,
    price: 0,
    salePrice: 0,
    services: [],
    accommodations: [],
  });
  const [editPlan, setEditPlan] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [serviceQuantity, setServiceQuantity] = useState(1);
  const [accommodationQuantity, setAccommodationQuantity] = useState(1);
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  const [showEditServiceModal, setShowEditServiceModal] = useState(false);
  const [showEditAccommodationModal, setShowEditAccommodationModal] = useState(false);
  const [editingServiceIndex, setEditingServiceIndex] = useState(null);
  const [editingAccommodationIndex, setEditingAccommodationIndex] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [editingAccommodation, setEditingAccommodation] = useState(null);
  const [services, setServices] = useState([
    { id: 1, name: "Service 1", price: 100 },
    { id: 2, name: "Service 2", price: 200 },
    { id: 3, name: "Service 3", price: 300 },
  ]);
  const [accommodations, setAccommodations] = useState([
    { id: 1, name: "Accommodation 1", type: "Cabin", price: 500 },
    { id: 2, name: "Accommodation 2", type: "Room", price: 300 },
    { id: 3, name: "Accommodation 3", type: "Cabin", price: 700 },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsPlan, setDetailsPlan] = useState({});
  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.subtotal || 0), 0);
  };
  const updatePlanPrice = (plan) => {
    const servicesTotal = calculateTotal(plan.services);
    const accommodationsTotal = calculateTotal(plan.accommodations);
    return servicesTotal + accommodationsTotal;
  };

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

  const [currentPage, setCurrentPage] = useState(0);
  const plansPerPage = 9;

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };


  const validate = (values) => {
    const errors = {};
    // const today = new Date();
    // today.setHours(0, 0, 0, 0); // Set time to beginning of the day for accurate comparison

    if (!values.name) errors.name = "El nombre es requerido";
    if (!values.description) errors.description = "La descripción es requerida";

    if (!values.startDate) {
      errors.startDate = "La fecha de inicio es requerida";
    } else {
      const startDate = startOfDay(parseISO(values.startDate));
      const today = startOfDay(new Date());
      if (isBefore(startDate, today)) {
        errors.startDate = "La fecha de inicio no puede ser anterior a hoy";
      }
    }

    if (!values.endDate) {
      errors.endDate = "La fecha fin es requerida";
    } else {
      const endDate = startOfDay(parseISO(values.endDate));
      const today = startOfDay(new Date());
      if (isBefore(endDate, today)) {
        errors.endDate = "La fecha fin no puede ser anterior a hoy";
      } else if (isBefore(endDate, values.startDate)) {
        errors.endDate = "La fecha fin debe ser posterior a la fecha de inicio";
      }
    }

    if (!values.price) {
      errors.price = "El precio es requerido";
    } else if (isNaN(values.price) || Number(values.price) <= 0) {
      errors.price = "El precio debe ser un número positivo";
    }

    if (!values.salePrice) {
      errors.salePrice = "El precio de venta es requerido";
    } else if (isNaN(values.salePrice) || Number(values.salePrice) <= 0) {
      errors.salePrice = "El precio de venta debe ser un número valido";
    }

    if (!values.capacity) {
      errors.capacity = "La capacidad es requerida";
    } else if (isNaN(values.capacity) || parseInt(values.capacity) < 1 || parseInt(values.capacity) > 50) {
      errors.capacity = "La capacidad debe ser un número entre 1 y 50";
    }

    if (!values.image) errors.image = "La imagen es requerida";
    if (values.services.length === 0) errors.services = "Debe agregar al menos un servicio";

    return errors;
  };

  const handleAddService = () => {
    if (selectedService && serviceQuantity > 0) {
      const newService = {
        ...selectedService,
        quantity: serviceQuantity,
        subtotal: selectedService.price * serviceQuantity,
      };
      if (showAddModal) {
        setNewPlan((prevPlan) => {
          const updatedPlan = {
            ...prevPlan,
            services: [...prevPlan.services, newService],
          };
          updatedPlan.price = updatePlanPrice(updatedPlan);
          return updatedPlan;
        });
      } else if (showEditModal) {
        setEditPlan((prevPlan) => {
          const updatedPlan = {
            ...prevPlan,
            services: [...prevPlan.services, newService],
          };
          updatedPlan.price = updatePlanPrice(updatedPlan);
          return updatedPlan;
        });
      }
      setShowServicesModal(false);
      setSelectedService(null);
      setServiceQuantity(1);
    }
  };

  const handleAddAccommodation = () => {
    if (selectedAccommodation && accommodationQuantity > 0) {
      const newAccommodation = {
        ...selectedAccommodation,
        quantity: accommodationQuantity,
        subtotal: selectedAccommodation.price * accommodationQuantity,
      };
      if (showAddModal) {
        setNewPlan((prevPlan) => {
          const updatedPlan = {
            ...prevPlan,
            accommodations: [...prevPlan.accommodations, newAccommodation],
          };
          updatedPlan.price = updatePlanPrice(updatedPlan);
          return updatedPlan;
        });
      } else if (showEditModal) {
        setEditPlan((prevPlan) => {
          const updatedPlan = {
            ...prevPlan,
            accommodations: [...prevPlan.accommodations, newAccommodation],
          };
          updatedPlan.price = updatePlanPrice(updatedPlan);
          return updatedPlan;
        });
      }
      setShowAccommodationsModal(false);
      setSelectedAccommodation(null);
      setAccommodationQuantity(1);
    }
  };

  const handleEditService = (index, isEditMode = false) => {
    const service = isEditMode ? editPlan.services[index] : newPlan.services[index];
    setEditingService({ ...service });
    setEditingServiceIndex(index);
    setShowEditServiceModal(true);
  };

  const handleEditAccommodation = (index, isEditMode = false) => {
    const accommodation = isEditMode ? editPlan.accommodations[index] : newPlan.accommodations[index];
    setEditingAccommodation({ ...accommodation });
    setEditingAccommodationIndex(index);
    setShowEditAccommodationModal(true);
  };
  const handleSaveEditedService = (isEditMode = false) => {
    if (editingService) {
      const updatedService = {
        ...editingService,
        subtotal: editingService.price * editingService.quantity,
      };
      if (isEditMode) {
        setEditPlan((prevPlan) => {
          const updatedServices = [...prevPlan.services];
          updatedServices[editingServiceIndex] = updatedService;
          const updatedPlan = {
            ...prevPlan,
            services: updatedServices,
          };
          updatedPlan.price = updatePlanPrice(updatedPlan);
          return updatedPlan;
        });
      } else {
        setNewPlan((prevPlan) => {
          const updatedServices = [...prevPlan.services];
          updatedServices[editingServiceIndex] = updatedService;
          const updatedPlan = {
            ...prevPlan,
            services: updatedServices,
          };
          updatedPlan.price = updatePlanPrice(updatedPlan);
          return updatedPlan;
        });
      }
      setShowEditServiceModal(false);
      setEditingService(null);
      setEditingServiceIndex(null);
    }
  };

  const handleSaveEditedAccommodation = (isEditMode = false) => {
    if (editingAccommodation) {
      const updatedAccommodation = {
        ...editingAccommodation,
        subtotal: editingAccommodation.price * editingAccommodation.quantity,
      };
      if (isEditMode) {
        setEditPlan((prevPlan) => {
          const updatedAccommodations = [...prevPlan.accommodations];
          updatedAccommodations[editingAccommodationIndex] = updatedAccommodation;
          const updatedPlan = {
            ...prevPlan,
            accommodations: updatedAccommodations,
          };
          updatedPlan.price = updatePlanPrice(updatedPlan);
          return updatedPlan;
        });
      } else {
        setNewPlan((prevPlan) => {
          const updatedAccommodations = [...prevPlan.accommodations];
          updatedAccommodations[editingAccommodationIndex] = updatedAccommodation;
          const updatedPlan = {
            ...prevPlan,
            accommodations: updatedAccommodations,
          };
          updatedPlan.price = updatePlanPrice(updatedPlan);
          return updatedPlan;
        });
      }
      setShowEditAccommodationModal(false);
      setEditingAccommodation(null);
      setEditingAccommodationIndex(null);
    }
  };
  const handleRemoveService = (index, isEditMode = false) => {
    if (isEditMode) {
      setEditPlan((prevPlan) => {
        const updatedServices = prevPlan.services.filter((_, i) => i !== index);
        const updatedPlan = {
          ...prevPlan,
          services: updatedServices,
        };
        updatedPlan.price = updatePlanPrice(updatedPlan);
        return updatedPlan;
      });
    } else {
      setNewPlan((prevPlan) => {
        const updatedServices = prevPlan.services.filter((_, i) => i !== index);
        const updatedPlan = {
          ...prevPlan,
          services: updatedServices,
        };
        updatedPlan.price = updatePlanPrice(updatedPlan);
        return updatedPlan;
      });
    }
  };

  const handleRemoveAccommodation = (index, isEditMode = false) => {
    if (isEditMode) {
      setEditPlan((prevPlan) => {
        const updatedAccommodations = prevPlan.accommodations.filter((_, i) => i !== index);
        const updatedPlan = {
          ...prevPlan,
          accommodations: updatedAccommodations,
        };
        updatedPlan.price = updatePlanPrice(updatedPlan);
        return updatedPlan;
      });
    } else {
      setNewPlan((prevPlan) => {
        const updatedAccommodations = prevPlan.accommodations.filter((_, i) => i !== index);
        const updatedPlan = {
          ...prevPlan,
          accommodations: updatedAccommodations,
        };
        updatedPlan.price = updatePlanPrice(updatedPlan);
        return updatedPlan;
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPlan((prevPlan) => {
      const updatedPlan = { ...prevPlan, [name]: value };
      if (name !== 'price') {
        updatedPlan.price = updatePlanPrice(updatedPlan);
      }
      return updatedPlan;
    });
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
  }, [newPlan, touchedFields, editPlan]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditPlan((prevPlan) => {
      const updatedPlan = { ...prevPlan, [name]: value };
      if (name !== 'price') {
        updatedPlan.price = updatePlanPrice(updatedPlan);
      }
      return updatedPlan;
    });
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

  const paginatedPlans = filteredPlans.slice(
    currentPage * plansPerPage,
    (currentPage + 1) * plansPerPage
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
    Swal.fire({
      title: "¿Estás seguro de editar este plan?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, editar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
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
      }
    })

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
        {paginatedPlans.length > 0 ? (
          paginatedPlans.map((plan) => (
            <Col md={4} key={plan.id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Title className="text-center" style={{ fontSize: '2rem' }}>{plan.name}</Card.Title> <br />
                <Card.Img variant="top" src={plan.image} alt={plan.name} style={{ height: '200px', objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Text className="fs-4 fw-bold mb-3">Precio de venta: {plan.salePrice}</Card.Text>
                  <Card.Text className="fs-5 fw-bold mb-4">Estado: {plan.status}</Card.Text>
                  <Card.Text className="text-muted mb-2">
                    <small>
                      <i className="bi bi-calendar-event me-2"></i>
                      Disponible desde: {plan.startDate}
                    </small>
                    <br />
                    <small>
                      <i className="bi bi-calendar-event me-2"></i>
                      Disponible hasta: {plan.endDate}
                    </small>
                    <br />
                    <small>
                      Precio: {plan.price} <br />
                      Capacidad: {plan.capacity} <br />
                    </small>
                  </Card.Text>

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
                <Card.Footer className="bg-white border-top-0">
                </Card.Footer>
              </Card>
            </Col>
          ))
        ) : (
          <p>No se encontraron planes.</p>
        )}

      </Row>
      <ReactPaginate
        previousLabel={"Anterior"}
        nextLabel={"Siguiente"}
        breakLabel={"..."}
        pageCount={Math.ceil(filteredPlans.length / plansPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination-container"}
        activeClassName={"active"}
      />
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
        <Modal.Body style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto', minHeight: '600px' }}>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formName">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={newPlan.name}
                        onChange={handleChange}
                        isInvalid={!!errors.name && touchedFields.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formStartDate">
                      <Form.Label>Fecha de Inicio</Form.Label>
                      <Form.Control
                        type="date"
                        name="startDate"
                        value={newPlan.startDate}
                        onChange={handleChange}
                        isInvalid={!!errors.startDate && touchedFields.startDate}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.startDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={8}>
                    <Form.Group className="mb-3" controlId="formDescription">
                      <Form.Label>Descripción</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={newPlan.description}
                        onChange={handleChange}
                        isInvalid={!!errors.description && touchedFields.description}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.description}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formEndDate">
                      <Form.Label>Fecha Fin</Form.Label>
                      <Form.Control
                        type="date"
                        name="endDate"
                        value={newPlan.endDate}
                        onChange={handleChange}
                        isInvalid={!!errors.endDate && touchedFields.endDate}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.endDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3" controlId="formCapacity">
                      <Form.Label>Capacidad</Form.Label>
                      <Form.Control
                        type="text"
                        name="capacity"
                        value={newPlan.capacity}
                        onChange={handleChange}
                        isInvalid={!!errors.capacity && touchedFields.capacity}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.capacity}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={5}>
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
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formPrice">
                      <Form.Label>Precio</Form.Label>
                      <Form.Control
                        type="text"
                        name="price"
                        value={newPlan.price}
                        readOnly
                      />
                    </Form.Group>

                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formSalePrice">
                      <Form.Label>Precio de Venta</Form.Label>
                      <Form.Control
                        type="text"
                        name="salePrice"
                        value={newPlan.salePrice}
                        onChange={handleChange}
                        isInvalid={!!errors.salePrice && touchedFields.salePrice}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.salePrice}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
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

              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h4>Servicios</h4>
                    <Button
                      variant="primary"
                      onClick={() => setShowServicesModal(true)}
                    >
                      Añadir Servicio
                    </Button>
                  </div>

                  <Table bordered>
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Subtotal</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newPlan.services.map((service, index) => (
                        <tr key={index}>
                          <td>{service.name}</td>
                          <td>{service.quantity}</td>
                          <td>{service.price}</td>
                          <td>{service.subtotal}</td>
                          <td>
                            <FaEdit style={{ cursor: "pointer", marginRight: "10px" }} onClick={() => handleEditService(index)} />
                            <FaTrash style={{ cursor: "pointer" }} onClick={() => handleRemoveService(index)} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="text-right"><strong>Total:</strong></td>
                        <td><strong>{calculateTotal(newPlan.services)}</strong></td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </Table>
                </div>
              </Col>
              <Col md={6}>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h4>Alojamientos</h4>
                    <Button
                      variant="primary"
                      onClick={() => setShowAccommodationsModal(true)}
                    >
                      Añadir Alojamiento
                    </Button>
                  </div>
                  <Table bordered>
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Subtotal</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newPlan.accommodations.map((accommodation, index) => (
                        <tr key={index}>
                          <td>{accommodation.name}</td>
                          <td>{accommodation.type}</td>
                          <td>{accommodation.quantity}</td>
                          <td>{accommodation.price}</td>
                          <td>{accommodation.subtotal}</td>
                          <td>
                            <FaEdit style={{ cursor: "pointer", marginRight: "10px" }} onClick={() => handleEditAccommodation(index)} />
                            <FaTrash style={{ cursor: "pointer" }} onClick={() => handleRemoveAccommodation(index)} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="4" className="text-right"><strong>Total:</strong></td>
                        <td><strong>{calculateTotal(newPlan.accommodations)}</strong></td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </Table>
                </div>
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
        size="xl"
        style={{ overflowY: 'auto' }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto', minHeight: '600px' }}>
          <Form onSubmit={handleEditSubmit}>
            <Row>
              <Col md={6}>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formName">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={editPlan?.name || ""}
                        onChange={handleEditChange}
                        isInvalid={!!errors.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formStartDate">
                      <Form.Label>Fecha de Inicio</Form.Label>
                      <Form.Control
                        type="date"
                        name="startDate"
                        value={editPlan?.startDate || ""}
                        onChange={handleEditChange}
                        isInvalid={!!errors.startDate}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.startDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={8}>
                    <Form.Group className="mb-3" controlId="formDescription">
                      <Form.Label>Descripción</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={editPlan?.description || ""}
                        onChange={handleEditChange}
                        isInvalid={!!errors.description}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.description}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formEndDate">
                      <Form.Label>Fecha Fin</Form.Label>
                      <Form.Control
                        type="date"
                        name="endDate"
                        value={editPlan?.endDate || ""}
                        onChange={handleEditChange}
                        isInvalid={!!errors.endDate}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.endDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3" controlId="formCapacity">
                      <Form.Label>Capacidad</Form.Label>
                      <Form.Control
                        type="text"
                        name="capacity"
                        value={editPlan?.capacity || ""}
                        onChange={handleEditChange}
                        isInvalid={!!errors.capacity}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.capacity}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={5}>
                    <Form.Group className="mb-3" controlId="formStatus">
                      <Form.Label>Estado</Form.Label>
                      <Form.Control
                        as="select"
                        name="status"
                        value={editPlan?.status || "disponible"}
                        onChange={handleEditChange}
                      >
                        <option value="disponible">Disponible</option>
                        <option value="copado">Copado</option>
                        <option value="en pausa">En Pausa</option>
                        <option value="cerrado">Cerrado</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formPrice">
                      <Form.Label>Precio</Form.Label>
                      <Form.Control
                        type="text"
                        name="price"
                        value={editPlan?.price || ""}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formSalePrice">
                      <Form.Label>Precio de Venta</Form.Label>
                      <Form.Control
                        type="text"
                        name="salePrice"
                        value={editPlan?.salePrice || ""}
                        onChange={handleEditChange}
                        isInvalid={!!errors.salePrice}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.salePrice}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
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
                    {editPlan && editPlan.image ? (
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


              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h4>Servicios en el plan</h4>
                    <Button
                      variant="primary"
                      onClick={() => setShowServicesModal(true)}
                    >
                      Añadir Servicio
                    </Button>
                  </div>
                  <Table bordered>
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Subtotal</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editPlan?.services?.map((service, index) => (
                        <tr key={index}>
                          <td>{service.name}</td>
                          <td>{service.quantity}</td>
                          <td>{service.price}</td>
                          <td>{service.subtotal}</td>
                          <td>
                            <FaEdit style={{ cursor: "pointer", marginRight: "10px" }} onClick={() => handleEditService(index, true)} />
                            <FaTrash style={{ cursor: "pointer" }} onClick={() => handleRemoveService(index, true)} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="text-right"><strong>Total:</strong></td>
                        <td><strong>{calculateTotal(editPlan?.services || [])}</strong></td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </Table>
                </div>

              </Col>
              <Col md={6}>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h4>Alojamientos en el plan</h4>
                    <Button
                      variant="primary"
                      onClick={() => setShowAccommodationsModal(true)}
                    >
                      Añadir Alojamiento
                    </Button>
                  </div>
                  <Table bordered>
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Subtotal</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editPlan?.accommodations?.map((accommodation, index) => (
                        <tr key={index}>
                          <td>{accommodation.name}</td>
                          <td>{accommodation.type}</td>
                          <td>{accommodation.quantity}</td>
                          <td>{accommodation.price}</td>
                          <td>{accommodation.subtotal}</td>
                          <td>
                            <FaEdit style={{ cursor: "pointer", marginRight: "10px" }} onClick={() => handleEditAccommodation(index, true)} />
                            <FaTrash style={{ cursor: "pointer" }} onClick={() => handleRemoveAccommodation(index, true)} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="4" className="text-right"><strong>Total:</strong></td>
                        <td><strong>{calculateTotal(editPlan?.accommodations || [])}</strong></td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </Table>
                </div>

              </Col>
            </Row>
            <Button variant="primary" type="submit">
              Guardar Cambios
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal para editar servicio */}
      <Modal show={showEditServiceModal} onHide={() => setShowEditServiceModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Servicio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingService && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={editingService.name}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Cantidad</Form.Label>
                <Form.Control
                  type="number"
                  value={editingService.quantity}
                  onChange={(e) => setEditingService({ ...editingService, quantity: parseInt(e.target.value) })}
                  min="1"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                  type="number"
                  value={editingService.price}
                  onChange={(e) => setEditingService({ ...editingService, price: parseFloat(e.target.value) })}
                  min="0"
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditServiceModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => handleSaveEditedService(showEditModal)}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar alojamiento */}
      <Modal show={showEditAccommodationModal} onHide={() => setShowEditAccommodationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Alojamiento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingAccommodation && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={editingAccommodation.name}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Tipo</Form.Label>
                <Form.Control
                  type="text"
                  value={editingAccommodation.type}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Cantidad</Form.Label>
                <Form.Control
                  type="number"
                  value={editingAccommodation.quantity}
                  onChange={(e) => setEditingAccommodation({ ...editingAccommodation, quantity: parseInt(e.target.value) })}
                  min="1"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                  type="number"
                  value={editingAccommodation.price}
                  onChange={(e) => setEditingAccommodation({ ...editingAccommodation, price: parseFloat(e.target.value) })}
                  min="0"
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditAccommodationModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => handleSaveEditedAccommodation(showEditModal)}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para añadir servicio */}
      <Modal show={showServicesModal} onHide={() => setShowServicesModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir Servicio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Servicio</Form.Label>
              <Form.Control
                as="select"
                value={selectedService ? selectedService.id : ""}
                onChange={(e) => {
                  const service = services.find(s => s.id === parseInt(e.target.value));
                  setSelectedService(service);
                }}
              >
                <option value="">Seleccione un servicio</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>{service.name}</option>
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
            Añadir
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para añadir alojamiento */}
      <Modal show={showAccommodationsModal} onHide={() => setShowAccommodationsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir Alojamiento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Alojamiento</Form.Label>
              <Form.Control
                as="select"
                value={selectedAccommodation ? selectedAccommodation.id : ""}
                onChange={(e) => {
                  const accommodation = accommodations.find(a => a.id === parseInt(e.target.value));
                  setSelectedAccommodation(accommodation);
                }}
              >
                <option value="">Seleccione un alojamiento</option>
                {accommodations.map(accommodation => (
                  <option key={accommodation.id} value={accommodation.id}>{accommodation.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                value={accommodationQuantity}
                onChange={(e) => setAccommodationQuantity(parseInt(e.target.value))}
                min="1"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAccommodationsModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddAccommodation}>
            Añadir
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal para detalles del plan */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>


              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      value={detailsPlan.name || ""}
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
                </Col>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={detailsPlan.description || ""}
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha Fin</Form.Label>
                    <Form.Control
                      type="date"
                      value={detailsPlan.endDate || ""}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Capacidad</Form.Label>
                    <Form.Control
                      type="number"
                      value={detailsPlan.capacity || ""}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={5}>
                  <Form.Group className="mb-3" controlId="formStatus">
                    <Form.Label>Estado</Form.Label>
                    <Form.Control
                      value={detailsPlan.status || ""}
                      readOnly
                    >
                    </Form.Control>
                  </Form.Group>

                </Col>
              </Row>
              <Row>
                <Col md={6}>
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
                </Col>
                <Col md={6}>
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
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {detailsPlan.services &&
                    detailsPlan.services.map((service, index) => (
                      <tr key={index}>
                        <td>{service.name}</td>
                        <td>{service.quantity}</td>
                        <td>{service.price}</td>
                        <td>{service.subtotal}</td>
                      </tr>
                    ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-right"><strong>Total:</strong></td>
                    <td><strong>{calculateTotal(detailsPlan.services || [])}</strong></td>
                  </tr>
                </tfoot>
              </Table>
            </Col>
            <Col>
              <h5>Alojamientos</h5>
              <Table striped bordered hover className="mt-2">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {detailsPlan.accommodations &&
                    detailsPlan.accommodations.map((accommodation, index) => (
                      <tr key={index}>
                        <td>{accommodation.name}</td>
                        <td>{accommodation.type}</td>
                        <td>{accommodation.quantity}</td>
                        <td>{accommodation.price}</td>
                        <td>{accommodation.subtotal}</td>
                      </tr>
                    ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" className="text-right"><strong>Total:</strong></td>
                    <td><strong>{calculateTotal(detailsPlan.accommodations || [])}</strong></td>
                  </tr>
                </tfoot>
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


    </div>
  );
};

export default PlanManagement;
