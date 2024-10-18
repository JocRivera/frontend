import React, { useState, useEffect } from 'react';
import * as BsIcons from "react-icons/bs";
import { Button, Modal, Form, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import { PlusCircle } from "lucide-react"
import ReactPaginate from 'react-paginate';

const SettingManagement = () => {
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editSetting, setEditSetting] = useState({ id: '', rol: '', description: '', permissions: [], status: true });
    const [settings, setSettings] = useState([]);
    const [newSetting, setNewSetting] = useState({ rol: '', description: '', permissions: [], status: true });
    const [query, setQuery] = useState('');
    const [errors, setErrors] = useState({ rol: '', description: '' });
    const [permissions, setPermissions] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [rolesResponse, permissionsResponse] = await Promise.all([
                    axios.get('http://192.168.1.28/rol'),
                    axios.get('http://192.168.1.28/permission')
                ]);
                setSettings(rolesResponse.data);
                setPermissions(permissionsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [newSetting]);

    const validate = (values) => {
        const errors = {}
        if (!values.rol) {
            errors.rol = 'Nombre de rol es requerido';
        }
        if (!values.description) {
            errors.description = 'Descripción es requerida';
        }
        if (values.permissions.length === 0) {
            errors.permission = 'Seleccione al menos un permiso';
        }
        return errors;
    };

    const handleChange = (e) => {
        setNewSetting({ ...newSetting, [e.target.name]: e.target.value });
    };

    const handleEditChange = (e) => {
        setEditSetting({ ...editSetting, [e.target.name]: e.target.value });
    };

    const handlePermissionChange = (permissionId, isChecked, isNewSetting = true) => {
        if (isNewSetting) {
            setNewSetting(prev => ({
                ...prev,
                permissions: isChecked
                    ? [...prev.permissions, permissionId]
                    : prev.permissions.filter(id => id !== permissionId)
            }));
        } else {
            setEditSetting(prev => ({
                ...prev,
                permissions: isChecked
                    ? [...prev.permissions, permissionId]
                    : prev.permissions.filter(id => id !== permissionId)
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validate(newSetting);
        if (Object.keys(errors).length) {
            setErrors(errors);
            return;
        }

        try {
            const response = await axios.post('http://192.168.1.28/rol', newSetting);
            setSettings([...settings, response.data]);
            setNewSetting({ rol: '', description: '', permissions: [], status: true });
            setShowModal(false);
            Swal.fire({
                title: "Success!",
                text: "New role added successfully!",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error('Error adding new role:', error);
            Swal.fire({
                title: "Error!",
                text: "Failed to add new role.",
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
            });
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const errors = validate(editSetting);
        if (Object.keys(errors).length) {
            setErrors(errors);
            return;
        }

        try {
            await axios.put(`http://192.168.1.28/rol/${editSetting._id}`, editSetting);
            const updatedSettings = settings.map(setting =>
                setting._id === editSetting._id ? editSetting : setting
            );
            setSettings(updatedSettings);
            setShowEditModal(false);
            Swal.fire({
                title: "Success!",
                text: "Role updated successfully!",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error('Error updating role:', error);
            Swal.fire({
                title: "Error!",
                text: "Failed to update role.",
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
            });
        }
    };

    const handleEdit = (setting) => {
        setEditSetting(setting);
        setShowEditModal(true);
    };

    const handleDelete = async (setting) => {
        try {
            await axios.delete(`http://192.168.1.28/rol/${setting._id}`);
            const updatedSettings = settings.filter(s => s._id !== setting._id);
            setSettings(updatedSettings);
            Swal.fire({
                title: "Success!",
                text: "Role deleted successfully!",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error('Error deleting role:', error);
            Swal.fire({
                title: "Error!",
                text: "Failed to delete role.",
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
            });
        }
    };

    const handleSearch = (e) => {
        setQuery(e.target.value);
    };

    const handleSettingStatus = async (_id) => {
        try {
            // Mostrar alerta de confirmación y esperar la respuesta
            const confirm = await Swal.fire({
                title: "¿Desea cambiar el estado del rol?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Confirmar",
                cancelButtonText: "Cancelar",
            });

            if (confirm.isConfirmed) {
                const settingToUpdate = settings.find(s => s._id === _id);
                const updatedStatus = !settingToUpdate.status;
                await axios.patch(`http://192.168.1.28/rol/${_id}`, { status: updatedStatus });
                const updatedSettings = settings.map(setting =>
                    setting._id === _id ? { ...setting, status: updatedStatus } : setting
                );
                setSettings(updatedSettings);
                Swal.fire({
                    title: "Success!",
                    text: "El estado del rol ha sido cambiado!",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                });
            }
        } catch (error) {
            console.error('Error updating role status:', error);
            Swal.fire({
                title: "Error!",
                text: "Failed to update role status.",
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
            });
        }
    };

    const filteredSettings = settings.filter(setting =>
        setting && setting.rol && typeof setting.rol === 'string' &&
        setting.rol.toLowerCase().includes(query.toLowerCase())
    );;

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    }

    const displayedSettings = filteredSettings.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <div className='container col p-5 mt-3' style={{ minHeight: "100vh", marginRight: "850px", marginTop: "50px" }}>
            <h2 className='text-center'>Configuracion roles</h2>
            <div className="d-flex justify-content-between align-items-center" style={{ gap: '800px' }}>
                <Form className="d-flex mb-3" onSubmit={(e) => e.preventDefault()}>
                    <Form.Control
                        type="search"
                        placeholder="Buscar..."
                        className='me-2 w-70'
                        aria-label='search'
                        value={query}
                        onChange={handleSearch}
                    />
                    <Button variant="outline-success" type="submit">Buscar</Button>
                </Form>
                <Button className='mb-3 d-flex align-items-center' onClick={() => setShowModal(true)}><PlusCircle size={20} className='me-2'/>
                    Añadir</Button>
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Rol</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedSettings.length > 0 ? (
                        displayedSettings.map((setting, index) => (
                            <tr key={setting._id}>
                                <td>{index + 1}</td>
                                <td>{setting.rol}</td>
                                <td>{setting.description}</td>
                                <td>
                                    <Form.Check
                                        type='switch'
                                        id={`switch-${setting._id}`}
                                        checked={setting.status}
                                        onChange={() => handleSettingStatus(setting._id)}
                                    />
                                </td>
                                <td className='d-flex justify-content-center' style={{ gap: '10px' }} >
                                    <Button variant="warning" onClick={() => handleEdit(setting)}><BsIcons.BsPencilFill style={{ marginRight: '5px' }} /></Button>
                                    <Button variant="danger" onClick={() => handleDelete(setting)}><BsIcons.BsTrash3Fill style={{ marginRight: '5px' }} /></Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">No se encontraron roles</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <ReactPaginate
                previousLabel={"Anterior"}
                nextLabel={"Siguiente"}
                breakLabel={"..."}
                pageCount={Math.ceil(filteredSettings.length / itemsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
                containerClassName={"pagination-container"}
                activeClassName={"active"}
            />

            {/* Modal for Adding a Setting */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Añadir rol</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Rol</Form.Label>
                            <Form.Control type="text" name="rol" value={newSetting.rol} onChange={handleChange} />
                            {errors.rol && <span style={{ color: 'red' }}>{errors.rol}</span>}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control type="text" name="description" value={newSetting.description} onChange={handleChange} />
                            {errors.description && <span style={{ color: 'red' }}>{errors.description}</span>}
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Permisos</Form.Label>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {permissions.map((permission) => (
                                        <tr key={permission._id}>
                                            <td>{permission.name}</td>
                                            <td>
                                                <Form.Check
                                                    type='switch'
                                                    checked={newSetting.permissions.includes(permission._id)}
                                                    onChange={(e) => handlePermissionChange(permission._id, e.target.checked)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            {errors.permission && <span style={{ color: 'red' }}>{errors.permission}</span>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formStatus">
                            <Form.Check
                                type='switch'
                                label={newSetting.status ? "Activo" : "Inactivo"}
                                name="status"
                                checked={newSetting.status}
                                onChange={(e) => setNewSetting({
                                    ...newSetting,
                                    status: e.target.checked
                                })}
                            />
                        </Form.Group>

                        <Button type="submit">Agregar</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal for Editing a Setting */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Rol</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group>
                            <Form.Label>Rol</Form.Label>
                            <Form.Control type="text" name="rol" value={editSetting.rol} onChange={handleEditChange} />
                            {errors.rol && <span style={{ color: 'red' }}>{errors.rol}</span>}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control type="text" name="description" value={editSetting.description} onChange={handleEditChange} />
                            {errors.description && <span style={{ color: 'red' }}>{errors.description}</span>}
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Permisos</Form.Label>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {permissions.map((permission) => (
                                        <tr key={permission._id}>
                                            <td>{permission.name}</td>
                                            <td>
                                                <Form.Check
                                                    type='switch'
                                                    checked={editSetting.permissions.includes(permission._id)}
                                                    onChange={(e) => handlePermissionChange(permission._id, e.target.checked, false)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            {errors.permission && <span style={{ color: 'red' }}>{errors.permission}</span>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formStatus">
                            <Form.Check
                                type='switch'
                                label={editSetting.status ? "Activo" : "Inactivo"}
                                name="status"
                                checked={editSetting.status}
                                onChange={(e) => setEditSetting({
                                    ...editSetting,
                                    status: e.target.checked
                                })}
                            />
                        </Form.Group>
                        <Button type="submit">Guardar Cambios</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default SettingManagement;