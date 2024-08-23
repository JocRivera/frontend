import React, { useState } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';


// Función para generar una contraseña aleatoria
const generateRandomPassword = (length = 8) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
};


// Función para generar un ID autoincrementable simple
let nextId = 1; // Mantener el valor del ID a nivel de archivo
const generateUniqueId = () => {
    return nextId++;
};


const ClientManagement = () => {
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [clients, setClients] = useState([]);
    const [newClient, setNewClient] = useState({
        Identification: '',
        Name: '',
        Email: '',
        PhoneNumber: '',
        Address: '',
        EPS: '',
        Password: '',
        Status: ''
    });
    const [currentClient, setCurrentClient] = useState(null);
    const [editClient, setEditClient] = useState({});
    const [errors, setErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState('');


    const validate = (values) => {
        const errors = {};
        if (!values.Identification) errors.Identification = 'Identification es requerido';
        if (!values.Name) errors.Name = 'Name es requerido';
        if (!values.Email) {
            errors.Email = 'Email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(values.Email)) {
            errors.Email = 'Email inválido';
        }
        if (!values.PhoneNumber) errors.PhoneNumber = 'PhoneNumber es requerido';
        if (!values.Address) errors.Address = 'Address es requerido';
        if (!values.EPS) errors.EPS = 'EPS es requerido';
        if (!values.Status) errors.Status = 'Status es requerido';


        return errors;
    };


    const handleChange = (e) => {
        setNewClient({
            ...newClient,
            [e.target.name]: e.target.value
        });
    };


    const handleEditChange = (e) => {
        setEditClient({
            ...editClient,
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate(newClient);


        if (Object.keys(validationErrors).length === 0) {
            const password = generateRandomPassword();
            const clientWithId = { ...newClient, Password: password, Id: generateUniqueId() };


            setClients([...clients, clientWithId]);
            setNewClient({
                Identification: '',
                Name: '',
                Email: '',
                PhoneNumber: '',
                Address: '',
                EPS: '',
                Password: '',
                Status: ''
            });
            setErrors({});
            setShowModal(false);
        } else {
            setErrors(validationErrors);
        }
    };


    const handleViewDetails = (client) => {
        setCurrentClient(client);
        setShowDetailModal(true);
    };


    const handleDelete = (clientToDelete) => {
        setClients(clients.filter(client => client.Id !== clientToDelete.Id));
    };


    const handleEdit = (clientToEdit) => {
        setEditClient(clientToEdit);
        setShowEditModal(true);
    };


    const handleEditSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate(editClient);


        if (Object.keys(validationErrors).length === 0) {
            const updatedClients = clients.map(client =>
                client.Id === editClient.Id ? editClient : client
            );
            setClients(updatedClients);
            setEditClient({});
            setShowEditModal(false);
        } else {
            setErrors(validationErrors);
        }
    };


    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };


    // Filtrar clientes según el término de búsqueda
    const filteredClients = clients.filter(client =>
        client.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.Email.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div className='container col p-5'>




            {/* Barra de búsqueda */}
            <Form.Control
                type="text"
                placeholder="Buscar por nombre o email"
                value={searchTerm}
                onChange={handleSearchChange}
                className="mb-3"
            />
            <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
                Añadir Cliente
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Identification</th>
                        <th>PhoneNumber</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredClients.length > 0 ? (
                        filteredClients.map((client) => (
                            <tr key={client.Id}>
                                <td>{client.Id}</td>
                                <td>{client.Name}</td>
                                <td>{client.Email}</td>
                                <td>{client.Identification}</td>
                                <td>{client.PhoneNumber}</td>
                                <td>
                                    <Button variant="info" onClick={() => handleViewDetails(client)}>Detalles</Button>
                                    <Button variant="warning" onClick={() => handleEdit(client)} className="ms-2">Editar</Button>
                                    <Button variant="danger" onClick={() => handleDelete(client)} className="ms-2">Eliminar</Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">No se encontraron clientes</td>
                        </tr>
                    )}
                </tbody>
            </Table>


            {/* Modal para añadir cliente */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Añadir Cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formIdentification">
                            <Form.Label>Identification</Form.Label>
                            <Form.Control
                                type="text"
                                name="Identification"
                                value={newClient.Identification}
                                onChange={handleChange}
                                isInvalid={!!errors.Identification}
                            />
                            <Form.Control.Feedback type="invalid">{errors.Identification}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="Name"
                                value={newClient.Name}
                                onChange={handleChange}
                                isInvalid={!!errors.Name}
                            />
                            <Form.Control.Feedback type="invalid">{errors.Name}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="Email"
                                value={newClient.Email}
                                onChange={handleChange}
                                isInvalid={!!errors.Email}
                            />
                            <Form.Control.Feedback type="invalid">{errors.Email}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPhoneNumber">
                            <Form.Label>PhoneNumber</Form.Label>
                            <Form.Control
                                type="text"
                                name="PhoneNumber"
                                value={newClient.PhoneNumber}
                                onChange={handleChange}
                                isInvalid={!!errors.PhoneNumber}
                            />
                            <Form.Control.Feedback type="invalid">{errors.PhoneNumber}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formAddress">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="Address"
                                value={newClient.Address}
                                onChange={handleChange}
                                isInvalid={!!errors.Address}
                            />
                            <Form.Control.Feedback type="invalid">{errors.Address}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEPS">
                            <Form.Label>EPS</Form.Label>
                            <Form.Control
                                type="text"
                                name="EPS"
                                value={newClient.EPS}
                                onChange={handleChange}
                                isInvalid={!!errors.EPS}
                            />
                            <Form.Control.Feedback type="invalid">{errors.EPS}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formStatus">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                type="text"
                                name="Status"
                                value={newClient.Status}
                                onChange={handleChange}
                                isInvalid={!!errors.Status}
                            />
                            <Form.Control.Feedback type="invalid">{errors.Status}</Form.Control.Feedback>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Añadir Cliente
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>


            {/* Modal para ver detalles del cliente */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles del Cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentClient ? (
                        <div>
                            <p><strong>ID:</strong> {currentClient.Id}</p>
                            <p><strong>Name:</strong> {currentClient.Name}</p>
                            <p><strong>Email:</strong> {currentClient.Email}</p>
                            <p><strong>Identification:</strong> {currentClient.Identification}</p>
                            <p><strong>PhoneNumber:</strong> {currentClient.PhoneNumber}</p>
                            <p><strong>Address:</strong> {currentClient.Address}</p>
                            <p><strong>EPS:</strong> {currentClient.EPS}</p>
                            <p><strong>Status:</strong> {currentClient.Status}</p>
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


            {/* Modal para editar cliente */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group className="mb-3" controlId="formEditIdentification">
                            <Form.Label>Identification</Form.Label>
                            <Form.Control
                                type="text"
                                name="Identification"
                                value={editClient.Identification}
                                onChange={handleEditChange}
                                isInvalid={!!errors.Identification}
                            />
                            <Form.Control.Feedback type="invalid">{errors.Identification}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEditName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="Name"
                                value={editClient.Name}
                                onChange={handleEditChange}
                                isInvalid={!!errors.Name}
                            />
                            <Form.Control.Feedback type="invalid">{errors.Name}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEditEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="Email"
                                value={editClient.Email}
                                onChange={handleEditChange}
                                isInvalid={!!errors.Email}
                            />
                            <Form.Control.Feedback type="invalid">{errors.Email}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEditPhoneNumber">
                            <Form.Label>PhoneNumber</Form.Label>
                            <Form.Control
                                type="text"
                                name="PhoneNumber"
                                value={editClient.PhoneNumber}
                                onChange={handleEditChange}
                                isInvalid={!!errors.PhoneNumber}
                            />
                            <Form.Control.Feedback type="invalid">{errors.PhoneNumber}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEditAddress">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="Address"
                                value={editClient.Address}
                                onChange={handleEditChange}
                                isInvalid={!!errors.Address}
                            />
                            <Form.Control.Feedback type="invalid">{errors.Address}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEditEPS">
                            <Form.Label>EPS</Form.Label>
                            <Form.Control
                                type="text"
                                name="EPS"
                                value={editClient.EPS}
                                onChange={handleEditChange}
                                isInvalid={!!errors.EPS}
                            />
                            <Form.Control.Feedback type="invalid">{errors.EPS}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEditStatus">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                type="text"
                                name="Status"
                                value={editClient.Status}
                                onChange={handleEditChange}
                                isInvalid={!!errors.Status}
                            />
                            <Form.Control.Feedback type="invalid">{errors.Status}</Form.Control.Feedback>
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


export default ClientManagement;