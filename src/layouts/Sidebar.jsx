import React, { useState } from 'react';
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

function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <Layout >
            {/* Sidebar */}
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                className="sidebar"
            >
                {/* Menú de navegación */}
                <Menu
                    theme="dark"
                    mode="inline"
                    items={menuItems}
                />
            </Sider>
            {/* Botón de alternar */}
            <div className="menu-toggle" onClick={toggleSidebar} style={{
              color : 'white',

            }}>
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
        </Layout>
    );
}

export default Sidebar;
