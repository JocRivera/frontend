import React, { useState } from 'react';

const ComodidadForm = ({ onSave }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [estado, setEstado] = useState('Activo');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: Date.now(), nombre, descripcion, fecha, estado });
    setNombre('');
    setDescripcion('');
    setFecha('');
    setEstado('Activo');
  };

  return (
    <form  >
      <div>
        <label>Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Descripción:</label>
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          
        />
      </div>
      <div>
        <label>Fecha:</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </div>
      <div>
        <label>Estado:</label>
        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </div>
      <button type="submit" onClick={handleSubmit}>Guardar Comodidad</button>
    </form>
  );
};

export default ComodidadForm;
