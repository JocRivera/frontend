import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import ReservationForm from './ReservationForm';
import CompanionsForm from './CompanionsForm';
import PaymentsForm from './PaymentsForm';

const ReservationModal = ({
    show,
    onHide,
    reservation,
    setReservation,
    companions,
    setCompanions,
    payments,
    setPayments,
    mode,
    onDelete
}) => {
    const handleReservationChange = (e) => {
        setReservation({ ...reservation, [e.target.name]: e.target.value });
    };

    const handleAddCompanion = (companion) => {
        setCompanions([...companions, { ...companion, id: Date.now() }]);
    };

    const handleDeleteCompanion = (id) => {
        setCompanions(companions.filter(comp => comp.id !== id));
    };

    const handleAddPayment = (payment) => {
        setPayments([...payments, { ...payment, id: Date.now() }]);
    };

    const handleDeletePayment = (id) => {
        setPayments(payments.filter(pay => pay.id !== id));
    };

    const handleSave = () => {
        // Aquí puedes agregar la lógica para guardar la reserva
        // Por ejemplo, enviar la reserva actualizada a un servidor
        onHide();
    };

    const handleDelete = () => {
        onDelete(reservation.id);
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    {mode === 'view' ? 'Detalle de la Reserva' : mode === 'edit' ? 'Editar Reserva' : 'Eliminar Reserva'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    {mode === 'view' ? (
                        <div>
                            <h5>Detalles de la Reserva</h5>
                            <p><strong>Código:</strong> {reservation?.code}</p>
                            <p><strong>Fecha de Inicio:</strong> {reservation?.startDate}</p>
                            <p><strong>Fecha de Fin:</strong> {reservation?.endDate}</p>
                            <p><strong>Estado:</strong> {reservation?.status}</p>
                            <p><strong>Tipo de Documento:</strong> {reservation?.typeOfDocument}</p>
                            <p><strong>Número del Documento:</strong> {reservation?.documentNumber}</p>
                            <p><strong>Nombre del Cliente:</strong> {reservation?.clientName}</p>
                            <h6>Acompañantes</h6>
                            <ul>
                                {companions.map((comp) => (
                                    <li key={comp.id}>
                                        {comp.name}, {comp.age} años
                                    </li>
                                ))}
                            </ul>
                            <h6>Pagos</h6>
                            <ul>
                                {payments.map((pay) => (
                                    <li key={pay.id}>
                                        Monto: {pay.amount}, Fecha: {pay.paymentDate}, Estado: {pay.status}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : mode === 'edit' ? (
                        <div>
                            <ReservationForm
                                reservation={reservation}
                                onChange={handleReservationChange}
                            />
                            <CompanionsForm
                                companions={companions}
                                onAdd={handleAddCompanion}
                                onDelete={handleDeleteCompanion}
                            />
                            <PaymentsForm
                                payments={payments}
                                onAdd={handleAddPayment}
                                onDelete={handleDeletePayment}
                            />
                        </div>
                    ) : (
                        <div>
                            <p>¿Estás seguro de que deseas eliminar esta reserva?</p>
                        </div>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                {mode === 'view' && (
                    <Button variant="primary" onClick={onHide}>
                        Aceptar
                    </Button>
                )}
                {mode === 'edit' && (
                    <Button variant="primary" onClick={handleSave}>
                        Guardar Cambios
                    </Button>
                )}
                {mode === 'delete' && (
                    <Button variant="danger" onClick={handleDelete}>
                        Eliminar Reserva
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default ReservationModal;
