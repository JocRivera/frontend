import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import ReservationForm from './ReservationForm';
import CompanionsForm from './companionsForm';
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
    onSave,
    onDelete
}) => {
    const handleReservationChange = (name, value) => {
        setReservation(prev => ({ ...prev, [name]: value }));
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
        // Actualiza la reserva con los acompañantes y pagos actuales
        const updatedReservation = { ...reservation, companions, payments };
        onSave(updatedReservation); // Pasar la reserva actualizada al componente padre
        onHide();
    };

    const handleDelete = () => {
        onDelete(reservation.id);
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} size="xl" centered>
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
                            <dl className="row">
                                <dt className="col-sm-4">Código:</dt>
                                <dd className="col-sm-8">{reservation?.code}</dd>
                                <dt className="col-sm-4">Fecha de Inicio:</dt>
                                <dd className="col-sm-8">{reservation?.startDate}</dd>
                                <dt className="col-sm-4">Fecha de Fin:</dt>
                                <dd className="col-sm-8">{reservation?.endDate}</dd>
                                <dt className="col-sm-4">Estado:</dt>
                                <dd className="col-sm-8">{reservation?.status}</dd>
                                <dt className="col-sm-4">Tipo de Documento:</dt>
                                <dd className="col-sm-8">{reservation?.typeOfDocument}</dd>
                                <dt className="col-sm-4">Número del Documento:</dt>
                                <dd className="col-sm-8">{reservation?.documentNumber}</dd>
                                <dt className="col-sm-4">Nombre del Cliente:</dt>
                                <dd className="col-sm-8">{reservation?.clientName}</dd>
                            </dl>
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
