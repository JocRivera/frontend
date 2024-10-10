import React, { useState, useEffect } from "react";
import { Button, Table, FormControl, Modal, InputGroup } from "react-bootstrap";
import Swal from "sweetalert2";
import ReservationForm from "../pages/ReservationForm";
import CompanionsForm from "../pages/companionsForm";
import PaymentsForm from "../pages/PaymentsForm";
import ReactPaginate from "react-paginate";
import { utils, writeFile } from "xlsx";
import "bootstrap-icons/font/bootstrap-icons.css";

const Reservations = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [selectedReservation, setSelectedReservation] = useState(null);

  const [reservations, setReservations] = useState([]);
  const [companions, setCompanions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [newReservation, setNewReservation] = useState({
    estado: "",
    tipoDocumento: "",
    documento: "",
    startDate: "",
    endDate: "",
    nombreCliente: "",
    companions: [],
    payments: [],
  });
  const [filteredReservations, setFilteredReservations] = useState(reservations);
  const [searchTerm, setSearchTerm] = useState("");

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [reservationsPerPage] = useState(5); // Cambia este valor para ajustar el número de reservas por página

  useEffect(() => {
    // Simulate fetching data
    const mockReservations = [
      {
        _id: "1",
        estado: "Confirmada",
        tipoDocumento: "DNI",
        documento: "12345678",
        startDate: "2024-10-10",
        endDate: "2024-10-15",
        nombreCliente: "John Doe",
        companions: [],
        payments: [],
      },
      // Add more mock reservations as needed
      // ...
    ];
    setReservations(mockReservations);
    setFilteredReservations(mockReservations);
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = reservations.filter(
      (res) =>
        res.nombreCliente.toLowerCase().includes(term) ||
        res.documento.toLowerCase().includes(term)
    );
    setFilteredReservations(filtered);
    setCurrentPage(1); // Reset to first page on search
  };

  // Get current reservations
  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = filteredReservations.slice(
    indexOfFirstReservation,
    indexOfLastReservation
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddReservation = () => {
    if (
      !newReservation.nombreCliente ||
      !newReservation.tipoDocumento ||
      !newReservation.documento ||
      !newReservation.startDate ||
      !newReservation.endDate
    ) {
      Swal.fire({
        icon: "error",
        title: "Error reserva incompleta",
        text: "Por favor, completa todos los campos obligatorios.",
      });
      return;
    }

    const newReservationWithId = { ...newReservation, _id: generateId() };
    setReservations([...reservations, newReservationWithId]);
    setFilteredReservations([...reservations, newReservationWithId]);
    setNewReservation({
      estado: "",
      tipoDocumento: "",
      documento: "",
      startDate: "",
      endDate: "",
      nombreCliente: "",
      companions: [],
      payments: [],
    });
    setShowAddModal(false);
    Swal.fire({
      icon: "success",
      title: "¡Éxito!",
      text: "Reserva registrada exitosamente.",
    });
  };

  const handleEditReservation = (updatedReservation) => {
    if (
      !updatedReservation.nombreCliente ||
      !updatedReservation.tipoDocumento ||
      !updatedReservation.documento ||
      !updatedReservation.startDate ||
      !updatedReservation.endDate
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, completa todos los campos requeridos.",
      });
      return;
    }

    const updatedReservations = reservations.map((reservation) =>
      reservation._id === updatedReservation._id ? updatedReservation : reservation
    );
    setReservations(updatedReservations);
    setFilteredReservations(updatedReservations);
    setShowEditModal(false);

    Swal.fire({
      icon: "success",
      title: "¡Éxito!",
      text: "Reserva editada exitosamente.",
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
      title: "¿Estás seguro?",
      text: "¿Quieres editar esta reserva?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, editar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        if (
          !selectedReservation.nombreCliente ||
          !selectedReservation.tipoDocumento ||
          !selectedReservation.documento ||
          !selectedReservation.startDate ||
          !selectedReservation.endDate
        ) {
          Swal.fire({
            icon: "error",
            title: "Error reserva incompleta",
            text: "Por favor, completa todos los campos obligatorios.",
          });
          return;
        }
        const updatedReservation = {
          ...selectedReservation,
          startDate: new Date(selectedReservation.startDate).toISOString(),
          endDate: new Date(selectedReservation.endDate).toISOString(),
          companions: companions || [],
          payments: payments || [],
        };

        handleEditReservation(updatedReservation);
      }
    });
  };

  const handleDeleteReservation = (reservationId) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción. La reserva será eliminada permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedReservations = reservations.filter(
          (reservation) => reservation._id !== reservationId
        );
        setReservations(updatedReservations);
        setFilteredReservations(updatedReservations);

        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "La reserva ha sido eliminada correctamente.",
        });
      }
    });
  };

  const handleChangeReservation = (name, value) => {
    if (showAddModal) {
      setNewReservation({ ...newReservation, [name]: value });
    } else {
      setSelectedReservation((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDetailModal(false);
    setSelectedReservation(null);
  };

  const handleDownloadExcel = () => {
    const worksheet = utils.json_to_sheet(filteredReservations);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Reservas");
    writeFile(workbook, "reservas.xlsx");
  };

  const totalPages = Math.ceil(filteredReservations.length / reservationsPerPage);

  return (
    <div
      className="container col p-5 mt-3"
      style={{ minHeight: "100vh", marginRight: "850px", marginTop: "50px" }}
    >
      <div className="d-flex justify-content-between align-items-center my-3">
        <h2>Reservas</h2>
        <div>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            Registrar Reserva
          </Button>
          <Button
            variant="success"
            onClick={handleDownloadExcel}
            className="ms-2"
          >
            Descargar Excel
          </Button>
        </div>
      </div>
      <InputGroup className="mb-3" style={{ maxWidth: "300px" }}>
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
          {currentReservations.map((reservation) => (
            <tr key={reservation._id}>
              <td>{reservation._id}</td>
              <td>{reservation.nombreCliente}</td>
              <td>{reservation.tipoDocumento}</td>
              <td>{reservation.documento}</td>
              <td>{reservation.startDate}</td>
              <td>{reservation.endDate}</td>
              <td>{reservation.estado}</td>
              <td>
                <Button
                  variant="info"
                  onClick={() => handleDetail(reservation)}
                  className="me-2"
                >
                  Ver Detalle
                </Button>
                <Button
                  variant="warning"
                  onClick={() => handleEdit(reservation)}
                  className="me-2"
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteReservation(reservation._id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      {/* Paginación */}
      <div className="d-flex justify-content-center mt-4">
        <Button
          variant="light"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Anterior
        </Button>
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index + 1}
            variant={currentPage === index + 1 ? "primary" : "light"}
            onClick={() => handlePageChange(index + 1)}
            className="mx-1"
          >
            {index + 1}
          </Button>
        ))}
        <Button
          variant="light"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Siguiente
        </Button>
      </div>

      {/* Add Reservation Modal */}
      <Modal show={showAddModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReservationForm
            reservation={newReservation}
            handleChange={handleChangeReservation}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModals}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddReservation}>
            Registrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Reservation Modal */}
      <Modal show={showEditModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReservationForm
            reservation={selectedReservation}
            handleChange={handleChangeReservation}
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

      {/* Detail Modal */}
      <Modal show={showDetailModal} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>Detalle de Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Nombre del Cliente: {selectedReservation?.nombreCliente}</h5>
          <h5>Tipo de Documento: {selectedReservation?.tipoDocumento}</h5>
          <h5>Número de Documento: {selectedReservation?.documento}</h5>
          <h5>Fecha Inicio: {selectedReservation?.startDate}</h5>
          <h5>Fecha Fin: {selectedReservation?.endDate}</h5>
          <h5>Estado: {selectedReservation?.estado}</h5>
          <h5>Compañeros:</h5>
          {companions.map((companion, index) => (
            <div key={index}>
              {companion.name} - {companion.age} años
            </div>
          ))}
          <h5>Pagos:</h5>
          {payments.map((payment, index) => (
            <div key={index}>
              Monto: {payment.amount}, Fecha: {payment.date}
            </div>
          ))}
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

export default Reservations;
