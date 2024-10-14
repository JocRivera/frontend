import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import Swal from "sweetalert2";
import {
  PlusCircle,
  Edit,
  Trash,
  Bed,
  Tv,
  Wind,
  Archive,
  Bath,
} from "lucide-react";
import "./Cabins.css"; // Asegúrate de que este archivo exista y contenga los estilos necesarios

// Simulación de datos de artículos reales
let articuloData = [
  { id: "1", nombre: "Cama Doble", codigo: "CD001", icon: <Bed /> },
  { id: "2", nombre: "Televisor 42 pulgadas", codigo: "TV042", icon: <Tv /> },
  { id: "3", nombre: "Aire Acondicionado", codigo: "AC001", icon: <Wind /> },
  { id: "4", nombre: "Mini Bar", codigo: "MB001", icon: <Archive /> },
  { id: "5", nombre: "Baño Privado", codigo: "BP001", icon: <Bath /> },
];

const TableComodidad = ({ comodidades, onUpdateComodidades, onShowModal, onHideModal }) => {
  const [selectedComodidad, setSelectedComodidad] = useState(null);
  const [showComodidadModal, setShowComodidadModal] = useState(false);

  
  const handleAddComodidad = () => {
    setSelectedComodidad(null);
    setShowComodidadModal(true);
    onShowModal();
  };

  const handleCloseComodidadModal = () => {
    setShowComodidadModal(false);
    onHideModal();
  };

  const handleSaveComodidad = (comodidad) => {
    if (selectedComodidad) {
      onUpdateComodidades(
        comodidades.map((item) =>
          item.id === comodidad.id ? { ...item, ...comodidad } : item
        )
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
      <Button onClick={handleAddComodidad} className="mb-3" variant="primary">
        <PlusCircle size={16} className="me-2" />
        Agregar Comodidad
      </Button>
      <Table striped bordered hover responsive>
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
          {comodidades.map((comodidad) => {
            const articulo = articuloData.find(
              (a) => a.id === comodidad.articuloId
            );
            return (
              <tr key={comodidad.id}>
                <td>{comodidad.id}</td>
                <td>
                  {articulo && articulo.icon}
                  {comodidad.nombreArticulo}
                </td>
                <td>{comodidad.codigoArticulo}</td>
                <td>{comodidad.observacion}</td>
                <td>{new Date(comodidad.fechaIngreso).toLocaleDateString()}</td>
                <td>{comodidad.estado}</td>
                <td>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => handleEditComodidad(comodidad)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteComodidad(comodidad.id)}
                  >
                    <Trash size={16} />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {showComodidadModal && (
        <ModalComodidad
          show={showComodidadModal}
          onHide={handleCloseComodidadModal}
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
  const [codigoArticulo, setCodigoArticulo] = useState("");
  const [observacion, setObservacion] = useState("");
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [estado, setEstado] = useState("Disponible");
  const [showNewArticuloForm, setShowNewArticuloForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [editableNombre, setEditableNombre] = useState("");


  useEffect(() => {
    if (comodidad) {
      const articuloEncontrado = articuloData.find(
        (a) => a.id === comodidad.articuloId
      );
      setSelectedArticulo(
        articuloEncontrado
          ? {
              value: articuloEncontrado.id,
              label: articuloEncontrado.nombre,
              codigo: articuloEncontrado.codigo,
            }
          : null
      );
      setEditableNombre(comodidad.nombreArticulo);
      setCodigoArticulo(comodidad.codigoArticulo);
      setObservacion(comodidad.observacion);
      setFechaIngreso(comodidad.fechaIngreso);
      setEstado(comodidad.estado);
    } else {
      resetForm();
    }
  }, [comodidad]);

  const resetForm = () => {
    setSelectedArticulo(null);
    setEditableNombre("");
    setCodigoArticulo("");
    setObservacion("");
    setFechaIngreso("");
    setEstado("Disponible");
    setShowNewArticuloForm(false);
    setNewArticulo("");
    setNewCodigo("");
  };  const handleSave = () => {
    const newErrors = {};

    if (!selectedArticulo && !newArticulo && !editableNombre)
      newErrors.articulo = "Debe seleccionar, crear o editar un artículo";
    if (!showNewArticuloForm && !codigoArticulo.trim())
      newErrors.codigo = "El campo Código es obligatorio";
    if (!observacion.trim())
      newErrors.observacion = "El campo Observación es obligatorio";
    if (!fechaIngreso.trim())
      newErrors.fechaIngreso = "El campo Fecha de Ingreso es obligatorio";
    if (isNaN(new Date(fechaIngreso).getTime()))
      newErrors.fechaIngreso = "Fecha inválida";

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

    let articuloId, nombreArticulo, codigoFinal;

    if (newArticulo) {
      const nuevoArticulo = {
        id: Date.now().toString(),
        nombre: newArticulo,
        codigo: newCodigo,
      };
      articuloData.push(nuevoArticulo);
      articuloId = nuevoArticulo.id;
      nombreArticulo = nuevoArticulo.nombre;
      codigoFinal = newCodigo;
    } else if (comodidad && editableNombre !== comodidad.nombreArticulo) {
      const articuloIndex = articuloData.findIndex(
        (a) => a.id === comodidad.articuloId
      );
      if (articuloIndex !== -1) {
        articuloData[articuloIndex].nombre = editableNombre;
        articuloData[articuloIndex].codigo = codigoArticulo;
        articuloId = comodidad.articuloId;
        nombreArticulo = editableNombre;
        codigoFinal = codigoArticulo;
      } else {
        articuloId = comodidad.articuloId;
        nombreArticulo = editableNombre;
        codigoFinal = codigoArticulo;
      }
    } else {
      articuloId = selectedArticulo
        ? selectedArticulo.value
        : comodidad.articuloId;
      nombreArticulo =
        editableNombre ||
        (selectedArticulo ? selectedArticulo.label : comodidad.nombreArticulo);
      codigoFinal = codigoArticulo;
    }

    onSave({
      id: comodidad ? comodidad.id : Date.now().toString(),
      articuloId,
      nombreArticulo,
      codigoArticulo: codigoFinal,
      observacion,
      fechaIngreso,
      estado,
    });

    resetForm();
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedArticulo(selectedOption);
    setShowNewArticuloForm(false);
    if (selectedOption) {
      setEditableNombre(selectedOption.label);
      setCodigoArticulo(selectedOption.codigo);
    } else {
      // Limpiar campos cuando se deselecciona un artículo
      setEditableNombre("");
      setCodigoArticulo("");
      setObservacion("");
      setFechaIngreso("");
      setEstado("Disponible");
    }
  };

  const handleCodigoChange = (e) => {
    setCodigoArticulo(e.target.value);
  };
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      backdrop="static"
      keyboard={false}
      className="modal-comodidad"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {comodidad ? "Editar Comodidad" : "Agregar Comodidad"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light">
        <Form>
          <Row>
            <Col md={6}>
              {comodidad ? (
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del Artículo</Form.Label>
                  <Form.Control
                    type="text"
                    value={editableNombre}
                    onChange={(e) => setEditableNombre(e.target.value)}
                  />
                </Form.Group>
              ) : (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Artículos</Form.Label>
                    <Select
                      options={articuloData.map((a) => ({
                        value: a.id,
                        label: a.nombre,
                        codigo: a.codigo,
                      }))}
                      onChange={handleSelectChange}
                      value={selectedArticulo}
                      placeholder="Selecciona un artículo..."
                      isClearable
                    />
                    {errors.articulo && (
                      <div className="text-danger">{errors.articulo}</div>
                    )}
                  </Form.Group>
                  <Button
                    variant="outline-primary"
                    onClick={() => setShowNewArticuloForm(!showNewArticuloForm)}
                    className="mb-3"
                  >
                    {showNewArticuloForm ? "Cancelar" : "Crear nuevo artículo"}
                  </Button>
                  {showNewArticuloForm && (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Label>Nuevo Artículo</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Nombre del nuevo artículo"
                          value={newArticulo}
                          onChange={(e) => setNewArticulo(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
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
                </>
              )}

              {!showNewArticuloForm && (
                <Form.Group className="mb-3">
                  <Form.Label>Código del Artículo</Form.Label>
                  <Form.Control
                    type="text"
                    value={codigoArticulo}
                    onChange={handleCodigoChange}
                  />
                  {errors.codigo && (
                    <div className="text-danger">{errors.codigo}</div>
                  )}
                </Form.Group>
              )}
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha de Ingreso</Form.Label>
                <Form.Control
                  type="date"
                  value={fechaIngreso}
                  onChange={(e) => setFechaIngreso(e.target.value)}
                />
                {errors.fechaIngreso && (
                  <div className="text-danger">{errors.fechaIngreso}</div>
                )}
              </Form.Group>
              <Form.Group className="mb-3">
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
              <Form.Group className="mb-3">
                <Form.Label>Observación</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Observación"
                  value={observacion}
                  onChange={(e) => setObservacion(e.target.value)}
                />
                {errors.observacion && (
                  <div className="text-danger">{errors.observacion}</div>
                )}
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer className="bg-light">
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
