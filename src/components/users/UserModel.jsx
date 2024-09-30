import React, { useState, useEffect } from "react";
import { Modal, Form, Button, InputGroup } from "react-bootstrap";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash, FaLock, FaUnlock } from "react-icons/fa";

const UserModal = ({ show, handleClose, handleSave, user }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    documento: "",
    tipoDocumento: "CC",
    email: "",
    telefono: "",
    rol: "empleado",
    contraseña: "",
    confirmarContraseña: "",
    estado: "activo",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        contraseña: user.contraseña || "",
        confirmarContraseña: user.contraseña || "",
        estado: user.estado || "activo",
      });
    } else {
      setFormData({
        nombre: "",
        documento: "",
        tipoDocumento: "CC",
        email: "",
        telefono: "",
        rol: "empleado",
        contraseña: "",
        confirmarContraseña: "",
        estado: "activo",
      });
    }
    setErrors({});
    setTouched({});
  }, [user]);

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateForm(name, value);
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateForm(field, formData[field]);
  };

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
      case "tipoDocumento":
        newErrors.tipoDocumento =
          !value ? "Selecciona un tipo de documento." : "";
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
      case "estado":
        newErrors.estado =
          !value || (value !== "activo" && value !== "inactivo")
            ? "Selecciona un estado válido."
            : "";
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const isFormValid = () => {
    return (
      Object.values(formData).every((val) => val !== "") &&
      Object.values(errors).every((error) => error === "")
    );
  };

  const handleSubmit = async () => {
    if (isFormValid()) {
      await handleSave(formData);
      handleClose();
      setFormData({
        nombre: "",
        documento: "",
        tipoDocumento: "CC",
        email: "",
        telefono: "",
        rol: "empleado",
        contraseña: "",
        confirmarContraseña: "",
        estado: "activo",
      });
      setErrors({});
      setTouched({});
    } else {
      Swal.fire({
        title: "Error",
        text: "Corrige los errores del formulario",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'contraseña') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmarContraseña') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const renderPasswordField = (fieldName, placeholder, value, onChange, onBlur, error, touched, showPassword, toggleVisibility) => {
    return (
      <Form.Group className="mb-3" controlId={`formBasic${fieldName}`}>
        <Form.Label>{fieldName === 'contraseña' ? 'Contraseña' : 'Confirmar Contraseña'}</Form.Label>
        <InputGroup>
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder}
            name={fieldName}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            isInvalid={!!error && touched}
          />
          <InputGroup.Text 
            onClick={() => toggleVisibility(fieldName)}
            style={{ cursor: 'pointer', background: showPassword ? '#e9ecef' : '#ffffff' }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </InputGroup.Text>
        </InputGroup>
        <Form.Control.Feedback type="invalid">
          {error}
        </Form.Control.Feedback>
      </Form.Group>
    );
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
            <Form.Label>Tipo de Documento</Form.Label>
            <Form.Select
              name="tipoDocumento"
              value={formData.tipoDocumento}
              onChange={handleInputChange}
              isInvalid={!!errors.tipoDocumento}
            >
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="TI">Tarjeta de Identidad</option>
              <option value="CE">Cédula de Extranjería</option>
              <option value="PAS">Pasaporte</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.tipoDocumento}
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
            <Form.Label>Estado</Form.Label>
            <Form.Check
              type="switch"
              id="estado-switch"
              name="estado"
              checked={formData.estado === "activo"}
              onChange={() =>
                setFormData((prev) => ({
                  ...prev,
                  estado: prev.estado === "activo" ? "inactivo" : "activo",
                }))
              }
              label={formData.estado}
            />
            <Form.Control.Feedback type="invalid">
              {errors.estado}
            </Form.Control.Feedback>
          </Form.Group>

          {renderPasswordField(
            'contraseña',
            'Ingrese la contraseña',
            formData.contraseña,
            handleInputChange,
            () => handleBlur('contraseña'),
            errors.contraseña,
            touched.contraseña,
            showPassword,
            togglePasswordVisibility
          )}

          {renderPasswordField(
            'confirmarContraseña',
            'Confirme la contraseña',
            formData.confirmarContraseña,
            handleInputChange,
            () => handleBlur('confirmarContraseña'),
            errors.confirmarContraseña,
            touched.confirmarContraseña,
            showConfirmPassword,
            togglePasswordVisibility
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {user ? "Actualizar" : "Agregar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserModal;