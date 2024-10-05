import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { FaExclamationCircle } from "react-icons/fa"; // Importar icono de advertencia
import Swal from "sweetalert2"; // Importar SweetAlert

const CompanionsForm = ({ companions = [], onAdd, onDelete }) => {
  const [companion, setCompanion] = React.useState({
    id: null,
    name: "",
    age: "",
    typeOfDocument: "",
    documentNumber: "",
    birthDate: "",
  });

  const [errorMessages, setErrorMessages] = React.useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanion((prevState) => ({ ...prevState, [name]: value }));

    if (name === "birthDate") {
      const birthDate = new Date(value);
      const calculatedAge = new Date().getFullYear() - birthDate.getFullYear();
      setCompanion((prevState) => ({
        ...prevState,
        age: calculatedAge >= 0 ? calculatedAge : "",
      }));
    }

    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMsg = "";

    switch (name) {
      case "name":
        if (!value) errorMsg = "El nombre del acompañante es obligatorio.";
        else if (/\d/.test(value))
          errorMsg = "El nombre no puede contener números.";
        break;
      case "age":
        if (value && (isNaN(value) || value < 0))
          errorMsg = "La edad debe ser un número positivo.";
        break;
      case "typeOfDocument":
        if (!value) errorMsg = "Debes seleccionar un tipo de documento.";
        break;
      case "documentNumber":
        if (!/^[a-zA-Z0-9]+$/.test(value) || value.trim() === "")
          errorMsg =
            "El número de documento debe ser alfanumérico y no puede estar vacío.";
        break;
      case "birthDate":
        const today = new Date().toISOString().split("T")[0];
        if (!value) errorMsg = "Debes seleccionar una fecha de nacimiento.";
        else if (value > today)
          errorMsg = "La fecha de nacimiento no puede ser posterior a hoy.";
        break;
      default:
        break;
    }

    setErrorMessages((prevState) => ({ ...prevState, [name]: errorMsg }));
  };

  const handleAdd = () => {
    if (Object.values(errorMessages).some((msg) => msg !== "")) return;

    onAdd(companion);
    setCompanion({
      id: null,
      name: "",
      age: "",
      typeOfDocument: "",
      documentNumber: "",
      birthDate: "",
    });
    setErrorMessages({});
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro de eliminar este acompañante?",
      text: "No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(id);
        Swal.fire("Eliminado!", "El acompañante ha sido eliminado.", "success");
      }
    });
  };

  return (
    <div>
      <h5>Acompañantes</h5>
      <h6>Lista de Acompañantes</h6>
      <ul>
        {companions.map((comp) => (
          <li key={comp.id}>
            {comp.name}, {comp.age} años - {comp.typeOfDocument}{" "}
            {comp.documentNumber}
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDelete(comp.id)}
              className="ms-2"
            >
              Eliminar
            </Button>
          </li>
        ))}
      </ul>

      <Form>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={companion.name}
                onChange={handleChange}
                isInvalid={!!errorMessages.name}
              />
              <Form.Control.Feedback type="invalid">
                {errorMessages.name}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha de Nacimiento</Form.Label>
                <Form.Control
                  type="date"
                  name="birthDate"
                  value={companion.birthDate}
                  onChange={handleChange}
                  isInvalid={!!errorMessages.birthDate}
                />
                <Form.Control.Feedback type="invalid">
                  {errorMessages.birthDate}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Edad</Form.Label>
                <Form.Control
                  type="number"
                  name="age"
                  value={companion.age}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Documento</Form.Label>
              <Form.Control
                as="select"
                name="typeOfDocument"
                value={companion.typeOfDocument}
                onChange={handleChange}
                isInvalid={!!errorMessages.typeOfDocument}
              >
                <option value="">Selecciona...</option>
                {companion.age < 18 ? (
                  <>
                    <option value="TI">Tarjeta de Identidad</option>
                    <option value="CE">Cédula de Extrangería</option>
                  </>
                ) : (
                  <>
                    <option value="CC">Cédula de Ciudadanía</option>
                    <option value="TI">Tarjeta de Identidad</option>
                    <option value="CE">Cédula de Extrangería</option>
                  </>
                )}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errorMessages.typeOfDocument}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Número de Documento</Form.Label>
              <Form.Control
                type="text"
                name="documentNumber"
                value={companion.documentNumber}
                onChange={handleChange}
                isInvalid={!!errorMessages.documentNumber}
              />
              <Form.Control.Feedback type="invalid">
                {errorMessages.documentNumber}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" onClick={handleAdd}>
          Añadir Acompañante
        </Button>
      </Form>
      <hr />
    </div>
  );
};

export default CompanionsForm;
