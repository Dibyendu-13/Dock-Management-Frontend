import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import HomePage from './HomePage';
import SignIn from './SignIn';
import Loader from './Loader';
import './Loader.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);
  }, []);

  const responseMessage = (response) => {
    const jwtToken = response.credential; // Get the JWT token from the response
    const base64Url = jwtToken.split('.')[1]; // Split the token and get the payload
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Replace characters
    const payload = JSON.parse(window.atob(base64)); // Decode the payload
    const userName = payload.name; // Get the user's name from the payload
    
    console.log('User name:', userName);
    localStorage.setItem('user', JSON.stringify(response));
    setIsAuthenticated(true);
  };
  
  const errorMessage = (error) => {
    console.error('Google Login Error', error);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    return <Loader />;
  }

  return (
    <GoogleOAuthProvider clientId="889820616743-b57vj6h0dglavavm8npg07t4l6r62dlp.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <HomePage onLogout={handleLogout} />
              ) : (
                <SignIn onSuccess={responseMessage} onError={errorMessage} />
              )
            }
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
