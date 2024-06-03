import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const PrivateRoute = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const location = useLocation();

  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" replace state={{ from: location }} />
  );
};

export default PrivateRoute;
