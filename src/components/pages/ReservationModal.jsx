import React from 'react';
import { Modal, Button, Table, Form, Row, Col } from 'react-bootstrap';

const ReservationModal = ({
  show, handleClose, reservation, companions, payments,
  handleNewReservationChange, handleAddReservation,
  handleCompanionChange, handleAddCompanion,
  handlePaymentChange, handleAddPayment,
  newReservation, newCompanion, newPayment,
  handleDeleteCompanion, handleDeletePayment,
  isEditMode
}) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{isEditMode ? 'Registrar Reserva' : 'Ver Detalle'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isEditMode ? (
          <Form>
            <h5>Datos de la Reserva</h5>
            <Form.Group className="mb-3">
              <Form.Label>Cliente</Form.Label>
              <Form.Control
                type="text"
                name="cliente"
                value={newReservation.cliente}
                onChange={handleNewReservationChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha Inicio</Form.Label>
              <Form.Control
                type="datetime-local"
                name="fechaInicio"
                value={newReservation.fechaInicio}
                onChange={handleNewReservationChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha Fin</Form.Label>
              <Form.Control
                type="datetime-local"
                name="fechaFin"
                value={newReservation.fechaFin}
                onChange={handleNewReservationChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                name="precio"
                value={newReservation.precio}
                onChange={handleNewReservationChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                name="estado"
                value={newReservation.estado}
                onChange={handleNewReservationChange}
              >
                <option>Pendiente</option>
                <option>Confirmado</option>
                <option>Completado</option>
                <option>Anulado</option>
              </Form.Control>
            </Form.Group>

            <h5>Añadir Acompañante</h5>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={newCompanion.name}
                    onChange={handleCompanionChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Edad</Form.Label>
                  <Form.Control
                    type="number"
                    name="age"
                    value={newCompanion.age}
                    onChange={handleCompanionChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Documento</Form.Label>
                  <Form.Control
                    type="text"
                    name="docType"
                    value={newCompanion.docType}
                    onChange={handleCompanionChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Documento</Form.Label>
                  <Form.Control
                    type="text"
                    name="document"
                    value={newCompanion.document}
                    onChange={handleCompanionChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>EPS</Form.Label>
                  <Form.Control
                    type="text"
                    name="eps"
                    value={newCompanion.eps}
                    onChange={handleCompanionChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" onClick={handleAddCompanion}>Añadir Acompañante</Button>

            <h5>Listado de Acompañantes</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Edad</th>
                  <th>Tipo de Documento</th>
                  <th>Documento</th>
                  <th>EPS</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {companions.map((companion) => (
                  <tr key={companion.id}>
                    <td>{companion.name}</td>
                    <td>{companion.age}</td>
                    <td>{companion.docType}</td>
                    <td>{companion.document}</td>
                    <td>{companion.eps}</td>
                    <td>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteCompanion(companion.id)}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <h5>Añadir Pago</h5>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Monto</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    value={newPayment.amount}
                    onChange={handlePaymentChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Fecha del Pago</Form.Label>
                  <Form.Control
                    type="date"
                    name="paymentDate"
                    value={newPayment.paymentDate}
                    onChange={handlePaymentChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Control
                    as="select"
                    name="status"
                    value={newPayment.status}
                    onChange={handlePaymentChange}
                  >
                    <option>Pendiente</option>
                    <option>Confirmado</option>
                    <option>Completado</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Comprobante</Form.Label>
                  <Form.Control
                    type="file"
                    name="receipt"
                    onChange={handlePaymentChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" onClick={handleAddPayment}>Añadir Pago</Button>

            <h5>Listado de Pagos</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Monto</th>
                  <th>Fecha del Pago</th>
                  <th>Estado</th>
                  <th>Comprobante</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {payments.length > 0 ? (
                  payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.amount}</td>
                      <td>{payment.paymentDate}</td>
                      <td>{payment.status}</td>
                      <td>{payment.receipt ? payment.receipt.name : 'N/A'}</td>
                      <td>
                        <Button variant="danger" size="sm" onClick={() => handleDeletePayment(payment.id)}>
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">No hay pagos</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Form>
        ) : (
          <div>
            <h5>Información de la Reserva</h5>
            <p><strong>Cliente:</strong> {reservation.cliente}</p>
            <p><strong>Fecha Inicio:</strong> {reservation.fechaInicio}</p>
            <p><strong>Fecha Fin:</strong> {reservation.fechaFin}</p>
            <p><strong>Precio:</strong> {reservation.precio}</p>
            <p><strong>Estado:</strong> {reservation.estado}</p>

            <h5>Acompañantes</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Edad</th>
                  <th>Tipo de Documento</th>
                  <th>Documento</th>
                  <th>EPS</th>
                </tr>
              </thead>
              <tbody>
                {companions.length > 0 ? (
                  companions.map((companion) => (
                    <tr key={companion.id}>
                      <td>{companion.name}</td>
                      <td>{companion.age}</td>
                      <td>{companion.docType}</td>
                      <td>{companion.document}</td>
                      <td>{companion.eps}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">No hay acompañantes</td>
                  </tr>
                )}
              </tbody>
            </Table>

            <h5>Pagos</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Monto</th>
                  <th>Fecha del Pago</th>
                  <th>Estado</th>
                  <th>Comprobante</th>
                </tr>
              </thead>
              <tbody>
                {payments.length > 0 ? (
                  payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.amount}</td>
                      <td>{payment.paymentDate}</td>
                      <td>{payment.status}</td>
                      <td>{payment.receipt ? payment.receipt.name : 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">No hay pagos</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        {isEditMode && (
          <Button variant="primary" onClick={handleAddReservation}>
            Guardar
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ReservationModal;
