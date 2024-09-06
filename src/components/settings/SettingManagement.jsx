import React, { useState } from "react";
import * as BsIcons from "react-icons/bs";
import { Button, Modal, Form, Table } from "react-bootstrap";
import Swal from "sweetalert2";

let nextId = 1;
const generateUniqueId = () => {
  return nextId++;
};

const SettingManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSetting, setEditSetting] = useState({
    id: "",
    name: "",
    description: "",
    status: true,
  });
  const [settings, setSettings] = useState([]);
  const [newSetting, setNewSetting] = useState({
    name: "",
    description: "",
    status: true,
  });
  const [query, setQuery] = useState("");
  const [errors, setErrors] = useState({ name: "", description: "" });

  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = "Name is required";
    }
    if (!values.description) {
      errors.description = "Description is required";
    }
    return errors;
  };

  const handleChange = (e) => {
    setNewSetting({ ...newSetting, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditSetting({ ...editSetting, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(newSetting);
    if (Object.keys(errors).length) {
      setErrors(errors);
      return;
    } else {
      Swal.fire({
        title: "¿Desea agregar este rol?",
        text: "Revisa que todos los campos esten correctos",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "confirmar",
        cancelButtonText: "cancelar",
      }).then((confirm) => {
        if (confirm.isConfirmed) {
          setSettings([...settings, { ...newSetting, id: generateUniqueId() }]);
          setNewSetting({ name: "", description: "", status: true });
          setShowModal(false);
          Swal.fire({
            title: "Good job!",
            text: "You clicked the button!",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          setShowModal(false);
        }
      });
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const errors = validate(editSetting);
    if (Object.keys(errors).length) {
      setErrors(errors);
      return;
    }
    const updatedSettings = settings.map((setting) =>
      setting.id === editSetting.id ? editSetting : setting
    );
    setSettings(updatedSettings);
    setShowEditModal(false);
  };

  const handleEdit = (setting) => {
    setEditSetting(setting);
    setShowEditModal(true);
  };

  const handleDelete = (setting) => {
    const updatedSettings = settings.filter((s) => s.id !== setting.id);
    setSettings(updatedSettings);
  };

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  const handleSettingStatus = (id) => {
    const updatedSettings = settings.map((setting) =>
      setting.id === id ? { ...setting, status: !setting.status } : setting
    );
    setSettings(updatedSettings);
  };

  const filteredSettings = settings.filter((setting) =>
    setting.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container col p-5 mt-3">
      <h2 className="text-center">Configuracion roles</h2>
      <div className="d-flex justify-content-between align-items-center">
        <Form className="d-flex mb-3" onSubmit={handleSearch}>
          <Form.Control
            type="search"
            placeholder="Buscar..."
            className="me-2 w-70"
            aria-label="search"
            value={query}
            onChange={(e) => handleSearch(e)}
          />
          <Button variant="outline-success" type="submit">
            Buscar
          </Button>
        </Form>
        <Button className="mb-3" onClick={() => setShowModal(true)}>
          Añadir rol
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSettings.length > 0 ? (
            filteredSettings.map((setting, index) => (
              <tr key={setting.id}>
                <td>{index + 1}</td>
                <td>{setting.name}</td>
                <td>{setting.description}</td>
                <td>
                  <Form.Check
                    type="switch"
                    id={`switch-${setting.id}`}
                    checked={setting.status}
                    onChange={() => handleSettingStatus(setting.id)}
                  />
                </td>
                <td
                  className="d-flex justify-content-center"
                  style={{ gap: "10px" }}
                >
                  <Button variant="warning" onClick={() => handleEdit(setting)}>
                    {" "}
                    <BsIcons.BsPencilFill style={{ marginRight: "5px" }} />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(setting)}
                  >
                    <BsIcons.BsTrash3Fill style={{ marginRight: "5px" }} />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No se encontraron servicios
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal for Adding a Setting */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar rol</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newSetting.name}
                onChange={handleChange}
              />
              {errors.name && (
                <span style={{ color: "red" }}>{errors.name}</span>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={newSetting.description}
                onChange={handleChange}
              />
              {errors.description && (
                <span style={{ color: "red" }}>{errors.description}</span>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formStatus">
              <Form.Check
                type="switch"
                label={newSetting.status ? "Activo" : "Inactivo"}
                name="status"
                checked={newSetting.status}
                onChange={(e) =>
                  setNewSetting({
                    ...newSetting,
                    status: e.target.checked,
                  })
                }
              />
            </Form.Group>

            <Button type="submit">Add</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal for Editing a Setting */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Setting</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editSetting.name}
                onChange={handleEditChange}
              />
              {errors.name && (
                <span style={{ color: "red" }}>{errors.name}</span>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={editSetting.description}
                onChange={handleEditChange}
              />
              {errors.description && (
                <span style={{ color: "red" }}>{errors.description}</span>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formStatus">
              <Form.Check
                type="switch"
                label={editSetting.status ? "Activo" : "Inacivo"}
                name="status"
                checked={editSetting.status}
                onChange={(e) =>
                  setEditSetting({
                    ...editSetting,
                    status: e.target.checked,
                  })
                }
              />
            </Form.Group>
            <Button type="submit">Guardar Cambios</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SettingManagement;
