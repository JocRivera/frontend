import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

const CompanionsForm = ({ companions = [], onAdd, onDelete }) => {
    const [companion, setCompanion] = React.useState({
        id: null,
        name: '',
        age: '',
        typeOfDocument: '',
        documentNumber: '',
        birthDate: ''
    });

    const handleChange = (e) => {
        setCompanion({ ...companion, [e.target.name]: e.target.value });
    };

    const handleAdd = () => {
        if (companion.name && companion.age && companion.typeOfDocument && companion.documentNumber && companion.birthDate) {
            onAdd(companion);
            setCompanion({
                id: null,
                name: '',
                age: '',
                typeOfDocument: '',
                documentNumber: '',
                birthDate: ''
            });
        }
    };

    return (
        <div>
            <h5>Acompañantes</h5>
            <Form>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={companion.name}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Edad</Form.Label>
                            <Form.Control
                                type="number"
                                name="age"
                                value={companion.age}
                                onChange={handleChange}
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
                                name="typeOfDocument"
                                value={companion.typeOfDocument}
                                onChange={handleChange}
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
                            <Form.Label>Número de Documento</Form.Label>
                            <Form.Control
                                type="text"
                                name="documentNumber"
                                value={companion.documentNumber}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Fecha de Nacimiento</Form.Label>
                            <Form.Control
                                type="date"
                                name="birthDate"
                                value={companion.birthDate}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Button variant="primary" onClick={handleAdd}>
                    Añadir Acompañante
                </Button>
            </Form>

            <h6>Lista de Acompañantes</h6>
            <ul>
                {companions.map((comp) => (
                    <li key={comp.id}>
                        {comp.name}, {comp.age} años - {comp.typeOfDocument} {comp.documentNumber}
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => onDelete(comp.id)}
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

export default CompanionsForm;
