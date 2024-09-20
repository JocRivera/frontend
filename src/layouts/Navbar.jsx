import React, { useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import LoginSignin from "../components/utils/auth/login";
import RegisterModal from "../components/utils/auth/RegisterMoldal";
import { useAuth } from "../components/utils/auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbarx = ({ collapsed }) => {
  const { isAuthenticated, user, logout, role } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const navigate = useNavigate();

  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);

  const openRegisterModal = () => setIsRegisterOpen(true);
  const closeRegisterModal = () => setIsRegisterOpen(false);
  const isHomePage = location.pathname === '/';
  const isContact = location.pathname === "/contact";
  const isCabin = location.pathname === "/listcabins";
  const isRoom = location.pathname === "/listrooms";
  const isPlans = location.pathname === "/viewsplans";
  const isMyReservation = location.pathname === "/myreservation";

  return (
    <>
      <Navbar
        expand="lg"
        className={`navbar ${collapsed && !isHomePage && !isContact && !isCabin && !isRoom && !isPlans && !isMyReservation ? "collapsed-navbar" : "expanded-navbar"}`}
        style={{
          transition: "margin-left 0.3s ease",
          marginLeft: isHomePage || isCabin || isContact || isRoom || isPlans || isMyReservation ? "0" : (collapsed ? "80px" : "256px"),
          width: isHomePage || isCabin || isContact || isRoom || isPlans || isMyReservation ? "100%" : "auto"
        }}
      >
        <Container>
          {/* Sección Izquierda: Logo */}
          <Navbar.Brand href="/" className="brand">
            Bookedge
          </Navbar.Brand>

          {/* Sección Centro: Enlaces de navegación */}
          <Nav className="mx-auto nav-links">
            {(!isAuthenticated || (isAuthenticated && role === "client")) && (
              <>
                <Nav.Link href="/contact">Contáctanos</Nav.Link>
                <Nav.Link href="/listcabins">Cabañas</Nav.Link>
                <Nav.Link href="/listrooms">Habitaciones</Nav.Link>
                <Nav.Link href="/viewsplans">Planes</Nav.Link>
                <Nav.Link href="/myreservations">Mis reservas</Nav.Link>
              </>
            )}
          </Nav>

          {/* Sección Derecha: Botones o menú de usuario */}
          <Nav className="ms-auto nav-buttons">
            {isAuthenticated ? (
              <NavDropdown
                title={user?.name || "Mi Cuenta"}
                id="basic-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item onClick={() => navigate("/profile")}>
                  Mi Perfil
                </NavDropdown.Item>
                {role !== "client" && (
                  <NavDropdown.Item href="/settings">
                    Configuración
                  </NavDropdown.Item>
                )}
                <NavDropdown.Item onClick={logout}>
                  Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-primary me-2"
                  onClick={openLoginModal}
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={openRegisterModal}
                >
                  Registrarse
                </button>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>

      {/* Modales */}
      {isLoginOpen && (
        <LoginSignin isOpen={isLoginOpen} closeLoginModal={closeLoginModal} />
      )}
      {isRegisterOpen && (
        <RegisterModal
          isOpen={isRegisterOpen}
          clickModal={closeRegisterModal}
        />
      )}
    </>
  );
};

export default Navbarx;
