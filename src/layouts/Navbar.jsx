import React, { useState } from 'react'; // Importar useState
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import LoginSignin from '../components/utils/auth/login';
import RegisterModal from '../components/utils/auth/RegisterMoldal';

const Navbarx = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    const openLoginModal = () => setIsLoginOpen(true);
    const closeLoginModal = () => setIsLoginOpen(false);

    const openRegisterModal = () => setIsRegisterOpen(true);
    const closeRegisterModal = () => setIsRegisterOpen(false);

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="#home">Bookedge</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <NavDropdown title="Admin" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">My Profile</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Configuración</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Sign Out</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
                <div className="d-flex">
                    <button
                        type="button"
                        className="btn bg-primary me-2"
                        onClick={openLoginModal}
                        style={{ fontSize: '14px', padding: '6px 12px' }}
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        type="button"
                        className="btn bg-primary"
                        onClick={openRegisterModal}
                        style={{ fontSize: '14px', padding: '6px 12px' }}
                    >
                        Registrarse
                    </button>
                </div>
            </Navbar>
            {isLoginOpen && <LoginSignin isOpen={isLoginOpen} closeLoginModal={closeLoginModal} />}
            {isRegisterOpen && <RegisterModal isOpen={isRegisterOpen} clickModal={closeRegisterModal} />}
        </>
    );
};

export default Navbarx;
