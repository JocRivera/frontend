import React, { useState } from 'react';
import { Button, Modal, Form, Table, Row, Col, InputGroup, FormControl, Alert } from 'react-bootstrap';

// Función para generar un ID único
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [alert, setAlert] = useState(null);

    const handleAddReservation = (newReservation) => {
        const reservationWithId = { ...newReservation, id: generateId() };
        setReservations([...reservations, reservationWithId]);
        setFilteredReservations([...filteredReservations, reservationWithId]);
        setShowAddModal(false);
        setAlert({ type: 'success', message: 'Reserva agregada exitosamente.' });
    };

    const handleEditReservation = (updatedReservation) => {
        const updatedReservations = reservations.map(res => res.id === updatedReservation.id ? updatedReservation : res);
        setReservations(updatedReservations);
        setFilteredReservations(updatedReservations);
        setShowEditModal(false);
        setAlert({ type: 'success', message: 'Reserva editada exitosamente.' });
    };

    const handleDeleteReservation = (id) => {
        const updatedReservations = reservations.filter(res => res.id !== id);
        setReservations(updatedReservations);
        setFilteredReservations(updatedReservations);
        setAlert({ type: 'danger', message: 'Reserva eliminada.' });
    };

    const handleEdit = (reservation) => {
        setSelectedReservation(reservation);
        setShowEditModal(true);
    };

    const handleDetail = (reservation) => {
        setSelectedReservation(reservation);
        setShowDetailModal(true);
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = reservations.filter(res =>
            res.cliente.toLowerCase().includes(term) ||
            res.id.toLowerCase().includes(term)
        );
        setFilteredReservations(filtered);
    };

    return (
        <div className="container-fluid">
            {alert && (
                <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
                    {alert.message}
                </Alert>
            )}
            <div className="d-flex justify-content-between align-items-center my-3">
                <h2>Reservas</h2>
                <Button variant="primary" onClick={() => setShowAddModal(true)}>
                    Registrar Reserva
                </Button>
            </div>
            <InputGroup className="mb-3">
                <FormControl
                    placeholder="Buscar por cliente o ID"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </InputGroup>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Fecha Inicio</th>
                        <th>Fecha Fin</th>
                        <th>Precio</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredReservations.map((reservation) => (
                        <tr key={reservation.id}>
                            <td>{reservation.id}</td>
                            <td>{reservation.cliente}</td>
                            <td>{reservation.fechaInicio}</td>
                            <td>{reservation.fechaFin}</td>
                            <td>{reservation.precio}</td>
                            <td>{reservation.estado}</td>
                            <td>
                                <Button variant="info" size="sm" onClick={() => handleDetail(reservation)}>
                                    🔍
                                </Button>
                                <Button variant="warning" size="sm" onClick={() => handleEdit(reservation)}>
                                    ✏️
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => handleDeleteReservation(reservation.id)}>
                                    🗑️
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal para agregar reserva */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Registrar Reserva</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ReservationForm onSubmit={handleAddReservation} />
                </Modal.Body>
            </Modal>

            {/* Modal para editar reserva */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Editar Reserva</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedReservation && (
                        <ReservationForm reservation={selectedReservation} onSubmit={handleEditReservation} />
                    )}
                </Modal.Body>
            </Modal>

            {/* Modal para ver detalle de la reserva */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Detalles de Reserva</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedReservation && (
                        <div>
                            <h4>ID: {selectedReservation.id}</h4>
                            <p><strong>Cliente:</strong> {selectedReservation.cliente}</p>
                            <p><strong>Fecha Inicio:</strong> {selectedReservation.fechaInicio}</p>
                            <p><strong>Fecha Fin:</strong> {selectedReservation.fechaFin}</p>
                            <p><strong>Precio:</strong> {selectedReservation.precio}</p>
                            <p><strong>Estado:</strong> {selectedReservation.estado}</p>
                            <h5>Acompañantes</h5>
                            <Table striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Edad</th>
                                        <th>Documento</th>
                                        <th>EPS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedReservation.companions.map((comp, index) => (
                                        <tr key={index}>
                                            <td>{comp.name}</td>
                                            <td>{comp.age}</td>
                                            <td>{comp.document}</td>
                                            <td>{comp.eps}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <h5>Pagos</h5>
                            <Table striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>Monto</th>
                                        <th>Fecha de Pago</th>
                                        <th>Estado</th>
                                        <th>Recibo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedReservation.payments.map((pay, index) => (
                                        <tr key={index}>
                                            <td>{pay.amount}</td>
                                            <td>{pay.paymentDate}</td>
                                            <td>{pay.status}</td>
                                            <td>{pay.receipt ? <a href={pay.receipt} target="_blank" rel="noopener noreferrer">Ver Recibo</a> : 'No disponible'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

const ReservationForm = ({ reservation = {}, onSubmit }) => {
    const [formValues, setFormValues] = useState({
        cliente: reservation.cliente || '',
        fechaInicio: reservation.fechaInicio || '',
        fechaFin: reservation.fechaFin || '',
        precio: reservation.precio || '',
        estado: reservation.estado || 'Reservado',
        companions: reservation.companions || [],
        payments: reservation.payments || []
    });
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);

    const validate = () => {
        const errors = {};
        if (!formValues.cliente) errors.cliente = 'El nombre del cliente es obligatorio.';
        if (!formValues.fechaInicio) errors.fechaInicio = 'La fecha de inicio es obligatoria.';
        if (!formValues.fechaFin) errors.fechaFin = 'La fecha de fin es obligatoria.';
        if (!formValues.precio || formValues.precio <= 0) errors.precio = 'El precio debe ser un número positivo.';
        if (new Date(formValues.fechaInicio) >= new Date(formValues.fechaFin)) errors.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio.';
        return errors;
    };

    const handleChange = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    const handleAddCompanion = (newCompanion) => {
        setFormValues({
            ...formValues,
            companions: [...formValues.companions, { ...newCompanion, id: generateId() }]
        });
    };

    const handleDeleteCompanion = (id) => {
        setFormValues({
            ...formValues,
            companions: formValues.companions.filter(comp => comp.id !== id)
        });
    };

    const handleAddPayment = (newPayment) => {
        setFormValues({
            ...formValues,
            payments: [...formValues.payments, { ...newPayment, id: generateId() }]
        });
    };

    const handleDeletePayment = (id) => {
        setFormValues({
            ...formValues,
            payments: formValues.payments.filter(pay => pay.id !== id)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            setAlert({ type: 'danger', message: 'Por favor, corrija los errores en el formulario.' });
        } else {
            setErrors({});
            onSubmit({ ...reservation, ...formValues });
            setAlert({ type: 'success', message: 'Reserva guardada exitosamente.' });
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {alert && (
                <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
                    {alert.message}
                </Alert>
            )}
            <Form.Group className="mb-3">
                <Form.Label>Cliente</Form.Label>
                <Form.Control
                    type="text"
                    name="cliente"
                    value={formValues.cliente}
                    onChange={handleChange}
                    isInvalid={!!errors.cliente}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.cliente}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Fecha Inicio</Form.Label>
                <Form.Control
                    type="datetime-local"
                    name="fechaInicio"
                    value={formValues.fechaInicio}
                    onChange={handleChange}
                    isInvalid={!!errors.fechaInicio}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.fechaInicio}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Fecha Fin</Form.Label>
                <Form.Control
                    type="datetime-local"
                    name="fechaFin"
                    value={formValues.fechaFin}
                    onChange={handleChange}
                    isInvalid={!!errors.fechaFin}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.fechaFin}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                    type="number"
                    name="precio"
                    value={formValues.precio}
                    onChange={handleChange}
                    isInvalid={!!errors.precio}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.precio}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                    as="select"
                    name="estado"
                    value={formValues.estado}
                    onChange={handleChange}
                >
                    <option value="Reservado">Reservado</option>
                    <option value="Confirmado">Confirmado</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Anulado">Anulado</option>
                </Form.Control>
            </Form.Group>

            <Row>
                <Col md={6}>
                    <CompanionsForm
                        companions={formValues.companions}
                        onAdd={handleAddCompanion}
                        onDelete={handleDeleteCompanion}
                    />
                </Col>
                <Col md={6}>
                    <PaymentsForm
                        payments={formValues.payments}
                        onAdd={handleAddPayment}
                        onDelete={handleDeletePayment}
                    />
                </Col>
            </Row>

            <Button variant="primary" type="submit" className="mt-3">
                Guardar Reserva
            </Button>
        </Form>
    );
};

const CompanionsForm = ({ companions, onAdd, onDelete }) => {
    const [companion, setCompanion] = useState({ name: '', age: '', docType: '', document: '', eps: '' });
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);

    const validate = () => {
        const errors = {};
        if (!companion.name) errors.name = 'El nombre es obligatorio.';
        if (!companion.age || companion.age <= 0) errors.age = 'La edad debe ser un número positivo.';
        if (!companion.document) errors.document = 'El documento es obligatorio.';
        if (!companion.docType) errors.docType = 'El tipo de documento es obligatorio.';
        return errors;
    };

    const handleChange = (e) => {
        setCompanion({ ...companion, [e.target.name]: e.target.value });
    };

    const handleAdd = () => {
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            setAlert({ type: 'danger', message: 'Por favor, corrija los errores en el formulario de acompañantes.' });
        } else {
            setErrors({});
            onAdd(companion);
            setCompanion({ name: '', age: '', docType: '', document: '', eps: '' });
            setAlert({ type: 'success', message: 'Acompañante agregado exitosamente.' });
        }
    };

    return (
        <div className="mb-3">
            {alert && (
                <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
                    {alert.message}
                </Alert>
            )}
            <h5>Acompañantes</h5>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Edad</th>
                        <th>Documento</th>
                        <th>Tipo de Documento</th>
                        <th>EPS</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {companions.map((comp) => (
                        <tr key={comp.id}>
                            <td>{comp.name}</td>
                            <td>{comp.age}</td>
                            <td>{comp.docType}</td>
                            <td>{comp.document}</td>
                            <td>{comp.eps}</td>
                            <td>
                                <Button variant="danger" size="sm" onClick={() => onDelete(comp.id)}>
                                    🗑️
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    value={companion.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.name}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Edad</Form.Label>
                <Form.Control
                    type="number"
                    name="age"
                    value={companion.age}
                    onChange={handleChange}
                    isInvalid={!!errors.age}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.age}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Tipo de documento</Form.Label>
                <Form.Control
                    as="select"
                    name="docType"
                    value={companion.docType}
                    onChange={handleChange}
                    isInvalid={!!errors.docType}
                >
                    <option value="">Seleccione</option>
                    <option value="TI">TI</option>
                    <option value="CC">CC</option>
                    <option value="Cedula de extranjería">Cédula de extranjería</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                    {errors.docType}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Documento</Form.Label>
                <Form.Control
                    type="text"
                    name="document"
                    value={companion.document}
                    onChange={handleChange}
                    isInvalid={!!errors.document}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.document}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>EPS</Form.Label>
                <Form.Control
                    type="text"
                    name="eps"
                    value={companion.eps}
                    onChange={handleChange}
                />
            </Form.Group>
            <Button variant="secondary" onClick={handleAdd}>
                Añadir Acompañante
            </Button>
        </div>
    );
};

const PaymentsForm = ({ payments, onAdd, onDelete }) => {
    const [payment, setPayment] = useState({ amount: '', paymentDate: '', status: 'Pendiente', receipt: '' });
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);

    const validate = () => {
        const errors = {};
        if (!payment.amount || payment.amount <= 0) errors.amount = 'El monto debe ser un número positivo.';
        if (!payment.paymentDate) errors.paymentDate = 'La fecha de pago es obligatoria.';
        return errors;
    };

    const handleChange = (e) => {
        setPayment({ ...payment, [e.target.name]: e.target.value });
    };

    const handleAdd = () => {
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            setAlert({ type: 'danger', message: 'Por favor, corrija los errores en el formulario de pagos.' });
        } else {
            setErrors({});
            onAdd(payment);
            setPayment({ amount: '', paymentDate: '', status: 'Pendiente', receipt: '' });
            setAlert({ type: 'success', message: 'Pago agregado exitosamente.' });
        }
    };

    return (
        <div className="mb-3">
            {alert && (
                <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
                    {alert.message}
                </Alert>
            )}
            <h5>Pagos</h5>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Monto</th>
                        <th>Fecha de Pago</th>
                        <th>Estado</th>
                        <th>Recibo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((pay) => (
                        <tr key={pay.id}>
                            <td>{pay.amount}</td>
                            <td>{pay.paymentDate}</td>
                            <td>{pay.status}</td>
                            <td>{pay.receipt ? <a href={pay.receipt} target="_blank" rel="noopener noreferrer">Ver Recibo</a> : 'No disponible'}</td>
                            <td>
                                <Button variant="danger" size="sm" onClick={() => onDelete(pay.id)}>
                                    🗑️
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Form.Group className="mb-3">
                <Form.Label>Monto</Form.Label>
                <Form.Control
                    type="number"
                    name="amount"
                    value={payment.amount}
                    onChange={handleChange}
                    isInvalid={!!errors.amount}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.amount}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Fecha de Pago</Form.Label>
                <Form.Control
                    type="datetime"
                    name="paymentDate"
                    value={payment.paymentDate}
                    onChange={handleChange}
                    isInvalid={!!errors.paymentDate}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.paymentDate}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                    as="select"
                    name="status"
                    value={payment.status}
                    onChange={handleChange}
                >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Pagado">Pagado</option>
                    <option value="Cancelado">Cancelado</option>
                </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Recibo</Form.Label>
                <Form.Control
                    type="file"
                    name="receipt"
                    value={payment.receipt}
                    onChange={handleChange}
                />
            </Form.Group>
            <Button variant="secondary" onClick={handleAdd}>
                Añadir Pago
            </Button>
        </div>
    );
};

export default Reservations;
