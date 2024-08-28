import React, { useState } from "react";
import * as Icon from "react-icons/md";
import { NavLink } from "react-router-dom";
import './Sidebar.css';

export default function Sidebar() {
  const [isCabinsOpen, setIsCabinsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Estado para el tema

  const toggleCabinsMenu = () => {
    setIsCabinsOpen(!isCabinsOpen);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`sidebar ${isDarkMode ? 'dark' : 'light'} ${isCabinsOpen ? 'expanded' : 'collapsed'}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDarkMode ? '🌙' : '🌞'} {/* Icono de cambio de tema */}
      </button>
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            <Icon.MdSpaceDashboard /> <span>Dashboard</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/services" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            <Icon.MdRoomService /> <span>Servicios</span>
          </NavLink>
        </li>
        <li className={`nav-item ${isCabinsOpen ? 'open' : ''}`}>
          <button 
            className="nav-link dropdown-toggle" 
            onClick={toggleCabinsMenu}
            aria-expanded={isCabinsOpen}
          >
            <Icon.MdHotel /> <span>Habitaciones</span>
          </button>
          <ul className="sub-menu">
            <li className="nav-item">
              <NavLink to="/rooms" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                <Icon.MdRoomService /> <span>Habitaciones</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/cabins" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                <Icon.MdCabin /> <span>Cabañas</span>
              </NavLink>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <NavLink to="/clients" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            <Icon.MdPeople /> <span>Clientes</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/users" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            <Icon.MdPeopleOutline /> <span>Usuarios</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/settings" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            <Icon.MdSettings /> <span>Configuración</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
