import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import Swal from 'sweetalert2'; // Importa SweetAlert

const PaymentsForm = ({ totalAmount, payments = [], onAdd, onDelete }) => {
    const [payment, setPayment] = useState({
        id: null,
        amount: '',
        paymentDate: '',
        status: 'Pendiente',
        receipt: ''
    });
    const [errors, setErrors] = useState({});
    const [receiptUrl, setReceiptUrl] = useState('');

    useEffect(() => {
        return () => {
            if (receiptUrl) {
                URL.revokeObjectURL(receiptUrl);
            }
        };
    }, [receiptUrl]);

    const validate = (fieldName = null) => {
        const currentErrors = { ...errors };
        const currentDate = new Date().toISOString().split('T')[0];

        const validateField = (name) => {
            switch (name) {
                case 'amount':
                    if (!payment.amount || payment.amount <= 0) {
                        currentErrors.amount = 'El monto debe ser un número positivo.';
                    } else {
                        delete currentErrors.amount;
                    }
                    break;
                case 'paymentDate':
                    if (!payment.paymentDate) {
                        currentErrors.paymentDate = 'La fecha de pago es obligatoria.';
                    } else if (payment.paymentDate > currentDate) {
                        currentErrors.paymentDate = 'La fecha de pago no puede ser una fecha futura.';
                    } else {
                        delete currentErrors.paymentDate;
                    }
                    break;
                case 'status':
                    if (!payment.status) {
                        currentErrors.status = 'El estado es obligatorio.';
                    } else {
                        delete currentErrors.status;
                    }
                    break;
                case 'receipt':
                    if (!payment.receipt) {
                        currentErrors.receipt = 'El recibo es obligatorio.';
                    } else {
                        delete currentErrors.receipt;
                    }
                    break;
                default:
                    break;
            }
        };

        // Si `fieldName` es nulo, validar todo el formulario
        if (!fieldName) {
            validateField('amount');
            validateField('paymentDate');
            validateField('status');
            validateField('receipt');
        } else {
            validateField(fieldName);
        }

        setErrors(currentErrors); // Actualiza el estado de errores
        return currentErrors; // Devuelve los errores para evaluar
    };

    const handleAddPayment = () => {
        const currentErrors = validate(); // Validar todos los campos al agregar
        if (Object.keys(currentErrors).length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Errores en el formulario',
                text: 'Por favor, corrija los errores en el formulario de pagos.',
                footer: Object.values(currentErrors).join('<br/>'), // Muestra los mensajes de error
                html: true // Permite HTML en el footer
            });
        } else {
            setErrors({});
            onAdd(payment);
            setPayment({
                amount: '',
                paymentDate: '',
                status: 'Pendiente',
                receipt: ''
            });
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Pago agregado exitosamente.',
            });
        }
    };

    const handleDeletePayment = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás recuperar este pago después de eliminarlo!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                onDelete(id);
                Swal.fire(
                    'Eliminado!',
                    'El pago ha sido eliminado.',
                    'success'
                );
            }
        });
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            if (file && file.type.startsWith('image/')) {
                setReceiptUrl(URL.createObjectURL(file));
                setPayment({ ...payment, receipt: file });
                setErrors((prevErrors) => ({ ...prevErrors, receipt: null }));
            } else {
                setErrors((prevErrors) => ({ ...prevErrors, receipt: 'El recibo debe ser una imagen.' }));
            }
        } else {
            setPayment({ ...payment, [name]: value });
            validate(name); // Validar campo en tiempo real
        }
    };

    // Calcular el total de pagos realizados
    const totalPayments = payments.reduce((acc, pay) => acc + Number(pay.amount), 0);
    const remainingAmount = totalAmount - totalPayments;

    return (
        <div className="mb-3">
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
                                isInvalid={!!errors.status}
                            >
                                <option value="">Selecciona</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="Confirmado">Confirmado</option>
                                <option value="Completado">Completado</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.status}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Recibo</Form.Label>
                            <Form.Control
                                type="file"
                                name="receipt"
                                accept="image/*"
                                onChange={handleChange}
                                isInvalid={!!errors.receipt}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.receipt}
                            </Form.Control.Feedback>
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
                <Button variant="primary" onClick={handleAddPayment} className="mt-3">
                    Agregar Pago
                </Button>
            </Form>
            <h6>Saldo Pendiente</h6>
            <p>${remainingAmount > 0 ? remainingAmount : 0} (de ${totalAmount})</p>
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
                            onClick={() => handleDeletePayment(pay.id)}
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
