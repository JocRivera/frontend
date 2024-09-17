import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";

// Función para generar contraseña aleatoria
const generatePassword = () => {
  const length = 10;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  while (true) {
    password = "";
    let hasUpper = false;
    let hasLower = false;
    let hasSpecial = false;
    for (let i = 0; i < length; i++) {
      const char = charset.charAt(Math.floor(Math.random() * charset.length));
      password += char;
      if (/[A-Z]/.test(char)) hasUpper = true;
      if (/[a-z]/.test(char)) hasLower = true;
      if (/[@#$%^&*()_+~`|}{[$$:;?><,./-=]/.test(char)) hasSpecial = true;
    }
    if (hasUpper && hasLower && hasSpecial) break;
  }
  return password;
};

const UserModal = ({ show, handleClose, handleSave, user }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    documento: "",
    email: "",
    telefono: "",
    rol: "empleado", // Rol por defecto
    contraseña: "",
    confirmarContraseña: "",
  });
  const [errors, setErrors] = useState({});

  // Efecto para cargar datos de usuario al editar o resetear el formulario al agregar nuevo
  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        contraseña: user.contraseña || "",
        confirmarContraseña: user.contraseña || "",
      });
    } else {
      const generatedPassword = generatePassword();
      setFormData({
        nombre: "",
        documento: "",
        email: "",
        telefono: "",
        rol: "empleado", // Rol por defecto
        contraseña: generatedPassword,
        confirmarContraseña: generatedPassword,
      });
    }
    setErrors({});
  }, [user]);

  // Manejo de cambios en los inputs y validación en tiempo real
  const handleInputChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateForm(name, value);
  };

  // Validación del formulario para cada campo
  const validateForm = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case "nombre":
        newErrors.nombre =
          !value || !/^[a-zA-Z\s]+$/.test(value)
            ? "El nombre debe contener solo letras y espacios."
            : "";
        break;
      case "documento":
        newErrors.documento =
          !value || !/^\d{6,15}$/.test(value)
            ? "Debe ser un número entre 6 y 15 dígitos."
            : "";
        break;
      case "email":
        newErrors.email =
          !value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ? "Debe ser una dirección válida."
            : "";
        break;
      case "telefono":
        newErrors.telefono =
          !value || !/^\d{10,15}$/.test(value)
            ? "Debe ser un número entre 10 y 15 dígitos."
            : "";
        break;
      case "rol":
        newErrors.rol =
          !value || (value !== "admin" && value !== "empleado")
            ? "Selecciona un rol válido."
            : "";
        break;
      case "contraseña":
        newErrors.contraseña =
          !value ||
          !/^.*(?=.{10,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&*()_+~`|}{[$$:;?><,./-=]).*$/.test(value)
            ? "La contraseña debe tener al menos 10 caracteres, incluyendo mayúsculas, minúsculas y caracteres especiales."
            : "";
        // Validar confirmación de contraseña también
        if (formData.confirmarContraseña && value !== formData.confirmarContraseña) {
          newErrors.confirmarContraseña = "Las contraseñas no coinciden.";
        } else {
          newErrors.confirmarContraseña = "";
        }
        break;
      case "confirmarContraseña":
        newErrors.confirmarContraseña =
          value !== formData.contraseña ? "Las contraseñas no coinciden." : "";
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  // Verifica si todos los campos están llenos y no tienen errores
  const isFormValid = () => {
    return (
      Object.values(formData).every((val) => val !== "") &&
      Object.values(errors).every((error) => error === "")
    );
  };

  // Guardar el formulario y cerrar el modal si todo es correcto
  const handleSubmit = async () => {
    if (isFormValid()) {
      await handleSave(formData); // Guardar los datos
      Swal.fire({
        title: "Éxito",
        text: user ? "Usuario actualizado" : "Usuario agregado",
        icon: "success",
        timer: 2000, // Desaparece después de 2 segundos
        showConfirmButton: false,
      }).then(() => {
        handleClose(); // Cerrar el modal después de guardar
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "Corrige los errores del formulario",
        icon: "error",
        timer: 2000, // Desaparece después de 2 segundos
        showConfirmButton: false,
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{user ? "Editar Usuario" : "Agregar Usuario"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              isInvalid={!!errors.nombre}
            />
            <Form.Control.Feedback type="invalid">
              {errors.nombre}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Documento</Form.Label>
            <Form.Control
              type="number"
              name="documento"
              value={formData.documento}
              onChange={handleInputChange}
              isInvalid={!!errors.documento}
            />
            <Form.Control.Feedback type="invalid">
              {errors.documento}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="number"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              isInvalid={!!errors.telefono}
            />
            <Form.Control.Feedback type="invalid">
              {errors.telefono}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Rol</Form.Label>
            <Form.Select
              name="rol"
              value={formData.rol}
              onChange={handleInputChange}
              isInvalid={!!errors.rol}
            >
              <option value="empleado">Empleado</option>
              <option value="admin">Admin</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.rol}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleInputChange}
              isInvalid={!!errors.contraseña}
              readOnly={false} // Permitir edición de la contraseña
            />
            <Form.Control.Feedback type="invalid">
              {errors.contraseña}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Campo de Confirmar Contraseña */}
          <Form.Group className="mb-3">
            <Form.Label>Confirmar Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="confirmarContraseña"
              value={formData.confirmarContraseña}
              onChange={handleInputChange}
              isInvalid={!!errors.confirmarContraseña}
              readOnly={false} // Permitir edición de la confirmación de la contraseña
            />
            <Form.Control.Feedback type="invalid">
              {errors.confirmarContraseña}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserModal;