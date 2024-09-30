import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Form, Button, Modal, Col, Row, Alert, InputGroup } from 'react-bootstrap';
import './stylesLogin.css';
import RecoveryPassword from './PasswordRecovery';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function LoginSignin({ isOpen, closeLoginModal }) {
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const users = [
    { name: "admin", email: 'admin@example.com', password: 'admin123', active: true, rol: "admin" },
    { name: "user", email: 'user@example.com', password: 'user123', active: true, rol: "employee" },
    { name: "inactive", email: 'inactive@example.com', password: 'inactive123', active: true, rol: "client" },
  ];

  const validateEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (!validateEmail(newEmail)) {
      setEmailError('Por favor, ingresa un correo electrónico válido');
    } else {
      setEmailError('');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    const user = users.find(
      (user) => user.email === email && user.password === password
    );
    
    if (!user || !user.active) {
      setError('Usuario no existe o inactivo');
    } else {
      setError('');
      login(user.rol);
  
      if (user.rol === 'client') {
        navigate('/');
      } else {
        navigate('/cabins');
      }
      
      handleCloseLoginModal();
    }
  };
  
  const openRecoveryModal = (e) => {
    e.preventDefault();
    setIsRecoveryOpen(true);
  };

  const closeRecoveryModal = () => setIsRecoveryOpen(false);
  const handleCloseLoginModal = () => {
    if (typeof closeLoginModal === 'function') {
      closeLoginModal();
    } else {
      console.error('closeLoginModal no es una función');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Modal show={isOpen} onHide={handleCloseLoginModal} centered size="lg">
        <Modal.Body>
          <Button
            variant="danger"
            onClick={handleCloseLoginModal}
            style={{ position: 'absolute', top: 10, right: 10, zIndex: 999 }}
          >
            X
          </Button>
          <Modal.Title className="text-center">Bienvenido al Inicio de Sesión</Modal.Title>
          <Row className="align-items-center">
            <Col md={6} className="image-col">
              <img
                src="/src/assets/losgLagos.png"
                alt="Logo"
                className="logo-img"
                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
              />
            </Col>
            <Col md={6} className="form-col">
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Ingresa el correo"
                    className="custom-control"
                    value={email}
                    onChange={handleEmailChange}
                    isInvalid={!!emailError}
                  />
                  <Form.Control.Feedback type="invalid">
                    {emailError}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Contraseña"
                      className="custom-control"
                      value={password}
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputGroup.Text 
                      onClick={togglePasswordVisibility}
                      style={{ cursor: 'pointer', background: '#ffffff' }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>

                <Button variant="primary" type="submit" className="custom-button">
                  Ingresar
                </Button>

                <Form.Group className="mt-3 text-center">
                  <Form.Text>
                    <a href="#!" className="link-text" onClick={openRecoveryModal}>¿Has olvidado tu contraseña?</a>
                  </Form.Text>
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      <RecoveryPassword show={isRecoveryOpen} onHide={closeRecoveryModal} />
    </>
  );
}

export default LoginSignin;