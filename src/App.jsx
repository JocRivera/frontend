import Sidebar from "./layouts/Sidebar";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainContent from "./components/services/MainContent";
import ClientManagement from "./components/clients/ClientManagement";

import Navbar from "./layouts/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useState } from "react";

function App() {

  return (
    <BrowserRouter>

      <div className="min-vh-100 min-vw-100 overflow-hidden">
        <Navbar />
        <div className="row">
          <Sidebar className="col-1" />
          <Routes>
            <Route path="/services" element={<MainContent />} />
            <Route path="/clients" element={<ClientManagement />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>

  );
}

export default App;
