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
            
                <HomePage  />
            }
          
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
