import React from 'react';
import DockTable from './components/DockTable';
import VehicleForm from './components/VehicleForm';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css'; // Ensure you import the CSS for react-toastify
import './HomePage.css'; // Add this to import custom CSS

function HomePage({onLogout}) {

 
  const user = JSON.parse(localStorage.getItem('user'));


  return (
    <div className="App">
      <div className="header">
        <button onClick={onLogout} className="btn btn-danger">Sign Out</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        {user && (
          <h2 className="greeting">Hello, {user?.name}!</h2>
        )}
        <h1>Vehicle Dock Management System</h1>
        <VehicleForm />
        <DockTable />
      </div>
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
    </div>
  );
}

export default HomePage;
