import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ element, allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();
  
  if (!isAuthenticated) {
    // No está autenticado, redirigir al inicio de sesión
    return <Navigate to="/" />;    
  } 
  
  if (allowedRoles && !allowedRoles.includes(role)) {
    // No tiene el rol necesario, redirigir a la página de inicio
    return <Navigate to="/" />;
  }

  // Está autenticado y tiene el rol permitido
  return element;
};

export default PrivateRoute;
