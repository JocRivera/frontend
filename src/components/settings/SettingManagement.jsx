import React, { useState } from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';

let nextId = 1;
const generateUniqueId = () => {
    return nextId++;
};

const SettingManagement = () => {
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editSetting, setEditSetting] = useState({ id: '', name: '', description: '', status: true });
    const [settings, setSettings] = useState([]);
    const [newSetting, setNewSetting] = useState({
        id: generateUniqueId(), name: '',
        description: '',
        status: true
    });
    const [currentSetting, setCurrentSetting] = useState({ id: '', name: '', description: '', status: true });
    const [query, setQuery] = useState('');
    const [errors, setErrors] = useState({ name: '', description: '' });

    const validate = (values) => {
        const errors = {}
        if (!values.name) {
            errors.name = 'Name is required';
        }
        if (!values.description) {
            errors.description = 'Description is required';
        }
        return errors;
    }
    const handleChange = (e) => {
        setNewSetting({ ...newSetting, [e.target.name]: e.target.value });
    }
    const handleEditChange = (e) => {
        setEditSetting({ ...editSetting, [e.target.name]: e.target.value });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate(newSetting);
        if (Object.keys(errors).length) {
            setErrors(errors);
            return;
        }
        setSettings([...settings, newSetting]);
        setNewSetting({ id: generateUniqueId(), name: '', description: '', status: true });
        setShowModal(false);
    }
    const handleEditSubmit = (e) => {
        e.preventDefault();
        const errors = validate(editSetting);
        if (Object.keys(errors).length) {
            setErrors(errors);
            return;
        }
        const updatedSettings = settings.map(setting => setting.id === editSetting.id ? editSetting : setting);
        setSettings(updatedSettings);
        setShowEditModal(false);
    }
    const handleEdit = (setting) => {
        setEditSetting(setting);
        setShowEditModal(true);
    }
    const handleDelete = (setting) => {
        const updatedSettings = settings.filter(s => s.id !== setting.id);
        setSettings(updatedSettings);
    }
    const handleSearch = (e) => {
        setQuery(e.target.value);
    }
    const filteredSettings = settings.filter(setting => setting.name.toLowerCase().includes(query.toLowerCase()));
    return (
        <div className='container'>
            <h1>Setting Management</h1>
            <Button onClick={() => setShowModal(true)}>Add Setting</Button>
            <Form.Control type="text" placeholder="Search" value={query} onChange={handleSearch} />
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSettings.map((setting, index) => (
                        <tr key={setting.id}>
                            <td>{index + 1}</td>
                            <td>{setting.name}</td>
                            <td>{setting.description}</td>
                            <td>{setting.status ? 'Active' : 'Inactive'}</td>
                            <td>
                                <Button onClick={() => handleEdit(setting)}>Edit</Button>
                                <Button onClick={() => handleDelete(setting)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Setting</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" value={newSetting.name} onChange={handleChange} />
                            {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" name="description" value={newSetting.description} onChange={handleChange} />
                            {errors.description && <span style={{ color: 'red' }}>{errors.description}</span>}
                        </Form.Group>
                        <Button type="submit">Add</Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Setting</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" value={editSetting.name} onChange={handleEditChange} />
                            {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" name="description" value={editSetting.description} onChange={handleEditChange} />
                            {errors.description && <span style={{ color: 'red' }}>{errors.description}</span>}
                        </Form.Group>
                        <Button type="submit">Update</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );

}

export default SettingManagement;
