import React from 'react';
import DockTable from './components/DockTable';
import VehicleForm from './components/VehicleForm';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css'; // Ensure you import the CSS for react-toastify
import './HomePage.css'; // Add this to import custom CSS

function HomePage({onLogout}) {

 //This is my code
 
  const user = JSON.parse(localStorage.getItem('user'));
  const jwtToken = user.credential; // Get the JWT token from the response
  const base64Url = jwtToken.split('.')[1]; // Split the token and get the payload
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Replace characters
  const payload = JSON.parse(window.atob(base64)); // Decode the payload
  const userName = payload.name; // Get the user's name from the payload
  
  console.log('User name:', userName);

  return (
    <div className="App">
      <div className="header">
        <button onClick={onLogout} className="btn btn-danger">Sign Out</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        {user && (
          <h2 className="greeting">Hello, {user?userName:''}!</h2>
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
