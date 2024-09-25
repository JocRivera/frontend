import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import AsyncSelect from "react-select/async";
import Swal from "sweetalert2";

// Simulación de datos de artículos reales
let articuloData = [
  { id: "1", nombre: "Cama Doble", codigo: "CD001" },
  { id: "2", nombre: "Televisor 42 pulgadas", codigo: "TV042" },
  { id: "3", nombre: "Aire Acondicionado", codigo: "AC001" },
  { id: "4", nombre: "Mini Bar", codigo: "MB001" },
  { id: "5", nombre: "Baño Privado", codigo: "BP001" },
];

const TableComodidad = ({ comodidades, onUpdateComodidades }) => {
  const [selectedComodidad, setSelectedComodidad] = useState(null);
  const [showComodidadModal, setShowComodidadModal] = useState(false);

  const handleAddComodidad = () => {
    setSelectedComodidad(null);
    setShowComodidadModal(true);
  };

  const handleSaveComodidad = (comodidad) => {
    if (selectedComodidad) {
      onUpdateComodidades(
        comodidades.map((item) => (item.id === comodidad.id ? { ...item, ...comodidad } : item))
      );
    } else {
      onUpdateComodidades([...comodidades, comodidad]);
    }
    setShowComodidadModal(false);
    Swal.fire({
      icon: "success",
      title: "Éxito",
      text: "Comodidad guardada correctamente",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleEditComodidad = (comodidad) => {
    setSelectedComodidad(comodidad);
    setShowComodidadModal(true);
  };

  const handleDeleteComodidad = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        onUpdateComodidades(comodidades.filter((item) => item.id !== id));
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "Comodidad eliminada correctamente",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <div>
      <Button onClick={handleAddComodidad}>Agregar Comodidad</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Artículos</th>
            <th>Código</th>
            <th>Observación</th>
            <th>Fecha de Ingreso</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {comodidades.map((comodidad) => (
            <tr key={comodidad.id}>
              <td>{comodidad.id}</td>
              <td>{comodidad.nombreArticulo}</td>
              <td>{comodidad.codigoArticulo}</td>
              <td>{comodidad.observacion}</td>
              <td>{new Date(comodidad.fechaIngreso).toLocaleDateString()}</td>
              <td>{comodidad.estado}</td>
              <td>
                <Button variant="info" onClick={() => handleEditComodidad(comodidad)}>
                  Editar
                </Button>
                <Button variant="danger" onClick={() => handleDeleteComodidad(comodidad.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showComodidadModal && (
        <ModalComodidad
          show={showComodidadModal}
          onHide={() => setShowComodidadModal(false)}
          comodidad={selectedComodidad}
          onSave={handleSaveComodidad}
        />
      )}
    </div>
  );
};

const ModalComodidad = ({ show, onHide, comodidad, onSave }) => {
  const [selectedArticulo, setSelectedArticulo] = useState(null);
  const [newArticulo, setNewArticulo] = useState("");
  const [newCodigo, setNewCodigo] = useState("");
  const [observacion, setObservacion] = useState(comodidad?.observacion || "");
  const [fechaIngreso, setFechaIngreso] = useState(comodidad?.fechaIngreso || "");
  const [estado, setEstado] = useState(comodidad?.estado || "Disponible");
  const [showNewArticuloForm, setShowNewArticuloForm] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (comodidad) {
      const articuloEncontrado = articuloData.find(a => a.id === comodidad.articuloId);
      setSelectedArticulo(articuloEncontrado ? { 
        value: articuloEncontrado.id, 
        label: articuloEncontrado.nombre,
        codigo: articuloEncontrado.codigo 
      } : null);
      setObservacion(comodidad.observacion);
      setFechaIngreso(comodidad.fechaIngreso);
      setEstado(comodidad.estado);
    }
  }, [comodidad]);

  const handleSave = () => {
    const newErrors = {};

    if (!selectedArticulo && !newArticulo) newErrors.articulo = "Debe seleccionar o crear un artículo";
    if (!observacion.trim()) newErrors.observacion = "El campo Observación es obligatorio"; 
    if (!fechaIngreso.trim()) newErrors.fechaIngreso = "El campo Fecha de Ingreso es obligatorio";
    if (isNaN(new Date(fechaIngreso).getTime())) newErrors.fechaIngreso = "Fecha inválida";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        title: "Errores en el formulario",
        html: Object.values(newErrors).join("<br>"),
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }

    let articuloId, nombreArticulo, codigoArticulo;

    if (newArticulo) {
      const nuevoArticulo = {
        id: Date.now().toString(),
        nombre: newArticulo,
        codigo: newCodigo
      };
      articuloData.push(nuevoArticulo);
      articuloId = nuevoArticulo.id;
      nombreArticulo = nuevoArticulo.nombre;
      codigoArticulo = nuevoArticulo.codigo;
    } else {
      articuloId = selectedArticulo.value;
      nombreArticulo = selectedArticulo.label;
      codigoArticulo = selectedArticulo.codigo;
    }

    onSave({
      id: comodidad ? comodidad.id : Date.now().toString(),
      articuloId,
      nombreArticulo,
      codigoArticulo,
      observacion,
      fechaIngreso,
      estado,
    });
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedArticulo(selectedOption);
    setShowNewArticuloForm(false);
  };

  const loadArticulos = (inputValue) => {
    return Promise.resolve(
      articuloData
        .filter((articulo) =>
          articulo.nombre.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map((articulo) => ({
          value: articulo.id,
          label: articulo.nombre,
          codigo: articulo.codigo
        }))
    );
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{comodidad ? "Editar Comodidad" : "Agregar Comodidad"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Artículos</Form.Label>
            <AsyncSelect
              cacheOptions
              loadOptions={loadArticulos}
              defaultOptions
              onChange={handleSelectChange}
              value={selectedArticulo}
              placeholder="Selecciona un artículo..."
            />
            {errors.articulo && <div className="text-danger">{errors.articulo}</div>}
            <Button 
              variant="link" 
              onClick={() => setShowNewArticuloForm(!showNewArticuloForm)}
            >
              {showNewArticuloForm ? "Cancelar" : "Crear nuevo artículo"}
            </Button>
          </Form.Group>
          
          {showNewArticuloForm && (
            <>
              <Form.Group>
                <Form.Label>Nuevo Artículo</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre del nuevo artículo"
                  value={newArticulo}
                  onChange={(e) => setNewArticulo(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Código del Nuevo Artículo</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Código del nuevo artículo"
                  value={newCodigo}
                  onChange={(e) => setNewCodigo(e.target.value)}
                />
              </Form.Group>
            </>
          )}
          
          {selectedArticulo && (
            <Form.Group>
              <Form.Label>Código del Artículo</Form.Label>
              <Form.Control
                type="text"
                value={selectedArticulo.codigo}
                readOnly
              />
            </Form.Group>
          )}

          
          <Form.Group>
            <Form.Label>Fecha de Ingreso</Form.Label>
            <Form.Control
              type="date"
              value={fechaIngreso}
              onChange={(e) => setFechaIngreso(e.target.value)}
            />
            {errors.fechaIngreso && <div className="text-danger">{errors.fechaIngreso}</div>}
          </Form.Group>
          <Form.Group>
            <Form.Label>Estado</Form.Label>
            <Form.Control
              as="select"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="Disponible">Disponible</option>
              <option value="De Baja">Dado de Baja</option>
              <option value="En Mantenimiento">En Mantenimiento</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Observación</Form.Label>
            <Form.Control
              type="text"
              placeholder="Observación"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
            />
            {errors.observacion && <div className="text-danger">{errors.observacion}</div>}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TableComodidad;