import React, { useState } from 'react';
import { Table, Button, FormControl, Modal, Form } from 'react-bootstrap';
import UserModal from './UserModel';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [modalState, setModalState] = useState({ showUserModal: false, showConfirmDelete: false, selectedUser: null });
  const [searchTerm, setSearchTerm] = useState('');

  const toggleUserModal = (user = null) => setModalState({ ...modalState, selectedUser: user, showUserModal: !modalState.showUserModal });

  const saveUser = (user) => {
    setUsers(user.id ? users.map(u => u.id === user.id ? user : u) : [...users, { ...user, id: users.length + 1 }]);
    toggleUserModal();
  };

  const filteredUsers = users.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.telefono.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.rol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='container col p-5'>
      {/* Barra de búsqueda */}
      <Form className="d-flex mb-3">
        <FormControl
          type="search"
          placeholder="Buscar..."
          className="me-2"
          aria-label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form>

      <Button variant="primary" className="mb-3" onClick={() => toggleUserModal()}>
        Agregar Usuario
      </Button>

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
            filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nombre}</td>
                <td>{user.documento}</td>
                <td>{user.email}</td>
                <td>{user.telefono}</td>
                <td>{user.rol}</td>
                <td>
                  <Button variant="warning" onClick={() => toggleUserModal(user)}>Editar</Button>{' '}
                  <Button variant="danger" onClick={() => setModalState({ ...modalState, selectedUser: user, showConfirmDelete: true })}>Eliminar</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No se encontraron usuarios</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal para editar/agregar usuario */}
      <UserModal
        show={modalState.showUserModal}
        handleClose={() => toggleUserModal()}
        user={modalState.selectedUser}
        handleSave={saveUser}
      />

      {/* Modal de confirmación para eliminar usuario */}
      <Modal show={modalState.showConfirmDelete} onHide={() => setModalState({ ...modalState, showConfirmDelete: false })}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar al usuario {modalState.selectedUser?.nombre}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalState({ ...modalState, showConfirmDelete: false })}>Cancelar</Button>
          <Button variant="danger" onClick={() => {
            setUsers(users.filter(u => u.id !== modalState.selectedUser.id));
            setModalState({ ...modalState, showConfirmDelete: false });
          }}>Eliminar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserTable;
