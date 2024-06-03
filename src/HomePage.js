import React, { useEffect, useState } from 'react';
import DockTable from './components/DockTable';
import VehicleForm from './components/VehicleForm';
import { auth } from './firebase';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css'; // Ensure you import the CSS for react-toastify
import './HomePage.css'; // Add this to import custom CSS

function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve the current user from Firebase Auth
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    } else {
      // If no user is found, redirect to sign-in page
      navigate('/signin');
    }
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/signin'); // Redirect to sign-in page after sign-out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getFirstName = (displayName) => {
    if (!displayName) return '';
    return displayName.split(' ')[0];
  };

  return (
    <div className="App">
      <div className="header">
        {user && (
          <h2 className="greeting">Hello, {getFirstName(user.displayName || user.email)}!</h2>
        )}
        <button onClick={handleSignOut} className="btn btn-danger">Sign Out</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
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
