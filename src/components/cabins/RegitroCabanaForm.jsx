import React, { useState } from 'react';
import ComodidadForm from './ComodidadForm'; 

const RegistroCabanaForm = ({ onAddCabana }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('Disponible');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState('');
  const [comodidades, setComodidades] = useState([]);

  const agregarComodidad = (comodidad) => {
    setComodidades([...comodidades, comodidad]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCabana({ nombre, descripcion, estado, precio, imagen, comodidades });
    resetForm();
  };

  const resetForm = () => {
    setNombre('');
    setDescripcion('');
    setEstado('Disponible');
    setPrecio('');
    setImagen('');
    setComodidades([]);
  };

  return (
    <form onSubmit={handleSubmit}>
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
        <label>Estado:</label>
        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="Disponible">Disponible</option>
          <option value="Ocupada">Ocupada</option>
        </select>
      </div>
      <div>
        <label>Precio:</label>
        <input
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Imagen:</label>
        <input
          type="text"
          value={imagen}
          onChange={(e) => setImagen(e.target.value)}
        />
      </div>
      
      <h3>Agregar Comodidades</h3>
      <ComodidadForm onSave={agregarComodidad} />

      <div>
        <h4>Lista de Comodidades:</h4>
        <ul>
          {comodidades.map((comodidad) => (
            <li key={comodidad.id}>{comodidad.nombre} {comodidad.descripcion} {comodidad.fecha} {comodidad.estado}</li>
          ))}
        </ul>
      </div>

      <button type="submit" >Guardar Cabaña</button>
    </form>
  );
};

export default RegistroCabanaForm;
