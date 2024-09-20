import React, { useState, useEffect } from 'react';
import { Table, Button, FormControl, Form, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';

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

const ClientModal = ({ show, handleClose, handleSave, client }) => {
    const [formData, setFormData] = useState({
        Identification: '',
        Name: '',
        Email: '',
        PhoneNumber: '',
        Address: '',
        EPS: '',
        Password: '',
        Status: 'Activo' // Valor por defecto
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (client) {
            setFormData({
                ...client,
                Password: client.Password || ''
            });
        } else {
            const generatedPassword = generateRandomPassword();
            setFormData({
                Identification: '',
                Name: '',
                Email: '',
                PhoneNumber: '',
                Address: '',
                EPS: '',
                Password: generatedPassword,
                Status: 'Activo' // Valor por defecto
            });
        }
        setErrors({});
    }, [client]);

    const handleInputChange = ({ target: { name, value } }) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        validateForm(name, value);
    };

    const validateForm = (name, value) => {
        const newErrors = { ...errors };
        switch (name) {
            case 'Identification':
                newErrors.Identification = !value || !/^\d{6,15}$/.test(value)
                    ? 'Debe ser un número entre 6 y 15 dígitos.'
                    : '';
                break;
            case 'Name':
                newErrors.Name = !value || !/^[a-zA-Z\s]+$/.test(value)
                    ? 'El nombre debe contener solo letras y espacios.'
                    : '';
                break;
            case 'Email':
                newErrors.Email = !value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    ? 'Debe ser una dirección de correo electrónico válida.'
                    : '';
                break;
            case 'PhoneNumber':
                newErrors.PhoneNumber = !value || !/^\d{10,15}$/.test(value)
                    ? 'Debe ser un número entre 10 y 15 dígitos.'
                    : '';
                break;
            case 'Address':
                newErrors.Address = !value ? 'La dirección es requerida.' : '';
                break;
            case 'EPS':
                newErrors.EPS = !value ? 'EPS es requerido.' : '';
                break;
                case 'Status':
                    newErrors.Status = !value ? 'El estado es requerido.' : '';
                    break;
            // case 'Password':
            //     newErrors.Password = !value || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
            //         ? 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales.'
            //         : '';
            //     break;
            default:
                break;
        }
        setErrors(newErrors);
    };

    const isFormValid = () => {
        return Object.values(formData).every(val => val !== '') &&
               Object.values(errors).every(error => error === '');
    };

    const handleSubmit = async () => {
        if (isFormValid()) {
            await handleSave(formData);
            Swal.fire({
                title: 'Éxito',
                text: client ? 'Cliente actualizado' : 'Cliente agregado',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                handleClose();
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Por favor, corrija los errores en el formulario',
                icon: 'error',
                timer: 2000,
                showConfirmButton: false
            });
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{client ? 'Editar Cliente' : 'Agregar Cliente'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Identificación</Form.Label>
                        <Form.Control
                            type="text"
                            name="Identification"
                            value={formData.Identification}
                            onChange={handleInputChange}
                            isInvalid={!!errors.Identification}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.Identification}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            name="Name"
                            value={formData.Name}
                            onChange={handleInputChange}
                            isInvalid={!!errors.Name}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.Name}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="Email"
                            value={formData.Email}
                            onChange={handleInputChange}
                            isInvalid={!!errors.Email}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.Email}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control
                            type="text"
                            name="PhoneNumber"
                            value={formData.PhoneNumber}
                            onChange={handleInputChange}
                            isInvalid={!!errors.PhoneNumber}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.PhoneNumber}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Dirección</Form.Label>
                        <Form.Control
                            type="text"
                            name="Address"
                            value={formData.Address}
                            onChange={handleInputChange}
                            isInvalid={!!errors.Address}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.Address}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>EPS</Form.Label>
                        <Form.Control
                            type="text"
                            name="EPS"
                            value={formData.EPS}
                            onChange={handleInputChange}
                            isInvalid={!!errors.EPS}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.EPS}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Estado</Form.Label>
                        <Form.Select
                            name="Status"
                            value={formData.Status}
                            onChange={handleInputChange}
                            isInvalid={!!errors.Status}
                        >
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.Status}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            name="Password"
                            value={formData.Password}
                            readOnly
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.Password}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const ClientManagement = () => {
    const [clients, setClients] = useState([]);
    const [modalState, setModalState] = useState({
        showClientModal: false,
        selectedClient: null,
        isEditing: false,
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [showDetails, setShowDetails] = useState(false);
    const [selectedClientDetails, setSelectedClientDetails] = useState(null);

    const saveClient = (client) => {
        setClients((prevClients) =>
            client.Id
                ? prevClients.map((c) => (c.Id === client.Id ? { ...c, ...client } : c))
                : [...prevClients, { ...client, Id: prevClients.length + 1 }]
        );
        setModalState((prevState) => ({
            ...prevState,
            showClientModal: false,
            selectedClient: null,
            isEditing: false,
        }));
    };

    const handleDeleteClient = (client) => {
        Swal.fire({
            title: 'Confirmar Eliminación',
            text: `¿Estás seguro de que deseas eliminar al cliente ${client.Name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedClients = clients.filter((c) => c.Id !== client.Id);
                setClients(updatedClients);
                Swal.fire(
                    'Eliminado',
                    'El cliente ha sido eliminado.',
                    'success'
                );
            }
        });
    };

    const filteredClients = clients.filter((client) =>
        Object.values(client).some(
            (field) => field.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const toggleClientModal = (client = null) => {
        if (client) {
            Swal.fire({
                title: 'Editar Cliente',
                text: `Vas a editar al cliente ${client.Name}. ¿Deseas continuar?`,
                icon: 'info',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, continuar',
                cancelButtonText: 'Cancelar',
                showCancelButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    setModalState((prevState) => ({
                        ...prevState,
                        selectedClient: client,
                        showClientModal: true,
                        isEditing: true,
                    }));
                }
            });
        } else {
            setModalState((prevState) => ({
                ...prevState,
                showClientModal: true,
                isEditing: false,
            }));
        }
    };

    const handleShowDetails = (client) => {
        setSelectedClientDetails(client);
        setShowDetails(true);
    };

    const handleCloseModal = () => {
        setModalState((prevState) => ({
            ...prevState,
            showClientModal: false,
            selectedClient: null,
            isEditing: false,
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // La búsqueda se realiza en tiempo real, así que no es necesario hacer nada aquí
    };

    return (
        <div className="container col p-5 mt-3" style={{ minHeight: "100vh", marginRight: "850px", marginTop: "50px" }}>
            <h1>Lista de Clientes</h1>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <Form className="d-flex mb-3" onSubmit={handleSearch}>
                    <FormControl
                        type="search"
                        placeholder="Buscar..."
                        className="me-2"
                        aria-label="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="outline-success" type="submit">
                        Buscar
                    </Button>
                </Form>

                <Button
                    variant="primary"
                    className="mb-3"
                    onClick={() => toggleClientModal()}
                >
                    Agregar Cliente
                </Button>
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Identificación</th>
                        <th>Teléfono</th>
                        <th>Acción</th>
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
                                    <Button
                                        variant="warning"
                                        onClick={() => toggleClientModal(client)}
                                    >
                                        Editar
                                    </Button>{' '}
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDeleteClient(client)}
                                    >
                                        Eliminar
                                    </Button>{' '}
                                    <Button
                                        variant="info"
                                        onClick={() => handleShowDetails(client)}
                                    >
                                        Detalles
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">
                                No se encontraron clientes
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <ClientModal
                show={modalState.showClientModal}
                handleClose={handleCloseModal}
                client={modalState.selectedClient}
                handleSave={saveClient}
            />

            <Modal show={showDetails} onHide={() => setShowDetails(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles del Cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedClientDetails && (
                        <div>
                            <p><strong>ID:</strong> {selectedClientDetails.Id}</p>
                            <p><strong>Nombre:</strong> {selectedClientDetails.Name}</p>
                            <p><strong>Identificación:</strong> {selectedClientDetails.Identification}</p>
                            <p><strong>Email:</strong> {selectedClientDetails.Email}</p>
                            <p><strong>Teléfono:</strong> {selectedClientDetails.PhoneNumber}</p>
                            <p><strong>Dirección:</strong> {selectedClientDetails.Address}</p>
                            <p><strong>EPS:</strong> {selectedClientDetails.EPS}</p>
                            <p><strong>Estado:</strong> {selectedClientDetails.Status}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetails(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ClientManagement;