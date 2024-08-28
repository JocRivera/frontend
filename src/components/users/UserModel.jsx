import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const UserModal = ({ show, handleClose, handleSave, user }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    documento: "",
    email: "",
    telefono: "",
    rol: "empleado", // Rol por defecto
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData({
        nombre: "",
        documento: "",
        email: "",
        telefono: "",
        rol: "", // Rol por defecto
      });
    }
    setErrors({});
  }, [user]);

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validación de nombre
    if (!formData.nombre || !/^[a-zA-Z\s]+$/.test(formData.nombre)) {
      newErrors.nombre = "El nombre es obligatorio y debe contener solo letras y espacios.";
    }

    // Validación de documento
    if (!formData.documento || !/^\d{6,15}$/.test(formData.documento)) {
      newErrors.documento = "El documento es obligatorio y debe ser un número entre 6 y 15 dígitos.";
    }

    // Validación de email
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email es obligatorio y debe ser una dirección de correo válida.";
    }

    // Validación de teléfono
    if (!formData.telefono || !/^\d{10,15}$/.test(formData.telefono)) {
      newErrors.telefono = "El teléfono es obligatorio y debe ser un número entre 10 y 15 dígitos.";
    }

    // Validación de rol
    if (!formData.rol) {
      newErrors.rol = "El rol es obligatorio.";
    }

    return newErrors;
  };

  const handleSubmit = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      handleSave(formData);
      handleClose();
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{user ? "Editar Usuario" : "Agregar Usuario"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              isInvalid={!!errors.nombre}
            />
            <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formDocumento">
            <Form.Label>Documento</Form.Label>
            <Form.Control
              type="text"
              name="documento"
              value={formData.documento}
              onChange={handleInputChange}
              isInvalid={!!errors.documento}
            />
            <Form.Control.Feedback type="invalid">{errors.documento}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTelefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              isInvalid={!!errors.telefono}
            />
            <Form.Control.Feedback type="invalid">{errors.telefono}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formRol">
            <Form.Label>Rol</Form.Label>
            <Form.Control
              as="select"
              name="rol"
              value={formData.rol}
              onChange={handleInputChange}
              isInvalid={!!errors.rol}
            >
              <option value="">Selecciona un rol</option>
              <option value="admin">Admin</option>
              <option value="empleado">Empleado</option>
              <option value="cliente">Cliente</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">{errors.rol}</Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
        <Button variant="primary" onClick={handleSubmit}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserModal;
