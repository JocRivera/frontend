import React, { useState } from "react";
import { Button, Card, Modal, Form, Row, Col } from "react-bootstrap";
import TableComodidad from "./ComodidadTable"; // Asegúrate de que este componente esté importado correctamente
import Swal from "sweetalert2"; // Importa la librería de alertas

import "./Cabins.css";

// Componente para gestionar Cabañas
const CabanaManagement = () => {
  const [cabanaList, setCabanaList] = useState([]);
  const [selectedCabana, setSelectedCabana] = useState(null);
  const [showCabanaForm, setShowCabanaForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [formValues, setFormValues] = useState({
    nombre: "",
    capacidad: "",
    estado: "En servicio",
    descripcion: "",
    comodidades: [],
    imagen: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formValues.nombre) newErrors.nombre = "Nombre es obligatorio";
    if (!formValues.capacidad) newErrors.capacidad = "Capacidad es obligatoria";
    if (formValues.capacidad < 4 || formValues.capacidad > 7)
      newErrors.capacidad = "Capacidad debe estar entre 4 y 7";
    if (!formValues.descripcion)
      newErrors.descripcion = "Descripción es obligatoria";
    if (!formValues.imagen) newErrors.imagen = "Imagen es obligatoria";
    if (formValues.comodidades.length === 0)
      newErrors.comodidades = "Debe agregar al menos una comodidad";
  
    setErrors(newErrors);
  
    // Si hay errores, mostrar la alerta
    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        title: "Errores en el formulario",
        html: Object.values(newErrors).join("<br>"), // Muestra todos los errores en líneas separadas
        icon: "error",
        confirmButtonText: "Ok",
      });
      return false;
    }
  
    return true;
  };

  const handleSaveCabana = () => {
    if (!validateForm()) return;
    if (selectedCabana) {
      // Editar cabaña existente
      setCabanaList(
        cabanaList.map((item) =>
          item.id === formValues.id ? { ...item, ...formValues } : item
        )
      );
      Swal.fire({
        title: "Cabaña editada con éxito",
        text: "La cabaña ha sido editada con éxito.",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });
    } else {
      // Agregar nueva cabaña
      setCabanaList([...cabanaList, { ...formValues, id: Date.now() }]);
      Swal.fire({
        title: "Cabaña agregada con éxito",
        text: "La cabaña ha sido agregada con éxito.",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });
    }
    setShowCabanaForm(false);
    setSelectedCabana(null); // Resetear cabaña seleccionada
    setFormValues({
      nombre: "",
      capacidad: "",
      estado: "En servicio",
      descripcion: "",
      comodidades: [],
      imagen: null,
    });
  };

  const validateField = (name, value) => {
    switch (name) {
      case "nombre":
        return value.length < 4
          ? "El nombre debe tener al menos 4 caracteres"
          : "";
      case "capacidad":
        if (!value) return "Capacidad es obligatoria";
        if (value < 4 || value > 7) return "Capacidad debe estar entre 4 y 7";
        return "";
      case "descripcion":
        return value.length < 6
          ? "Descripción es obligatoria, mínimo 6 caracteres"
          : "";
      case "imagen":
        return !value ? "Imagen es obligatoria" : "";
      case "comodidades":
        return value.length === 0 ? "Debe agregar al menos una comodidad" : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const error = validateField("imagen", file);
    setErrors({ ...errors, imagen: error });
    setFormValues({ ...formValues, imagen: file });
  };

  const handleComodidadesChange = (newComodidades) => {
    const error = validateField("comodidades", newComodidades);
    setErrors({ ...errors, comodidades: error });
    setFormValues({ ...formValues, comodidades: newComodidades });
  };

  const handleEditCabana = (cabana) => {
    Swal.fire({
      title: "¿Estás seguro de editar esta cabaña?",
      text: "Los cambios no podrán ser revertidos.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, editar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedCabana(cabana);
        setFormValues({
          nombre: cabana.nombre,
          capacidad: cabana.capacidad,
          estado: cabana.estado,
          descripcion: cabana.descripcion,
          comodidades: cabana.comodidades,
          imagen: cabana.imagen,
          id: cabana.id, // Necesario para identificar la cabaña al editar
        });
        setShowCabanaForm(true);
      }
    });
  };

  const handleAddCabana = () => {
    setSelectedCabana(null);
    setShowCabanaForm(true);
  };

  const handleViewDetails = (cabana) => {
    setSelectedCabana(cabana);
    setShowDetailModal(true);
  };

  const handleDeleteCabana = (cabana) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setCabanaList(cabanaList.filter((u) => u.id !== cabana.id));
        Swal.fire({
          title: "Cabaña eliminada con éxito",
          text: "La cabaña ha sido eliminada con éxito.",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    });
  };

  const filteredCabanaList = cabanaList.filter((cabana) =>
    cabana.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="container "
      style={{ minHeight: "100vh", paddingTop: "60px" }}
    >
      <h1>Lista de Cabañas</h1>
      <div
        className="d-flex justify-content-start align-items-center mb-2"
        style={{ gap: "750px" }}
      >
        <Form.Control
          style={{ maxWidth: "300px", marginRight: "20px" }}
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="me-2"
        />
        <Button variant="primary" onClick={handleAddCabana}>
          Añadir Cabaña
        </Button>
      </div>

      <Row>
        {filteredCabanaList.length > 0 ? (
          filteredCabanaList.map((cabana) => (
            <Col md={4} key={cabana.id} className="mb-3">
              <Card>
                {cabana.imagen && (
                  <Card.Img
                    variant="top"
                    src={URL.createObjectURL(cabana.imagen)}
                  />
                )}
                <Card.Body>
                  <Card.Title>{cabana.nombre}</Card.Title>
                  <Card.Text>
                    Comodidades:{" "}
                    {cabana.comodidades.map((c) => c.articulos).join(", ")}
                  </Card.Text>
                  <Card.Text>Capacidad: {cabana.capacidad}</Card.Text>
                  <Card.Text>Estado: {cabana.estado}</Card.Text>
                  <Card.Text>Descripción: {cabana.descripcion}</Card.Text>
                  <Button
                    variant="info"
                    onClick={() => handleEditCabana(cabana)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleViewDetails(cabana)}
                  >
                    Ver Detalle
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteCabana(cabana)}
                  >
                    Eliminar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No se encontraron cabañas.</p>
        )}
      </Row>

      {showCabanaForm && (
        <Modal
          show={showCabanaForm}
          onHide={() => setShowCabanaForm(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedCabana ? "Editar Cabaña" : "Agregar Cabaña"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formValues.nombre}
                  onChange={handleChange}
                  isInvalid={!!errors.nombre}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.nombre}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Capacidad</Form.Label>
                <Form.Control
                  type="number"
                  name="capacidad"
                  value={formValues.capacidad}
                  onChange={handleChange}
                  isInvalid={!!errors.capacidad}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.capacidad}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={formValues.estado}
                  onChange={handleChange}
                >
                  <option>En servicio</option>
                  <option>En mantenimiento</option>
                  <option>Fuera de servicio</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  name="descripcion"
                  value={formValues.descripcion}
                  onChange={handleChange}
                  isInvalid={!!errors.descripcion}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.descripcion}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Comodidades</Form.Label>
                <TableComodidad
                  comodidades={formValues.comodidades}
                  onUpdateComodidades={handleComodidadesChange}
                />
                {errors.comodidades && (
                  <div className="text-danger">{errors.comodidades}</div>
                )}
              </Form.Group>
              <Form.Group>
                <Form.Label>Imagen</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleFileChange}
                  isInvalid={!!errors.imagen}
                />
                {formValues.imagen && (
                  <img
                    src={URL.createObjectURL(formValues.imagen)}
                    alt="Vista previa"
                    style={{ width: "100%", marginTop: "10px" }}
                  />
                )}
                <Form.Control.Feedback type="invalid">
                  {errors.imagen}
                </Form.Control.Feedback>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowCabanaForm(false)}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSaveCabana}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {showDetailModal && (
        <Modal
          show={showDetailModal}
          onHide={() => setShowDetailModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Detalles de la Cabaña</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card>
              {selectedCabana.imagen && (
                <Card.Img
                  variant="top"
                  src={URL.createObjectURL(selectedCabana.imagen)}
                />
              )}
              <Card.Body>
                <Card.Title>{selectedCabana.nombre}</Card.Title>
                <Card.Text>
                  Comodidades:{" "}
                  {selectedCabana.comodidades
                    .map((c) => c.articulos)
                    .join(", ")}
                </Card.Text>
                <Card.Text>Capacidad: {selectedCabana.capacidad}</Card.Text>
                <Card.Text>Estado: {selectedCabana.estado}</Card.Text>
                <Card.Text>Descripción: {selectedCabana.descripcion}</Card.Text>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDetailModal(false)}
            >
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default CabanaManagement;
