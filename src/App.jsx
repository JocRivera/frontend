import Sidebar from "./layouts/Sidebar";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainContent from "./components/services/MainContent";
import ClientManagement from "./components/clients/ClientManagement";
import CabinsPage from './components/cabins/CabinPage';
import UserTable from './components/users/UserTable';
import PlanManagement from "./components/plans/PlanManagement";




import Navbar from "./layouts/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";



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
            <Route path="/cabins" element={<CabinsPage />} />
            <Route path="/users" element={<UserTable />} />
            <Route path="/plans" element={<PlanManagement />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>


  );
}


export default App;