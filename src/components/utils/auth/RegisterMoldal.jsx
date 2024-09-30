import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col, InputGroup } from 'react-bootstrap';
import './stylesLogin.css';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function RegisterModal({ isOpen, clickModal }) {
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    birthdate: '',
    email: '',
    password: '',
    confirmPassword: '',
    tipoDocumento: '',
  });

  const [errors, setErrors] = useState({
    fullName: '',
    idNumber: '',
    birthdate: '',
    email: '',
    password: '',
    confirmPassword: '',
    tipoDocumento: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        clickModal();
      });
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <Modal show={isOpen} onHide={clickModal} size="lg" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
      <Modal.Body>
        <Button variant="danger" onClick={clickModal} style={{ position: 'absolute', top: 10, right: 10, zIndex: 999 }}>X</Button>
        <Modal.Title className="text-center">Bienvenido al Registro</Modal.Title>
        <Row className="align-items-center">
          <Col md={6} className="image-col">
            <img src="/src/assets/losgLagos.png" alt="Logo" className="logo-img" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
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
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                  />
                  <InputGroup.Text 
                    onClick={() => togglePasswordVisibility('password')}
                    style={{ cursor: 'pointer', background: '#ffffff' }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </InputGroup.Text>
                </InputGroup>
                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    isInvalid={!!errors.confirmPassword}
                  />
                  <InputGroup.Text 
                    onClick={() => togglePasswordVisibility('confirmPassword')}
                    style={{ cursor: 'pointer', background: '#ffffff' }}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </InputGroup.Text>
                </InputGroup>
                <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
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