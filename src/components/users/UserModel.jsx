import React, { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";

const UserModal = ({ show, handleClose, handleSave, user }) => {
  // Estado inicial del formulario y de los errores
  const [formData, setFormData] = useState({
    nombre: "",
    documento: "",
    email: "",
    telefono: "",
    rol: "empleado", // Rol por defecto
  });

  const [errors, setErrors] = useState({});

  // Actualiza los datos del formulario al abrir el modal
  const initializeFormData = () => {
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
  };

  // Maneja los cambios en los inputs
  const handleInputChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Valida el formulario
  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre) newErrors.nombre = "El nombre es obligatorio.";
    if (!formData.documento) newErrors.documento = "El documento es obligatorio.";
    if (!formData.email) newErrors.email = "El email es obligatorio.";
    if (!formData.telefono) newErrors.telefono = "El teléfono es obligatorio.";
    if (!formData.rol) newErrors.rol = "El rol es obligatorio.";
    return newErrors;
  };

  // Maneja el envío del formulario
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
    <Modal show={show} onHide={handleClose} onShow={initializeFormData}>
      <Modal.Header closeButton>
        <Modal.Title>{user ? "Editar Usuario" : "Agregar Usuario"}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Form>
          {["nombre", "documento", "email", "telefono"].map((field) => (
            <Form.Group controlId={`form${field}`} key={field}>
              <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
              <Form.Control
                type={field === "email" ? "email" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                isInvalid={!!errors[field]} // Indica que hay un error
              />
              <Form.Control.Feedback type="invalid">
                {errors[field]}
              </Form.Control.Feedback>
            </Form.Group>
          ))}
          <Form.Group controlId="formRole">
            <Form.Label>Rol</Form.Label>
            <Form.Control
              as="select"
              name="rol"
              value={formData.rol}
              onChange={handleInputChange}
              isInvalid={!!errors.rol} // Indica que hay un error
            >
              <option value="">Selecciona un rol</option>
              <option value="admin">Admin</option>
              <option value="empleado">Empleado</option>
              <option value="cliente">Cliente</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.rol}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit} // Maneja el envío del formulario directamente
        >
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserModal;
