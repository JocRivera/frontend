import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainContent from "./components/services/MainContent";
import ClientManagement from "./components/clients/ClientManagement";
import UserTable from "./components/users/UserTable";
import ProfilePage from "./components/utils/auth/ProfilePage";
import CabanaManagement from "./components/cabins/CabanaManagement";
import PlanManagement from "./components/plans/PlanManagement";
import Reservations from "./components/pages/Reservations";
import HomePage from "./components/Homepage";
import NotFound from "./404";
import Navbarx from "./layouts/Navbar";
import PrivateRoute from "./components/utils/auth/PrivateRoute";
import RoomsManagement from "./components/rooms/RoomsManagement";
import SettingManagement from "./components/settings/SettingManagement";
import { useAuth } from "./components/utils/auth/AuthContext";
import Sidebar from "./layouts/Sidebar";
import Listcabins from "./components/cabins/viwescabins";
import Listrooms from "./components/rooms/viwesRooms";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const { isAuthenticated, role } = useAuth();

  return (
    <BrowserRouter>
      <div className="min-vh-100 min-vw-100 overflow-hidden">
        <Navbarx />
        <div className="d-flex">
          {isAuthenticated && (role === "admin" || role === "employee") && (
            <Sidebar />
          )}
          <main className={`flex-grow-1 ${isAuthenticated ? "ml-3" : ""}`}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/profile"
                element={
                  <PrivateRoute
                    allowedRoles={["admin", "employee", "client"]}
                    element={<ProfilePage />}
                  />
                }
              />
              <Route
                path="/services"
                element={
                  <PrivateRoute
                    allowedRoles={["admin", "employee"]}
                    element={<MainContent />}
                  />
                }
              />
              <Route
                path="/clients"
                element={
                  <PrivateRoute
                    allowedRoles={["admin"]}
                    element={<ClientManagement />}
                  />
                }
              />
              <Route
                path="/cabins"
                element={
                  <PrivateRoute
                    allowedRoles={["admin", "employee", "client"]}
                    element={<CabanaManagement />}
                  />
                }
              />
              <Route
                path="/users"
                element={
                  <PrivateRoute
                    allowedRoles={["admin"]}
                    element={<UserTable />}
                  />
                }
              />
              <Route
                path="/rooms"
                element={
                  <PrivateRoute
                    allowedRoles={["admin", "employee", "client"]}
                    element={<RoomsManagement />}
                  />
                }
              />
              <Route
                path="/plans"
                element={
                  <PrivateRoute
                    allowedRoles={["admin", "employee", "client"]}
                    element={<PlanManagement />}
                  />
                }
              />
              <Route
                path="/reservations"
                element={
                  <PrivateRoute
                    allowedRoles={["admin", "employee", "client"]}
                    element={<Reservations />}
                  />
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute
                    allowedRoles={["admin", "employee", "client"]}
                    element={<SettingManagement />}
                  />
                }
              />
              <Route path="/listcabins" element={<Listcabins />} />
              <Route path="/listrooms" element={<Listrooms />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
