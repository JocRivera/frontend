import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Sidebar from './layouts/Sidebar'
import MainContent from './MainContent'
import Navbar from './layouts/Navbar'
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import './App.css';


function App() {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState('');

  return (
    <div className='App'>
      <Navbar></Navbar>
      <div className="flex"><Sidebar></Sidebar>
        <div className="content">
          <MainContent></MainContent>
        </div>
      </div>
    </div>

  )
}







export default App
