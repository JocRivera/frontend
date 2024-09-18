import React, { useState, useEffect } from "react";
import { Table, Button, FormControl, Form, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import UserModal from "./UserModel";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [modalState, setModalState] = useState({
    showUserModal: false,
    selectedUser: null,
    isEditing: false, // Nueva propiedad para indicar si se está editando
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetails, setShowDetails] = useState(false); // Estado para mostrar detalles
  const [selectedUserDetails, setSelectedUserDetails] = useState(null); // Estado para guardar el usuario seleccionado

  const saveUser = (user) => {
    setUsers((prevUsers) =>
      user.id
        ? prevUsers.map((u) => (u.id === user.id ? { ...u, ...user } : u))
        : [...prevUsers, { ...user, id: prevUsers.length + 1 }]
    );
    setModalState((prevState) => ({
      ...prevState,
      showUserModal: false,
      selectedUser: null,
      isEditing: false,
    }));
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
        Swal.fire(
          "Eliminado",
          "El usuario ha sido eliminado.",
          "success"
        );
      }
    });
  };

  const filteredUsers = users.filter((user) =>
    [user.nombre, user.documento, user.email, user.telefono, user.rol].some(
      (field) => field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const toggleUserModal = (user = null) => {
    if (user) {
      Swal.fire({
        title: "Editar Usuario",
        text: `Vas a editar al usuario ${user.nombre}. ¿Deseas continuar?`,
        icon: "info",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, continuar",
        cancelButtonText: "Cancelar",
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          // Si se confirma, abrir el modal de edición
          setModalState((prevState) => ({
            ...prevState,
            selectedUser: user,
            showUserModal: true,
            isEditing: true, // Indicar que se está editando
          }));
        }
      });
    } else {
      // Abrir el modal para agregar nuevo usuario sin alerta
      setModalState((prevState) => ({
        ...prevState,
        showUserModal: true,
        isEditing: false,
      }));
    }
  };

  const handleShowDetails = (user) => {
    setSelectedUserDetails(user);
    setShowDetails(true);
  };

  const handleCloseModal = () => {
    setModalState((prevState) => ({
      ...prevState,
      showUserModal: false,
      selectedUser: null,
      isEditing: false,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container col p-5 mt-3" style={{ minHeight: "100vh", marginRight : "850px", marginTop  : "50px"}}>


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
                <td>{user.documento}</td>
                <td>{user.email}</td>
                <td>{user.telefono}</td>
                <td>{user.rol}</td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => toggleUserModal(user)}
                  >
                    Editar
                  </Button>{" "}
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteUser(user)}
                  >
                    Eliminar
                  </Button>{" "}
                  <Button
                    variant="info"
                    onClick={() => handleShowDetails(user)}
                  >
                    Detalles
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
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

      <Modal show={showDetails} onHide={() => setShowDetails(false)}>
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
              <p>
                <strong>Contraseña:</strong> {selectedUserDetails.contraseña}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDetails(false)}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserTable;