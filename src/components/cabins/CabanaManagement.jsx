import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Modal,
  Form,
  Row,
  Col,
  Container,
  Table
} from "react-bootstrap";
import Select from 'react-select';
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import { PlusCircle, Edit, Trash, Eye,FileSpreadsheet  } from "lucide-react";
import * as XLSX from 'xlsx';
import "./Cabins.css";

const CabanaManagement = () => {
  const [cabanaList, setCabanaList] = useState([]);
 const [showCabanaForm, setShowCabanaForm] = useState(false);
  const [showComodidadModal, setShowComodidadModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCabana, setSelectedCabana] = useState(null);
  const [tempCabanaFormValues, setTempCabanaFormValues] = useState(null);
  const [formValues, setFormValues] = useState({
    nombre: "",
    capacidad: "",
    estado: "En servicio",
    descripcion: "",
    comodidades: [],
    imagen: null,
  });

  const [comodidadesOptions, setComodidadesOptions] = useState([
    { value: 'cama', label: 'Cama King Size' },
    { value: 'tv', label: 'TV 4K' },
    { value: 'jacuzzi', label: 'Jacuzzi' },
    { value: 'minibar', label: 'Minibar' },
    { value: 'wifi', label: 'Wi-Fi' },
  ]);

  const [selectedComodidad, setSelectedComodidad] = useState(null);
  const [editingComodidadId, setEditingComodidadId] = useState(null);
  const [newComodidad, setNewComodidad] = useState({
    nombreArticulo: '',
    codigoArticulo: '',
    observacion: '',
    fechaIngreso: '',
    estado: 'Disponible',
  });
  const [comodidadErrors, setComodidadErrors] = useState({});

  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  const handleComodidadSelect = (selectedOption) => {
    setSelectedComodidad(selectedOption);
    if (selectedOption) {
      const newComodidad = {
        id: Date.now(),
        nombreArticulo: selectedOption.label,
        codigoArticulo: `COD-${selectedOption.value.toUpperCase()}`,
        observacion: '',
        fechaIngreso: new Date().toISOString().split('T')[0],
        estado: 'Disponible',
      };
      setFormValues(prev => ({
        ...prev,
        comodidades: [...prev.comodidades, newComodidad]
      }));
      setSelectedComodidad(null);
    }
  };

  const handleNewComodidadChange = (e) => {
    const { name, value } = e.target;
    setNewComodidad(prev => ({ ...prev, [name]: value }));
    
    const error = validateComodidadField(name, value);
    setComodidadErrors(prev => ({ ...prev, [name]: error }));
  };
 const handleAddNewComodidad = () => {
    setEditingComodidadId('new');
    setNewComodidad({
      nombreArticulo: '',
      codigoArticulo: '',
      observacion: '',
      fechaIngreso: '',
      estado: 'Disponible',
    });
    setTempCabanaFormValues({ ...formValues });
    setShowCabanaForm(false);
    setShowComodidadModal(true);
  };
  const handleSaveComodidad = () => {

const newErrors = {};
    Object.keys(newComodidad).forEach(key => {
      const error = validateComodidadField(key, newComodidad[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setComodidadErrors(newErrors);
      return;
    }

    let updatedComodidades;
    if (editingComodidadId === 'new') {
      const newComodidadWithId = { ...newComodidad, id: Date.now() };
      updatedComodidades = [...tempCabanaFormValues.comodidades, newComodidadWithId];
      
      // Actualizar comodidadesOptions
      const newOption = {
        value: newComodidadWithId.codigoArticulo.toLowerCase(),
        label: newComodidadWithId.nombreArticulo
      };
      setComodidadesOptions(prevOptions => [...prevOptions, newOption]);
    } else {
      updatedComodidades = tempCabanaFormValues.comodidades.map(c => 
        c.id === editingComodidadId ? { ...c, ...newComodidad } : c
      );
      
      // Actualizar comodidadesOptions
      setComodidadesOptions(prevOptions => 
        prevOptions.map(option => 
          option.value === newComodidad.codigoArticulo.toLowerCase()
            ? { ...option, label: newComodidad.nombreArticulo }
            : option
        )
      );
    }

    setFormValues(prev => ({
      ...prev,
      comodidades: updatedComodidades
    }));

    setShowComodidadModal(false);
    setShowCabanaForm(true);
    setEditingComodidadId(null);
    setNewComodidad({
      nombreArticulo: '',
      codigoArticulo: '',
      observacion: '',
      fechaIngreso: '',
      estado: 'Disponible',
    });
  };


  const handleCloseComodidadModal = () => {
    setShowComodidadModal(false);
    setShowCabanaForm(true);
    setEditingComodidadId(null);
    setNewComodidad({
      nombreArticulo: '',
      codigoArticulo: '',
      observacion: '',
      fechaIngreso: '',
      estado: 'Disponible',
    });
  };


  const handleDeleteComodidad = (id) => {
    const comodidadToDelete = formValues.comodidades.find(c => c.id === id);
    setFormValues(prev => ({
      ...prev,
      comodidades: prev.comodidades.filter(c => c.id !== id)
    }));
    setComodidadesOptions(prevOptions => 
      prevOptions.filter(option => option.value !== comodidadToDelete.codigoArticulo.toLowerCase())
    );
  };
  
  const handleEditComodidad = (id) => {
    setEditingComodidadId(id);
    const comodidadToEdit = formValues.comodidades.find(c => c.id === id);
    setNewComodidad({ ...comodidadToEdit });
    setTempCabanaFormValues({ ...formValues });
    setShowCabanaForm(false);
    setShowComodidadModal(true);
  };

  const handleSaveEditedComodidad = () => {
    setFormValues(prev => ({
      ...prev,
      comodidades: prev.comodidades.map(c => 
        c.id === editingComodidadId ? { ...c, ...newComodidad } : c
      )
    }));
    setEditingComodidadId(null);
    setNewComodidad({
      nombreArticulo: '',
      codigoArticulo: '',
      observacion: '',
      fechaIngreso: '',
      estado: 'Disponible',
    });
    setShowComodidadModal(false);
  };

  const handleComodidadChange = (id, field, value) => {
    setFormValues(prev => ({
      ...prev,
      comodidades: prev.comodidades.map(c => 
        c.id === id ? { ...c, [field]: value } : c
      )
    }));
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "nombre":
        if (!value.trim()) error = "Nombre es obligatorio";
        else if (value.length < 3) error = "Nombre debe tener al menos 3 caracteres";
        break;
      case "capacidad":
        if (!value) error = "Capacidad es obligatoria";
        else if (value < 4 || value > 7) error = "Capacidad debe estar entre 4 y 7";
        break;
      case "descripcion":
        if (!value.trim()) error = "Descripción es obligatoria";
        else if (value.length < 10) error = "Descripción debe tener al menos 10 caracteres";
        break;
      case "imagen":
        if (!value) error = "Imagen es obligatoria";
        break;
      case "comodidades":
        if (value.length === 0) error = "Debe agregar al menos una comodidad";
        break;
      default:
        break;
    }
    return error;
  };

  const validateComodidadField = (name, value) => {
    let error = "";
    switch (name) {
      case "nombreArticulo":
        if (!value.trim()) error = "El nombre del artículo es obligatorio";
        break;
      case "codigoArticulo":
        if (!value.trim()) error = "El código del artículo es obligatorio";
        break;
      case "fechaIngreso":
        if (!value) error = "La fecha de ingreso es obligatoria";
        break;
        case "observacion":
          if (!value.trim()) error = "La observación es obligatoria";
          break;
      default:
        break;
    }
    return error;
  };
  useEffect(() => {
    const newErrors = {};
    Object.keys(formValues).forEach(key => {
      const error = validateField(key, formValues[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
  }, [formValues]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    const newValue = type === "file" ? files[0] : value;
    setFormValues(prev => ({ ...prev, [name]: newValue }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formValues).forEach(key => {
      const error = validateField(key, formValues[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveCabana = () => {
    if (!validateForm()) {
      Swal.fire({
        title: "Error",
        text: "Por favor, corrija los errores en el formulario antes de guardar.",
        icon: "error",
      });
      return;
    }
  
    const saveCabana = () => {
      if (selectedCabana) {
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

    if (selectedCabana) {
      Swal.fire({
        title: "¿Estás seguro de guardar los cambios?",
        text: "Los cambios no podrán ser revertidos.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, guardar cambios",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          saveCabana();
        }
      });
    } else {
      saveCabana();
    }
  };

  const handleEditCabana = (cabana) => {
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
  };

  const handleAddCabana = () => {
    setSelectedCabana(null);
    setShowCabanaForm(true);
  };

  const getStatusBadgeClass = (estado) => {
    switch (estado) {
      case "En servicio":
        return "bg-success";
      case "En mantenimiento":
        return "bg-warning text-dark";
      case "Fuera de servicio":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
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

  const paginatedCabanas = filteredCabanaList.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const handleExportComodidades = () => {
    const allComodidades = [
      ...comodidadesOptions.map(option => ({
        'Nombre del Artículo': option.label,
        'Código del Artículo': `COD-${option.value.toUpperCase()}`,
        'Observación': '',
        'Fecha de Ingreso': new Date().toISOString().split('T')[0],
        'Estado': 'Disponible'
      })),
      ...cabanaList.flatMap(cabana => 
        cabana.comodidades.map(comodidad => ({
          'Nombre del Artículo': comodidad.nombreArticulo,
          'Código del Artículo': comodidad.codigoArticulo,
          'Observación': comodidad.observacion,
          'Fecha de Ingreso': comodidad.fechaIngreso,
          'Estado': comodidad.estado
        }))
      )
    ];
  
    // Eliminar duplicados basados en el código del artículo
    const uniqueComodidades = allComodidades.reduce((acc, current) => {
      const x = acc.find(item => item['Código del Artículo'] === current['Código del Artículo']);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
  
    if (uniqueComodidades.length === 0) {
      Swal.fire({
        title: "No hay datos para exportar",
        text: "No se encontraron comodidades para exportar.",
        icon: "info"
      });
      return;
    }
  
    const ws = XLSX.utils.json_to_sheet(uniqueComodidades);
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Comodidades");
  
    XLSX.writeFile(wb, "comodidades.xlsx");
  
    Swal.fire({
      title: "Exportación exitosa",
      text: "Las comodidades se han exportado correctamente.",
      icon: "success"
    });
  };

  return (
    <div className="container col p-5 mt-3" style={{ minHeight: "100vh", marginRight: "850px", marginTop: "50px" }}>
    <h1 className="mb-4">Lista de Cabañas</h1>
    <Row className="mb-4">
      <Col md={6}>
        <div className="search-container">
          <Form.Control
            style={{ maxWidth: "300px", marginRight: "20px" }}
            type="text"
            placeholder="Buscar por nombre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="me-2"
          />
        </div>
      </Col>
      <Col md={6} className="text-md-end">
        <Button
          variant="primary"
          onClick={handleAddCabana}
          className="add-button"
        >
          <PlusCircle size={20} className="me-2" />
          Añadir Cabaña
        </Button>
        <Button
          variant="success"
          onClick={handleExportComodidades}
          className="export-button"
        >
          <FileSpreadsheet size={20} className="me-2" />
          Exportar Comodidades
        </Button>
      </Col>
    </Row>
      <Row>
        {paginatedCabanas.length > 0 ? (
          paginatedCabanas.map((cabana) => (
            <Col md={6} key={cabana.id} className="mb-4">
              <Card className="h-100 cabin-card">
                <Row className="g-0">
                  <Col md={5}>
                    {cabana.imagen && (
                      <Card.Img
                        src={URL.createObjectURL(cabana.imagen)}
                        alt={cabana.nombre}
                        className="cabin-image"
                      />
                    )}
                  </Col>
                  <Col md={7}>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{cabana.nombre}</Card.Title>
                      <Card.Text>Capacidad: {cabana.capacidad}</Card.Text>
                      <Card.Text>Estado: {cabana.estado}</Card.Text>
                      <Card.Text>
                        Comodidades:{" "}
                        {cabana.comodidades && cabana.comodidades.length > 0
                          ? cabana.comodidades
                              .map((c) => c.nombreArticulo)
                              .join(", ")
                          : "No hay comodidades registradas"}
                      </Card.Text>
                      <div className="mt-auto">
                        <Button
                          variant="outline-primary"
                          onClick={() => handleEditCabana(cabana)}
                          className="me-2 mb-2"
                        >
                          <Edit size={16} className="me-1" /> Editar
                        </Button>
                        <Button
                          variant="outline-info"
                          onClick={() => handleViewDetails(cabana)}
                          className="me-2 mb-2"
                        >
                          <Eye size={16} className="me-1" /> Ver Detalle
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={() => handleDeleteCabana(cabana)}
                          className="mb-2"
                        >
                          <Trash size={16} className="me-1" /> Eliminar
                        </Button>
                      </div>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p>No seencontraron cabañas.</p>
          </Col>
        )}
      </Row>

      <ReactPaginate
        previousLabel={"Anterior"}
        nextLabel={"Siguiente"}
        breakLabel={"..."}
        pageCount={Math.ceil(filteredCabanaList.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination-container"}
        activeClassName={"active"}
      />

      <Modal
        show={showCabanaForm}
        onHide={() => setShowCabanaForm(false)}
        size="lg"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedCabana ? "Editar Cabaña" : "Agregar Cabaña"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Container>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      name="nombre"
                      value={formValues.nombre}
                      onChange={handleInputChange}
                      isInvalid={!!errors.nombre}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.nombre}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Capacidad</Form.Label>
                    <Form.Control
                      type="number"
                      name="capacidad"
                      value={formValues.capacidad}
                      onChange={handleInputChange}
                      isInvalid={!!errors.capacidad}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.capacidad}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Estado</Form.Label>
                    <Form.Control
                      as="select"
                      name="estado"
                      value={formValues.estado}
                      onChange={handleInputChange}
                    >
                      <option>En servicio</option>
                      <option>En mantenimiento</option>
                      <option>Fuera de servicio</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="descripcion"
                      value={formValues.descripcion}
                      onChange={handleInputChange}
                      isInvalid={!!errors.descripcion}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.descripcion}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Imagen</Form.Label>
                    <Form.Control
                      type="file"
                      name="imagen"
                      onChange={handleInputChange}
                      isInvalid={!!errors.imagen}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.imagen}
                    </Form.Control.Feedback>
                  </Form.Group>
                  {formValues.imagen && (
                    <img
                      src={URL.createObjectURL(formValues.imagen)}
                      alt="Vista previa"
                      style={{
                        width: "100%",
                        maxHeight: "150px",
                        objectFit: "cover",
                        marginTop: "10px",
                      }}
                    />
                  )}
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mt-3">
                    <Form.Label>Comodidades</Form.Label>
                    <div className="d-flex mb-3">
                      <Select
                        options={comodidadesOptions}
                        onChange={handleComodidadSelect}
                        value={selectedComodidad}
                        placeholder="Seleccionar comodidad"
                        className="flex-grow-1 me-2"
                      />
                       <Button onClick={handleAddNewComodidad} variant="primary"  >
          <PlusCircle size={16} className="me-2" />
          Nueva Comodidad
        </Button>
                    </div>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Artículo</th>
                          <th>Código</th>
                          <th>Observación</th>
                          <th>Fecha de Ingreso</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formValues.comodidades.map((comodidad) => (
                          <tr key={comodidad.id}>
                            <td>{comodidad.nombreArticulo}</td>
                            <td>{comodidad.codigoArticulo}</td>
                            <td>{comodidad.observacion}</td>
                            <td>{comodidad.fechaIngreso}</td>
                            <td>{comodidad.estado}</td>
                            <td>
                              <Button
                                variant="outline-primary"
                                onClick={() => handleEditComodidad(comodidad.id)}
                                className="me-2"
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                variant="outline-danger"
                                onClick={() => handleDeleteComodidad(comodidad.id)}
                              >
                                <Trash size={16} />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Form.Group>
                </Col>
              </Row>
            </Container>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCabanaForm(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveCabana}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

       <Modal 
      show={showComodidadModal} 
      onHide={handleCloseComodidadModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>{editingComodidadId === 'new' ? 'Agregar' : 'Editar'} Comodidad</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Código del Artículo</Form.Label>
            <Form.Control
              type="text"
              name="codigoArticulo"
              value={newComodidad.codigoArticulo}
              onChange={handleNewComodidadChange}
              isInvalid={!!comodidadErrors.codigoArticulo}
            />
            <Form.Control.Feedback type="invalid">
              {comodidadErrors.codigoArticulo}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nombre del Artículo</Form.Label>
            <Form.Control
              type="text"
              name="nombreArticulo"
              value={newComodidad.nombreArticulo}
              onChange={handleNewComodidadChange}
              isInvalid={!!comodidadErrors.nombreArticulo}
            />
            <Form.Control.Feedback type="invalid">
              {comodidadErrors.nombreArticulo}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Observación</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="observacion"
              value={newComodidad.observacion}
              onChange={handleNewComodidadChange}

            />
            <Form.Control.Feedback type="invalid">
              {comodidadErrors.observacion}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de Ingreso</Form.Label>
            <Form.Control
              type="date"
              name="fechaIngreso"
              value={newComodidad.fechaIngreso}
              onChange={handleNewComodidadChange}
              isInvalid={!!comodidadErrors.fechaIngreso}
            />
            <Form.Control.Feedback type="invalid">
              {comodidadErrors.fechaIngreso}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Control
              as="select"
              name="estado"
              value={newComodidad.estado}
              onChange={handleNewComodidadChange}
            >
              <option value="Disponible">Disponible</option>
              <option value="De Baja">Dado de Baja</option>
              <option value="En Mantenimiento">En Mantenimiento</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseComodidadModal}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSaveComodidad}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>

      {showDetailModal && (
        <Modal
          show={showDetailModal}
          onHide={() => setShowDetailModal(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton className="bg-light">
            <Modal.Title>{selectedCabana.nombre}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0">
            <Row className="g-0">
              <Col md={6}>
                {selectedCabana.imagen && (
                  <img
                    src={URL.createObjectURL(selectedCabana.imagen)}
                    alt={selectedCabana.nombre}
                    className="img-fluid rounded-start"
                    style={{
                      objectFit: "cover",
                      height: "100%",
                      width: "100%",
                    }}
                  />
                )}
              </Col>
              <Col md={6}>
                <div className="p-4">
                  <h5 className="card-title mb-3">Detalles de la Cabaña</h5>
                  <p className="card-text">
                    <strong>Capacidad:</strong> {selectedCabana.capacidad}{" "}
                    personas
                  </p>
                  <p className="card-text">
                    <strong>Estado:</strong>{" "}
                    <span
                      className={`badge ${getStatusBadgeClass(
                        selectedCabana.estado
                      )}`}
                    >
                      {selectedCabana.estado}
                    </span>
                  </p>
                  <p className="card-text">
                    <strong>Descripción:</strong> {selectedCabana.descripcion}
                  </p>
                  <div className="mt-4">
                    <h6>Comodidades:</h6>
                    {selectedCabana.comodidades &&
                    selectedCabana.comodidades.length > 0 ? (
                      <ul className="list-unstyled">
                        {selectedCabana.comodidades.map((c, index) => (
                          <li key={index} className="mb-1">
                            <i className="bi bi-check2-circle me-2 text-success"></i>
                            {c.nombreArticulo}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No hay comodidades registradas</p>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
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