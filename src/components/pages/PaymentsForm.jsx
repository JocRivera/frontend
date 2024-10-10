import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

const PaymentsForm = ({ totalAmount = 0, payments = [], onAdd, onDelete }) => {
    const [payment, setPayment] = useState({
        id: null,
        amount: '',
        paymentDate: '',
        status: 'Pendiente',
        receipt: ''
    });
    const [errors, setErrors] = useState({});
    const [receiptUrl, setReceiptUrl] = useState('');
    const [localPayments, setLocalPayments] = useState(payments);
    const [remainingAmount, setRemainingAmount] = useState(totalAmount);

    useEffect(() => {
        return () => {
            if (receiptUrl) {
                URL.revokeObjectURL(receiptUrl);
            }
        };
    }, [receiptUrl]);

    useEffect(() => {
        setLocalPayments(payments);
        updateRemainingAmount(payments);
    }, [payments, totalAmount]);

    const updateRemainingAmount = (currentPayments) => {
        const totalPayments = currentPayments.reduce((acc, pay) => acc + Number(pay.amount || 0), 0);
        const newRemainingAmount = Math.max(totalAmount - totalPayments, 0);
        setRemainingAmount(newRemainingAmount);
    };

    const validate = (fieldName = null) => {
        const currentErrors = {};
        if (!payment.amount) {
            currentErrors.amount = 'El monto es requerido.';
        } else if (Number(payment.amount) < 0) {
            currentErrors.amount = 'El monto no puede ser negativo.';
        }
        if (!payment.paymentDate) {
            currentErrors.paymentDate = 'La fecha de pago es requerida.';
        }
        if (!payment.status) {
            currentErrors.status = 'El estado es requerido.';
        }
        if (!payment.receipt) {
            currentErrors.receipt = 'El recibo es requerido.';
        }
        setErrors(currentErrors);
        return currentErrors;
    };

    const handleAddPayment = () => {
        const currentErrors = validate();
        if (Object.keys(currentErrors).length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Errores en el formulario',
                text: 'Por favor, corrija los errores en el formulario de pagos.',
                footer: Object.values(currentErrors).join('<br/>'),
                html: true
            });
        } else {
            setErrors({});
            const newPayment = { ...payment, id: Date.now() };
            const updatedPayments = [...localPayments, newPayment];
            setLocalPayments(updatedPayments);
            updateRemainingAmount(updatedPayments);
            onAdd(newPayment);
            setPayment({
                id: null,
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
                const updatedPayments = localPayments.filter((pay) => pay.id !== id);
                setLocalPayments(updatedPayments);
                updateRemainingAmount(updatedPayments);
                onDelete(id);
                Swal.fire('Eliminado!', 'El pago ha sido eliminado.', 'success');
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
            validate(name); // Validar en tiempo real
        }
    };

    return (
        <div className="mb-3">
            <h5>Pagos</h5>
            <h6>Saldo Pendiente: ${remainingAmount.toFixed(2)} (de ${totalAmount.toFixed(2)})</h6>
            <h6>Lista de Pagos</h6>
            <ul>
                {localPayments.map((pay) => (
                    <li key={pay.id}>
                        Monto: ${(Number(pay.amount) || 0).toFixed(2)}, Fecha: {pay.paymentDate}, Estado: {pay.status}
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
                                max={remainingAmount} // Limitar el monto al saldo pendiente
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
                                <option value="Por Confirmar">Por Confirmar</option>
                                <option value="Completado">Completado</option>
                                <option value="No Aprobado">No Aprobado</option>
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
        </div>
    );
};

export default PaymentsForm;
