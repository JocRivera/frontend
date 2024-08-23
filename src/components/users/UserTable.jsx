import React, { useState } from 'react';
import { Table, Button, FormControl } from 'react-bootstrap';
import EliminarModal from './deleteUserModal';
import UserModal from './UserModel';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [modalState, setModalState] = useState({ showUserModal: false, showConfirmDelete: false, selectedUser: null });
  const [searchTerm, setSearchTerm] = useState('');

  const toggleUserModal = (user = null) => setModalState({ ...modalState, selectedUser: user, showUserModal: !modalState.showUserModal });

  const toggleConfirmDelete = (user = null) => setModalState({ ...modalState, selectedUser: user, showConfirmDelete: !modalState.showConfirmDelete });

  const saveUser = (user) => {
    setUsers(user.id ? users.map(u => u.id === user.id ? user : u) : [...users, { ...user, id: users.length + 1 }]);
    toggleUserModal();
  };

  const deleteUser = () => {
    setUsers(users.filter(u => u.id !== modalState.selectedUser.id));
    toggleConfirmDelete();
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
      <Button variant="primary" onClick={() => toggleUserModal()}>
        Agregar Usuario
      </Button>
      <FormControl
        type="text"
        placeholder="Buscar..."
        className="mr-sm-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Table striped bordered hover style={{ width: '50%', margin: 'auto', marginTop: '50px' }}>
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
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nombre}</td>
              <td>{user.documento}</td>
              <td>{user.email}</td>
              <td>{user.telefono}</td>
              <td>{user.rol}</td>
              <td className="col-md-2 col-lg-6">
                <Button variant="warning" onClick={() => toggleUserModal(user)}>Editar</Button>{''}
                <Button variant="danger" onClick={() => toggleConfirmDelete(user)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <UserModal
        show={modalState.showUserModal}
        handleClose={toggleUserModal}
        user={modalState.selectedUser}
        handleSave={saveUser}
      />

      <EliminarModal
        show={modalState.showConfirmDelete}
        handleClose={toggleConfirmDelete}
        handleConfirm={deleteUser}
        itemName={modalState.selectedUser ? modalState.selectedUser.nombre : ''}
      />
    </div>
  );
};

export default UserTable;
