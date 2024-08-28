import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from "./layouts/Sidebar";
import MainContent from "./components/services/MainContent";
import ClientManagement from "./components/clients/ClientManagement";
import UserTable from './components/users/UserTable';
import ProfilePage from "./components/utils/auth/ProfilePage";
import CabanaManagement from "./components/cabins/CabanaManagement";
import HomePage from "./components/homepage";
import NotFound from './404';
import Navbarx from "./layouts/Navbar";
import PrivateRoute from "./components/utils/auth/PrivateRoute";
import { useAuth } from "./components/utils/auth/AuthContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const auth = useAuth();

  if (!auth) {
    return <div>Error: AuthContext no está disponible.</div>;
  }

  const { isAuthenticated, role } = auth;

  return (
    <BrowserRouter>
      <div className="min-vh-100 min-vw-100 overflow-hidden">
        <Navbarx />
        <div className="row">
          {isAuthenticated && (role === 'admin' || role === 'employee' || role === 'client') && (
            <Sidebar className="col-2" />
          )}
          <main className="col">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={
                <PrivateRoute 
                  allowedRoles={['admin', 'employee', 'client']}
                  element={<ProfilePage />} 
                />
              } />
              <Route path="/services" element={
                <PrivateRoute 
                  allowedRoles={['admin', 'employee']}
                  element={<MainContent />} 
                />
              } />
              <Route path="/clients" element={
                <PrivateRoute 
                  allowedRoles={['admin']}
                  element={<ClientManagement />} 
                />
              } />
              <Route path="/cabins" element={
                <PrivateRoute 
                  allowedRoles={['admin', 'employee', 'client']}
                  element={<CabanaManagement />} 
                />
              } />
              <Route path="/users" element={
                <PrivateRoute 
                  allowedRoles={['admin']}
                  element={<UserTable />} 
                />
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
