import Sidebar from "./layouts/Sidebar";
import MainContent from "./MainContent";
import Navbar from "./layouts/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useState } from "react";

function App() {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState("");

  return (
    <div className="min-vh-100 min-vw-100 overflow-hidden"> 
      <Navbar></Navbar>
      <div className="row">
        <Sidebar className="col-1"></Sidebar>
        <MainContent className="col-11"></MainContent>
      </div>
    </div>
  );
}

export default App;
