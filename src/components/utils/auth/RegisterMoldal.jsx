import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import './stylesLogin.css';

function RegisterModal({ isOpen, clickModal }) {
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    birthdate: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = (name, value) => {
    const errorMessages = {
      fullName: 'El nombre debe tener al menos 8 caracteres.',
      idNumber: 'El número de identificación debe tener al menos 4 dígitos y no contener letras.',
      email: 'Por favor, ingrese un email válido.',
      birthdate: 'Debes tener al menos 18 años para registrarte.',
      password: 'La contraseña debe contener al menos 10 caracteres, una mayúscula, una minúscula, un número y un carácter especial.',
    };

    const validations = {
      fullName: value.length >= 8,
      idNumber: /^[0-9]{4,}$/.test(value),
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      birthdate: value && new Date(value) <= new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
      password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/.test(value),
    };

    return validations[name] ? '' : errorMessages[name];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateForm(name, value);

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const formErrors = Object.keys(formData).reduce((acc, field) => {
      const error = validateForm(field, formData[field]);
      if (error) {
        acc[field] = error;
      }
      return acc;
    }, {});

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      alert('Registro exitoso');
      
      
    }
  };

  return (
    <Modal show={isOpen} onHide={clickModal} size="lg" style={{ background : 'rgba(0, 0, 0, 0.5)'}}>
      <Modal.Body>
        <Button variant="danger" onClick={clickModal} style={{ float: 'right' }}>X</Button>
        <Modal.Title className="text-center">Bienvenido al Registro</Modal.Title>
        <Row>
          <Col md={6} className="image-col">
            <img src="/src/assets/losgLagos.png" alt="Logo" className="logo-img"  style={{ width: '100%', height: '60%', objectFit: 'cover' }} />
          </Col>
          <Col md={6} className="form-col">
            <Form onSubmit={handleRegister}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre Completo</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  placeholder="Nombre Completo"
                  value={formData.fullName}
                  onChange={handleChange}
                  isInvalid={!!errors.fullName}
                />
                <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Número de Identificación</Form.Label>
                <Form.Control
                  type="text"
                  name="idNumber"
                  placeholder="Número de Identificación"
                  value={formData.idNumber}
                  onChange={handleChange}
                  isInvalid={!!errors.idNumber}
                />
                <Form.Control.Feedback type="invalid">{errors.idNumber}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Fecha de Nacimiento</Form.Label>
                <Form.Control
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  isInvalid={!!errors.birthdate}
                />
                <Form.Control.Feedback type="invalid">{errors.birthdate}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
              </Form.Group>

              <Button variant="primary" type="submit" className="custom-button">
                Registrarte
              </Button>

              <Form.Group className="mt-3 text-center">
                {/* <Form.Text>
                  <a href="#!" className="link-text" onClick={() => clickModal()}>¿Ya tienes cuenta?</a>
                </Form.Text> */}
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default RegisterModal;
