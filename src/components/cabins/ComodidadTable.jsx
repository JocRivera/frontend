import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

// Componente para gestionar Comodidades dentro del formulario de Cabaña
const TableComodidad = ({ comodidades, onUpdateComodidades }) => {
  const [selectedComodidad, setSelectedComodidad] = useState(null);
  const [showComodidadModal, setShowComodidadModal] = useState(false);

  const handleAddComodidad = () => {
    setSelectedComodidad(null);
    setShowComodidadModal(true);
  };

  const handleSaveComodidad = (comodidad) => {
    if (selectedComodidad) {
      onUpdateComodidades(comodidades.map((item) => (item.id === comodidad.id ? comodidad : item)));
    } else {
      onUpdateComodidades([...comodidades, { ...comodidad, id: Date.now() }]);
    }
    setShowComodidadModal(false);
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'Comodidad guardada correctamente',
      timer: 2000, // Desaparece después de 2 segundos
      showConfirmButton: false
    });
  };

  const handleEditComodidad = (comodidad) => {
    Swal.fire({
      title: '¿Estás seguro de editar esta comodidad?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, editar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedComodidad(comodidad);
        setShowComodidadModal(true);
      }
    });
  };

  const handleDeleteComodidad = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        onUpdateComodidades(comodidades.filter((item) => item.id !== id));
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'Comodidad eliminada correctamente',
          timer: 2000, // Desaparece después de 2 segundos
          showConfirmButton: false
        });
      }
    });
  };

  return (
    <div>
      <Button onClick={handleAddComodidad}>Agregar Comodidad</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Artículos</th>
            <th>Observación</th>
            <th>Fecha de Ingreso</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {comodidades.map((comodidad) => (
            <tr key={comodidad.id}>
              <td>{comodidad.id}</td>
              <td>{comodidad.articulos}</td>
              <td>{comodidad.observacion}</td>
              <td>{new Date(comodidad.fechaIngreso).toLocaleDateString()}</td>
              <td>{comodidad.estado}</td>
              <td>
                <Button variant="info" onClick={() => handleEditComodidad(comodidad)}>Editar</Button>
                <Button variant="danger" onClick={() => handleDeleteComodidad(comodidad.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showComodidadModal && (
        <ModalComodidad
          show={showComodidadModal}
          onHide={() => setShowComodidadModal(false)}
          comodidad={selectedComodidad}
          onSave={handleSaveComodidad}
        />
      )}
    </div>
  );
};

// Modal para agregar/editar Comodidades
const ModalComodidad = ({ show, onHide, comodidad, onSave }) => {
  const [articulos, setArticulos] = useState(comodidad?.articulos || '');
  const [observacion, setObservacion] = useState(comodidad?.observacion || '');
  const [fechaIngreso, setFechaIngreso] = useState(comodidad?.fechaIngreso || '');
  const [estado, setEstado] = useState(comodidad?.estado || 'Disponible');
  const [errors, setErrors] = useState({});
  useEffect(() => {
    const newErrors = {};
    if (articulos.trim() && articulos.trim().length < 2) {
      newErrors.articulos = 'Debe tener al menos 2 caracteres';
    }
    if (observacion.trim() && observacion.trim().length < 6) {
      newErrors.observacion = 'Debe tener al menos 6 caracteres';
    }
    if (fechaIngreso && isNaN(new Date(fechaIngreso).getTime())) {
      newErrors.fechaIngreso = 'Fecha inválida';
    }
    setErrors(newErrors);
  }, [articulos, observacion, fechaIngreso]); // Corregir 'observaciaon' a 'observacion'

  const handleSave = () => {
    const newErrors = {};
    
    if (!articulos.trim()) newErrors.articulos = 'El campo Artículos es obligatorio';
    if (!observacion.trim()) newErrors.observacion = 'El campo Observación es obligatorio';
    if (!fechaIngreso) newErrors.fechaIngreso = 'El campo Fecha de Ingreso es obligatorio';
    if (isNaN(new Date(fechaIngreso).getTime())) newErrors.fechaIngreso = 'Fecha inválida';
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length > 0) {
      // Muestra una alerta con todos los errores
      Swal.fire({
        title: 'Errores en el formulario',
        html: Object.values(newErrors).join('<br>'), // Muestra todos los errores en líneas separadas
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    } else {
      // Llama a la función onSave si no hay errores
      onSave({ ...comodidad, articulos, observacion, fechaIngreso, estado });
    }
  };
  

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{comodidad ? 'Editar Comodidad' : 'Agregar Comodidad'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Artículos</Form.Label>
            <Form.Control
              type="text"
              value={articulos}
              onChange={(e) => setArticulos(e.target.value)}
              isInvalid={!!errors.articulos}
              onBlur={() => {
                if (articulos.trim() && articulos.trim().length < 2) {
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    articulos: 'Debe tener al menos 2 caracteres'
                  }));
                }
              }}
            />
            <Form.Control.Feedback type="invalid">
              {errors.articulos}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Observación</Form.Label>
            <Form.Control
              type="text"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              isInvalid={!!errors.observacion}
              onBlur={() => {
                if (observacion.trim() && observacion.trim().length < 6) {
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    observacion: 'Debe tener al menos 6 caracteres'
                  }));
                }
              }}
            />
            <Form.Control.Feedback type="invalid">
              {errors.observacion}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Fecha de Ingreso</Form.Label>
            <Form.Control
              type="date"
              value={fechaIngreso}
              onChange={(e) => setFechaIngreso(e.target.value)}
              isInvalid={!!errors.fechaIngreso}
              onBlur={() => {
                if (fechaIngreso && isNaN(new Date(fechaIngreso).getTime())) {
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    fechaIngreso: 'Fecha inválida'
                  }));
                }
              }}
            />
            <Form.Control.Feedback type="invalid">
              {errors.fechaIngreso}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Estado</Form.Label>
            <Form.Control
              as="select"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option>Disponible</option>
              <option>En reparación</option>
              <option>No disponible</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={Object.keys(errors).length > 0}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TableComodidad;
