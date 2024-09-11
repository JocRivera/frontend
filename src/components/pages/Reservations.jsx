import React, { useState } from 'react';
import { Button, Table, FormControl, Modal, InputGroup, Alert } from 'react-bootstrap';
import ReservationForm from '../pages/ReservationForm';
import CompanionsForm from '../pages/CompanionsForm';
import PaymentsForm from '../pages/PaymentsForm';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons

const Reservations = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [companions, setCompanions] = useState([]);
    const [payments, setPayments] = useState([]);
    const [reservations, setReservations] = useState([
        // Datos de ejemplo
        {
            id: 1,
            code: 'R001',
            startDate: '2024-08-01T12:00',
            endDate: '2024-08-05T12:00',
            status: 'Reservado',
            typeOfDocument: 'CC',
            documentNumber: '123456789',
            clientName: 'Juan Pérez',
            companions: [],
            payments: []
        },
        {
            id: 2,
            code: 'R002',
            startDate: '2024-08-10T12:00',
            endDate: '2024-08-12T12:00',
            status: 'Confirmado',
            typeOfDocument: 'TI',
            documentNumber: '987654321',
            clientName: 'Ana Gómez',
            companions: [],
            payments: []
        }
    ]);
    const [filteredReservations, setFilteredReservations] = useState(reservations);
    const [searchTerm, setSearchTerm] = useState('');
    const [alert, setAlert] = useState(null);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = reservations.filter(res =>
            res.clientName.toLowerCase().includes(term) ||
            res.code.toLowerCase().includes(term)
        );
        setFilteredReservations(filtered);
    };

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

    const handleDetail = (reservation) => {
        setSelectedReservation(reservation);
        setCompanions(reservation.companions || []);
        setPayments(reservation.payments || []);
        setShowDetailModal(true);
    };

    const handleEdit = (reservation) => {
        setSelectedReservation(reservation);
        setCompanions(reservation.companions || []);
        setPayments(reservation.payments || []);
        setShowEditModal(true);
    };

    const handleUpdateReservation = () => {
        if (selectedReservation) {
            const updatedReservation = { ...selectedReservation, companions, payments };
            handleEditReservation(updatedReservation);
        }
    };

    const handleChangeReservation = (name, value) => {
        setSelectedReservation(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCloseModals = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowDetailModal(false);
        setSelectedReservation(null);
    };

    return (
        <div className="container col p-5 mt-3">
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
                    placeholder="Buscar por cliente o código"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </InputGroup>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Fecha Inicio</th>
                        <th>Fecha Fin</th>
                        <th>Estado</th>
                        <th>Tipo Documento</th>
                        <th>Número Documento</th>
                        <th>Nombre Cliente</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredReservations.map((reservation) => (
                        <tr key={reservation.id}>
                            <td>{reservation.code}</td>
                            <td>{new Date(reservation.startDate).toLocaleString()}</td>
                            <td>{new Date(reservation.endDate).toLocaleString()}</td>
                            <td>{reservation.status}</td>
                            <td>{reservation.typeOfDocument}</td>
                            <td>{reservation.documentNumber}</td>
                            <td>{reservation.clientName}</td>
                            <td>
                                <Button
                                    variant="info"
                                    size="sm"
                                    onClick={() => handleDetail(reservation)}
                                >
                                    🔍
                                </Button>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    onClick={() => handleEdit(reservation)}
                                >
                                    ✏️
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDeleteReservation(reservation.id)}
                                >
                                    🗑️
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal para agregar reserva */}
            <Modal show={showAddModal} onHide={handleCloseModals} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Reserva</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ReservationForm
                        reservation={selectedReservation || {}}
                        onChange={handleChangeReservation}
                    />
                    <CompanionsForm
                        companions={companions}
                        onAdd={(companion) => setCompanions([...companions, { ...companion, id: generateId() }])}
                        onDelete={(id) => setCompanions(companions.filter(comp => comp.id !== id))}
                    />
                    <PaymentsForm
                        payments={payments}
                        onAdd={(payment) => setPayments([...payments, { ...payment, id: generateId() }])}
                        onDelete={(id) => setPayments(payments.filter(payment => payment.id !== id))}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModals}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={() => handleAddReservation(selectedReservation)}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para editar reserva */}
            <Modal show={showEditModal} onHide={handleCloseModals}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Reserva</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ReservationForm
                        reservation={selectedReservation || {}}
                        onChange={handleChangeReservation}
                    />
                    <CompanionsForm
                        companions={companions}
                        onAdd={(companion) => setCompanions([...companions, { ...companion, id: generateId() }])}
                        onDelete={(id) => setCompanions(companions.filter(comp => comp.id !== id))}
                    />
                    <PaymentsForm
                        payments={payments}
                        onAdd={(payment) => setPayments([...payments, { ...payment, id: generateId() }])}
                        onDelete={(id) => setPayments(payments.filter(payment => payment.id !== id))}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModals}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleUpdateReservation}>
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para ver detalles */}
            <Modal show={showDetailModal} onHide={handleCloseModals}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles de la Reserva</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedReservation && (
                        <div>
                            <h5>Datos de la Reserva</h5>
                            <p>Código: {selectedReservation.code}</p>
                            <p>Fecha de Inicio: {new Date(selectedReservation.startDate).toLocaleString()}</p>
                            <p>Fecha de Fin: {new Date(selectedReservation.endDate).toLocaleString()}</p>
                            <p>Estado: {selectedReservation.status}</p>
                            <p>Tipo Documento: {selectedReservation.typeOfDocument}</p>
                            <p>Número Documento: {selectedReservation.documentNumber}</p>
                            <p>Nombre Cliente: {selectedReservation.clientName}</p>
                            <h5>Acompañantes</h5>
                            <ul>
                                {companions.map(companion => (
                                    <li key={companion.id}>
                                        {companion.name} - {companion.documentNumber}
                                    </li>
                                ))}
                            </ul>
                            <h5>Pagos</h5>
                            <ul>
                                {payments.map(payment => (
                                    <li key={payment.id}>
                                        ${payment.amount} - {payment.date} - {payment.status}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModals}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

const generateId = () => Math.floor(Math.random() * 10000);

export default Reservations;
