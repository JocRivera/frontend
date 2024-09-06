import React, { useState } from "react";
import { Button, Table, FormControl } from "react-bootstrap";
import ReservationModal from "../pages/ReservationModal";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons

const Reservations = () => {
  const [showModal, setShowModal] = useState(false);
  const [reservation, setReservation] = useState(null);
  const [companions, setCompanions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("");
  const [reservationList, setReservationList] = useState([
    {
      id: 1,
      code: "R001",
      startDate: "2024-08-01",
      endDate: "2024-08-05",
      status: "Reservado",
      typeOfDocument: "CC",
      documentNumber: "123456789",
      clientName: "Juan Pérez",
    },
    {
      id: 2,
      code: "R002",
      startDate: "2024-08-10",
      endDate: "2024-08-12",
      status: "Confirmado",
      typeOfDocument: "TI",
      documentNumber: "987654321",
      clientName: "Ana Gómez",
    },
  ]);

  const filteredReservations = reservationList.filter((reservation) =>
    reservation.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleShowModal = (mode, reservation) => {
    setMode(mode);
    setReservation(reservation);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setMode("");
  };

  const handleDeleteReservation = (id) => {
    const updatedReservations = reservationList.filter((res) => res.id !== id);
    setReservationList(updatedReservations);
    console.log(`Reservation with id ${id} deleted`);
  };

  return (
    <div>
      <h2>Lista de Reservas</h2>
      <FormControl
        type="text"
        placeholder="Buscar por código"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3"
      />
      <Button
        variant="primary"
        onClick={() =>
          handleShowModal("edit", {
            startDate: "",
            endDate: "",
            status: "Reservado",
            typeOfDocument: "",
            documentNumber: "",
            clientName: "",
          })
        }
      >
        Registrar Nueva Reserva
      </Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Código</th>
            <th>Fecha de Inicio</th>
            <th>Fecha de Fin</th>
            <th>Estado</th>
            <th>Tipo de Documento</th>
            <th>Número del Documento</th>
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
                  variant="link"
                  size="sm"
                  onClick={() => handleShowModal("view", reservation)}
                >
                  <i className="bi bi-eye"></i> {/* View Icon */}
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => handleShowModal("edit", reservation)}
                >
                  <i className="bi bi-pencil"></i> {/* Edit Icon */}
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => handleShowModal("delete", reservation)}
                >
                  <i className="bi bi-trash"></i> {/* Delete Icon */}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ReservationModal
        show={showModal}
        onHide={handleCloseModal}
        reservation={reservation}
        setReservation={setReservation}
        companions={companions}
        setCompanions={setCompanions}
        payments={payments}
        setPayments={setPayments}
        mode={mode}
        onDelete={handleDeleteReservation}
      />
    </div>
  );
};

export default Reservations;
