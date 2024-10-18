import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import SweetAlert from "sweetalert2";
import CompanionsForm from "./companionsForm";
import PaymentsForm from "./PaymentsForm";
import ReservationForm from "./ReservationForm"; // Importa el formulario existente

const ReservationsFormClient = () => {
  const [reservationData, setReservationData] = useState({
    customerName: "",
    documentType: "",
    documentNumber: "",
    startDate: "",
    endDate: "",
    status: "Reserved", // Estado predeterminado
    plans: "",
    price: "",
  });

  const [companions, setCompanions] = useState([]);
  const [payments, setPayments] = useState([]);

  const handleReservationChange = (name, value) => {
    setReservationData({ ...reservationData, [name]: value });
  };

  const validateForm = () => {
    const {
      customerName,
      documentType,
      documentNumber,
      startDate,
      endDate,
      plans,
      price,
    } = reservationData;

    if (
      !customerName ||
      !documentType ||
      !documentNumber ||
      !startDate ||
      !endDate ||
      !plans ||
      !price
    ) {
      SweetAlert.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, completa todos los campos requeridos.",
      });
      return false;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      SweetAlert.fire({
        icon: "error",
        title: "Error",
        text: "La fecha de inicio debe ser anterior a la fecha de fin.",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      SweetAlert.fire({
        icon: "success",
        title: "Éxito",
        text: "Reserva registrada correctamente.",
      });
      // Limpiar los campos del formulario después de mostrar el mensaje de éxito
      setReservationData({
        customerName: "",
        documentType: "",
        documentNumber: "",
        startDate: "",
        endDate: "",
        status: "Reserved", // Restablece el estado predeterminado
        plans: "",
        price: "",
      });
      setCompanions([]);
      setPayments([]);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Reserva de Cliente</h2>
      <Row className="mb-3">
        <Col md={12}>
          {/* Reutiliza el componente ReservationForm */}
          <ReservationForm
            reservation={reservationData}
            onChange={handleReservationChange}
          />
        </Col>
      </Row>

      {/* Formularios de acompañantes y pagos */}
      <Row className="mb-3">
        <Col md={12}>
          <CompanionsForm
            companions={companions}
            setCompanions={setCompanions}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={12}>
          <PaymentsForm payments={payments} setPayments={setPayments} />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={12} className="text-center">
          <Button variant="primary" onClick={handleSubmit}>
            Guardar Reserva
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ReservationsFormClient;
