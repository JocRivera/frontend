import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from "./layouts/Sidebar";
import MainContent from "./components/services/MainContent";
import ClientManagement from "./components/clients/ClientManagement";
import UserTable from './components/users/UserTable';
import CabinsPage from './components/cabins/CabanaManagement'


import Navbar from "./layouts/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useState } from "react";

function App() {

  return (
    <BrowserRouter>

      <div className="min-vh-100 min-vw-100 overflow-hidden">
        <Navbarx />
        <div className="row">
          <Sidebar className="col-1" />
          <Routes>
            <Route path="/services" element={<MainContent />} />
            <Route path="/clients" element={<ClientManagement />} />
            <Route path="/cabins" element={<CabinsPage />} />
            <Route path="/users" element={<UserTable />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>

  );
}


export default App;