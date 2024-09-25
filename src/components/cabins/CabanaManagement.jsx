import React, { useState } from "react";
import { Button, Card, Modal, Form, Row, Col } from "react-bootstrap";
import TableComodidad from "./ComodidadTable";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import "./Cabins.css";

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

  const handlePageClick = (data) => {
    const currentPage = data.selected;
    const itemsPerPage = 10;
    const offset = currentPage * itemsPerPage;
    const paginatedCabins = cabanaList.slice(offset, offset + itemsPerPage);
    // Aquí puedes actualizar la lista de cabañas paginadas
  };

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
    return Object.keys(newErrors).length === 0;
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
    setSelectedCabana(null);
    setFormValues({
      nombre: "",
      capacidad: "",
      estado: "En servicio",
      descripcion: "",
      comodidades: [],
      imagen: null,
    });
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
          id: cabana.id,
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
      className="container col p-5 mt-3"
      style={{ minHeight: "100vh", marginRight: "850px", marginTop: "50px" }}
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
                  onChange={(e) =>
                    setFormValues({ ...formValues, nombre: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormValues({ ...formValues, capacidad: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormValues({ ...formValues, estado: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      descripcion: e.target.value,
                    })
                  }
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
                  onUpdateComodidades={(newComodidades) =>
                    setFormValues({
                      ...formValues,
                      comodidades: newComodidades,
                    })
                  }
                />
                {errors.comodidades && (
                  <div className="text-danger">{errors.comodidades}</div>
                )}
              </Form.Group>
              <Form.Group>
                <Form.Label>Imagen</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) =>
                    setFormValues({ ...formValues, imagen: e.target.files[0] })
                  }
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
     <ReactPaginate
  previousLabel={"Anterior"}
  nextLabel={"Siguiente"}
  breakLabel={"..."}
  pageCount={Math.ceil(cabanaList.length / 10)}
  marginPagesDisplayed={2}
  pageRangeDisplayed={5}
  onPageChange={handlePageClick}
  containerClassName={"pagination-container"}
/>
    </div>
  );
};

export default CabanaManagement;
