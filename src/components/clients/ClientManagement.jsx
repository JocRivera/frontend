import React, { useState, useEffect } from 'react';
import { Table, Button, FormControl, Form, Modal, InputGroup, Pagination } from 'react-bootstrap';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import Swal from 'sweetalert2';

// Función para generar una contraseña aleatoria
// const generateRandomPassword = (length = 8) => {
//     const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
//     let password = "";
//     for (let i = 0; i < length; i++) {
//         const randomIndex = Math.floor(Math.random() * charset.length);
//         password += charset[randomIndex];
//     }
//     return password;
// };

const ClientModal = ({ show, handleClose, handleSave, client }) => {
    const [formData, setFormData] = useState({
        Identification: '',
        Name: '',
        Email: '',
        PhoneNumber: '',
        Address: '',
        EPS: '',
        Password: '',
        Confirmar: '',
        Status: 'Activo' // Valor por defecto
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (client)
            setFormData(client);
        else if (!show) {
            setFormData({
                Identification: '',
                Name: '',
                Email: '',
                PhoneNumber: '',
                Address: '',
                EPS: '',
                Password: '',
                Confirmar: '',
                Status: 'Activo', // Valor por defecto
            });
            // El ojito siempre inicia en oculto
            setPasswordVisible(false);
            setPasswordVisible2(false);
        }
        setErrors({});
    }, [client, show]);

    const handleInputChange = ({ target: { name, value } }) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        validateForm(name, value);
    };

    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const [passwordVisible2, setPasswordVisible2] = useState(false);

    const togglePasswordVisibility2 = () => {
        setPasswordVisible2(!passwordVisible2);
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
                newErrors.Name = !value || !/^[a-záéíóüuA-Z\s]+$/.test(value)
                    ? 'El nombre debe contener solo letras y espacios.'
                    : '';
                break;
            case 'DocumentType':
                newErrors.DocumentType = !value ? 'El tipo de documento es requerido.' : '';
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
            case 'Password':
                newErrors.Password = !value ? 'La contraseña es requerida.' : !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value) ? 'Debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.' : '';
                break;
            case 'Confirmar':
                newErrors.Confirmar = !value ? 'La confirmación de la contraseña es requerida.' : value !== formData.Password ? 'Las contraseñas no coinciden.' : '';
                break;
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
                    if (isFormValid()) {
                        handleSave(formData);
                        Swal.fire({
                            title: 'Éxito',
                            text: 'Cliente actualizado',
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
                }
            }
            )
        } else {
            if (isFormValid()) {
                await handleSave(formData);
                Swal.fire({
                    title: 'Éxito',
                    text: 'Cliente agregado',
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
        }

    };


    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{client ? 'Editar Cliente' : 'Agregar Cliente'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3">
                    <Form.Label>Tipo de Documento</Form.Label>
                    <Form.Select
                        name="DocumentType"
                        value={formData.DocumentType}
                        onChange={handleInputChange}
                        isInvalid={!!errors.DocumentType}
                    >
                        <option value="">Seleccione un tipo de documento</option>
                        <option value="Cédula de ciudadanía">Cédula de ciudadanía</option>
                        <option value="Cédula de extranjería">Cédula de extranjería</option>
                        <option value="Pasaporte">Pasaporte</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        {errors.DocumentType}
                    </Form.Control.Feedback>
                </Form.Group>
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
                        <InputGroup>
                            <Form.Control
                                type={passwordVisible ? 'text' : 'password'}
                                name="Password"
                                value={formData.Password}
                                onChange={handleInputChange}
                                isInvalid={!!errors.Password}
                            />
                            <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                            </InputGroup.Text>
                            <Form.Control.Feedback type="invalid">
                                {errors.Password}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Confirmar contraseña</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={passwordVisible2 ? 'text' : 'password'}
                                name="Confirmar"
                                value={formData.Confirmar}
                                onChange={handleInputChange}
                                isInvalid={!!errors.Confirmar}
                            />
                            <InputGroup.Text onClick={togglePasswordVisibility2} style={{ cursor: 'pointer' }}>
                                {passwordVisible2 ? <FaEyeSlash /> : <FaEye />}
                            </InputGroup.Text>
                            <Form.Control.Feedback type="invalid">
                                {errors.Confirmar}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    {/* <Form.Group className='mb-3'>{client ? <Form.Label><Button variant='tertiary'>Enviar correo de recuperación</Button></Form.Label> : null}</Form.Group> */}
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

    const [currentPage, setCurrentPage] = useState(1);
    const [clientsPerPage] = useState(10);





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
    const toggleClientStatus = (client) => {
        const newStatus = client.Status === 'Activo' ? 'Inactivo' : 'Activo';
        Swal.fire({
            title: 'Confirmar cambio de estado',
            text: `¿Estás seguro de que deseas cambiar el estado del cliente ${client.Name} a ${newStatus}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cambiar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedClient = { ...client, Status: newStatus };
                setClients(clients.map(c => c.Id === client.Id ? updatedClient : c));
                Swal.fire(
                    'Estado cambiado',
                    `El estado del cliente ha sido cambiado a ${newStatus}.`,
                    'success'
                );
            }
        });
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

    const indexOfLastClient = currentPage * clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - clientsPerPage;
    const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const toggleClientModal = (client = null) => {
        if (client) {
            setModalState((prevState) => ({
                ...prevState,
                selectedClient: client,
                showClientModal: true,
                isEditing: true,
            }));
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
                        <th>Estado</th>
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
                                    <Form.Check
                                        type="switch"
                                        id={`status-switch-${client.Id}`}
                                        checked={client.Status === 'Activo'}
                                        onChange={() => toggleClientStatus(client)}
                                        label={client.Status}
                                    />
                                </td>
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
                                    </Button>{' '}
                                    <Button
                                        variant="success"
                                    >
                                        Ir a reservas
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">
                                No se encontraron clientes
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Pagination>
                {[...Array(Math.ceil(filteredClients.length / clientsPerPage))].map((_, index) => (
                    <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>

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
                            <p><strong>Tipo de Documento:</strong> {selectedClientDetails.DocumentType}</p>
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