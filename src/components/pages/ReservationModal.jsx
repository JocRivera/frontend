import React from "react";
import { Modal, Button } from "react-bootstrap";
import ReservationForm from "./ReservationForm";
import CompanionsForm from "./companionsForm";
import PaymentsForm from "./PaymentsForm";

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
  onDelete,
}) => {
  const handleReservationChange = (name, value) => {
    setReservation((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCompanion = (companion) => {
    setCompanions([...companions, { ...companion, id: Date.now() }]);
  };

  const handleDeleteCompanion = (id) => {
    setCompanions(companions.filter((comp) => comp.id !== id));
  };

  const handleAddPayment = (payment) => {
    setPayments((prev) => [...prev, { ...payment, id: Date.now() }]);
  };

  const handleDeletePayment = (id) => {
    setPayments((prev) => prev.filter((pay) => pay.id !== id));
  };

  const handleSave = () => {
    const updatedReservation = { ...reservation, companions, payments };
    onSave(updatedReservation);
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
          {mode === "view"
            ? "Detalle de la Reserva"
            : mode === "edit"
            ? "Editar Reserva"
            : "Eliminar Reserva"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {mode === "view" ? (
            /* Aquí iría el código para mostrar los detalles en modo 'view' */
            <div>
              <p>Mostrar detalles de la reserva aquí</p>
            </div>
          ) : mode === "edit" ? (
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
                totalAmount={Number(reservation?.price) || 0}
                payments={payments || []}
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
        {mode === "view" && (
          <Button variant="primary" onClick={onHide}>
            Aceptar
          </Button>
        )}
        {mode === "edit" && (
          <Button variant="primary" onClick={handleSave}>
            Guardar Cambios
          </Button>
        )}
        {mode === "delete" && (
          <Button variant="danger" onClick={handleDelete}>
            Eliminar Reserva
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ReservationModal;
