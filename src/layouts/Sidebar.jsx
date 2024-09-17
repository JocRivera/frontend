import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { FaCalendarDays, FaUsersBetweenLines, FaUsers } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { MdDashboard, MdRoomService, MdBeachAccess } from 'react-icons/md';
import { GiWoodCabin, GiBed } from 'react-icons/gi';
import { IoSettingsSharp } from 'react-icons/io5';
import './Sidebar.css'; 

const { Sider } = Layout;

const menuItems = [
    { key: '1', icon: <MdDashboard size={24} />, label: <Link to="/">Dashboard</Link> },
    { key: '2', icon: <MdRoomService size={24} />, label: <Link to="/services">Servicios</Link> },
    { key: '3', icon: <FaUsers size={24} />, label: <Link to="/users">Usuarios</Link> },
    { key: '4', icon: <FaUsersBetweenLines size={24} />, label: <Link to="/clients">Clientes</Link> },
    { key: '5', icon: <GiWoodCabin size={24} />, label: <Link to="/cabins">Cabañas</Link> },
    { key: '6', icon: <GiBed size={24} />, label: <Link to="/rooms">Habitaciones</Link> },
    { key: '7', icon: <MdBeachAccess size={24} />, label: <Link to="/plans">Planes</Link> },
    { key: '8', icon: <FaCalendarDays size={24} />, label: <Link to="/reservations">Reservas</Link> },
    { key: '9', icon: <IoSettingsSharp size={24} />, label: <Link to="/settings">Configuración</Link> },
];

function Sidebar({ collapsed, setCollapsed }) {
    const [delayedCollapsed, setDelayedCollapsed] = useState(collapsed);

    // Efecto para sincronizar la actualización del botón después de la transición
    useEffect(() => {
        const timer = setTimeout(() => {
            setDelayedCollapsed(collapsed);
        }, 300); // Ajusta este valor para que coincida con la duración de la transición
        return () => clearTimeout(timer);
    }, [collapsed]);

    // Función para alternar el colapso
    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Layout>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                width={256}
                collapsedWidth={80}
                style={{
                    height: '100vh',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    overflowY: 'auto',
                    transition: 'all 0.2s ease', // Transición más suave
                }}
            >
                {/* Menú de navegación */}
                <Menu theme="dark" mode="inline" items={menuItems} />
                {/* Botón de alternar */}
                <div className="menu-toggle" onClick={toggleSidebar}>
                    {delayedCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </div>
            </Sider>
        </Layout>
    );
}

export default Sidebar;
