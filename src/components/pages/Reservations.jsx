import React, { useState } from 'react';
import { Button, Table, FormControl, Modal, InputGroup, Alert } from 'react-bootstrap';
import ReservationForm from '../pages/ReservationForm';
import CompanionsForm from '../pages/companionsForm';
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
      startDate: '2024-08-01',
      endDate: '2024-08-05',
      status: 'Reservado',
      typeOfDocument: 'CC',
      documentNumber: '123456789',
      clientName: 'Juan Pérez',
      companions: [], // Acompañantes
      payments: [] // Pagos
    },
    {
      id: 2,
      code: 'R002',
      startDate: '2024-08-10',
      endDate: '2024-08-12',
      status: 'Confirmado',
      typeOfDocument: 'TI',
      documentNumber: '987654321',
      clientName: 'Ana Gómez',
      companions: [], // Acompañantes
      payments: [] // Pagos
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

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDetailModal(false);
    setSelectedReservation(null);
  };

  return (
    <div className="container col p-5 mt-3"  style={{ minHeight: "100vh", marginRight : "850px", marginTop  : "50px"}}>
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
            <th>Tipo de Documento</th>
            <th>Número de Documento</th>
            <th>Nombre del Cliente</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredReservations.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.code}</td>
              <td>{reservation.startDate}</td>
              <td>{reservation.endDate}</td>
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
          <Modal.Title>Registrar Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReservationForm
            onChange={(e) => {
              const { name, value } = e.target;
              setSelectedReservation(prev => ({
                ...prev,
                [name]: value
              }));
            }}
          />
          <CompanionsForm
            companions={companions}
            onAdd={companion => setCompanions([...companions, companion])}
            onDelete={id => setCompanions(companions.filter(comp => comp.id !== id))}
          />
          <PaymentsForm
            payments={payments}
            onAdd={payment => setPayments([...payments, payment])}
            onDelete={id => setPayments(payments.filter(pay => pay.id !== id))}
          />
          <Button
            variant="primary"
            onClick={() => handleAddReservation(selectedReservation)}
          >
            Agregar Reserva
          </Button>
        </Modal.Body>
      </Modal>

      {/* Modal para editar reserva */}
      <Modal show={showEditModal} onHide={handleCloseModals} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReservation && (
            <div>
              <ReservationForm
                reservation={selectedReservation}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setSelectedReservation(prev => ({
                    ...prev,
                    [name]: value
                  }));
                }}
              />
              <CompanionsForm
                companions={companions}
                onAdd={companion => setCompanions([...companions, companion])}
                onDelete={id => setCompanions(companions.filter(comp => comp.id !== id))}
              />
              <PaymentsForm
                payments={payments}
                onAdd={payment => setPayments([...payments, payment])}
                onDelete={id => setPayments(payments.filter(pay => pay.id !== id))}
              />
              <Button
                variant="primary"
                onClick={handleUpdateReservation}
              >
                Actualizar Reserva
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal para ver detalle de la reserva */}
      <Modal show={showDetailModal} onHide={handleCloseModals} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalles de Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReservation && (
            <div>
              <h4>Código: {selectedReservation.code}</h4>
              <p><strong>Fecha Inicio:</strong> {selectedReservation.startDate}</p>
              <p><strong>Fecha Fin:</strong> {selectedReservation.endDate}</p>
              <p><strong>Estado:</strong> {selectedReservation.status}</p>
              <p><strong>Tipo de Documento:</strong> {selectedReservation.typeOfDocument}</p>
              <p><strong>Número de Documento:</strong> {selectedReservation.documentNumber}</p>
              <p><strong>Nombre del Cliente:</strong> {selectedReservation.clientName}</p>

              <h5>Acompañantes</h5>
              <ul>
                {companions.map((companion, index) => (
                  <li key={index}>{companion.name} - {companion.age} años</li>
                ))}
              </ul>

              <h5>Pagos</h5>
              <ul>
                {payments.map((payment, index) => (
                  <li key={index}>
                    {payment.amount} - {payment.date} - {payment.status}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

// Función para generar ID único (por simplicidad)
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

export default Reservations;

