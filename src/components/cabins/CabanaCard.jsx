import React, { useState } from 'react';
import '../../../styles/stylesCabanas.css'

const CabanaCard = ({ cabana, onEdit, onRemove }) => {
  const [estado, setEstado] = useState(cabana.estado);

  const handleEstadoChange = (nuevoEstado) => {
    setEstado(nuevoEstado);
    // Aquí podrías agregar lógica para actualizar el estado en la base de datos
  };

  return (
    <div className="cabana-card">
      <img src={cabana.imagen} alt={cabana.nombre} />
      <div className="cabana-details">
        <h2>{cabana.nombre}</h2>
        <p>{cabana.descripcion}</p>
        <p><strong>Estado:</strong> 
          <select value={estado} onChange={(e) => handleEstadoChange(e.target.value)}>
            <option value="En servicio">En servicio</option>
            <option value="Fuera de Servicio">Fuera de Servicio</option>
          </select>
        </p>
        <p><strong>Comodidades:</strong></p>
        <ul>
          {cabana.comodidades.map((comodidad, index) => (
            <li key={index}>{comodidad}</li>
          ))}
        </ul>
        <p><strong>Precio:</strong> {cabana.precio}</p>
        <button onClick={() => onEdit(cabana)}>Editar</button>
        <button onClick={() => onRemove(cabana.id)}>Eliminar</button>
      </div>
    </div>
  );
};

export default CabanaCard;
