import React, { useState, useEffect } from 'react';
import { Button, Table, FormControl, Modal, InputGroup } from 'react-bootstrap';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import ReservationForm from '../pages/ReservationForm';
import CompanionsForm from '../pages/companionsForm';
import PaymentsForm from '../pages/PaymentsForm';
import { utils, writeFile } from 'xlsx'; // Importar funciones de xlsx
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import axios from 'axios';

const Reservations = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [selectedReservation, setSelectedReservation] = useState(null);

  const [reservations, setReservations] = useState([]);
  const [companions, setCompanions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [newReservation, setNewReservation] = useState({
    estado: '',
    tipoDocumento: '',
    documento: '',
    nombreCliente: '',
    companions: [],
    payments: []
  });
  const [filteredReservations, setFilteredReservations] = useState(reservations);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchReservations = async () => {
      const [reservationsResponse, companionsResponse, paymentsResponse] = await Promise.all([
        axios.get('http://localhost:4000/api/reservations'),
        axios.get('http://localhost:4000/api/companions'),
        axios.get('http://localhost:4000/api/payments')
      ]);
      setReservations(reservationsResponse.data);
      setFilteredReservations(reservationsResponse.data);
      setCompanions(companionsResponse.data);
      setPayments(paymentsResponse.data);
      console.log("get success");
    };
    fetchReservations();
  }, [newReservation]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = reservations.filter(res =>
      res.nombreCliente.toLowerCase().includes(term) ||
      res.documento.toLowerCase().includes(term)
    );
    setFilteredReservations(filtered);
  };

  const handleAddReservation = async () => {
    if (!newReservation.nombreCliente || !newReservation.tipoDocumento || !newReservation.documento) {
      Swal.fire({
        icon: 'error',
        title: 'Error reserva incompleta',
        text: 'Por favor, completa todos los campos obligatorios.'
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/reservations', newReservation);
      console.log('Response:', response);
      setReservations([...reservations, response.data]);
      setFilteredReservations([...reservations, response.data]);
      setShowAddModal(false);
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Reserva registrada exitosamente.'
      });
    }
    catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar la reserva',
        text: 'Ha ocurrido un error al registrar la reserva. Por favor, intenta de nuevo.'
      });
    }
  }

  const handleEditReservation = (updatedReservation) => {
    const updatedReservations = reservations.map(res => res.id === updatedReservation.id ? updatedReservation : res);
    setReservations(updatedReservations);
    setFilteredReservations(updatedReservations);
    setShowEditModal(false);
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Reserva editada exitosamente.'
    });
  };

  const handleDeleteReservation = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás recuperar esta reserva después de eliminarla!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedReservations = reservations.filter(res => res.id !== id);
        setReservations(updatedReservations);
        setFilteredReservations(updatedReservations);
        Swal.fire('Eliminado', 'Reserva eliminada.', 'success');
      }
    });
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
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres editar esta reserva?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, editar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        if (!selectedReservation.clientName || !selectedReservation.startDate || !selectedReservation.endDate) {
          Swal.fire({
            icon: 'error',
            title: 'Error reserva incompleta',
            text: 'Por favor, completa todos los campos obligatorios.'
          });
          return;
        }

        if (selectedReservation) {
          const updatedReservation = { ...selectedReservation, companions, payments };
          handleEditReservation(updatedReservation);
        }
      }
    });
  };

  const handleChangeReservation = (name, value) => {
    if (showAddModal) {
      setNewReservation(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setSelectedReservation(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDetailModal(false);
    setSelectedReservation(null);
  };

  // Función para descargar la lista de reservas en Excel
  const handleDownloadExcel = () => {
    const worksheet = utils.json_to_sheet(filteredReservations);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Reservas');
    writeFile(workbook, 'reservas.xlsx');
  };

  return (
    <div className="container col p-5 mt-3" style={{ minHeight: "100vh", marginRight: "850px", marginTop: "50px" }}>
      <div className="d-flex justify-content-between align-items-center my-3">
        <h2>Reservas</h2>
        <div>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            Registrar Reserva
          </Button>
          <Button variant="success" onClick={handleDownloadExcel} className="ms-2">
            Descargar Excel
          </Button>
        </div>
      </div>
      <InputGroup className="mb-3" style={{ maxWidth: '300px' }}> {/* Hacer la barra de búsqueda más pequeña */}
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
            <th>Nombre del Cliente</th>
            <th>Tipo de Documento</th>
            <th>Número de Documento</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredReservations.map((reservation) => (
            <tr key={reservation._id}>
              <td>{reservation._id}</td>
              <td>{reservation.nombreCliente}</td>
              <td>{reservation.tipoDocumento}</td>
              <td>{reservation.documento}</td>
              <td>{reservation.startDate}</td>
              <td>{reservation.endDate}</td>
              <td>{reservation.estado}</td>
              <td>
                <Button variant="info" onClick={() => handleDetail(reservation)}>Ver Detalle</Button>
                <Button variant="warning" onClick={() => handleEdit(reservation)}>Editar</Button>
                <Button variant="danger" onClick={() => handleDeleteReservation(reservation._id)}>Eliminar</Button>
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
            reservation={{}} // Puedes pasar un objeto vacío si es para agregar
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
            onDelete={(id) => setPayments(payments.filter(pmt => pmt.id !== id))}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddReservation}>
            Guardar Reserva
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar reserva */}
      <Modal show={showEditModal} onHide={handleCloseModals} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReservationForm
            reservation={selectedReservation}
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
            onDelete={(id) => setPayments(payments.filter(pmt => pmt.id !== id))}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdateReservation}>
            Actualizar Reserva
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para ver detalles de la reserva */}
      <Modal show={showDetailModal} onHide={handleCloseModals} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReservation && (
            <>
              <h5>Código: {selectedReservation.documento}</h5>
              <h5>Nombre del Cliente: {selectedReservation.nombreCliente}</h5>
              <h5>Tipo de Documento: {selectedReservation.tipoDocumento}</h5>
              <h5>Número de Documento: {selectedReservation.documento}</h5>
              <h5>Fecha Inicio: {selectedReservation.startDate}</h5>
              <h5>Fecha Fin: {selectedReservation.endDate}</h5>
              <h5>Estado: {selectedReservation.estado}</h5>

              <h6>Acompañantes:</h6>
              <ul>
                {companions.map(comp => (
                  <li key={comp.id}>{comp.name}</li>
                ))}
              </ul>

              <h6>Pagos:</h6>
              <ul>
                {payments.map(pmt => (
                  <li key={pmt.id}>Monto: {pmt.amount}, Fecha: {pmt.date}, Estado: {pmt.status}</li>
                ))}
              </ul>
            </>
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

const generateId = () => {
  return Math.random().toString(36).substr(2, 9); // Generar un ID único
};

export default Reservations;