import React, { useState } from "react";
import { Table, Button, FormControl, Form, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import * as BsIcons from "react-icons/bs";
import UserModal from "./UserModel";
import "./users.css";

const UserTable = () => {
  const initialUsers = [
    {
      id: 1,
      nombre: "Juan Pérez",
      tipoDocumento: "Cédula",
      documento: "12345678",
      email: "juan.perez@example.com",
      telefono: "3001234567",
      rol: "Admin",
      contraseña: "123456",
      estado: "activo",
    },
    {
      id: 2,
      nombre: "María Gómez",
      tipoDocumento: "Pasaporte",
      documento: "87654321",
      email: "maria.gomez@example.com",
      telefono: "3007654321",
      rol: "Usuario",
      estado: "inactivo",
    },
    {
      id: 3,
      nombre: "Carlos López",
      tipoDocumento: "Cédula",
      documento: "11223344",
      email: "carlos.lopez@example.com",
      telefono: "3009876543",
      rol: "Moderador",
      estado: "activo",
    },
  ];

  const handleChangeEstado = (user) => {
    const nuevoEstado = user.estado === "activo" ? "inactivo" : "activo";
    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, estado: nuevoEstado } : u
    );
    setUsers(updatedUsers);
  };
  const [users, setUsers] = useState(initialUsers);

  const [modalState, setModalState] = useState({
    showUserModal: false,
    selectedUser: null,
    isEditing: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);

  const saveUser = (user) => {
    const { isEditing } = modalState;
    if (isEditing) {
      Swal.fire({
        title: "Confirmar cambios",
        text: `¿Estás seguro de que deseas actualizar al usuario ${user.nombre}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Actualizar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          setUsers((prevUsers) =>
            user.id
              ? prevUsers.map((u) => (u.id === user.id ? { ...u, ...user } : u))
              : [...prevUsers, { ...user, id: prevUsers.length + 1 }]
          );
          handleCloseModal();
        }
      });
    } else {
      setUsers((prevUsers) => [
        ...prevUsers,
        { ...user, id: prevUsers.length + 1 },
      ]);
      handleCloseModal();
      Swal.fire(
        "Agregado con éxito",
        "El usuario ha sido agregado correctamente",
        "success"
      );
    }
  };
  const handleDeleteUser = (user) => {
    Swal.fire({
      title: "Confirmar Eliminación",
      text: `¿Estás seguro de que deseas eliminar al usuario ${user.nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedUsers = users.filter((u) => u.id !== user.id);
        setUsers(updatedUsers);
        Swal.fire("Eliminado", "El usuario ha sido eliminado.", "success");
      }
    });
  };

  const filteredUsers = users.filter((user) =>
    [
      user.nombre,
      user.documento,
      user.email,
      user.telefono,
      user.rol,
      user.tipoDocumento,
    ].some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleUserModal = (user = null) => {
    if (user) {
      setModalState({
        showUserModal: true,
        selectedUser: user,
        isEditing: true,
      });
    } else {
      setModalState({
        showUserModal: true,
        selectedUser: null,
        isEditing: false,
      });
    }
  };

  const handleShowDetails = (user) => {
    setSelectedUserDetails(user);
    setShowDetails(true);
  };

  const handleCloseModal = () => {
    setModalState({
      showUserModal: false,
      selectedUser: null,
      isEditing: false,
    });
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedUserDetails(null); // Resetear detalles al cerrar
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className="container col p-5 mt-3"
      style={{ minHeight: "100vh", marginRight: "850px", marginTop: "50px" }}
    >
      <h1>Lista de Usuarios</h1>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <Form className="d-flex mb-3" onSubmit={handleSearch}>
          <FormControl
            type="search"
            placeholder="Buscar..."
            className="me-2"
            aria-label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline-success" type="submit">
            Buscar
          </Button>
        </Form>

        <Button
          variant="primary"
          className="mb-3"
          onClick={() => toggleUserModal()}
        >
          Agregar Usuario
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Tipo Documento</th>{" "}
            {/* Nueva columna para el tipo de documento */}
            <th>Documento</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Rol</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nombre}</td>
                <td>{user.tipoDocumento}</td>{" "}
                {/* Mostrar el tipo de documento */}
                <td>{user.documento}</td>
                <td>{user.email}</td>
                <td>{user.telefono}</td>
                <td>{user.rol}</td>
                <td
                  className="d-flex justify-content-center"
                  style={{ gap: "10px" }}
                >
                  <Button
                    variant="info"
                    onClick={() => handleShowDetails(user)}
                  >
                    <BsIcons.BsInfoLg style={{ marginRight: "5px" }} />
                  </Button>
                  <Button
                    variant="warning"
                    onClick={() => toggleUserModal(user)}
                  >
                    <BsIcons.BsPencilFill style={{ marginRight: "5px" }} />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteUser(user)}
                  >
                    <BsIcons.BsTrash3Fill style={{ marginRight: "5px" }} />
                  </Button>
                  <Form.Check
                    type="switch"
                    id={`estado-${user.id}`}
                    name="estado"
                    checked={user.estado === "activo"}
                    onChange={() => handleChangeEstado(user)}
                    className={
                      user.estado === "activo"
                        ? "switch-active"
                        : "switch-inactive"
                    }
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No se encontraron usuarios
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <UserModal
        show={modalState.showUserModal}
        handleClose={handleCloseModal}
        user={modalState.selectedUser}
        handleSave={saveUser}
      />

      <Modal show={showDetails} onHide={handleCloseDetails}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUserDetails && (
            <div>
              <p>
                <strong>ID:</strong> {selectedUserDetails.id}
              </p>
              <p>
                <strong>Nombre:</strong> {selectedUserDetails.nombre}
              </p>
              <p>
                <strong>Tipo Documento:</strong>{" "}
                {selectedUserDetails.tipoDocumento}
              </p>{" "}
              {/* Detalle del tipo de documento */}
              <p>
                <strong>Documento:</strong> {selectedUserDetails.documento}
              </p>
              <p>
                <strong>Email:</strong> {selectedUserDetails.email}
              </p>
              <p>
                <strong>Teléfono:</strong> {selectedUserDetails.telefono}
              </p>
              <p>
                <strong>Rol:</strong> {selectedUserDetails.rol}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetails}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserTable;
