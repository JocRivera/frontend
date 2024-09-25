import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import './stylesLogin.css';
import Swal from 'sweetalert2';

function RegisterModal({ isOpen, clickModal }) {
  const [formData, setFormData] = React.useState({
    fullName: '',
    idNumber: '',
    birthdate: '',
    email: '',
    password: '',
    confirmPassword: '', // State for confirm password
    tipoDocumento: '', // State for tipo de documento
  });

  const [errors, setErrors] = React.useState({
    fullName: '',
    idNumber: '',
    birthdate: '',
    email: '',
    password: '',
    confirmPassword: '', // Error state for confirm password
    tipoDocumento: '', // Error state for tipo de documento
  });

  const [showPassword, setShowPassword] = React.useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false); // State for confirm password visibility

  const validateForm = (name, value) => {
    const errorMessages = {
      fullName: 'El nombre debe tener al menos 8 caracteres.',
      idNumber: 'El número de identificación debe tener al menos 4 dígitos y no contener letras.',
      email: 'Por favor, ingrese un email válido.',
      birthdate: 'Debes tener al menos 18 años para registrarte.',
      password: 'La contraseña debe contener al menos 10 caracteres, una mayúscula, una minúscula, un número y un carácter especial.',
      confirmPassword: 'Las contraseñas no coinciden.',
      tipoDocumento: 'Por favor, seleccione un tipo de documento válido.',
    };

    const validations = {
      fullName: value.length >= 8,
      idNumber: /^[0-9]{4,}$/.test(value),
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      birthdate: value && new Date(value) <= new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
      password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$%*?&])[A-Za-z\d@$%*?&]{10,}$/.test(value),
      confirmPassword: value === formData.password,
      tipoDocumento: ['CC', 'TI', 'CE', 'PAS'].includes(value),
    };

    return validations[name] ? '' : errorMessages[name];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateForm(name, value);

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleRegister = async (e) => {
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
      Swal.fire({
        icon: 'error',
        title: 'Error en el registro',
        text: 'Por favor, revise los campos.',
      });
    } else {
      setErrors({});
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso!',
        text: 'Te has registrado correctamente.',
      }).then(() => {
        // Cerrar el modal de registro después de mostrar la alerta
        clickModal();
      });
    }
  };

  return (
    <Modal show={isOpen} onHide={clickModal} size="lg" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
      <Modal.Body>
        <Button variant="danger" onClick={clickModal} style={{ float: 'right' }}>X</Button>
        <Modal.Title className="text-center">Bienvenido al Registro</Modal.Title>
        <Row>
          <Col md={6} className="image-col">
            <img src="/src/assets/losgLagos.png" alt="Logo" className="logo-img" style={{ width: '100%', height: '60%', objectFit: 'cover' }} />
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
                <Form.Label>Tipo de Documento</Form.Label>
                <Form.Select
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={handleChange}
                  isInvalid={!!errors.tipoDocumento}
                >
                  <option value="">Seleccione un tipo de documento</option>
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="TI">Tarjeta de Identidad</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="PAS">Pasaporte</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.tipoDocumento}</Form.Control.Feedback>
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
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                  />
                  <Button
                    variant="link"
                    className="position-absolute top-50 end-0 translate-middle-y"
                    style={{ zIndex: 1 }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <i className="bi bi-eye-slash" /> : <i className="bi bi-eye" />}
                  </Button>
                </div>
                <Form.Control.Feedback type="invalid" style={{ marginTop: '5px', display: 'block' }}>{errors.password}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    isInvalid={!!errors.confirmPassword}
                  />
                  <Button
                    variant="link"
                    className="position-absolute top-50 end-0 translate-middle-y"
                    style={{ zIndex: 1 }}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <i className="bi bi-eye-slash" /> : <i className="bi bi-eye" />}
                  </Button>
                </div>
                <Form.Control.Feedback type="invalid" style={{ marginTop: '5px', display: 'block' }}>{errors.confirmPassword}</Form.Control.Feedback>
              </Form.Group>

              <Button variant="primary" type="submit" className="custom-button">
                Registrarte
              </Button>
            </Form>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default RegisterModal;