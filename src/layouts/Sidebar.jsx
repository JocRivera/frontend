import React, { useState, useEffect } from "react";
import { GiWoodCabin, GiBed } from "react-icons/gi";
import { IoSettingsSharp } from "react-icons/io5";
import { FaBridgeCircleCheck } from "react-icons/fa6";
import { MdArrowForward, MdArrowBack, MdRoomService, MdDashboard, MdBeachAccess  } from "react-icons/md";
import { FaUsersBetweenLines, FaUsers } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

const Sidebar = ({ onToggleSidebar }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    // Aplica el tema oscuro o claro al body según el estado
    document.body.className = isDarkTheme ? "dark-theme" : "light-theme";
  }, [isDarkTheme]);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
    if (onToggleSidebar) onToggleSidebar(); // Notifica al componente padre si la función está disponible
  };

  return (
    <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : 'expanded'}`}>
      <div className="sidebar-content">
        <ul className="nav">
          {/* Menú de navegación */}
          <li className="nav-item">
            <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <MdDashboard size={24} />
              <span className={`nav-text ${isSidebarCollapsed ? 'hidden' : ''}`}>Dashboard</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/services" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <MdRoomService size={24} />
              <span className={`nav-text ${isSidebarCollapsed ? 'hidden' : ''}`}>Servicios</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/cabins" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <GiWoodCabin size={24} />
              <span className={`nav-text ${isSidebarCollapsed ? 'hidden' : ''}`}>Cabañas</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/rooms" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <GiBed size={24} />
              <span className={`nav-text ${isSidebarCollapsed ? 'hidden' : ''}`}>Habitaciones</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/clients" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <FaUsers size={24} />
              <span className={`nav-text ${isSidebarCollapsed ? 'hidden' : ''}`}>Clientes</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/users" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <FaUsersBetweenLines size={24} />
              <span className={`nav-text ${isSidebarCollapsed ? 'hidden' : ''}`}>Usuarios</span>
            </NavLink>
          </li>
         

          

          <li className="nav-item">
            <NavLink to="/plans" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <MdBeachAccess  size={24} />
              <span className={`nav-text ${isSidebarCollapsed ? 'hidden' : ''}`}>Planes</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/reservations" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <FaBridgeCircleCheck  size={24} />
              <span className={`nav-text ${isSidebarCollapsed ? 'hidden' : ''}`}>Reservas</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/settings" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <IoSettingsSharp size={24} />
              <span className={`nav-text ${isSidebarCollapsed ? 'hidden' : ''}`}>Configuración</span>
            </NavLink>
          </li>


        </ul>
      </div>
      <div className="theme-switcher">
        <label className="switch">
          <input type="checkbox" checked={isDarkTheme} onChange={toggleTheme} />
          <span className="slider round"></span>
        </label>
      </div>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isSidebarCollapsed ? <MdArrowForward size={24} /> : <MdArrowBack size={24} />}
      </button>
    </div>
  );
};

export default Sidebar;
