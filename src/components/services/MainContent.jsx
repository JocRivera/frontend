import React, { useEffect, useState } from 'react';
import * as BsIcons from "react-icons/bs";
import { Button, Modal, Form, Table, FormControl } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

let nextId = 1;
const generateUniqueId = () => {
    return nextId++;
};

const MainContent = () => {
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [services, setServices] = useState([]);
    const [newService, setNewService] = useState({
        service: '',
        description: '',
        price: '',
        status: true
    });

    const [currentService, setCurrentService] = useState(null);
    const [editService, setEditService] = useState({});
    const [errors, setErrors] = useState({});
    const [query, setQuery] = useState(''); // Estado para la búsqueda

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get('http://localhost:3000/service');
                setServices(response.data);
            } catch (error) {
                console.error("Error al obtener los servicios:", error);
            }
        };
        fetchServices();
    }, []);

    const validate = (values) => {
        const errors = {};
        if (!values.service) errors.service = 'El nombre del servicio es requerido';
        if (!values.description) errors.description = 'La descripción es requerida';
        if (!values.price || isNaN(values.price)) errors.price = 'El precio debe ser un número';
        return errors;
    };

    const handleChange = (e) => {
        setNewService({
            ...newService,
            [e.target.name]: e.target.value
        });
    };

    const handleEditChange = (e) => {
        setEditService({
            ...editService,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate(newService);
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }

        try {
            // Mostrar alerta de confirmación y esperar la respuesta
            const confirm = await Swal.fire({
                title: "¿Desea agregar este servicio?",
                text: "Revisa que todos los campos estén correctos",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Confirmar",
                cancelButtonText: "Cancelar",
            });

            if (confirm.isConfirmed) {
                // Enviar solicitud POST con axios
                const response = await axios.post('http://localhost:3000/service', newService);

                // Agregar el nuevo servicio a la lista
                setServices([...services, { ...newService, id: response.data.id }]);
                setNewService({
                    service: '',
                    description: '',
                    price: '',
                    status: true
                });
                setShowModal(false);
            }
        } catch (error) {
            console.error("Error al agregar el servicio:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo agregar el servicio. Inténtelo de nuevo.",
                icon: "error",
            });
        }
    };


    const handleViewDetails = (service) => {
        setCurrentService(service);
        setShowDetailModal(true);
    };

    const handleDelete = (serviceToDelete) => {
        setServices(services.filter(service => service.id !== serviceToDelete.id));
    };

    const handleEdit = (serviceToEdit) => {
        setEditService(serviceToEdit);
        setShowEditModal(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate(editService);

        if (Object.keys(validationErrors).length === 0) {
            const updatedServices = services.map(service =>
                service.id === editService.id ? editService : service
            );
            setServices(updatedServices);
            setEditService({});
            setShowEditModal(false);
        } else {
            setErrors(validationErrors);
        }
    };


    // Función para manejar la búsqueda
    const handleSearch = (e) => {
        e.preventDefault();
        // Implementar lógica de búsqueda aquí si es necesario
    };

    const handleServiceStatus = (id) => {
        const updatedServices = services.map(service =>
            service.id === id ? { ...service, status: !service.status } : service);
        setServices(updatedServices);
    };

    // Filtrar servicios basados en la búsqueda
    const filteredServices = services.filter(service =>
        (service.service || '').toLowerCase().includes(query.toLowerCase()) ||
        (service.description || '').toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className='container col p-5 mt-3' style={{ minHeight: "100vh", marginRight: "900px", marginTop: "50px" }}>
            {/* Barra de búsqueda */}


            <h2 className='text-center'>Servicios</h2>
            <div >
                <Form className="d-flex mb-3 " onSubmit={handleSearch}>
                    <FormControl
                        type="search"

                        placeholder="Buscar..."
                        className="me-2 w-70"
                        aria-label="Search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}

                    />
                    <Button variant="outline-success" type="submit">Buscar</Button>
                </Form>
                <Button variant="primary" className="mb-3 " onClick={() => setShowModal(true)}>
                    Añadir Servicio
                </Button>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Servicio</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredServices.length > 0 ? (
                        filteredServices.map((service) => (
                            <tr key={service.id}>
                                <td>{service.id}</td>
                                <td>{service.service}</td>
                                <td>{service.description}</td>
                                <td>{service.price}</td>
                                <td>
                                    <Form.Check
                                        type="switch"
                                        id={`switch-${service.id}`}
                                        checked={service.status}
                                        onChange={() => handleServiceStatus(service.id)} // Maneja el cambio de estado
                                    />
                                    {/* Mostrar el switch */}
                                </td>
                                <td className='d-flex justify-content-center' style={{ gap: '10px' }} >
                                    <Button variant="info" onClick={() => handleViewDetails(service)}><BsIcons.BsInfoLg style={{ marginRight: '5px' }} /></Button>
                                    <Button variant="warning" onClick={() => handleEdit(service)} ><BsIcons.BsPencilFill style={{ marginRight: '5px' }} /></Button>
                                    <Button variant="danger" onClick={() => handleDelete(service)} ><BsIcons.BsTrash3Fill style={{ marginRight: '5px' }} /></Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">No se encontraron servicios</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Modal para añadir servicios */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Añadir Servicio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formService">
                            <Form.Label>Servicio</Form.Label>
                            <Form.Control
                                type="text"
                                name="service"
                                value={newService.service}
                                onChange={handleChange}
                                isInvalid={!!errors.service}
                            />
                            <Form.Control.Feedback type="invalid">{errors.service}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formDescription">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                value={newService.description}
                                onChange={handleChange}
                                isInvalid={!!errors.description}
                            />
                            <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPrice">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control
                                type="text"
                                name="price"
                                value={newService.price}
                                onChange={handleChange}
                                isInvalid={!!errors.price}
                            />
                            <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formStatus">
                            <Form.Check
                                type="switch"
                                label={newService.status ? "Activo" : "Inactivo"}  // Cambia el texto según el estado
                                name="status"
                                checked={newService.status}
                                onChange={(e) => setNewService({
                                    ...newService,
                                    status: e.target.checked
                                })}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Añadir Servicio
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal para ver detalles del servicio */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles del Servicio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentService ? (
                        <div>
                            <p><strong>ID:</strong> {currentService.id}</p>
                            <p><strong>Servicio:</strong> {currentService.service}</p>
                            <p><strong>Descripción:</strong> {currentService.description}</p>
                            <p><strong>Precio:</strong> {currentService.price}</p>
                        </div>
                    ) : (
                        <p>No hay detalles disponibles.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para editar servicio */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Servicio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group className="mb-3" controlId="formEditService">
                            <Form.Label>Servicio</Form.Label>
                            <Form.Control
                                type="text"
                                name="service"
                                value={editService.service}
                                onChange={handleEditChange}
                                isInvalid={!!errors.service}
                            />
                            <Form.Control.Feedback type="invalid">{errors.service}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEditDescription">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                value={editService.description}
                                onChange={handleEditChange}
                                isInvalid={!!errors.description}
                            />
                            <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEditPrice">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control
                                type="text"
                                name="price"
                                value={editService.price}
                                onChange={handleEditChange}
                                isInvalid={!!errors.price}
                            />
                            <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEditStatus">
                            <Form.Check
                                type="switch"
                                label={editService.status ? "Activo" : "Inactivo"}
                                name="status"
                                checked={editService.status}
                                onChange={(e) => setEditService({
                                    ...editService,
                                    status: e.target.checked
                                })}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Guardar Cambios
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default MainContent;
