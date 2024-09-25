import React, { useState } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ReservationsFormClient = () => {
  const [reservation, setReservation] = useState({
    code: '',
    startDate: '',
    endDate: '',
    status: 'Reservado',
    typeOfDocument: '',
    documentNumber: '',
    clientName: '',
  });

  const [companions, setCompanions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [companion, setCompanion] = useState({ name: '', age: '', document: '' });
  const [payment, setPayment] = useState({ amount: '', date: '', status: 'Pendiente' });
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleReservationChange = (e) => {
    const { name, value } = e.target;
    setReservation((prev) => ({ ...prev, [name]: value }));
  };

  const handleCompanionChange = (e) => {
    const { name, value } = e.target;
    setCompanion((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPayment((prev) => ({ ...prev, [name]: value }));
  };

  const addCompanion = () => {
    setCompanions((prev) => [...prev, companion]);
    setCompanion({ name: '', age: '', document: '' }); // Resetear el formulario de acompañante
  };

  const addPayment = () => {
    setPayments((prev) => [...prev, payment]);
    setPayment({ amount: '', date: '', status: 'Pendiente' }); // Resetear el formulario de pago
  };

  const handleDeleteCompanion = (index) => {
    const newCompanions = companions.filter((_, i) => i !== index);
    setCompanions(newCompanions);
  };

  const handleDeletePayment = (index) => {
    const newPayments = payments.filter((_, i) => i !== index);
    setPayments(newPayments);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire('Reserva registrada', 'Los detalles de la reserva se han guardado con éxito.', 'success');
    // Aquí puedes agregar la lógica para guardar la reserva
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
  };

  return (
    <div className="container mt-5">
      <h2>Formulario de Reserva</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formCode">
          <Form.Label>Código de Reserva</Form.Label>
          <Form.Control
            type="text"
            name="code"
            value={reservation.code}
            onChange={handleReservationChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formStartDate">
          <Form.Label>Fecha de Inicio</Form.Label>
          <Form.Control
            type="datetime-local"
            name="startDate"
            value={reservation.startDate}
            onChange={handleReservationChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formEndDate">
          <Form.Label>Fecha de Fin</Form.Label>
          <Form.Control
            type="datetime-local"
            name="endDate"
            value={reservation.endDate}
            onChange={handleReservationChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formClientName">
          <Form.Label>Nombre del Cliente</Form.Label>
          <Form.Control
            type="text"
            name="clientName"
            value={reservation.clientName}
            onChange={handleReservationChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formTypeOfDocument">
          <Form.Label>Tipo de Documento</Form.Label>
          <Form.Control
            type="text"
            name="typeOfDocument"
            value={reservation.typeOfDocument}
            onChange={handleReservationChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formDocumentNumber">
          <Form.Label>Número de Documento</Form.Label>
          <Form.Control
            type="text"
            name="documentNumber"
            value={reservation.documentNumber}
            onChange={handleReservationChange}
            required
          />
        </Form.Group>

        <h4>Acompañantes</h4>
        <Form.Group controlId="formCompanionName">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={companion.name}
            onChange={handleCompanionChange}
          />
        </Form.Group>
        <Form.Group controlId="formCompanionAge">
          <Form.Label>Edad</Form.Label>
          <Form.Control
            type="number"
            name="age"
            value={companion.age}
            onChange={handleCompanionChange}
          />
        </Form.Group>
        <Form.Group controlId="formCompanionDocument">
          <Form.Label>Número de Documento</Form.Label>
          <Form.Control
            type="text"
            name="document"
            value={companion.document}
            onChange={handleCompanionChange}
          />
        </Form.Group>
        <Button variant="primary" onClick={addCompanion}>Agregar Acompañante</Button>

        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Edad</th>
              <th>Número de Documento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {companions.map((comp, index) => (
              <tr key={index}>
                <td>{comp.name}</td>
                <td>{comp.age}</td>
                <td>{comp.document}</td>
                <td>
                  <Button variant="danger" onClick={() => handleDeleteCompanion(index)}>
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <h4>Pagos</h4>
        <Form.Group controlId="formPaymentAmount">
          <Form.Label>Monto</Form.Label>
          <Form.Control
            type="number"
            name="amount"
            value={payment.amount}
            onChange={handlePaymentChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formPaymentDate">
          <Form.Label>Fecha de Pago</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={payment.date}
            onChange={handlePaymentChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formPaymentStatus">
          <Form.Label>Estado del Pago</Form.Label>
          <Form.Control
            as="select"
            name="status"
            value={payment.status}
            onChange={handlePaymentChange}
          >
            <option>Pendiente</option>
            <option>Confirmado</option>
            <option>Completado</option>
          </Form.Control>
        </Form.Group>
        <Button variant="primary" onClick={addPayment}>Agregar Pago</Button>

        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Monto</th>
              <th>Fecha de Pago</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((pay, index) => (
              <tr key={index}>
                <td>{pay.amount}</td>
                <td>{pay.date}</td>
                <td>{pay.status}</td>
                <td>
                  <Button variant="danger" onClick={() => handleDeletePayment(index)}>
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Button variant="success" type="submit">Registrar Reserva</Button>
      </Form>

      {/* Modal de Detalle (si es necesario) */}
      <Modal show={showDetailModal} onHide={handleCloseDetailModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Mostrar detalles de la reserva aquí */}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ReservationsFormClient;
