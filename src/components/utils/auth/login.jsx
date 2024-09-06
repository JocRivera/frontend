import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Form, Button, Modal, Col, Row, Alert } from 'react-bootstrap';
import './stylesLogin.css';
import RegisterModal from './RegisterMoldal';
import RecoveryPassword from './PasswordRecovery';

function LoginSignin({ isOpen, closeLoginModal }) {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const users = [
    { name: "admin", email: 'admin@example.com', password: 'admin123', active: true, rol: "admin" },
    { name: "user", email: 'user@example.com', password: 'user123', active: true, rol: "employee" },
    { name: "inactive", email: 'inactive@example.com', password: 'inactive123', active: true, rol: "cliente" },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    
    const user = users.find(
      (user) => user.email === email && user.password === password
    );
    
    if (!user || !user.active) {
      setError('Usuario no existe o inactivo');
    } else {
      setError('');
      login(user.rol); // Pasar solo el rol aquí
  
      if (user.rol === 'client') {
        navigate('/'); // Redirige a la página de inicio si es cliente
      } else {
        navigate('/cabins'); // Redirige a la página de Cabañas si es admin o empleado
      }
      
      handleCloseLoginModal();
    }
  };
  
  

  const openRegisterModal = () => setIsRegisterOpen(true);
  const openRecoveryModal = (e) => {
    e.preventDefault();
    setIsRecoveryOpen(true);
  };

  const closeRegisterModal = () => setIsRegisterOpen(false);
  const closeRecoveryModal = () => setIsRecoveryOpen(false);
  const handleCloseLoginModal = () => {
    if (typeof closeLoginModal === 'function') {
      closeLoginModal();
    } else {
      console.error('closeLoginModal no es una función');
    }
  };

  return (
    <>
      <Modal show={isOpen} onHide={handleCloseLoginModal} centered size="lg">
        <Modal.Body>
          <Button
            variant="danger"
            onClick={handleCloseLoginModal}
            style={{ float: 'right', position: 'absolute', top: 10, right: 10, zIndex: 999 }}
          >
            X
          </Button>
          <Modal.Title className="text-center">Bienvenido al Inicio de Sesión</Modal.Title>
          <Row>
            <Col md={6} className="image-col">
              <img
                src="/assets/loslagos.png"
                alt="Logo"
                className="logo-img"
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
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Contraseña"
                    className="custom-control"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="custom-button">
                  Ingresar
                </Button>

                <Form.Group className="mt-3 text-center">
                  <Form.Text>
                    <a href="#!" className="link-text" onClick={openRecoveryModal}>¿Has olvidado tu contraseña?</a>
                  </Form.Text>
                  <br />
                  <Form.Text>
                    <a href="#!" className="link-text" onClick={openRegisterModal}>Registro</a>
                  </Form.Text>
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      <RegisterModal isOpen={isRegisterOpen} clickModal={closeRegisterModal} />
      <RecoveryPassword show={isRecoveryOpen} onHide={closeRecoveryModal} />
    </>
  );
}

export default LoginSignin;
