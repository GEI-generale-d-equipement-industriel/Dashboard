// components/PrivateRoute.jsx
import React from 'react';
import { Navigate,useLocation } from 'react-router-dom';
import useAuth from '../Hooks/useAuth';

const PrivateRoute = ({ element: Element }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

  return isAuthenticated ? (
    <Element />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
