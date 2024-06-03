import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import HomePage from './HomePage'; // Adjust the path as needed
import SignIn from './SignIn'; // Adjust the path as needed
import PrivateRoute from './PrivateRoute'; // Adjust the path as needed



const App = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        navigate('/'); // Navigate to HomePage if user is authenticated
      } else {
        navigate('/signin'); // Navigate to SignIn page if user is not authenticated
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth, navigate]);

  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  );
};

const WrappedApp = () => (
  <Router>
    <App  />
  </Router>
);

export default WrappedApp;
