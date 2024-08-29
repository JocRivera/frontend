import React from "react";
import { Form } from "react-bootstrap";
import './EliminarSwitch.css'; // Asegúrate de crear este archivo CSS

const EliminarSwitch = ({ isOn, handleToggle, itemName }) => {
  return (
    <div className="d-flex align-items-center">
      <Form.Label className="switch-label">
        ¿Eliminar {itemName}?
      </Form.Label>
      <Form.Check 
        type="switch" 
        id={`switch-${itemName}`} 
        checked={isOn} 
        onChange={handleToggle} 
        className="custom-switch"
        label={isOn ? "Activado" : "Desactivado"}
      />
    </div>
  );
};

export default EliminarSwitch;
