import React from 'react';
import { Table, Button } from 'react-bootstrap';

const ListaDeComodidades = ({ comodidades, onRemoveComodidad, onEditComodidad }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Fecha</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {comodidades.map((comodidad) => (
          <tr key={comodidad.id}>
            <td>{comodidad.id}</td>
            <td>{comodidad.nombre}</td>
            <td>{comodidad.descripcion}</td>
            <td>{comodidad.fecha}</td>
            <td>{comodidad.estado}</td>
            <td>
              <Button variant="warning" onClick={() => onEditComodidad(comodidad.id)}>Editar</Button>
              <Button variant="danger" onClick={() => onRemoveComodidad(comodidad.id)}>Eliminar</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ListaDeComodidades;
