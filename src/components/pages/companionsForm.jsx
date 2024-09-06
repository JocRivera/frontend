import React, { useState } from 'react';
import { Table, Button, Form, Alert } from 'react-bootstrap';

const CompanionsForm = ({ companions, onAdd, onDelete }) => {
    const [companion, setCompanion] = useState({ name: '', age: '', docType: '', document: '', eps: '' });
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);

    const validate = () => {
        const errors = {};
        if (!companion.name) errors.name = 'El nombre es obligatorio.';
        if (!companion.age || companion.age <= 0) errors.age = 'La edad debe ser un número positivo.';
        if (!companion.docType) errors.docType = 'El tipo de documento es obligatorio.';
        if (!companion.document) errors.document = 'El documento es obligatorio.';
        return errors;
    };

    const handleAdd = () => {
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            setAlert({ type: 'danger', message: 'Por favor, corrija los errores en el formulario de acompañantes.' });
        } else {
            setErrors({});
            onAdd(companion);
            setCompanion({ name: '', age: '', docType: '', document: '', eps: '' });
            setAlert({ type: 'success', message: 'Acompañante agregado exitosamente.' });
        }
    };

    const handleChange = (e) => {
        setCompanion({ ...companion, [e.target.name]: e.target.value });
    };

    return (
        <div className="mb-3">
            {alert && (
                <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
                    {alert.message}
                </Alert>
            )}
            <h5>Acompañantes</h5>
            <Table striped bordered hover size="sm">
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
                    {companions.map((comp) => (
                        <tr key={comp.id}>
                            <td>{comp.name}</td>
                            <td>{comp.age}</td>
                            <td>{comp.docType}</td>
                            <td>{comp.document}</td>
                            <td>{comp.eps}</td>
                            <td>
                                <Button variant="danger" size="sm" onClick={() => onDelete(comp.id)}>
                                    🗑️
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Compactación del formulario */}
            <div className="d-flex justify-content-between">
                <Form.Group className="mb-3 me-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={companion.name}
                        onChange={handleChange}
                        isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.name}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3 me-3">
                    <Form.Label>Edad</Form.Label>
                    <Form.Control
                        type="number"
                        name="age"
                        value={companion.age}
                        onChange={handleChange}
                        isInvalid={!!errors.age}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.age}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3 me-3">
                    <Form.Label>Tipo de Documento</Form.Label>
                    <Form.Control
                        type="text"
                        name="docType"
                        value={companion.docType}
                        onChange={handleChange}
                        isInvalid={!!errors.docType}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.docType}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3 me-3">
                    <Form.Label>Documento</Form.Label>
                    <Form.Control
                        type="text"
                        name="document"
                        value={companion.document}
                        onChange={handleChange}
                        isInvalid={!!errors.document}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.document}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>EPS</Form.Label>
                    <Form.Control
                        type="text"
                        name="eps"
                        value={companion.eps}
                        onChange={handleChange}
                    />
                </Form.Group>
            </div>

            <Button variant="primary" onClick={handleAdd} className="mt-3">
                Agregar Acompañante
            </Button>
        </div>
    );
};

export default CompanionsForm;
