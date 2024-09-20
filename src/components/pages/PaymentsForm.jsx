import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';

const PaymentsForm = ({ payments = [], onAdd, onDelete }) => {
    const [payment, setPayment] = useState({
        id: null,
        amount: '',
        paymentDate: '',
        status: '',
        receipt: ''
    });
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);
    const [receiptUrl, setReceiptUrl] = useState('');

    useEffect(() => {
        return () => {
            if (receiptUrl) {
                URL.revokeObjectURL(receiptUrl);
            }
        };
    }, [receiptUrl]);

    const validate = () => {
        const errors = {};
        if (!payment.amount || payment.amount <= 0) errors.amount = 'El monto debe ser un número positivo.';
        if (!payment.paymentDate) errors.paymentDate = 'La fecha de pago es obligatoria.';
        return errors;
    };

    const handleAdd = () => {
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            setAlert({ type: 'danger', message: 'Por favor, corrija los errores en el formulario de pagos.' });
        } else {
            setErrors({});
            onAdd(payment);
            setPayment({
                amount: '',
                paymentDate: '',
                status: '',
                receipt: ''
            });
            setAlert({ type: 'success', message: 'Pago agregado exitosamente.' });
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            setReceiptUrl(URL.createObjectURL(file));
            setPayment({ ...payment, receipt: file });
        } else {
            setPayment({ ...payment, [name]: value });
        }
    };

    return (
        <div className="mb-3">
            {alert && (
                <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
                    {alert.message}
                </Alert>
            )}
            <h5>Pagos</h5>
            <Form>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Monto</Form.Label>
                            <Form.Control
                                type="number"
                                name="amount"
                                value={payment.amount}
                                onChange={handleChange}
                                isInvalid={!!errors.amount}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.amount}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Fecha de Pago</Form.Label>
                            <Form.Control
                                type="date"
                                name="paymentDate"
                                value={payment.paymentDate}
                                onChange={handleChange}
                                isInvalid={!!errors.paymentDate}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.paymentDate}
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
                                name="status"
                                value={payment.status}
                                onChange={handleChange}
                            >
                                <option value="Pendiente">Pendiente</option>
                                <option value="Confirmado">Confirmado</option>
                                <option value="Completado">Completado</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Recibo</Form.Label>
                            <Form.Control
                                type="file"
                                name="receipt"
                                onChange={handleChange}
                            />
                            {receiptUrl && (
                                <img
                                    src={receiptUrl}
                                    alt="Recibo"
                                    style={{ maxWidth: '200px', marginTop: '10px' }}
                                />
                            )}
                        </Form.Group>
                    </Col>
                </Row>
                <Button variant="primary" onClick={handleAdd} className="mt-3">
                    Agregar Pago
                </Button>
            </Form>

            <h6>Lista de Pagos</h6>
            <ul>
                {payments.map((pay) => (
                    <li key={pay.id}>
                        Monto: ${pay.amount}, Fecha: {pay.paymentDate}, Estado: {pay.status}
                        {pay.receipt && (
                            <img
                                src={URL.createObjectURL(pay.receipt)}
                                alt="Recibo"
                                style={{ maxWidth: '100px', marginLeft: '10px' }}
                            />
                        )}
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => onDelete(pay.id)}
                            className="ms-2"
                        >
                            Eliminar
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PaymentsForm;
