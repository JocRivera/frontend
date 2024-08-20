import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Form, FormControl, Button, InputGroup, Modal } from 'react-bootstrap';


export default function MainContent() {
    const [query, setQuery] = useState(''); // Estado para la búsqueda
    const [services, setServices] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchServices();
    }, []);
    const fetchServices = async () => {
        try {
            const response = await fetch('http://localhost:3000/');
            const data = await response.json();
            setServices(data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const [newService, setNewService] = useState({
        service: '',
        description: '',
        price: ''
    });

    // Función para manejar la búsqueda
    const handleSearch = (e) => {
        e.preventDefault();
        // Implementar lógica de búsqueda aquí si es necesario
    };

    // Filtrar servicios basados en la búsqueda
    const filteredServices = services.filter(service =>
        (service.service || '').toLowerCase().includes(query.toLowerCase()) ||
        (service.description || '').toLowerCase().includes(query.toLowerCase())
    );

    // Función para añadir un nuevo servicio
    const handleAddService = () => {
        // Implementar lógica para añadir un servicio aquí
        setShowModal(true);
    };
    //
    const handleClose = () => {
        setShowModal(false);
    };

    const handleSave = async () => {
        try {
            // Hacer la solicitud POST al backend con los datos del nuevo servicio
            const response = await fetch('http://localhost:3000/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newService)
            });

            if (response.ok) {
                const savedService = await response.json();
                setServices(prevServices => [...prevServices, savedService]); // Actualizar la lista de servicios
                setNewService({ service: '', description: '', price: '' }); // Limpiar el formulario
                setShowModal(false); // Cerrar el modal
            } else {
                console.error('Error al guardar el servicio:', response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };

    const handleChange = (e) => {
        setNewService({ ...newService, [e.target.name]: e.target.value });
    };

    return (
        <div className='container col p-5'>
            <Form className="d-flex mb-3" onSubmit={handleSearch}>
                <FormControl
                    type="search"
                    placeholder="Buscar..."
                    className="me-2"
                    aria-label="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Button variant="outline-success" type="submit">Buscar</Button>
            </Form>
            <Button variant="primary" className="mb-3" onClick={handleAddService}>Añadir Servicio</Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Service</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Action</th>
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
                                    <Button variant="warning" size="sm" onClick={() => handleEdit(service.id)}>Editar</Button>
                                    <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDelete(service.id)}>Eliminar</Button>
                                </td>

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No services found</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Añadir Nuevo Servicio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Service</Form.Label>
                            <Form.Control
                                type="text"
                                name="service"
                                value={newService.service}
                                onChange={handleChange}
                                placeholder="Ingrese el nombre del servicio"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                value={newService.description}
                                onChange={handleChange}
                                placeholder="Ingrese una descripción"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <InputGroup>
                                <FormControl
                                    type="number"
                                    name="price"
                                    value={newService.price}
                                    onChange={handleChange}
                                    placeholder="Ingrese el precio"
                                />
                                <InputGroup.Text>USD</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
