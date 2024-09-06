import React from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container className="text-center mt-5">
      <h1>404 - Página No Encontrada</h1>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      <button
        className="btn btn-primary mt-3"
        onClick={() => navigate('/')}
      >
        Volver al Inicio
      </button>
    </Container>
  );
};

export default NotFound;
