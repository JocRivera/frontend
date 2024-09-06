import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";

const ProfilePage = () => {
  const { isAuthenticated, user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [document, setDocument] = useState(user?.document || "");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [birthdate, setBirthdate] = useState(user?.birthdate || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/"); // Redirige a la página de inicio si el usuario no está autenticado
    } else {
      // Rellenar los campos con la información del usuario logueado
      setDocument(user?.document || "");
      setName(user?.name || "");
      setEmail(user?.email || "");
      setBirthdate(user?.birthdate || "");
    }
  }, [isAuthenticated, navigate, user]);

  const validateForm = () => {
    const errorMessages = {
      fullName: "El nombre debe tener al menos 8 caracteres.",
      idNumber:
        "El número de identificación debe tener al menos 4 dígitos y no contener letras.",
      email: "Por favor, ingrese un email válido.",
      birthdate: "Debes tener al menos 18 años para registrarte.",
      password:
        "La contraseña debe contener al menos 10 caracteres, una mayúscula, una minúscula, un número y un carácter especial.",
      confirmPassword: "Las contraseñas no coinciden.",
    };

    const validations = {
      fullName: name.length >= 8,
      idNumber: /^[0-9]{4,}$/.test(document),
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      birthdate:
        birthdate &&
        new Date(birthdate) <=
          new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
      password:
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/.test(
          password
        ),
      confirmPassword: password === confirmPassword,
    };

    const newErrors = {};

    for (const [key, isValid] of Object.entries(validations)) {
      if (!isValid) {
        newErrors[key] = errorMessages[key];
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      updateProfile({ document, name, email, birthdate, password });
      setSuccess("Perfil actualizado correctamente.");
      setErrors({});
    } catch (error) {
      setErrors({ global: "Error al actualizar el perfil." });
    }
  };

  return (
    <Container>
      <h1>Editar Perfil</h1>
      {errors.global && <Alert variant="danger">{errors.global}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formBasicDocument">
              <Form.Label>Número de Documento</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingresa tu número de documento"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                isInvalid={!!errors.idNumber}
                style={{ maxWidth: "100%" }} // Ajusta el tamaño del input
              />
              <Form.Control.Feedback type="invalid">
                {errors.idNumber}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                isInvalid={!!errors.fullName}
                style={{ maxWidth: "100%" }} // Ajusta el tamaño del input
              />
              <Form.Control.Feedback type="invalid">
                {errors.fullName}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!!errors.password}
                style={{ maxWidth: "100%" }} // Ajusta el tamaño del input
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={!!errors.email}
                style={{ maxWidth: "100%" }} // Ajusta el tamaño del input
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicBirthdate">
              <Form.Label>Fecha de Nacimiento</Form.Label>
              <Form.Control
                type="date"
                placeholder="Ingresa tu fecha de nacimiento"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                isInvalid={!!errors.birthdate}
                style={{ maxWidth: "100%" }} // Ajusta el tamaño del input
              />
              <Form.Control.Feedback type="invalid">
                {errors.birthdate}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
              <Form.Label>Confirmar Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirma tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                isInvalid={!!errors.confirmPassword}
                style={{ maxWidth: "100%" }} // Ajusta el tamaño del input
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit">
          Guardar Cambios
        </Button>
      </Form>
    </Container>
  );
};

export default ProfilePage;
