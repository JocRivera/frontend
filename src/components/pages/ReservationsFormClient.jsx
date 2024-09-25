import React from 'react';
import { Form, Row, Col, Button, Tab, Tabs } from 'react-bootstrap';
import { FaExclamationCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ReservationsFormClients = ({ reservation = {}, onSave }) => {
    const [formData, setFormData] = React.useState({
        id: null,
        customerName: '',
        customerAge: '',
        customerTypeOfDocument: '',
        customerDocumentNumber: '',
        customerBirthDate: '',
        paymentAmount: '',
        paymentDate: '',
        paymentState: '',
        companions: [],
        companionName: '',
        companionAge: '',
        companionTypeOfDocument: '',
        companionDocumentNumber: '',
        companionBirthDate: ''
    });

    const [errorMessages, setErrorMessages] = React.useState({});

    React.useEffect(() => {
        if (reservation) {
            setFormData(reservation);
        }
    }, [reservation]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));

        if (name === 'customerBirthDate') {
            const birthDate = new Date(value);
            const calculatedAge = new Date().getFullYear() - birthDate.getFullYear();
            setFormData((prevState) => ({
                ...prevState,
                customerAge: calculatedAge >= 0 ? calculatedAge : ''
            }));
        } else if (name === 'companionBirthDate') {
            const birthDate = new Date(value);
            const calculatedAge = new Date().getFullYear() - birthDate.getFullYear();
            setFormData((prevState) => ({
                ...prevState,
                companionAge: calculatedAge >= 0 ? calculatedAge : ''
            }));
        }

        validateField(name, value);
    };

    const validateField = (name, value) => {
        let errorMsg = '';
        const today = new Date().toISOString().split('T')[0];

        switch (name) {
            // Validaciones para el cliente
            case 'customerName':
                if (!value) errorMsg = 'El nombre del cliente es obligatorio.';
                else if (/\d/.test(value)) errorMsg = 'El nombre no puede contener números.';
                break;
            case 'customerTypeOfDocument':
                if (!value) errorMsg = 'Debes seleccionar un tipo de documento.';
                break;
            case 'customerDocumentNumber':
                if (!/^[a-zA-Z0-9]+$/.test(value) || value.trim() === '') errorMsg = 'El número de documento debe ser alfanumérico y no puede estar vacío.';
                break;
            case 'customerBirthDate':
                if (!value) errorMsg = 'Debes seleccionar una fecha de nacimiento.';
                else if (value > today) errorMsg = 'La fecha de nacimiento no puede ser posterior a hoy.';
                break;
            // Validaciones para el pago
            case 'paymentAmount':
                if (!value) errorMsg = 'El monto del pago es obligatorio.';
                break;
            case 'paymentDate':
                if (!value) errorMsg = 'La fecha de pago es obligatoria.';
                else if (value > today) errorMsg = 'La fecha de pago no puede ser posterior a hoy.';
                break;
            case 'paymentState':
                if (!value) errorMsg = 'Debes seleccionar un estado para el pago.';
                break;
            // Validaciones para el acompañante
            case 'companionName':
                if (!value) errorMsg = 'El nombre del acompañante es obligatorio.';
                else if (/\d/.test(value)) errorMsg = 'El nombre no puede contener números.';
                break;
            case 'companionTypeOfDocument':
                if (!value) errorMsg = 'Debes seleccionar un tipo de documento para el acompañante.';
                break;
            case 'companionDocumentNumber':
                if (!/^[a-zA-Z0-9]+$/.test(value) || value.trim() === '') errorMsg = 'El número de documento debe ser alfanumérico y no puede estar vacío.';
                break;
            case 'companionBirthDate':
                if (!value) errorMsg = 'Debes seleccionar una fecha de nacimiento para el acompañante.';
                else if (value > today) errorMsg = 'La fecha de nacimiento del acompañante no puede ser posterior a hoy.';
                break;
            default:
                break;
        }

        setErrorMessages((prevState) => ({ ...prevState, [name]: errorMsg }));
    };

    const handleSave = () => {
        if (Object.values(errorMessages).some((msg) => msg !== '') || !formData.customerName) return;

        onSave(formData);
        setFormData({
            id: null,
            customerName: '',
            customerAge: '',
            customerTypeOfDocument: '',
            customerDocumentNumber: '',
            customerBirthDate: '',
            paymentAmount: '',
            paymentDate: '',
            paymentState: '',
            companions: [],
            companionName: '',
            companionAge: '',
            companionTypeOfDocument: '',
            companionDocumentNumber: '',
            companionBirthDate: ''
        });
        setErrorMessages({});
        Swal.fire('Éxito', 'Reserva guardada correctamente', 'success');
    };

    const addCompanion = () => {
        if (!formData.companionName || !formData.companionTypeOfDocument || !formData.companionDocumentNumber) {
            Swal.fire('Error', 'Completa todos los campos del acompañante.', 'error');
            return;
        }

        const newCompanion = {
            name: formData.companionName,
            age: formData.companionAge,
            typeOfDocument: formData.companionTypeOfDocument,
            documentNumber: formData.companionDocumentNumber,
            birthDate: formData.companionBirthDate
        };

        setFormData((prevState) => ({
            ...prevState,
            companions: [...prevState.companions, newCompanion],
            companionName: '',
            companionAge: '',
            companionTypeOfDocument: '',
            companionDocumentNumber: '',
            companionBirthDate: ''
        }));
        setErrorMessages({});
    };

    const removeCompanion = (index) => {
        setFormData((prevState) => {
            const updatedCompanions = prevState.companions.filter((_, i) => i !== index);
            return { ...prevState, companions: updatedCompanions };
        });
    };

    return (
        <div>
            <h5>Reserva de Clientes</h5>
            <Form>
                <Tabs defaultActiveKey="client" id="uncontrolled-tab-example" className="mb-3">
                    <Tab eventKey="client" title="Cliente">
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre del Cliente</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="customerName"
                                        value={formData.customerName}
                                        onChange={handleChange}
                                        isInvalid={!!errorMessages.customerName}
                                    />
                                    <Form.Control.Feedback type="invalid">{errorMessages.customerName}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Edad</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="customerAge"
                                        value={formData.customerAge}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tipo de Documento</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="customerTypeOfDocument"
                                        value={formData.customerTypeOfDocument}
                                        onChange={handleChange}
                                        isInvalid={!!errorMessages.customerTypeOfDocument}
                                    >
                                        <option value="">Selecciona...</option>
                                        <option value="CC">Cédula de Ciudadanía</option>
                                        <option value="TI">Tarjeta de Identidad</option>
                                        <option value="CE">Cédula de Extrangería</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">{errorMessages.customerTypeOfDocument}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Número de Documento</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="customerDocumentNumber"
                                        value={formData.customerDocumentNumber}
                                        onChange={handleChange}
                                        isInvalid={!!errorMessages.customerDocumentNumber}
                                    />
                                    <Form.Control.Feedback type="invalid">{errorMessages.customerDocumentNumber}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Fecha de Nacimiento</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="customerBirthDate"
                                        value={formData.customerBirthDate}
                                        onChange={handleChange}
                                        isInvalid={!!errorMessages.customerBirthDate}
                                    />
                                    <Form.Control.Feedback type="invalid">{errorMessages.customerBirthDate}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Tab>
                    <Tab eventKey="payment" title="Pago">
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Monto del Pago</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="paymentAmount"
                                        value={formData.paymentAmount}
                                        onChange={handleChange}
                                        isInvalid={!!errorMessages.paymentAmount}
                                    />
                                    <Form.Control.Feedback type="invalid">{errorMessages.paymentAmount}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Fecha de Pago</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="paymentDate"
                                        value={formData.paymentDate}
                                        onChange={handleChange}
                                        isInvalid={!!errorMessages.paymentDate}
                                    />
                                    <Form.Control.Feedback type="invalid">{errorMessages.paymentDate}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Estado del Pago</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="paymentState"
                                        value={formData.paymentState}
                                        onChange={handleChange}
                                        isInvalid={!!errorMessages.paymentState}
                                    >
                                        <option value="">Selecciona...</option>
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="Confirmado">Confirmado</option>
                                        <option value="Completado">Completado</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">{errorMessages.paymentState}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Tab>
                    <Tab eventKey="companion" title="Acompañante">
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre del Acompañante</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="companionName"
                                        value={formData.companionName}
                                        onChange={handleChange}
                                        isInvalid={!!errorMessages.companionName}
                                    />
                                    <Form.Control.Feedback type="invalid">{errorMessages.companionName}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Edad</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="companionAge"
                                        value={formData.companionAge}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Tipo de Documento</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="companionTypeOfDocument"
                                        value={formData.companionTypeOfDocument}
                                        onChange={handleChange}
                                        isInvalid={!!errorMessages.companionTypeOfDocument}
                                    >
                                        <option value="">Selecciona...</option>
                                        <option value="CC">Cédula de Ciudadanía</option>
                                        <option value="TI">Tarjeta de Identidad</option>
                                        <option value="CE">Cédula de Extrangería</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">{errorMessages.companionTypeOfDocument}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Número de Documento</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="companionDocumentNumber"
                                        value={formData.companionDocumentNumber}
                                        onChange={handleChange}
                                        isInvalid={!!errorMessages.companionDocumentNumber}
                                    />
                                    <Form.Control.Feedback type="invalid">{errorMessages.companionDocumentNumber}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Fecha de Nacimiento</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="companionBirthDate"
                                        value={formData.companionBirthDate}
                                        onChange={handleChange}
                                        isInvalid={!!errorMessages.companionBirthDate}
                                    />
                                    <Form.Control.Feedback type="invalid">{errorMessages.companionBirthDate}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="primary" onClick={addCompanion}>Agregar Acompañante</Button>
                        <ul>
                            {formData.companions.map((companion, index) => (
                                <li key={index}>
                                    {companion.name} - {companion.documentNumber} 
                                    <Button variant="danger" onClick={() => removeCompanion(index)}>Eliminar</Button>
                                </li>
                            ))}
                        </ul>
                    </Tab>
                </Tabs>
                <Button variant="success" onClick={handleSave}>Guardar Reserva</Button>
            </Form>
        </div>
    );
};

export default ReservationsFormClients;
