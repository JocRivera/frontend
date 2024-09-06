import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const ReservationForm = ({ reservation = {}, readOnly }) => {
    return (
        <div>
            <h5>Datos de la Reserva</h5>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Fecha de Inicio</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="startDate"
                            value={reservation.startDate ? reservation.startDate.slice(0, 16) : ''}
                            readOnly={readOnly}
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Fecha de Fin</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="endDate"
                            value={reservation.endDate ? reservation.endDate.slice(0, 16) : ''}
                            readOnly={readOnly}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Estado</Form.Label>
                        <Form.Control
                            as="select"
                            name="status"
                            value={reservation.status || ''}
                            readOnly={readOnly}
                        >
                            <option value="">Selecciona...</option>
                            <option value="Reservado">Reservado</option>
                            <option value="Confirmado">Confirmado</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Anulado">Anulado</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Plan</Form.Label>
                        <Form.Control
                            as="select"
                            name="plan"
                            value={reservation.plan || ''}
                            readOnly={readOnly}
                        >
                            <option value="">Selecciona un plan</option>
                            <option value="Pansadia cumpleaños">Pansadia cumpleaños</option>
                            <option value="Plan romántico">Plan romántico</option>
                            <option value="Plan alojamiento">Plan alojamiento</option>
                            <option value="Plan día de sol">Plan día de sol</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Tipo de Documento</Form.Label>
                        <Form.Control
                            as="select"
                            name="typeOfDocument"
                            value={reservation.typeOfDocument || ''}
                            readOnly={readOnly}
                        >
                            <option value="">Selecciona...</option>
                            <option value="CC">Cédula de Ciudadanía</option>
                            <option value="TI">Tarjeta de Identidad</option>
                            <option value="CE">Cédula de Extrangería</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Número del Documento</Form.Label>
                        <Form.Control
                            type="text"
                            name="documentNumber"
                            value={reservation.documentNumber || ''}
                            readOnly={readOnly}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre del Cliente</Form.Label>
                        <Form.Control
                            type="text"
                            name="clientName"
                            value={reservation.clientName || ''}
                            readOnly={readOnly}
                        />
                    </Form.Group>
                </Col>
            </Row>
        </div>
    );
};

export default ReservationForm;
