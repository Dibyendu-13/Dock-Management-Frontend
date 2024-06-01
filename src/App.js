import React from 'react';
import DockTable from './components/DockTable';
import VehicleForm from './components/VehicleForm';
import { ToastContainer, toast } from 'react-toastify';

import './App.css';

function App() {
  return (
    <div className="App">
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
       
      />
        <h1>Vehicle Dock Management System</h1>
        <VehicleForm />
        <DockTable />
      </div>
    </div>
  );
}

export default App;
