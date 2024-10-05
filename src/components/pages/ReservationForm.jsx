import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

const ReservationForm = ({ reservation = {}, onChange, onRegisterClient }) => {
  const [errors, setErrors] = useState({});
  const [isClientParticipating, setIsClientParticipating] = useState(
    !!reservation.isClientParticipating
  );

  useEffect(() => {
    setIsClientParticipating(!!reservation.isClientParticipating);
  }, [reservation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMsg = "";
    const today = new Date().toISOString().split("T")[0];

    switch (name) {
      case "startDate":
        if (!value) {
          errorMsg = "Este campo es obligatorio.";
        } else if (value < today) {
          errorMsg = "La fecha de inicio no puede ser anterior a hoy.";
        }
        break;
      case "endDate":
        if (!value) {
          errorMsg = "Este campo es obligatorio.";
        } else if (value < reservation.startDate) {
          errorMsg = "La fecha de fin debe ser posterior a la fecha de inicio.";
        }
        break;
      case "status":
        if (!value) {
          errorMsg = "Selecciona un estado.";
        }
        break;
      case "plan":
        if (!value) {
          errorMsg = "Selecciona un plan.";
        }
        break;
      case "tipoDocumento":
        if (!value) {
          errorMsg = "Selecciona un tipo de documento.";
        }
        break;
      case "documento":
        if (!value) {
          errorMsg = "El número del documento es obligatorio.";
        } else if (!/^\d+$/.test(value)) {
          errorMsg = "El número del documento solo puede contener números.";
        }
        break;
      case "nombreCliente":
        if (!value) {
          errorMsg = "El nombre del cliente es obligatorio.";
        } else if (/\d/.test(value)) {
          errorMsg = "El nombre del cliente no puede contener números.";
        }
        break;
      case "price":
        if (value === "" || Number(value) <= 0) {
          errorMsg = "El precio debe ser un número positivo.";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));
  };

  const handleCheckboxChange = () => {
    const newValue = !isClientParticipating;
    setIsClientParticipating(newValue);
    onChange("isClientParticipating", newValue);
  };

  return (
    <div>
      <h5>Datos de la Reserva</h5>
      <Form>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de Inicio</Form.Label>
              <Form.Control
                type="datetime-local"
                name="startDate"
                defaultValue={
                  reservation.startDate
                    ? reservation.startDate.slice(0, 16)
                    : ""
                }
                onChange={handleChange}
                isInvalid={!!errors.startDate}
              />
              <Form.Control.Feedback type="invalid">
                {errors.startDate}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de Fin</Form.Label>
              <Form.Control
                type="datetime-local"
                name="endDate"
                defaultValue={
                  reservation.endDate ? reservation.endDate.slice(0, 16) : ""
                }
                onChange={handleChange}
                isInvalid={!!errors.endDate}
              />
              <Form.Control.Feedback type="invalid">
                {errors.endDate}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                name="estado"
                defaultValue={reservation.estado || ""}
                onChange={handleChange}
                isInvalid={!!errors.estado}
              >
                <option value="">Selecciona...</option>
                <option value="Reservado">Reservado</option>
                <option value="Completo">Completo</option>
                <option value="Confirmado">Confirmado</option>
                <option value="En ejecucion">En ejecucion</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Anulado">Anulado</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.estado}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Plan</Form.Label>
              <Form.Control
                as="select"
                name="plan"
                defaultValue={reservation.plan || ""}
                onChange={handleChange}
                isInvalid={!!errors.plan}
              >
                <option value="">Selecciona un plan</option>
                <option value="Plan cumpleaños">Plan cumpleaños</option>
                <option value="Plan romántico">Plan romántico</option>
                <option value="Plan alojamiento">Plan alojamiento</option>
                <option value="Plan dia de sol">Plan día de sol</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.plan}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Documento</Form.Label>
              <Form.Control
                as="select"
                name="tipoDocumento"
                defaultValue={reservation.tipoDocumento || ""}
                onChange={handleChange}
                isInvalid={!!errors.tipoDocumento}
              >
                <option value="">Selecciona...</option>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="TI">Tarjeta de Identidad</option>
                <option value="CE">Cédula de Extranjería</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.tipoDocumento}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Número del Documento</Form.Label>
              <Form.Control
                type="text"
                name="documento"
                defaultValue={reservation.documento || ""}
                onChange={handleChange}
                isInvalid={!!errors.documento}
              />
              <Form.Control.Feedback type="invalid">
                {errors.documento}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Cliente</Form.Label>
              <Form.Control
                type="text"
                name="nombreCliente"
                defaultValue={reservation.nombreCliente || ""}
                onChange={handleChange}
                isInvalid={!!errors.nombreCliente}
              />
              <Form.Control.Feedback type="invalid">
                {errors.nombreCliente}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                name="price"
                defaultValue={reservation.price || ""}
                onChange={handleChange}
                isInvalid={!!errors.price}
              />
              <Form.Control.Feedback type="invalid">
                {errors.price}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="El cliente va a participar del servicio"
                checked={isClientParticipating}
                onChange={handleCheckboxChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Button
              variant="outline-primary"
              onClick={onRegisterClient}
              disabled={Object.values(errors).some((error) => error)}
            >
              Registrar Cliente
            </Button>
          </Col>
        </Row>
      </Form>
      <hr />
    </div>
  );
};

export default ReservationForm;
