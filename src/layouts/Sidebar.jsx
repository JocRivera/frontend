import React from "react";
import * as Icon from "react-icons/md";
export default function Sidebar() {
  return (
    <div className="sidebar col-2">
      <ul className="nav flex-column">
        <li className="nav-item">
          <a className="nav-link " href="#">
            <Icon.MdSpaceDashboard />
            dashboard
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            <Icon.MdHome />
            cabañas
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            <Icon.MdHome />
            habitaciones
          </a>
        </li>
        <li className="nav-item ">
          <a className="nav-link" href="#">
            <Icon.MdRoomService />
            servicios
          </a>
        </li>
        <li className="nav-item ">
          <a className="nav-link" href="#">
            <Icon.MdSunny />
            planes
          </a>
        </li>
        <li className="nav-item ">
          <a className="nav-link" href="#">
            clientes
          </a>
        </li>
        <li className="nav-item ">
          <a className="nav-link" href="#">
            reservas
          </a>
        </li>
        <li className="nav-item ">
          <a className="nav-link" href="#">
            hospedaje
          </a>
        </li>
        <li className="nav-item ">
          <a className="nav-link" href="#">
            usuarios
          </a>
        </li>
        <li className="nav-item ">
          <a className="nav-link" href="#">
            configuracion
          </a>
        </li>
      </ul>
    </div>
  );
}
