import React from "react";
import * as Icon from "react-icons/md";
import { NavLink } from "react-router-dom";
export default function Sidebar() {
  return (
    <div className="sidebar col-2">
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            <Icon.MdSpaceDashboard /> Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/services" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            <Icon.MdRoomService /> Servicios
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/cabins" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            <Icon.MdHotel /> Cabañas
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/clients" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            <Icon.MdPeople /> Clientes
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/settings" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Configuración
          </NavLink>
        </li>

      </ul>
    </div>
  );
}
