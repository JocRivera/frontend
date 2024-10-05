import React, { useState } from "react";
import { Button, Table, FormControl, Modal, InputGroup } from "react-bootstrap";
import { utils, writeFile } from "xlsx";
import "bootstrap-icons/font/bootstrap-icons.css";

const MyReservations = () => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [companions, setCompanions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reservations, setReservations] = useState([
    // Datos de ejemplo
    {
      id: 1,
      code: "R001",
      startDate: "2024-08-01T12:00",
      endDate: "2024-08-05T12:00",
      status: "Reservado",
      typeOfDocument: "CC",
      documentNumber: "123456789",
      clientName: "Juan Pérez",
      companions: [],
      payments: [],
    },
    {
      id: 2,
      code: "R002",
      startDate: "2024-08-10T12:00",
      endDate: "2024-08-12T12:00",
      status: "Confirmado",
      typeOfDocument: "TI",
      documentNumber: "987654321",
      clientName: "Ana Gómez",
      companions: [],
      payments: [],
    },
    // Agrega más reservas para probar la paginación
  ]);
  const [filteredReservations, setFilteredReservations] = useState(reservations);
  const [searchTerm, setSearchTerm] = useState("");

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const reservationsPerPage = 5; // Cambia el número de reservas por página aquí

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = reservations.filter(
      (res) =>
        res.clientName.toLowerCase().includes(term) ||
        res.code.toLowerCase().includes(term)
    );
    setFilteredReservations(filtered);
    setCurrentPage(1); // Reiniciar a la primera página después de buscar
  };

  const handleDetail = (reservation) => {
    setSelectedReservation(reservation);
    setCompanions(reservation.companions || []);
    setPayments(reservation.payments || []);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedReservation(null);
  };

  // Función para descargar la lista de reservas en Excel
  const handleDownloadExcel = () => {
    const worksheet = utils.json_to_sheet(filteredReservations);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Reservas");
    writeFile(workbook, "reservas.xlsx");
  };

  // Funciones de paginación
  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = filteredReservations.slice(
    indexOfFirstReservation,
    indexOfLastReservation
  );
  const totalPages = Math.ceil(
    filteredReservations.length / reservationsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div
      className="container col p-5 mt-3"
      style={{ minHeight: "100vh", marginRight: "850px", marginTop: "50px" }}
    >
      <div className="d-flex justify-content-between align-items-center my-3">
        <h2>Mis Reservas</h2>
        <Button variant="success" onClick={handleDownloadExcel}>
          Descargar Excel
        </Button>
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
            <tr key={reservation.id}>
              <td>{reservation.code}</td>
              <td>{reservation.clientName}</td>
              <td>{reservation.typeOfDocument}</td>
              <td>{reservation.documentNumber}</td>
              <td>{reservation.startDate}</td>
              <td>{reservation.endDate}</td>
              <td>{reservation.status}</td>
              <td>
                <Button
                  variant="info"
                  onClick={() => handleDetail(reservation)}
                >
                  Ver Detalle
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

      {/* Modal para ver detalle */}
      <Modal show={showDetailModal} onHide={handleCloseDetailModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Código: {selectedReservation?.code}</h5>
          <p>Nombre del Cliente: {selectedReservation?.clientName}</p>
          <p>Tipo de Documento: {selectedReservation?.typeOfDocument}</p>
          <p>Número de Documento: {selectedReservation?.documentNumber}</p>
          <p>Fecha Inicio: {selectedReservation?.startDate}</p>
          <p>Fecha Fin: {selectedReservation?.endDate}</p>
          <p>Estado: {selectedReservation?.status}</p>
          {/* Detalles de acompañantes y pagos aquí */}
          <h6>Acompañantes:</h6>
          <ul>
            {companions.map((companion, index) => (
              <li key={index}>{companion.name}</li>
            ))}
          </ul>
          <h6>Pagos:</h6>
          <ul>
            {payments.map((payment, index) => (
              <li key={index}>
                {payment.amount} - {payment.date} - {payment.status}
              </li>
            ))}
          </ul>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MyReservations;
